/* ==================================================================
   i18n.js —— 轻量多语言引擎（零依赖）
   ------------------------------------------------------------------
   1) 用法：
      <span data-i18n="chrome.nav.about"></span>          替换文本
      <span data-i18n-html="home.about.h2"></span>        替换 HTML（含 <br> / <span>）
      <span data-i18n-attr="title:chrome.lang.title"></span>  替换属性（逗号分隔多组）
      <span data-lang-hide="zh-CN zh-TW"></span>          命中语言时自动隐藏
   2) 内容注册：I18N.register("en", { home: { ... } })
   3) 切换：I18N.set("ja")  → 写入 localStorage 并派发 "i18n:change" 事件
   ================================================================== */
(function (w) {
  "use strict";

  var STORE = "xl-lang";
  var DEFAULT = "zh-CN";
  var CHAIN = ["zh-CN", "en"];   /* 缺失时的回退顺序 */

  /* 语言清单（顺序即菜单顺序） */
  var LOCALES = [
    { code: "en",    html: "en",    label: "English",   short: "EN", native: "English" },
    { code: "zh-CN", html: "zh-CN", label: "简体中文",   short: "中", native: "简体中文" },
    { code: "ja",    html: "ja",    label: "日本語",     short: "日", native: "日本語" },
    { code: "zh-TW", html: "zh-Hant", label: "繁體中文", short: "繁", native: "繁體中文" },
    { code: "fr",    html: "fr",    label: "Français",  short: "FR", native: "Français" },
    { code: "es",    html: "es",    label: "Español",   short: "ES", native: "Español" },
    { code: "de",    html: "de",    label: "Deutsch",   short: "DE", native: "Deutsch" }
  ];

  var dict = {};
  var locale = DEFAULT;
  var listeners = [];
  var mounted = [];

  /* ---------------- 工具 ---------------- */
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }

  function merge(a, b) {
    if (!isObj(b)) return a;
    Object.keys(b).forEach(function (k) {
      if (isObj(b[k]) && isObj(a[k])) merge(a[k], b[k]);
      else if (isObj(b[k])) { a[k] = merge({}, b[k]); }
      else a[k] = b[k];
    });
    return a;
  }

  function walk(path, loc) {
    var node = dict[loc];
    if (!node) return undefined;
    var parts = String(path).split("."), cur = node;
    for (var i = 0; i < parts.length; i++) {
      if (cur === null || cur === undefined) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function codeOf(c) {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].code === c) return LOCALES[i];
    return null;
  }

  /* ---------------- 读取 ---------------- */
  function get(path) {
    var order = [locale].concat(CHAIN), i, v;
    for (i = 0; i < order.length; i++) {
      v = walk(path, order[i]);
      if (v !== undefined && v !== null) return v;
    }
    return undefined;
  }

  function t(path) {
    var v = get(path);
    if (typeof v === "string") return v;
    if (v === undefined) return path;      /* 缺词时回显 key，方便排查 */
    return String(v);
  }

  /* ---------------- 自动识别 ---------------- */
  function detect() {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (!l) continue;
      if (l.indexOf("zh") === 0) return /hant|tw|hk|mo/.test(l) ? "zh-TW" : "zh-CN";
      if (l.indexOf("ja") === 0) return "ja";
      if (l.indexOf("fr") === 0) return "fr";
      if (l.indexOf("es") === 0) return "es";
      if (l.indexOf("de") === 0) return "de";
      if (l.indexOf("en") === 0) return "en";
    }
    return DEFAULT;
  }

  function readStored() {
    try {
      var v = localStorage.getItem(STORE);
      if (v && codeOf(v)) return v;
    } catch (e) {}
    return null;
  }

  /* ---------------- 应用到 DOM ---------------- */
  function apply(root) {
    root = root || document;
    var i, v;

    var nodes = root.querySelectorAll("[data-i18n]");
    for (i = 0; i < nodes.length; i++) {
      v = get(nodes[i].getAttribute("data-i18n"));
      if (typeof v === "string") nodes[i].textContent = v;
    }

    nodes = root.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < nodes.length; i++) {
      v = get(nodes[i].getAttribute("data-i18n-html"));
      if (typeof v === "string") nodes[i].innerHTML = v;
    }

    nodes = root.querySelectorAll("[data-i18n-attr]");
    for (i = 0; i < nodes.length; i++) {
      var spec = nodes[i].getAttribute("data-i18n-attr").split(",");
      for (var j = 0; j < spec.length; j++) {
        var kv = spec[j].split(":");
        if (kv.length < 2) continue;
        var attr = kv[0].trim(), key = kv.slice(1).join(":").trim();
        var val = get(key);
        if (typeof val === "string") nodes[i].setAttribute(attr, val);
      }
    }

    /* 按语言隐藏：data-lang-hide="zh-CN zh-TW" */
    nodes = root.querySelectorAll("[data-lang-hide]");
    for (i = 0; i < nodes.length; i++) {
      var hide = nodes[i].getAttribute("data-lang-hide").split(/\s+/);
      nodes[i].hidden = hide.indexOf(locale) !== -1;
    }

    /* 标题与描述 */
    var meta = codeOf(locale) || {};
    v = get("home.title");
    if (typeof v === "string") document.title = v;
    v = get("home.desc");
    var md = document.querySelector('meta[name="description"]');
    if (typeof v === "string" && md) md.setAttribute("content", v);

    /* 同步 <html lang> 与 lang.css 用的属性选择器 */
    document.documentElement.setAttribute("lang", meta.html || locale);
    document.documentElement.setAttribute("data-locale", locale);
  }

  /* ---------------- 语言菜单 ---------------- */
  var GLOBE = '<svg class="lang-globe" viewBox="0 0 24 24" width="15" height="15" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/>' +
    '<path d="M3 12h18M12 3c2.6 2.6 3.9 5.7 3.9 9S14.6 18.4 12 21c-2.6-2.6-3.9-5.7-3.9-9S9.4 5.6 12 3z"/></svg>';
  var CHEV = '<svg class="lang-chev" viewBox="0 0 24 24" width="12" height="12" fill="none" ' +
    'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function buildSwitcher(box) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = GLOBE + '<span class="lang-cur"></span>' + CHEV;

    var menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.setAttribute("role", "listbox");

    LOCALES.forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-item";
      b.setAttribute("role", "option");
      b.setAttribute("data-code", L.code);
      b.innerHTML = '<span class="lang-name">' + L.native + '</span><span class="lang-tick" aria-hidden="true">✓</span>';
      b.addEventListener("click", function () { set(L.code); close(); });
      menu.appendChild(b);
    });

    box.appendChild(btn);
    box.appendChild(menu);

    function close() {
      box.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
    function toggle() {
      var on = !box.classList.contains("open");
      if (on) {
        /* 同时只开一个 */
        mounted.forEach(function (m) { m.classList.remove("open"); });
        box.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        var cur = menu.querySelector('[data-code="' + locale + '"]');
        if (cur && cur.scrollIntoView) { try { cur.scrollIntoView({ block: "nearest" }); } catch (e) {} }
      } else close();
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });

    document.addEventListener("click", function (e) { if (!box.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    box.__sync = function () { close(); syncSwitcher(box); };
    return box;
  }

  function syncSwitcher(box) {
    var L = codeOf(locale) || {};
    var cur = box.querySelector(".lang-cur");
    if (cur) {
      cur.textContent = L.short || L.code;
      cur.setAttribute("title", L.native || L.code);
    }
    var btn = box.querySelector(".lang-btn");
    if (btn) btn.setAttribute("title", t("chrome.lang.open") + " · " + (L.native || ""));
    var items = box.querySelectorAll(".lang-item");
    for (var i = 0; i < items.length; i++) {
      var on = items[i].getAttribute("data-code") === locale;
      items[i].classList.toggle("on", on);
      items[i].setAttribute("aria-selected", on ? "true" : "false");
    }
  }

  function mount(root) {
    root = root || document;
    var boxes = root.querySelectorAll("[data-lang-mount]");
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].__built) { syncSwitcher(boxes[i]); continue; }
      boxes[i].__built = true;
      boxes[i].classList.add("lang");
      buildSwitcher(boxes[i]);
      syncSwitcher(boxes[i]);
      mounted.push(boxes[i]);
    }
    return boxes.length;
  }

  /* ---------------- 切换 ---------------- */
  function set(code, opts) {
    opts = opts || {};
    if (!codeOf(code) || code === locale) {
      if (code === locale) { apply(); mount(); }
      return locale;
    }
    locale = code;
    try { localStorage.setItem(STORE, code); } catch (e) {}
    apply();
    mount();
    if (!opts.silent) {
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](locale); } catch (e) {}
      }
      try {
        document.dispatchEvent(new CustomEvent("i18n:change", { detail: { locale: locale } }));
      } catch (e) {}
    }
    return locale;
  }

  /* ---------------- 初始化 ---------------- */
  function register(code, obj) {
    if (!dict[code]) dict[code] = {};
    merge(dict[code], obj);
    return API;
  }

  /* 语言在脚本加载时立即确定（同步），DOM 应用推迟到解析完成 */
  locale = readStored() || detect();
  /* 支持 ?lang=xx 直接指定（便于分享某一语言的链接） */
  var fromUrl = (String(location.search).match(/[?&]lang=([A-Za-z\-]+)/) || [])[1];
  if (fromUrl && codeOf(fromUrl)) {
    locale = fromUrl;
    try { localStorage.setItem(STORE, fromUrl); } catch (e) {}
  }
  document.documentElement.setAttribute("data-locale", locale);

  function boot() { apply(); mount(); }

  var API = {
    LOCALES: LOCALES,
    register: register,
    t: t,
    get: get,
    apply: apply,
    mount: mount,
    set: set,
    boot: boot,
    onChange: function (fn) { if (typeof fn === "function") listeners.push(fn); },
    locale: function () { return locale; },
    meta: function () { return codeOf(locale) || LOCALES[1]; },
    has: function (path) { return get(path) !== undefined; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  w.I18N = API;
})(window);
