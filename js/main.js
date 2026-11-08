/* Umer Azzam & Faiha — Nikah invitation · Emerald & Gold
   Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var root = document.documentElement;
  window.__inviteReady = true;

  /* ------------------------------------------------------------------ config */
  var NIKAH_START = new Date('2026-12-02T17:00:00+05:30');   // 5:00 PM India time
  var LUNCH_END   = new Date('2026-12-03T15:00:00+05:30');   // 3:00 PM India time

  var intro = $('#intro');
  var hero = $('.hero');

  /* ----------------------------------------------------------------- arches
     Every .arch gets a Mughal (ogee) arch drawn to its exact size. */
  function geom(w, inset) {
    var W = w - inset * 2;
    return {
      x0: inset, x1: w - inset, cx: w / 2,
      top: inset * 1.7,
      sh: inset + W * 0.52,
      c1y: inset + W * 0.34,
      p1x: inset + W * 0.21, p1y: inset + W * 0.255,
      c2x: inset + W * 0.405, c2y: inset + W * 0.155
    };
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function half(g, h, side) {                         // apex -> bottom, one side
    var m = function (x) { return side < 0 ? x : g.x0 + g.x1 - x; };
    var xe = side < 0 ? g.x0 : g.x1;
    return 'M' + f(g.cx) + ' ' + f(g.top) + ' Q' + f(m(g.c2x)) + ' ' + f(g.c2y) + ' ' + f(m(g.p1x)) + ' ' + f(g.p1y) +
           ' Q' + f(xe) + ' ' + f(g.c1y) + ' ' + f(xe) + ' ' + f(g.sh) + ' V' + f(h);
  }
  function closed(g, h, b) {
    var mx = function (x) { return g.x0 + g.x1 - x; };
    return 'M' + f(g.x0) + ' ' + f(h - b) + ' V' + f(g.sh) +
           ' Q' + f(g.x0) + ' ' + f(g.c1y) + ' ' + f(g.p1x) + ' ' + f(g.p1y) +
           ' Q' + f(g.c2x) + ' ' + f(g.c2y) + ' ' + f(g.cx) + ' ' + f(g.top) +
           ' Q' + f(mx(g.c2x)) + ' ' + f(g.c2y) + ' ' + f(mx(g.p1x)) + ' ' + f(g.p1y) +
           ' Q' + f(g.x1) + ' ' + f(g.c1y) + ' ' + f(g.x1) + ' ' + f(g.sh) +
           ' V' + f(h - b) + ' Z';
  }
  function setPath(el, d) {
    if (!el) return;
    el.setAttribute('d', d);
    if (el.getTotalLength) el.style.setProperty('--len', Math.ceil(el.getTotalLength()) + 1);
  }
  function drawArch(a) {
    var svg = $('.arch__svg', a), w = a.clientWidth, h = a.clientHeight;
    if (!svg || !w || !h) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('preserveAspectRatio', 'none');
    var gap = Math.max(9, Math.min(14, w * 0.032));
    var go = geom(w, 1), gi = geom(w, gap);
    if (a.getAttribute('data-arch') === 'open') {
      setPath($('.arch__outer.arch__l', a), half(go, h, -1));
      setPath($('.arch__outer.arch__r', a), half(go, h, 1));
      setPath($('.arch__inner.arch__l', a), half(gi, h, -1));
      setPath($('.arch__inner.arch__r', a), half(gi, h, 1));
    } else {
      setPath($('.arch__fill', a), closed(go, h, 1));
      setPath($('.arch__outer', a), closed(go, h, 1));
      setPath($('.arch__inner', a), closed(gi, h, gap));
    }
  }
  var arches = $$('.arch');
  arches.forEach(drawArch);
  if ('ResizeObserver' in window) {
    var raf = 0;
    var ro = new ResizeObserver(function (entries) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { entries.forEach(function (e) { drawArch(e.target); }); });
    });
    arches.forEach(function (a) { ro.observe(a); });
  } else {
    addEventListener('resize', function () { arches.forEach(drawArch); });
  }

  /* ------------------------------------------------------------------ intro */
  (function tassels() {
    var box = $('.valance__tassels');
    if (!box) return;
    var html = '';
    for (var i = 1; i < 12; i++) html += '<i class="tassel" style="left:' + (i * 100 / 12).toFixed(3) + '%;--d:' + (-rnd(0, 3)).toFixed(2) + 's"></i>';
    box.innerHTML = html;
  })();

  var ready = Promise.race([document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(), wait(2500)]);
  var played = false;

  function playHero() {
    if (played || !hero) return;
    played = true;
    arches.forEach(drawArch);                      // final layout (fonts loaded)
    hero.classList.add('play');
    hero.addEventListener('click', function skip(e) {   // tap to skip the animation
      if (e.target.closest('a, button')) return;
      hero.removeEventListener('click', skip);
      hero.classList.add('done');
    });
  }

  function openInvite() {
    if (!intro || intro.classList.contains('open')) return;
    intro.classList.add('open');
    Music.start();
    setTimeout(playHero, reduce ? 0 : 950);
    if (!reduce) setTimeout(Dust.start, 1200);
    setTimeout(function () {
      root.classList.add('opened');
      intro.remove();
    }, reduce ? 60 : 2700);
  }

  /* ------------------------------------------------------------- gold dust */
  var Dust = (function () {
    var cv, ctx, W, H, dpr, parts = [], sprite, raf = 0, last = 0, running = false, started = false;
    function makeSprite() {
      var s = document.createElement('canvas'), n = 32;
      s.width = s.height = n;
      var x = s.getContext('2d'), g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      g.addColorStop(0, 'rgba(190,145,60,1)');
      g.addColorStop(.25, 'rgba(176,132,52,.8)');
      g.addColorStop(1, 'rgba(168,127,57,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, n, n);
      return s;
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return { x: Math.random() * W, y: initial ? Math.random() * H : H + rnd(5, 40), r: rnd(.6, 2.1),
               vy: -rnd(.12, .42), vx: rnd(-.08, .08), ph: rnd(0, 6.28), sp: rnd(.015, .045), a: rnd(.35, .9) };
    }
    function frame(now) {
      var dt = Math.min(48, now - last) / 16.67; last = now;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.ph += p.sp * dt;
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(p.ph * .7) * .12) * dt;
        if (p.y < -10) { parts[i] = spawn(false); continue; }
        var s = p.r * 7;
        ctx.globalAlpha = p.a * (.45 + .55 * Math.abs(Math.sin(p.ph)));
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    function run() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    return {
      start: function () {
        if (started || reduce) return;
        cv = $('#dust');
        if (!cv || !cv.getContext) return;
        started = true;
        ctx = cv.getContext('2d');
        sprite = makeSprite();
        resize();
        addEventListener('resize', resize);
        var n = W < 640 ? 26 : 46;
        for (var i = 0; i < n; i++) parts.push(spawn(true));
        document.addEventListener('visibilitychange', function () { document.hidden ? stop() : run(); });
        run();
      }
    };
  })();

  /* ------------------------------------------------------------------ music */
  var Music = (function () {
    var audio = $('#bgm'), btn = $('#musicBtn'), fadeRaf = 0, resume = false, userPaused = false, armed = false;
    if (!audio || !btn) return { start: function () {} };
    audio.addEventListener('loadedmetadata', function () { btn.hidden = false; });
    audio.addEventListener('error', function () { btn.hidden = true; });       // no music.mp3 yet

    function setState(on) {
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    }
    function fadeTo(v, done) {
      cancelAnimationFrame(fadeRaf);
      var from = audio.volume, t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 1500);
        try { audio.volume = from + (v - from) * k; } catch (e) {}
        if (k < 1) fadeRaf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function play() {
      try { audio.volume = 0; } catch (e) {}
      var p = audio.play();
      if (p && p.then) p.then(function () { setState(true); fadeTo(.6); }).catch(function () { setState(false); armFirstTap(); });
    }
    function pause() { setState(false); fadeTo(0, function () { audio.pause(); }); }
    // Browsers block sound until the guest interacts: start on their first tap instead.
    function armFirstTap() {
      if (armed || audio.error) return;
      armed = true;
      function go(e) {
        if (e.target && e.target.closest && e.target.closest('#musicBtn')) return;
        document.removeEventListener('pointerdown', go, true);
        if (audio.paused && !userPaused) play();
      }
      document.addEventListener('pointerdown', go, true);
    }
    btn.addEventListener('click', function () {
      if (audio.paused) { userPaused = false; play(); } else { userPaused = true; pause(); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !audio.paused) { audio.pause(); resume = true; }
      else if (!document.hidden && resume) { resume = false; audio.play().catch(function () {}); }
    });
    return { start: function () { if (!audio.error) play(); } };
  })();

  /* -------------------------------------------------------------- countdown */
  (function countdown() {
    var cd = $('#cd'), msg = $('#cdMsg');
    if (!cd) return;
    var nums = {};
    $$('.cd__num', cd).forEach(function (n) { nums[n.getAttribute('data-unit')] = n; });
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function set(el, v) {
      if (el.textContent === v) return;
      el.textContent = v;
      if (!reduce) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    }
    var timer;
    function tick() {
      var now = Date.now(), diff = NIKAH_START - now;
      if (diff <= 0) {
        cd.classList.add('cd--done');
        msg.textContent = now < LUNCH_END ? 'Alhamdulillah, the celebrations have begun' : 'Alhamdulillah. Thank you for celebrating with us';
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 864e5); diff -= d * 864e5;
      var h = Math.floor(diff / 36e5);  diff -= h * 36e5;
      var m = Math.floor(diff / 6e4);   diff -= m * 6e4;
      var s = Math.floor(diff / 1e3);
      set(nums.d, pad(d)); set(nums.h, pad(h)); set(nums.m, pad(m)); set(nums.s, pad(s));
    }
    tick();
    timer = setInterval(tick, 1000);
  })();

  /* --------------------------------------------------------- calendar menus */
  (function calendars() {
    function closeAll() {
      $$('.cal__menu').forEach(function (m) { m.hidden = true; });
      $$('.cal__toggle').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
    $$('.cal').forEach(function (cal) {
      var btn = $('.cal__toggle', cal), menu = $('.cal__menu', cal);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = menu.hidden;
        closeAll();
        menu.hidden = !willOpen;
        btn.setAttribute('aria-expanded', String(willOpen));
      });
    });
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  })();

  /* --------------------------------------------------------- reveal on scroll */
  (function reveals() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ------------------------------------------------------------------- start */
  if (intro) {
    intro.addEventListener('click', openInvite);                        // tap = open sooner
    Promise.all([ready, wait(reduce ? 0 : 1500)]).then(openInvite);     // otherwise open on its own
  } else {
    root.classList.add('opened');
    playHero();
  }
})();
