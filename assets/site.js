/* ==================================================================
   共享脚本：光标 / 导航 / 进度条 / 滚动揭示 / 返回顶部
   ================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  /* 静态预览模式（?nofx） */
  var nofx = /(?:\?|&)nofx(?:&|$|=|$)/.test(location.search);
  if (nofx) {
    reduced = true;
    var ns = document.createElement("style");
    ns.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}";
    document.head.appendChild(ns);
  }

  /* ---------- 自定义光标 ---------- */
  if (fine && !reduced) {
    var dot = $("#cur"), ring = $("#curRing");
    if (dot && ring) {
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      document.addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
      });
      document.addEventListener("mouseover", function (e) {
        var hot = e.target.closest && e.target.closest("a, button, figure, tr");
        ring.classList.toggle("hot", !!hot);
      });
      (function loop() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ---------- 进度条 / 导航隐藏 / 返回顶部 ---------- */
  var bar = $("#bar"), nav = $("#nav"), bt = $("#backtop"), last = 0;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var h = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (bar) bar.style.width = (y / h * 100) + "%";
    if (nav) nav.classList.toggle("up", y > 560 && y > last);
    if (bt) bt.classList.toggle("on", y > 700);
    last = y;
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (bt) bt.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });

  /* ---------- 滚动揭示（带降级） ---------- */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".rv"));
    if (nofx || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  initReveal();

  /* ---------- 年份 ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
