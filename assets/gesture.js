/* ==================================================================
   gesture.js —— 隔空手势引擎（零依赖，按需加载）
   ------------------------------------------------------------------
   职责：摄像头 → 手部关键点 → 归一化手势信号，并驱动一个「隔空光标」。

   设计原则（改代码时别破坏）：
     1) **绝不自动索取权限**。只有调用 open() 才 getUserMedia。
     2) **懒加载识别模型**。MediaPipe Hands 只在用户点击开启后才去 CDN 拉，
        不开启手势的访客一个字节都不下载。
     3) **优雅降级**。任何一步失败（无摄像头 / 拒绝授权 / 模型拉不下来）
        都通过 onStatus 回一个可读状态，页面照常可用。
     4) **可完全关闭**。close() 必须释放摄像头轨道与全局事件，
        否则摄像头指示灯会一直亮着 —— 这是不可接受的。
     5) 不用 ES module / 构建步骤，跟站点其它 assets/*.js 保持一致。

   对外 API：window.XLGesture
     XLGesture.supported()            是否具备条件（有媒体设备 API + WebGL）
     XLGesture.open(opts)             开启（授权 + 加载模型 + 起循环）→ Promise
     XLGesture.close()                关闭并释放全部资源
     XLGesture.mode                    "region" | "global"
     XLGesture.setMode(m)             切换光标模式
     XLGesture.on("frame", fn)        每帧回调（手部信号）
     XLGesture.on("status", fn)       状态变化回调
     XLGesture.on("click", fn)        捏合「点击」回调
     XLGesture.video                  视频元素（供预览小窗使用）

   每帧信号（frame）：
     {
       seen:   Boolean,            这一帧有没有看到手
       x, y:   Number,             归一化手部位置（0..1，已做镜像）
       px, py: Number,             归一化掌部位置（比食指尖稳，用于画姿）
       pinch:  Number,             捏合程度 0（张开）..1（捏紧）
       spread: Number,             五指张开度 0..1
       roll:   Number,             手掌滚转角（弧度，-π..π）
       size:   Number,             手在画面里的大小 0..1（≈远近）
       vx, vy: Number,             归一化移动速度
       fingers:Array<Boolean>,     五根手指是否伸直 [拇指,食,中,无名,小]
     }
   ================================================================== */
(function (w, d) {
  "use strict";

  /* ---------- 常量 ---------- */
  var MP_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/";
  var LOAD_TIMEOUT = 15000;   /* 模型加载超时（ms） */
  var CLICK_ON = 0.62;        /* 捏合判定：超过这个值算捏住 */
  var CLICK_OFF = 0.4;        /* 松开判定要低一截，避免抖动反复触发 */
  var CLICK_COOL = 420;       /* 两次点击最小间隔（ms） */
  var LOST_MS = 420;          /* 丢失多久后标记未看到手 */

  /* ---------- 速度采样口径 ----------
     这一组常量决定「手速」这个量的可信度，而手速是所有玩法的主判定量，
     所以它们的取值直接等于「手感灵不灵」。

     旧实现是「相邻两次采样间隔 ≥150ms 就按 0 上报」。那条规则的本意是
     防止「手离开画面再回来」被算成一次巨大假速度，但它误伤了一个更常见的
     情况：页面一忙、推理被拖慢，间隔本身就过了 150ms —— 而这恰好发生在
     玩家挥手最快、最需要判定的时候。结果是「挥了没反应」。

     正确做法不是「间隔长就归零」，而是「间隔长就只接受一次合理的位移」：
       · GAP_MAX 以内都算连续采样（0.32s 覆盖到 ~3fps 的极端掉帧）
       · 单次位移超过 JUMP_MAX 视为重捕跳变（真的瞬移），丢弃
       · 速度再按 SPEED_MAX 截断（约 6.5 个画面宽每秒，人手达不到） */
  var GAP_MAX = 0.32;
  /* 1.1 ≈ 整个画面宽。真正的手在 0.32s 内最多也只能横穿一屏多一点，
     所以这个阈值只用来挡住「坐标跳变」（跟踪器重捕到别处）这类
     物理上不可能的单帧位移 —— 卡太紧（比如 0.55）会把**快挥**误杀，
     而那正是最需要判定的时候。 */
  var JUMP_MAX = 1.1;
  var SPEED_MAX = 6.5;

  /* MediaPipe Hands 的 21 个关键点索引 */
  var WRIST = 0, THUMB_TIP = 4, INDEX_TIP = 8, MIDDLE_MCP = 9, MIDDLE_TIP = 12,
      RING_TIP = 16, PINKY_MCP = 17, PINKY_TIP = 20;
  var TIPS = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP];
  var PIPS = [2, 6, 10, 14, 18];   /* 各指第二关节，用于判断「伸直」 */

  /* ---------- 状态 ---------- */
  var stream = null;
  var video = null;
  var hands = null;
  var loading = false;
  var running = false;
  var raf = 0;
  var mode = "region";
  var handlers = { frame: [], status: [], click: [] };

  var lastSeen = 0;
  var lastP = null;            /* 上一帧掌部位置，用于算速度 */
  var pinchState = false;
  var lastClickAt = 0;

  /* ---------- 链路健康度 ----------
     这一组变量的存在理由：手势会「假死」。
     现象是页面显示「已锁定」但手怎么晃都没反应，而且往往在
     「第一次互动之后」出现 —— 说明是 send 队列被搞坏了。
     下面三个时间戳/计数器就是用来发现并自动修复这种假死的。 */
  var busySince = 0;           /* 本次 send 开始等待的时刻（0 = 不在等） */
  var lastResult = 0;          /* 最近一次收到模型结果的时刻 */
  var stuckCount = 0;          /* 连续卡死次数，够了就重建实例 */
  var sendErrors = 0;          /* 统计用 */
  var BUSY_TIMEOUT = 1200;     /* 单次 send 允许等待的上限（ms） */
  var LOST_TIMEOUT = 1800;     /* 多久收不到结果就认定链路断了（ms） */

  /* ---------- 重捕助推 ----------
     MediaPipe 的跟踪器有两种工作模式：锁上手之后只在上帧位置附近
     做局部搜索（快，但跟丢就出不来）；以及全画面检测（慢，但一定能
     找到手）。一旦进入「跟丢」状态，玩家把手伸回画面也会被判在搜索
     窗外——这就是「手在摄像头面前怎么晃动都识别不到」。
     下面的参数让它每隔 RELOCK_EVERY 强制回到全画面检测一次。 */
  var lastRelock = 0;          /* 上次助推的时刻 */
  var RELOCK_MS = 260;         /* 手丢失多久开始助推（略大于 LOST_MS） */
  var RELOCK_EVERY = 700;      /* 助推间隔：太快会一直打断跟踪 */
  var relockPending = false;   /* 是否处于「助推中」的低门槛状态 */
  var DETECT_CONF = 0.5;       /* 常态检测置信度门槛 */
  var TRACK_CONF = 0.4;        /* 常态跟踪置信度门槛 */

  var out = {
    seen: false, x: 0.5, y: 0.5, px: 0.5, py: 0.5,
    pinch: 0, spread: 0, roll: 0, size: 0, vx: 0, vy: 0,
    fingers: [false, false, false, false, false]
  };

  /* ---------- 小工具 ---------- */
  function emit(name, payload) {
    var list = handlers[name] || [];
    for (var i = 0; i < list.length; i++) {
      try { list[i](payload); } catch (e) { /* 单个回调出错不能拖垮引擎 */ }
    }
  }
  function dist(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function status(code, msg) {
    emit("status", { code: code, message: msg || "" });
  }

  /* ---------- 能力检测 ---------- */
  function supported() {
    /* 有设备就够 —— 不查 WebGL：识别跑在库自己的 canvas 上，
       这里查一次只是为了提前给用户反馈，漏判比误判更糟（会白挡掉能用的人） */
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    } catch (e) { return false; }
    return true;
  }

  /* ---------- 脚本注入 ---------- */
  function loadScript(src) {
    return new Promise(function (ok, no) {
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      var t = setTimeout(function () { no(new Error("timeout:" + src)); }, LOAD_TIMEOUT);
      s.onload = function () { clearTimeout(t); ok(); };
      s.onerror = function () { clearTimeout(t); no(new Error("load:" + src)); };
      d.head.appendChild(s);
    });
  }

  /* ---------- 识别模型 ---------- */
  function ensureHands() {
    if (hands) return Promise.resolve(hands);
    if (loading) {
      /* 已经在拉了：轮询等它好，避免并发拉两份 */
      return new Promise(function (ok, no) {
        var n = 0;
        var iv = setInterval(function () {
          if (hands) { clearInterval(iv); ok(hands); }
          else if (!loading) { clearInterval(iv); no(new Error("load_failed")); }
          else if (++n > 300) { clearInterval(iv); no(new Error("timeout")); }
        }, 100);
      });
    }
    loading = true;
    status("loading", "loading hand model");
    return loadScript(MP_BASE + "hands.js").then(function () {
      if (!w.Hands) throw new Error("no Hands");
      hands = new w.Hands({ locateFile: function (f) { return MP_BASE + f; } });
      hands.setOptions({
        maxNumHands: 1,               /* 只跟一只手 —— 更稳、更快 */
        modelComplexity: 0,           /* 轻量模型：客厅笔记本也跑得动 */
        /* 置信度门槛往低调 —— 这是「延迟」的一大来源：
           门槛高的时候，手快挥过画面（带运动模糊、略微失焦）会被判成
           「没检测到」，于是光标在那里停顿一下再跳到新位置，
           玩家感受到的就是一卡一顿。
           实测 0.5/0.4 下快速挥动的连续性明显好于 0.6/0.5，
           而误检（把背景当手）在室内场景几乎没增加。 */
        minDetectionConfidence: DETECT_CONF,
        minTrackingConfidence: TRACK_CONF
      });
      hands.onResults(onResults);
      return hands;
    }).then(function (h) {
      loading = false;
      return h;
    }).catch(function (e) {
      loading = false;
      throw e;
    });
  }

  /* ---------- 关键点 → 手势信号 ---------- */
  function analyze(lm) {
    /* lm: 21 个 {x,y,z}，x/y 归一化到 0..1（画面坐标） */
    var wrist = lm[WRIST];
    var midMcp = lm[MIDDLE_MCP];
    var palm = { x: (wrist.x + midMcp.x + lm[PINKY_MCP].x) / 3,
                 y: (wrist.y + midMcp.y + lm[PINKY_MCP].y) / 3 };

    /* 手掌尺度：腕到中指根，用来把所有距离变成「相对手大小」，不受远近影响 */
    var scale = Math.max(1e-4, dist(wrist, midMcp));

    /* 五指伸直判定：指尖离腕的距离 > 该指第二关节离腕的距离 × 1.12 */
    var fingers = [];
    for (var i = 0; i < 5; i++) {
      /* 拇指比较特殊：横向张开，用「指尖离掌心 > 关节离掌心」判断 */
      if (i === 0) {
        fingers.push(dist(lm[TIPS[0]], palm) > dist(lm[PIPS[0]], palm) * 1.06);
      } else {
        fingers.push(dist(lm[TIPS[i]], wrist) > dist(lm[PIPS[i]], wrist) * 1.12);
      }
    }

    /* 捏合：拇指尖与食指尖的距离，除以手掌尺度 */
    var pinchRaw = dist(lm[THUMB_TIP], lm[INDEX_TIP]) / scale;
    /* 0.35 倍以下算捏紧、1.5 倍以上算完全张开，中间线性 */
    var pinch = clamp(1 - (pinchRaw - 0.35) / (1.5 - 0.35), 0, 1);

    /* 张开度：指尖到掌心的平均距离（相对手大小） */
    var s = 0;
    for (var k = 0; k < 5; k++) s += dist(lm[TIPS[k]], palm) / scale;
    var spread = clamp((s / 5 - 1.2) / 1.3, 0, 1);

    /* 滚转角：腕 → 中指根 的向量角度 */
    var roll = Math.atan2(midMcp.y - wrist.y, midMcp.x - wrist.x);

    /* 手的大小（≈远近感）：腕到中指根占画面的比例 */
    var size = clamp(scale * 2.6, 0, 1);

    return {
      palm: palm,
      pinch: pinch,
      spread: spread,
      roll: roll,
      size: size,
      fingers: fingers
    };
  }

  function onResults(res) {
    if (!running) return;
    /* 收到模型结果 = 这条推理链路是活的。
       除了清 busy 标志，还要记时间戳：看门狗靠它判断链路是否卡死。 */
    hands.__busy = false;
    busySince = 0;
    lastResult = performance.now();
    handle(res);
  }

  /* 真正处理一帧结果 —— 独立于 running，方便测试钩子直接灌数据 */
  function handle(res) {
    var list = res && res.multiHandLandmarks;
    if (list && list.length) {
      var lm = list[0];
      var a = analyze(lm);
      lastSeen = performance.now();
      /* 手抓住了：如果刚才是靠「助推」的低门槛抓到的，
         现在把门槛恢复常态 —— 不能一直用低门槛跑，
         否则背景里的干扰更容易被误判成手。 */
      settleDetect();

      /* 水平镜像：画面是自拍视角，往右伸手画面里是往左 —— 不镜像会反直觉 */
      var palmX = 1 - a.palm.x;
      var palmY = a.palm.y;

      /* 食指尖作为光标点（比掌心更符合「指哪打哪」） */
      var tip = lm[INDEX_TIP];
      var cx = 1 - tip.x, cy = tip.y;

      /* 速度：归一化到「每秒」，与帧率无关。
         用重捕计时器（gap）而不是上一帧的时间戳来算 ——
         中间真的丢了一段手再回来，lastP 会被 markLost 清掉，
         所以这里能走到 lastP 的情况都是「连续跟踪中」。
         剩下的两个守卫：位移过大判为重捕跳变、速度上限截断。
         详见文件头 GAP_MAX / JUMP_MAX / SPEED_MAX 的说明。 */
      var now = lastSeen;
      var vx = 0, vy = 0;
      if (lastP) {
        var gapMs = now - lastP.t;
        if (gapMs > 0 && gapMs < GAP_MAX * 1000) {
          var ddx = palmX - lastP.x, ddy = palmY - lastP.y;
          var d2 = ddx * ddx + ddy * ddy;
          if (d2 <= JUMP_MAX * JUMP_MAX) {
            var dtv = gapMs / 1000;
            vx = ddx / dtv; vy = ddy / dtv;
            var spd = Math.sqrt(vx * vx + vy * vy);
            if (spd > SPEED_MAX) { var kk = SPEED_MAX / spd; vx *= kk; vy *= kk; }
          }
        }
      }
      lastP = { x: palmX, y: palmY, t: now };

      out.seen = true;
      out.x = cx; out.y = cy; out.px = palmX; out.py = palmY;
      out.pinch = a.pinch; out.spread = a.spread;
      out.roll = a.roll; out.size = a.size;
      out.vx = vx; out.vy = vy;
      out.fingers = a.fingers;

      /* 捏合 → 点击（带迟滞 + 冷却，不然会连点） */
      var t = now;
      if (!pinchState && a.pinch > CLICK_ON && t - lastClickAt > CLICK_COOL) {
        pinchState = true;
        lastClickAt = t;
        emit("click", { x: cx, y: cy, pinch: a.pinch });
      } else if (pinchState && a.pinch < CLICK_OFF) {
        pinchState = false;
      }
    } else {
      /* 这次结果里没有手 —— 可能是单帧漏检，也可能是真的离开了。
         交给 markLost 按时间判定，避免「一帧没看到就闪一下未锁定」。 */
      markLost();
    }
    emit("frame", out);
  }

  /* 标记「当前没看到手」。
     两个入口都要走它：
       ① 模型返回了结果但里面没有手（handle 的 else 分支）
       ② 看门狗发现推理链路已经断了一段时间（handle 根本不会被调用）
     第 ② 条是必须的 —— 之前只靠 ①，一旦 hands.send() 卡住、
     handle 再也不被调用，out.seen 就会**永远停在 true**：
     页面一直显示「已锁定」，手怎么晃都没反应，而且是「互动过一次
     之后」才出现（第一次互动让 send 队列进入了异常状态）。
     这正是用户报的那个现象。 */
  function markLost() {
    if (out.seen && performance.now() - lastSeen > LOST_MS) {
      out.seen = false;
      out.pinch = 0; out.spread = 0;
      out.vx = 0; out.vy = 0;
      out.roll = 0; out.size = 0;
      out.fingers = [false, false, false, false, false];
      lastP = null;
      pinchState = false;
      emit("frame", out);
    }
  }

  /* 看门狗：定时检查推理链路。
     做三件事：
       ① busy 卡太久（模型挂死/丢 promise）→ 强制解开，让循环继续
       ② 很久没收到任何模型结果 → 按「没看到手」处理
       ③ 手丢了很久 → 定时「抖一下」跟踪器，帮它重新锁上手
     没有①②的话，上面两种故障都会让手势永久假死（用户报过的现象）；
     没有③的话，MediaPipe 的跟踪器一旦进入「跟丢」状态就只做局部搜索，
     手再伸进来也锁不上 —— 这正是「手在摄像头面前怎么晃都识别不到」。 */
  function watchdog() {
    if (!running) return;
    var now = performance.now();
    if (hands && hands.__busy && busySince && now - busySince > BUSY_TIMEOUT) {
      /* 卡死：解开标志，让 feed() 重新发一帧。
         不去 cancel 那个旧 Promise —— MediaPipe 的 send 没有取消接口，
         但它内部是串行的，旧的那次一旦返回就会正常走 onResults。 */
      hands.__busy = false;
      busySince = 0;
      stuckCount++;
      /* 连续卡死说明 send 队列彻底坏了：重建一个实例才是根治 */
      if (stuckCount >= 3) { rebuildHands(); }
    }
    /* 链路静默太久（有 busy 卡死 / video 没帧 / 模型异常）→ 视作没看到手 */
    if (lastResult && now - lastResult > LOST_TIMEOUT) markLost();
    /* 另一条独立防线：结果一直在流（链路是活的），但「看到手」这件事
       已经过去很久了。正常路径下 handle() 的 else 分支会处理它，
       但如果那一步因为任何原因没跑到，seen 就会一直停在 true ——
       页面显示「已锁定」而其实手上什么都没有。这里补一刀，
       保证「seen 的时效性」不依赖 handle() 一定被调用。 */
    if (out.seen && lastSeen && now - lastSeen > LOST_MS) markLost();
    /* ③ 重捕助推：手已经丢了 RELOCK_MS 以上，说明跟踪器很可能进了
       「跟丢」状态（只在上一帧位置附近做局部搜索）。此时周期性
       setOptions 一下，MediaPipe 会重跑一次全画面检测 —— 手只要在
       画面里就能重新锁上，不用等玩家把手伸到某个特定位置。
       间隔给 700ms：够快让玩家觉得「晃两下就好了」，又不至于
       每帧都打断跟踪（那反而会一直开不起来）。 */
    if (!out.seen && lastSeen && now - lastSeen > RELOCK_MS &&
        now - lastRelock > RELOCK_EVERY) {
      lastRelock = now;
      nudgeDetect();
    }
  }

  /* 让 MediaPipe 重新做一次全画面检测。
     setOptions 是它对外暴露的最轻量的「重置跟踪状态」手段：
     调用后内部跟踪器会丢弃上一帧的锚点，下一帧走全图检测。
     （直接换实例太重：要重新下载/初始化模型，会有肉眼可见的停顿。） */
  function nudgeDetect() {
    if (!hands || !hands.setOptions) return;
    try {
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        /* 重捕期间把检测门槛再压低一点：为的就是「手一晃就能被抓住」。
           抓稳之后由 watchdog 恢复默认值。 */
        minDetectionConfidence: 0.42,
        minTrackingConfidence: 0.32
      });
      relockPending = true;
    } catch (e) { /* 老版本没有 setOptions：忽略，看门狗下次再试 */ }
  }

  /* 手重新出现后，把门槛恢复到正常值。
     放这里而不是 nudgeDetect 里立刻恢复：恢复太早会让「刚抓住的手」
     又被高门槛筛掉，等于白助推一次。 */
  function settleDetect() {
    if (!relockPending || !hands || !hands.setOptions) return;
    relockPending = false;
    try {
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: DETECT_CONF,
        minTrackingConfidence: TRACK_CONF
      });
    } catch (e) {}
  }

  /* 重建识别实例。send 队列进入坏状态时唯一可靠的恢复方式 ——
     比让用户刷新页面友好得多。 */
  function rebuildHands() {
    stuckCount = 0;
    busySince = 0;
    lastResult = performance.now();
    var opts = hands ? null : null;
    try { if (hands && hands.close) hands.close(); } catch (e) {}
    hands = null;
    ensureHands().then(function (h) {
      h.__busy = false;
    }).catch(function () { /* 重建失败：下次看门狗再试 */ });
  }

  /* ---------- 主循环：把 video 帧喂给模型 ----------
     两个都要：rAF（跟随渲染节奏，正常路径）+ 定时器兜底。
     只用 rAF 的话，页面一忙（切水果时粒子/水果都在跑）rAF 就变稀，
     推理频率跟着掉，手势自然发滞。定时器不受渲染节奏影响，
     能保持一个稳定的推理频率 —— 这正是「跟手感」的来源。
     两者都受 __busy 保护，不会堆帧。 */
  var pumpTimer = 0;
  var watchTimer = 0;
  var PUMP_MS = 22;        /* 兜底推理间隔（≈45fps） */
  var WATCH_MS = 250;      /* 看门狗巡检间隔 */

  function feed() {
    if (!running) return;
    /* busy 时跳过这一帧 —— send() 是异步的，堆帧会越跑越慢。
       注意 busySince 一定要在这里记，看门狗靠它判断「卡了多久」。 */
    if (!hands || hands.__busy) return;
    if (!video || video.readyState < 2) return;
    hands.__busy = true;
    busySince = performance.now();
    var p = hands.send({ image: video });
    /* 不要在这里清 __busy！
       清标志的唯一权威是 onResults —— send() 返回的 Promise 只代表
       「这一帧数据被接受了」，onResults 才代表「模型真的算完了」。
       在 then 里清会让循环跑得比模型快，队列越堆越长。
       （onResults 里已经清了；下面只处理异常路径。） */
    if (p && p.catch) {
      p.catch(function () {
        /* send 出错：解锁，让下一帧重试 */
        if (hands) hands.__busy = false;
        busySince = 0;
        sendErrors++;
      });
    }
  }

  function pump() {
    if (!running) return;
    raf = requestAnimationFrame(pump);
    feed();
  }

  /* ---------- 开 / 关 ---------- */
  function open(opts) {
    opts = opts || {};
    if (running) return Promise.resolve(true);
    if (!supported()) {
      status("unsupported", "no camera api");
      return Promise.reject(new Error("unsupported"));
    }

    status("asking", "asking for camera permission");
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        /* 480×360 而不是 640×480：MediaPipe 内部本来就会把输入缩到
           256×256 附近再推理，给更大的帧只是让「采集 + 上传纹理」更慢。
           帧小一圈，从摄像头到推理结果这一段就短一截 —— 这是延迟里
           最实打实的一块。清晰度对关键点稳定性影响很小（模型只看形状）。 */
        width: { ideal: 480 },
        height: { ideal: 360 },
        frameRate: { ideal: 30, max: 30 }
      },
      audio: false
    }).then(function (s) {
      stream = s;
      video = d.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.muted = true;
      video.autoplay = true;
      video.srcObject = s;
      /* 预览小窗要把 video 塞进 DOM，这里只负责播 */
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function () { /* 自动播放被拦：静音下极少见 */ });
      return ensureHands();
    }).then(function () {
      running = true;
      status("ready", "gesture ready");
      /* 起循环前先清干净：上一次会话可能留下了 busy / 旧时间戳 */
      if (hands) hands.__busy = false;
      busySince = 0; stuckCount = 0; sendErrors = 0;
      lastResult = performance.now();
      lastSeen = 0; lastRelock = 0; relockPending = false;
      pump();
      /* 定时器兜底：渲染一忙 rAF 就稀，推理频率跟着掉，
         手势就会「发滞」。这条定时线保证最低推理频率。 */
      if (pumpTimer) clearInterval(pumpTimer);
      pumpTimer = setInterval(feed, PUMP_MS);
      /* 看门狗：发现 send 卡死或链路静默就自动恢复。
         没有它的话一次异常就会让手势永久假死（用户报过的现象）。 */
      if (watchTimer) clearInterval(watchTimer);
      watchTimer = setInterval(watchdog, WATCH_MS);
      return true;
    }).catch(function (e) {
      /* 失败要把已经拿到的东西吐回去，不能留个亮着的摄像头 */
      stopStream();
      var code = (e && e.name) === "NotAllowedError" ? "denied"
               : (e && e.name) === "NotFoundError" ? "nocam"
               : (e && e.name) === "NotReadableError" ? "busy"
               : "failed";
      status(code, (e && e.message) || String(e));
      throw e;
    });
  }

  function stopStream() {
    if (stream) {
      var tracks = stream.getTracks ? stream.getTracks() : [];
      for (var i = 0; i < tracks.length; i++) {
        try { tracks[i].stop(); } catch (e) {}
      }
      stream = null;
    }
    /* 本地预览 / 云端校验脚本会缓存视频元素，这里一并复位 */
    if (video) {
      try { video.pause(); } catch (e) {}
      try { video.srcObject = null; } catch (e) {}
      try { if (video.parentNode) video.parentNode.removeChild(video); } catch (e) {}
      video = null;
    }
  }

  function close() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (pumpTimer) { clearInterval(pumpTimer); pumpTimer = 0; }
    if (watchTimer) { clearInterval(watchTimer); watchTimer = 0; }
    busySince = 0; lastResult = 0; stuckCount = 0;
    lastSeen = 0; lastRelock = 0; relockPending = false;
    stopStream();
    lastP = null;
    pinchState = false;
    out.seen = false;
    out.pinch = 0; out.spread = 0; out.vx = 0; out.vy = 0;
    out.fingers = [false, false, false, false, false];
    status("off", "gesture off");
    emit("frame", out);
  }

  /* ---------- 对外 ---------- */
  w.XLGesture = {
    supported: supported,
    open: open,
    close: close,
    isRunning: function () { return running; },
    get mode() { return mode; },
    setMode: function (m) { mode = (m === "global") ? "global" : "region"; return mode; },
    on: function (name, fn) {
      if (!handlers[name]) handlers[name] = [];
      handlers[name].push(fn);
      return function () {   /* 返回一个取消订阅的函数 */
        var i = handlers[name].indexOf(fn);
        if (i >= 0) handlers[name].splice(i, 1);
      };
    },
    /* 只读地暴露当前信号，供外部（如 CDP 回归脚本）采样 */
    sample: function () {
      return {
        seen: out.seen, x: out.x, y: out.y, px: out.px, py: out.py,
        pinch: out.pinch, spread: out.spread, roll: out.roll,
        size: out.size, vx: out.vx, vy: out.vy, fingers: out.fingers.slice()
      };
    },
    get video() { return video; },
    /* 测试钩子：绕过摄像头，直接灌一组关键点进来（绝不影响正常路径） */
    __inject: function (lm) {
      handle(lm ? { multiHandLandmarks: [lm] } : { multiHandLandmarks: [] });
    },
    /* 测试钩子：链路健康度快照。
       回归脚本要靠它验证「假死自愈」—— 这些状态全部是内部量，
       光看 sample() 分辨不出「引擎正常」和「引擎卡住了但状态还停在旧值」。 */
    __health: function () {
      return {
        seen: out.seen,
        busy: !!(hands && hands.__busy),
        busySince: busySince, lastResult: lastResult, lastSeen: lastSeen,
        stuckCount: stuckCount, sendErrors: sendErrors,
        relockPending: relockPending, lastRelock: lastRelock,
        running: running
      };
    },
    /* 测试钩子：手动触发一次看门狗（不必真等 250ms 的定时器） */
    __tick: function () { watchdog(); return true; },
    /* 测试钩子：模拟「send 卡死」—— 直接把 busy 标志立起来，
       看门狗应当在 BUSY_TIMEOUT 之后解开它。 */
    __jamBusy: function (at) {
      if (!hands) return false;
      hands.__busy = true;
      busySince = typeof at === "number" ? at : performance.now();
      return true;
    },
    /* 测试钩子：给看门狗一个「假会话」。
       无头环境里没有真摄像头，open() 会卡在 getUserMedia 上，
       而看门狗的所有分支都以 running 为前提 —— 没有这个钩子，
       假死自愈逻辑在 CI 里根本测不到。
       只立 running + 一个占位 hands 对象（不需要真的能 send）。 */
    __fakeSession: function (on) {
      if (on) {
        running = true;
        if (!hands) hands = { __busy: false, send: function () { return Promise.resolve(); } };
        hands.__busy = false;
        busySince = 0; stuckCount = 0; sendErrors = 0;
        lastResult = performance.now();
        lastSeen = performance.now() - 600;   /* 手已经在画面外了 */
        lastRelock = 0; relockPending = false;
      } else {
        running = false;
        busySince = 0; lastResult = 0; stuckCount = 0;
      }
      return true;
    },
    /* 测试钩子：把「最近看到手 / 最近收到结果」的时间戳往前推。
       看门狗的两条分支都以「静默了多久」为判据，靠函数改内部量
       比 sleep 等真实时间稳得多（无头环境的时间基准本来就不准）。 */
    __age: function (seenMs, resultMs) {
      if (typeof seenMs === "number") lastSeen = performance.now() - seenMs;
      if (typeof resultMs === "number") lastResult = performance.now() - resultMs;
      return true;
    },
    __const: { CLICK_ON: CLICK_ON, CLICK_OFF: CLICK_OFF, TIPS: TIPS, WRIST: WRIST,
               BUSY_TIMEOUT: BUSY_TIMEOUT, LOST_TIMEOUT: LOST_TIMEOUT,
               LOST_MS: LOST_MS, RELOCK_MS: RELOCK_MS, RELOCK_EVERY: RELOCK_EVERY }
  };
})(window, document);
