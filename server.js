/* ============================================================================
   Affective Computing · 情感计算交互空间 —— 静态托管 + 漂流瓶后端
   ----------------------------------------------------------------------------
   零依赖，只用 Node 内置模块。职责：
     1) 托管 portfolio/ 下的静态站点（index.html / mindvr / assets）
     2) 漂流瓶的读写接口：投瓶、捞瓶（列表/单瓶）、回信、新回信队列
   数据落盘在 data/bottles.json，原子写入（先写临时文件再 rename）。

   关于邮箱（重要）：
     邮箱功能已**整套下线**。投瓶不再要求填邮箱，回信也不再收邮箱；
     回信只写进瓶子里，谁捞到都能看到。相应地：
       - bottle / reply 对象里不再新增任何邮箱字段
       - 公开接口（/api/bottles*）永远不返回邮箱
       - 历史数据里残留的 email 字段只是不再被读取，不再对外输出
     如果以后要恢复「回信邮件通知」，需要重新设计收件人来源，不要直接
     把 email 加回公开接口。

   其他安全约定：
     - server.js / package.json / data/ 一律不允许静态下载
     - 删除接口 /api/bottles/:id 需要 token（见 ADMIN_TOKEN）
     - 所有输入做长度截断与 HTML 转义，写入前统一 sanitize
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

const DATA_DIR = process.env.XL_DATA_DIR || path.join(ROOT, "data");
/* 重要：部署的应用就跑在本目录里，线上和本地测试共用同一份文件系统。
   测试必须用 XL_DATA_DIR 指到临时目录，否则测试数据会写进公开的河道。 */
const DATA_FILE = path.join(DATA_DIR, "bottles.json");
const BACKUP_FILE = path.join(DATA_DIR, "bottles.backup.json");

/* 管理口令：/api/pending（新回信队列）与 DELETE（内容审核）都要它。
   读取优先级：环境变量 ADMIN_TOKEN > data/admin-token.txt。
   admin-token.txt 已被 .gitignore 排除，不会进开源仓库；两个来源都没有时
   管理接口整体关闭，站点其余功能不受影响。 */
function readAdminToken() {
  if (process.env.ADMIN_TOKEN) return process.env.ADMIN_TOKEN;
  try {
    const t = fs.readFileSync(path.join(ROOT, "data", "admin-token.txt"), "utf8").trim();
    if (t) return t;
  } catch (e) {}
  return null;
}
const ADMIN_TOKEN = readAdminToken();
if (!ADMIN_TOKEN) {
  console.log("[admin] 未配置管理口令（环境变量 ADMIN_TOKEN 或 data/admin-token.txt），管理接口已关闭");
}

/* ---- 限制 ---- */
/* 字数「下限」已取消：写一个字也能投（只拦一个字都没写）。
   上限只做防滥用，正常写作碰不到；超限会明确报错，而不是静默截断。 */
const MAX_Q = 8000;          // 纸条（提问）最长字符数
const MAX_R = 4000;          // 回信最长字符数
const MAX_NICK = 40;         // 昵称最长
const MAX_BOTTLES = 600;     // 河里最多保留的瓶子数（超出丢最旧）
const MAX_REPLIES = 60;      // 单个瓶子的回信上限
const RATE_WINDOW_MS = 60 * 60 * 1000;
/* 限流阈值可用环境变量覆盖 —— 端到端测试要在同一小时内反复投瓶，
   线上仍走默认值（6 / 20） */
const RATE_MAX_POST = Number(process.env.XL_RATE_POST || 6);     // 每 IP 每小时可投的瓶子数
const RATE_MAX_REPLY = Number(process.env.XL_RATE_REPLY || 20);  // 每 IP 每小时可写的回信数

/* ==========================================================================
   数据层
   ========================================================================== */
let store = { bottles: [] };
let saveTimer = null;

function ensureDir() {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

function loadStore() {
  ensureDir();
  for (const f of [DATA_FILE, BACKUP_FILE]) {
    try {
      if (!fs.existsSync(f)) continue;
      const raw = fs.readFileSync(f, "utf8");
      if (!raw.trim()) continue;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.bottles)) {
        /* 自愈：过滤掉 null / 缺 id 的脏条目。
           历史事故：某个备份脚本在详情请求失败时把 undefined 写进了数组，
           整份数据就此卡死（每条接口都 500）。这里兜住，坏条目丢掉而不是让全站挂掉。 */
        const before = parsed.bottles.length;
        parsed.bottles = parsed.bottles.filter(function (b) {
          return b && typeof b === "object" && typeof b.id === "string" && b.id;
        });
        const dropped = before - parsed.bottles.length;
        if (dropped > 0) {
          console.error("[store] 已丢弃 " + dropped + " 条脏数据（" + f + "）");
          store = parsed;
          flush();          /* 立刻把干净版本写回主文件 */
          return;
        }
        store = parsed;
        if (f === BACKUP_FILE) flush(); /* 主文件丢了 → 用备份恢复 */
        return;
      }
    } catch (e) {
      console.error("[store] 读取失败 " + f + ": " + e.message);
    }
  }
}

/* 原子写入：临时文件 → rename，避免半截 JSON */
/* 滚动备份：每份带时间戳，保留最近 SNAP_KEEP 份。
   事故教训：就地覆盖的单份 bottles.backup.json 救不了「写坏之后再自愈」
   —— 脏数据一旦落盘，两份都脏。滚动快照能回到上一个好状态。 */
const SNAP_KEEP = 10;
const SNAP_DIR = path.join(DATA_DIR, "snapshots");
let snapAt = 0;

function snapshot(body) {
  const now = Date.now();
  /* 最快 60 秒一份，避免高频率投瓶把快照刷满 */
  if (now - snapAt < 60 * 1000) return;
  snapAt = now;
  try {
    fs.mkdirSync(SNAP_DIR, { recursive: true });
    const stamp = new Date(now).toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(path.join(SNAP_DIR, "bottles-" + stamp + ".json"), body, "utf8");
    /* 只留最近 SNAP_KEEP 份 */
    const files = fs.readdirSync(SNAP_DIR)
      .filter(function (f) { return /^bottles-.*\.json$/.test(f); })
      .sort();
    while (files.length > SNAP_KEEP) {
      const old = files.shift();
      try { fs.unlinkSync(path.join(SNAP_DIR, old)); } catch (e) {}
    }
  } catch (e) {
    console.error("[store] 快照失败: " + e.message);
  }
}

/* 原子写入：临时文件 → rename，避免半截 JSON */
function saveStore() {
  ensureDir();
  try {
    const tmp = DATA_FILE + ".tmp";
    const body = JSON.stringify(store, null, 1);
    fs.writeFileSync(tmp, body, "utf8");
    fs.renameSync(tmp, DATA_FILE);
    fs.writeFileSync(BACKUP_FILE, body, "utf8"); /* 双写一份备份 */
    snapshot(body);
  } catch (e) {
    console.error("[store] 写入失败: " + e.message);
  }
}

/* 合并短时间内的多次写入，避免频繁落盘 */
function flush() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  saveStore();
}
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(function () { saveTimer = null; saveStore(); }, 400);
}

store.load = loadStore;
store.flush = flush;
store.scheduleSave = scheduleSave;

/* ==========================================================================
   工具
   ========================================================================== */
function rid(n) {
  return crypto.randomBytes(n || 8).toString("hex");
}

/* 转义成纯文本：去掉标签与控制字符，压缩空行。前端一律用 textContent 渲染。 */
/* 清洗：去控制字符 / 去 HTML 标签 / 统一换行 / 压掉多余空行
   max 省略时不做截断（调用方自行判断是否超长并报错） */
function sanitize(str, max) {
  let s = String(str == null ? "" : str);
  s = s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
  s = s.replace(/<\/?[a-z][^>]*>/gi, "");   // 去掉 HTML 标签
  s = s.replace(/\r\n?/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.trim();
  if (max && s.length > max) s = s.slice(0, max);
  return s;
}

/* 简易内存限流：滑动窗口，按 IP + 动作分桶
   分成「查」和「记」两步：只有真正写入成功才计数 ——
   内容为空之类的失败提交不该消耗访客的配额。 */
const hits = new Map();
function ratePeek(ip, kind, max) {
  const key = kind + "|" + ip;
  const now = Date.now();
  let arr = hits.get(key);
  if (!arr) { arr = []; hits.set(key, arr); }
  while (arr.length && now - arr[0] > RATE_WINDOW_MS) arr.shift();
  return arr.length >= max;
}
function rateHit(ip, kind) {
  const key = kind + "|" + ip;
  let arr = hits.get(key);
  if (!arr) { arr = []; hits.set(key, arr); }
  arr.push(Date.now());
  if (hits.size > 5000) hits.clear();  /* 防止无限增长 */
}

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return String(xf).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "0.0.0.0";
}

function readBody(req, limit) {
  return new Promise(function (resolve) {
    let size = 0, chunks = [];
    let done = false;
    req.on("data", function (c) {
      if (done) return;
      size += c.length;
      if (size > (limit || 64 * 1024)) { done = true; try { req.destroy(); } catch (e) {} resolve(null); return; }
      chunks.push(c);
    });
    req.on("end", function () {
      if (done) return;
      done = true;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); }
      catch (e) { resolve(null); }
    });
    req.on("error", function () { if (!done) { done = true; resolve(null); } });
  });
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

/* 只输出瓶子的公开字段 —— 白名单，绝不能整体透传 b，
   否则以后往数据里加的任何内部字段（历史上就有过 email）都会漏出去 */
function publicBottle(b, withQuestion) {
  const o = {
    id: b.id,
    at: b.at,
    replies: (b.replies || []).length,
    seed: b.seed
  };
  if (withQuestion) {
    o.q = b.q;
    o.replies_list = (b.replies || []).map(function (r) {
      return { id: r.id, t: r.t, at: r.at, nick: r.nick || "" };
    });
  }
  return o;
}

function findBottle(id) {
  for (let i = 0; i < store.bottles.length; i++) if (store.bottles[i].id === id) return store.bottles[i];
  return null;
}

/* ==========================================================================
   API
   ========================================================================== */
async function api(req, res, url) {
  const p = url.pathname;
  const ip = clientIp(req);

  /* 河道背景数据：不需要登录，任何人可读（纸条公开） */
  if (p === "/api/bottles" && req.method === "GET") {
    const limit = Math.max(1, Math.min(80, Number(url.searchParams.get("limit") || 40)));
    const list = store.bottles.slice(-limit).reverse();
    return sendJson(res, 200, {
      ok: true,
      total: store.bottles.length,
      bottles: list.map(function (b) { return publicBottle(b, false); })
    });
  }

  /* 投瓶 */
  if (p === "/api/bottles" && req.method === "POST") {
    if (ratePeek(ip, "post", RATE_MAX_POST)) {
      return sendJson(res, 429, { ok: false, error: "rate", message: "投瓶太频繁了，请稍后再来。" });
    }
    const body = await readBody(req);
    if (!body) return sendJson(res, 400, { ok: false, error: "bad_json" });
    /* 先清洗（不截断），再判断长度 —— 这样超长会明确报错而不是被悄悄切掉 */
    const q = sanitize(body.q);
    if (!q.length) return sendJson(res, 400, { ok: false, error: "empty", message: "还没写呢。" });
    if (q.length > MAX_Q) return sendJson(res, 400, { ok: false, error: "too_long", message: "写得太长了。" });
    rateHit(ip, "post");   /* 只有真的投出去了才计数 */

    /* 投瓶是纯匿名的：不再收集、也不再存储邮箱。
       历史数据里可能残留 email 字段，那是旧版本留下的，不再被读写。 */
    const bottle = {
      id: rid(6),
      q: q,
      at: Date.now(),
      seed: Math.floor(Math.random() * 100000),
      replies: []
    };
    store.bottles.push(bottle);
    if (store.bottles.length > MAX_BOTTLES) store.bottles.splice(0, store.bottles.length - MAX_BOTTLES);
    scheduleSave();
    return sendJson(res, 200, { ok: true, bottle: publicBottle(bottle, true) });
  }

  /* 单个瓶子：纸条 + 所有回信 */
  let m = p.match(/^\/api\/bottles\/([A-Za-z0-9]{1,32})$/);
  if (m && req.method === "GET") {
    const b = findBottle(m[1]);
    if (!b) return sendJson(res, 404, { ok: false, error: "not_found" });
    return sendJson(res, 200, { ok: true, bottle: publicBottle(b, true) });
  }

  /* 回信 */
  m = p.match(/^\/api\/bottles\/([A-Za-z0-9]{1,32})\/replies$/);
  if (m && req.method === "POST") {
    if (ratePeek(ip, "reply", RATE_MAX_REPLY)) {
      return sendJson(res, 429, { ok: false, error: "rate", message: "回信太频繁了，缓一缓再写。" });
    }
    const b = findBottle(m[1]);
    if (!b) return sendJson(res, 404, { ok: false, error: "not_found" });
    const body = await readBody(req);
    if (!body) return sendJson(res, 400, { ok: false, error: "bad_json" });
    const t = sanitize(body.t);
    const nick = sanitize(body.nick, MAX_NICK);
    /* 回信只写进瓶子里 —— 不收邮箱，也没有「寄给谁」这回事。
       body 里即便带了 mail / email 字段也一律忽略，不入库。 */
    if (!t.length) return sendJson(res, 400, { ok: false, error: "empty", message: "还没写呢。" });
    if (t.length > MAX_R) return sendJson(res, 400, { ok: false, error: "too_long", message: "回信太长了。" });
    if ((b.replies || []).length >= MAX_REPLIES) {
      return sendJson(res, 400, { ok: false, error: "full", message: "这个瓶子的回信已经满了。" });
    }
    rateHit(ip, "reply");   /* 只有真的提交了才计数 */
    b.replies = b.replies || [];
    b.replies.push({ id: rid(5), t: t, at: Date.now(), nick: nick });
    b.notified = false;          /* 有新回信 → 进「新回信队列」，等站主查看 */
    scheduleSave();
    return sendJson(res, 200, { ok: true, bottle: publicBottle(b, true) });
  }

  /* 新回信队列：列出「有新回信、还没查看过」的瓶子（站主用，需口令）
     邮箱下线后这里不再返回任何邮箱字段，只返回纸条与回信内容本身。 */
  if (p === "/api/pending" && req.method === "GET") {
    if (!ADMIN_TOKEN || url.searchParams.get("token") !== ADMIN_TOKEN) {
      return sendJson(res, 403, { ok: false, error: "forbidden" });
    }
    const items = store.bottles.filter(function (b) { return b.notified === false; }).map(function (b) {
      return {
        id: b.id,
        q: b.q,
        at: b.at,
        replies: (b.replies || []).map(function (r) {
          return { t: r.t, at: r.at, nick: r.nick || "" };
        })
      };
    });
    return sendJson(res, 200, { ok: true, count: items.length, items: items });
  }

  /* 标记该瓶子的新回信已查看 */
  m = p.match(/^\/api\/pending\/([A-Za-z0-9]{1,32})\/ack$/);
  if (m && req.method === "POST") {
    if (!ADMIN_TOKEN || url.searchParams.get("token") !== ADMIN_TOKEN) {
      return sendJson(res, 403, { ok: false, error: "forbidden" });
    }
    const b = findBottle(m[1]);
    if (!b) return sendJson(res, 404, { ok: false, error: "not_found" });
    b.notified = true;
    b.notifiedAt = Date.now();
    flush();
    return sendJson(res, 200, { ok: true });
  }

  /* 删除瓶子（内容审核用，需口令） */
  m = p.match(/^\/api\/bottles\/([A-Za-z0-9]{1,32})$/);
  if (m && req.method === "DELETE") {
    if (!ADMIN_TOKEN || url.searchParams.get("token") !== ADMIN_TOKEN) {
      return sendJson(res, 403, { ok: false, error: "forbidden" });
    }
    const i = store.bottles.findIndex(function (b) { return b.id === m[1]; });
    if (i < 0) return sendJson(res, 404, { ok: false, error: "not_found" });
    store.bottles.splice(i, 1);
    flush();
    return sendJson(res, 200, { ok: true });
  }

  /* 自检 */
  if (p === "/api/health") {
    return sendJson(res, 200, { ok: true, bottles: store.bottles.length, up: Math.round(process.uptime()) });
  }

  return sendJson(res, 404, { ok: false, error: "no_route" });
}

/* ==========================================================================
   MindVR 接口反向代理
   --------------------------------------------------------------------------
   mindvr/ 里那套前端把接口基址写死成空串，所有请求打同源 /api/v1/*。
   它本来和 Python 后端（FastAPI）部署在同一台机器上，搬进作品集之后这些
   请求就落到了本服务的 404 上，界面显示「请求失败」。

   不能让浏览器直连 http://1.95.112.107:8080 —— 本站是 HTTPS，混合内容会被
   拦掉。只能由服务端转发。

   上游地址可用环境变量 MINDVR_API 覆盖；超时读 MINDVR_TIMEOUT（毫秒）。
   ========================================================================== */
const MINDVR_API = process.env.MINDVR_API || "http://1.95.112.107:8080";
const MINDVR_PREFIX = "/api/v1/";
const MINDVR_TIMEOUT = Number(process.env.MINDVR_TIMEOUT || 60000);

function proxyMindVR(req, res, url) {
  let target;
  try { target = new URL(url.pathname + url.search, MINDVR_API); }
  catch (e) { return sendJson(res, 502, { ok: false, error: "mindvr_upstream_bad" }); }

  /* 只允许 http 上游；https 上游留给以后换地址时用 */
  const mod = target.protocol === "https:" ? require("https") : http;

  const headers = Object.assign({}, req.headers);
  headers.host = target.host;          /* 必须换成上游 host，否则可能被拒 */

  const up = mod.request({
    hostname: target.hostname,
    port: target.port || (target.protocol === "https:" ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers: headers
  }, function (r) {
    /* 透传上游状态码与内容类型；分析接口可能返回大 JSON，直接管道输出 */
    const out = Object.assign({}, r.headers);
    delete out["transfer-encoding"];   /* 交给 Node 自己决定分块 */
    try { res.writeHead(r.statusCode || 502, out); }
    catch (e) { try { res.writeHead(502); } catch (e2) {} }
    r.pipe(res);
  });

  up.setTimeout(MINDVR_TIMEOUT, function () {
    up.destroy(new Error("timeout after " + MINDVR_TIMEOUT + "ms"));
  });

  up.on("error", function (e) {
    console.error("[mindvr] " + req.method + " " + url.pathname + " -> " + e.message);
    if (!res.headersSent) {
      sendJson(res, 502, {
        ok: false,
        error: "mindvr_unreachable",
        detail: "MindVR 分析服务暂时不可用，请稍后重试"
      });
    } else { try { res.end(); } catch (e2) {} }
  });

  req.pipe(up);
}

/* ==========================================================================
   静态托管
   ========================================================================== */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8"
};

/* 不允许被下载的文件/目录 */
const DENY = /^\/(server\.js|package\.json|package-lock\.json|data\/|\.git\/|node_modules\/)/;

/* 已下线的板块。部署是覆盖式上传、不删除沙箱旧文件：
   获奖页与作品详情页在本地已经删掉，但沙箱里可能还留着旧副本，
   必须在这里显式挡掉，否则删了等于没删。 */
const RETIRED = /^\/(awards\.html|work\/)/;

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (DENY.test(rel) || RETIRED.test(rel)) { res.writeHead(404); return res.end("Not Found"); }
  if (rel === "/" || rel === "") rel = "/index.html";
  if (!/[^/]+\.[A-Za-z0-9]+$/.test(rel) && !rel.endsWith("/")) rel += ".html";

  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }   /* 目录穿越 */

  fs.stat(file, function (err, st) {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<meta charset=utf-8><h1>404</h1><p>这个页面不存在。</p>");
    }
    const etag = '"' + st.size + "-" + st.mtimeMs + '"';
    if (req.headers["if-none-match"] === etag) { res.writeHead(304); return res.end(); }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Content-Length": st.size,
      "Cache-Control": "public, max-age=300",
      "ETag": etag
    });
    const stream = fs.createReadStream(file);
    stream.on("error", function () { try { res.end(); } catch (e) {} });
    stream.pipe(res);
  });
}

/* ==========================================================================
   启动
   ========================================================================== */
store.load();

const server = http.createServer(function (req, res) {
  let url;
  try { url = new URL(req.url, "http://" + (req.headers.host || "localhost")); }
  catch (e) { res.writeHead(400); return res.end("Bad Request"); }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  /* MindVR 的接口必须在漂流瓶的 /api/ 路由之前拦下来，否则会先落到 api() 的 404 */
  if (url.pathname.indexOf(MINDVR_PREFIX) === 0) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return proxyMindVR(req, res, url);
  }

  if (url.pathname.indexOf("/api/") === 0) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    api(req, res, url).catch(function (e) {
      console.error("[api] " + e.message);
      try { sendJson(res, 500, { ok: false, error: "server" }); } catch (e2) {}
    });
    return;
  }

  serveStatic(req, res, url);
});

server.listen(PORT, HOST, function () {
  console.log("漂流瓶信箱已启动 → http://" + HOST + ":" + PORT + "（瓶子 " + store.bottles.length + " 个）");
});

/* 退出前落盘 */
["SIGINT", "SIGTERM"].forEach(function (sig) {
  process.on(sig, function () { try { flush(); } catch (e) {} process.exit(0); });
});
