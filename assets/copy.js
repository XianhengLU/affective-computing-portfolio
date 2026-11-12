/* ==================================================================
   点击复制：<button data-copy="文本" data-copied="提示语">
   —— 不依赖访客本机是否装了邮件客户端，复制即可粘贴到任意邮箱使用。
   可选：内部元素加 data-copy-label，则只替换该元素的文字作为反馈。
   ================================================================== */
(function () {
  "use strict";

  function write(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // 降级：老浏览器 / 非 HTTPS 环境
    return new Promise(function (ok, no) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange && ta.setSelectionRange(0, text.length);
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) { done = false; }
      document.body.removeChild(ta);
      done ? ok() : no(new Error("copy failed"));
    });
  }

  function flash(el, target, msg) {
    if (el.__copyTimer) clearTimeout(el.__copyTimer);
    if (el.__copyOrig === undefined) el.__copyOrig = target.textContent;
    el.classList.add("copied");
    target.textContent = msg;
    el.__copyTimer = setTimeout(function () {
      el.classList.remove("copied");
      target.textContent = el.__copyOrig;
      el.__copyTimer = 0;
    }, 1900);
  }

  function msg(key, fallback) {
    return (window.I18N && I18N.has(key)) ? I18N.t(key) : fallback;
  }

  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-copy]") : null;
    if (!el) return;
    e.preventDefault();
    var target = el.querySelector("[data-copy-label]") || el;
    var text = el.getAttribute("data-copy") || "";
    var doneMsg = el.getAttribute("data-copied") || msg("chrome.copy.done", "已复制 ✓");
    write(text).then(function () {
      flash(el, target, doneMsg);
    }, function () {
      flash(el, target, msg("chrome.copy.failed", "复制失败，请手动选中"));
    });
  });

  /* 切换语言时收回进行中的「已复制」提示，避免残留旧语言文案 */
  document.addEventListener("i18n:change", function () {
    var els = document.querySelectorAll("[data-copy]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.__copyTimer) continue;
      clearTimeout(el.__copyTimer);
      el.__copyTimer = 0;
      el.classList.remove("copied");
      var target = el.querySelector("[data-copy-label]") || el;
      if (el.__copyOrig !== undefined) target.textContent = el.__copyOrig;
    }
  });
})();
