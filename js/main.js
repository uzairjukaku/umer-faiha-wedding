/* Umer Azzam & Faiha — wedding invitation
   Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  window.__inviteReady = true;

  /* ------------------------------------------------------------------ config */
  var NIKAH_START = new Date('2026-12-02T17:00:00+05:30');   // 5:00 PM India time
  var LUNCH_END   = new Date('2026-12-03T15:00:00+05:30');   // 3:00 PM India time
  var SHARE_TEXT  = 'You are invited to the wedding of Umer Azzam & Faiha.\n' +
                    'Nikah: Wednesday, 2 December 2026, 5:00 PM\n' +
                    'Lunch: Thursday, 3 December 2026, 12:00 to 3:00 PM\n' +
                    'M.M. Siddique Shadi Hall, Bunder Road 3rd Cross, Bhatkal';

  // Positions (% of the card) of the fairy lights and candle flames in the artwork.
  // [x, y, strength, kind] kind 1 = string-light bulb, 2 = curtain bokeh
  var LIGHTS = [[28.72,0.62,1,1],[63.92,0.56,1,1],[66.64,1.62,1,1],[23.2,4,1,1],[59.72,1.69,1,1],[22.85,3.25,.96,1],[61.82,1.19,.54,1],[39.4,.81,.53,1],[33.63,1.44,.51,1],[56.57,2.31,.49,1],[24.43,3.88,.49,1],[44.05,2.81,.47,1],[26.36,2.62,.46,1],[35.99,1.75,.46,1],[29.95,5.12,.46,1],[27.58,5.38,.46,1],[30.65,1.5,.45,1],[41.07,.5,.42,1],[62.7,2.06,.42,1],[50.18,2.81,.41,1],[25.31,4.62,.37,1],[37.48,6.69,.36,1],[31.44,6.19,.36,1],[32.4,3.81,.35,1],[52.98,4.62,.34,1],[57.09,3.19,.34,1],[40.37,6.5,.32,1],[44.31,6.31,.31,1],[47.2,6.45,.3,1],[54.6,5.4,.3,1],
    [5.34,13.12,1,2],[5.95,14.31,1,2],[7.01,16,1,2],[94.05,28.81,1,2],[15.76,11.62,1,2],[7.18,21.19,1,2],[5.95,30.38,1,2],[5.34,22.5,.96,2],[92.03,27.62,.96,2],[93.7,23.94,.96,2],[8.93,27.44,.95,2],[7.88,28.94,.94,2],[8.41,24.44,.94,2],[92.21,17.44,.94,2],[86.25,21.31,.9,2],[87.57,20.94,.9,2],[9.37,18.12,.9,2],[16.73,9.38,.85,2],[84.85,21.06,.82,2],[87.13,23.38,.82,2],[85.03,19.12,.81,2],[82.4,11.06,.78,2],[92.73,11.12,.78,2],[10.42,10.94,.78,2],[9.63,26.44,.78,2]];
  var CANDLES = [[8.49,84.75,1],[2.63,87,.8],[13.31,88.81,.8],[85.29,87.81,.9],[94.4,87.12,1],[8.06,93.25,.6],[83.63,93.25,.6]];
  // Where sparkles may appear (% boxes: x0, y0, x1, y1)
  var SPARKLE_ZONES = [[40,39,60,46],[3,38,12,62],[88,38,97,62],[12,40,22,50],[79,40,89,50],[24,0,66,7],[2,74,18,84],[80,74,96,84]];

  var card = $('#card');
  var intro = $('#intro');

  /* ------------------------------------------------------------- card effects */
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function buildCardFx() {
    var fx = $('#cardFx');
    if (!fx || reduce) return;
    var html = '';
    LIGHTS.forEach(function (l) {
      var size = l[3] === 1 ? 18 + l[2] * 12 : 30 + l[2] * 18;
      html += '<i class="fx-l" style="left:' + l[0] + '%;top:' + l[1] + '%;--s:' + size.toFixed(1) +
        ';--t:' + rnd(1.6, 4.2).toFixed(2) + 's;--d:' + (-rnd(0, 4)).toFixed(2) + 's;--o:' + (0.5 + l[2] * 0.45).toFixed(2) + '"></i>';
    });
    CANDLES.forEach(function (c) {
      html += '<i class="fx-c" style="left:' + c[0] + '%;top:' + c[1] + '%;--s:' + (24 + 40 * c[2]).toFixed(0) +
        ';--t:' + rnd(1.6, 2.8).toFixed(2) + 's;--d:' + (-rnd(0, 2)).toFixed(2) + 's"></i>';
    });
    fx.innerHTML = html;

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        card.classList.toggle('fx-paused', !visible);
      }).observe(card);
    }
    setInterval(function () {
      if (!visible || document.hidden) return;
      var z = SPARKLE_ZONES[Math.floor(Math.random() * SPARKLE_ZONES.length)];
      var s = document.createElement('i');
      s.className = 'fx-s';
      s.style.cssText = 'left:' + rnd(z[0], z[2]).toFixed(2) + '%;top:' + rnd(z[1], z[3]).toFixed(2) + '%;--s:' + rnd(18, 34).toFixed(0);
      s.addEventListener('animationend', function () { s.remove(); });
      fx.appendChild(s);
    }, 650);
  }

  /* ------------------------------------------------------------------ intro */
  function buildIntro() {
    if (!intro) return;
    var narrow = innerWidth < 640;
    $$('.curtain__lights', intro).forEach(function (box) {
      var strands = narrow ? 5 : 9, html = '';
      for (var i = 0; i < strands; i++) {
        var x = (i + 0.5) / strands * 100 + rnd(-3, 3);
        html += '<b style="left:' + x.toFixed(2) + '%"></b>';
        var n = narrow ? 9 : 12;
        for (var j = 0; j < n; j++) {
          var y = 14 + (j + rnd(0, 0.6)) / n * 84;
          html += '<i style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;--t:' + rnd(1.2, 3.2).toFixed(2) + 's;--d:' + (-rnd(0, 3)).toFixed(2) + 's"></i>';
        }
      }
      box.innerHTML = html;
    });

    // bulbs along the scalloped valance trim (same cubic curves as the SVG, viewBox 1000×150)
    var segs = [[[0, 58], [70, 128], [180, 128], [250, 70]], [[250, 70], [320, 128], [430, 128], [500, 70]],
                [[500, 70], [570, 128], [680, 128], [750, 70]], [[750, 70], [820, 128], [930, 128], [1000, 58]]];
    var sw = '';
    segs.forEach(function (p) {
      for (var k = 1; k <= 7; k++) {
        var t = k / 8, m = 1 - t;
        var x = m * m * m * p[0][0] + 3 * m * m * t * p[1][0] + 3 * m * t * t * p[2][0] + t * t * t * p[3][0];
        var y = m * m * m * p[0][1] + 3 * m * m * t * p[1][1] + 3 * m * t * t * p[2][1] + t * t * t * p[3][1];
        sw += '<i style="left:' + (x / 10).toFixed(2) + '%;top:' + ((y + 4) / 150 * 100).toFixed(2) + '%;--t:' + rnd(1.2, 2.8).toFixed(2) + 's;--d:' + (-rnd(0, 2)).toFixed(2) + 's"></i>';
      }
    });
    $('.intro__swag', intro).innerHTML = sw;
  }

  // Wait (max 3 s) for fonts and the card artwork so the animation never starts half-loaded
  var bgImg = $('.card__bg');
  var ready = Promise.race([
    Promise.all([
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
      bgImg && bgImg.decode ? bgImg.decode().catch(function () {}) : Promise.resolve()
    ]),
    wait(3000)
  ]);

  var SEQUENCE_MS = 8800;   // when the card choreography has finished
  var played = false;

  function playCard() {
    if (played) return;
    played = true;
    card.classList.add('play');
    var hint = $('.scroll-hint');
    var finish = function () { if (hint) hint.classList.add('show'); };
    var t = setTimeout(finish, reduce ? 0 : SEQUENCE_MS);
    // tap the card to skip the animation
    card.addEventListener('click', function skip() {
      card.removeEventListener('click', skip);
      clearTimeout(t);
      card.classList.add('done');
      finish();
    });
  }

  function openInvite() {
    if (!intro || intro.classList.contains('open')) return;
    intro.classList.add('open');
    Music.start();                                   // must run inside the tap
    var delay = reduce ? 0 : 700;
    Promise.all([ready, wait(delay)]).then(playCard);
    if (!reduce) setTimeout(Petals.start, 900);
    setTimeout(function () {
      document.documentElement.classList.add('opened');
      intro.remove();
      var h = $('.couple');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, reduce ? 60 : 3100);
  }

  /* ----------------------------------------------------------------- petals */
  var Petals = (function () {
    var cv, ctx, W, H, dpr, petals = [], sprites = [], raf = 0, last = 0, running = false, started = false;
    var COLORS = [['#f7d4ce', '#e2a198'], ['#fae2dc', '#ebb3aa'], ['#fdf0e8', '#eec6ba'], ['#f3cbc2', '#d8928a']];

    function makeSprite(c) {
      var s = document.createElement('canvas'), n = 64;
      s.width = s.height = n;
      var x = s.getContext('2d');
      var g = x.createLinearGradient(0, 4, 0, n - 4);
      g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
      x.fillStyle = g;
      x.beginPath();
      x.moveTo(n / 2, 4);
      x.bezierCurveTo(n * .95, n * .12, n * .86, n * .74, n / 2, n - 4);
      x.bezierCurveTo(n * .14, n * .74, n * .05, n * .12, n / 2, 4);
      x.fill();
      x.globalAlpha = .35;                     // soft vein
      x.strokeStyle = '#ffffff';
      x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(n / 2, 10); x.quadraticCurveTo(n * .56, n * .5, n / 2, n - 10); x.stroke();
      return s;
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: Math.random() * W,
        y: initial ? -rnd(10, H * .9) : -rnd(20, 60),
        size: rnd(10, 19),
        vy: rnd(.5, 1.15), vx: rnd(-.25, .35),
        rot: rnd(0, 6.28), vr: rnd(-.025, .025),
        sway: rnd(0, 6.28), ss: rnd(.012, .026),
        flip: rnd(0, 6.28), fs: rnd(.02, .045),
        img: sprites[Math.floor(Math.random() * sprites.length)],
        a: rnd(.7, .95)
      };
    }
    function target() { return W < 640 ? 12 : 20; }
    function frame(now) {
      var dt = Math.min(48, now - last) / 16.67; last = now;
      ctx.clearRect(0, 0, W, H);
      for (var i = petals.length - 1; i >= 0; i--) {
        var p = petals[i];
        p.sway += p.ss * dt; p.flip += p.fs * dt; p.rot += p.vr * dt;
        p.x += (p.vx + Math.sin(p.sway) * .7) * dt;
        p.y += p.vy * dt;
        if (p.y > H + 30 || p.x < -40 || p.x > W + 40) {
          if (petals.length > target()) petals.splice(i, 1); else petals[i] = spawn(false);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, .3 + Math.abs(Math.cos(p.flip)) * .7);
        ctx.globalAlpha = p.a;
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    function run() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    return {
      start: function () {
        if (started || reduce) return;
        cv = $('#petals');
        if (!cv || !cv.getContext) return;
        started = true;
        ctx = cv.getContext('2d');
        sprites = COLORS.map(makeSprite);
        resize();
        addEventListener('resize', resize);
        for (var i = 0; i < (W < 640 ? 26 : 42); i++) petals.push(spawn(true));   // opening shower
        document.addEventListener('visibilitychange', function () { document.hidden ? stop() : run(); });
        run();
      }
    };
  })();

  /* ------------------------------------------------------------------ music */
  var Music = (function () {
    var audio = $('#bgm'), btn = $('#musicBtn'), fadeRaf = 0, resume = false;
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
    var userPaused = false, armed = false;
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
        if (e.target && e.target.closest && e.target.closest('#musicBtn')) return;   // the button handles itself
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
    return { start: function () { if (audio.error) return; play(); } };
  })();

  /* -------------------------------------------------------------- countdown */
  function countdown() {
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
        msg.textContent = now < LUNCH_END
          ? 'Alhamdulillah, the celebrations have begun'
          : 'Alhamdulillah. Thank you for celebrating with us';
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
  }

  /* --------------------------------------------------------- calendar menus */
  function calendars() {
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
        if (willOpen) { var first = $('a', menu); if (first) first.focus({ preventScroll: true }); }
      });
    });
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  /* ------------------------------------------------------------------ share */
  function toast(text) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function share() {
    var url = /^https?:/.test(location.protocol) ? location.origin + location.pathname : location.href;
    var shareBtn = $('#shareBtn'), wa = $('#waBtn'), copyBtn = $('#copyBtn');

    if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + '\n\n' + url);

    function copy() {
      var done = function () { toast('Link copied'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done, legacy);
      } else legacy();
      function legacy() {
        var ta = document.createElement('textarea');
        ta.value = url; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast(url); }
        ta.remove();
      }
    }
    if (copyBtn) copyBtn.addEventListener('click', copy);

    if (shareBtn) {
      if (!navigator.share) { shareBtn.hidden = true; return; }
      shareBtn.addEventListener('click', function () {
        navigator.share({ title: document.title, text: SHARE_TEXT, url: url }).catch(function () {});
      });
    }
  }

  /* --------------------------------------------------------- reveal on scroll */
  function reveals() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ------------------------------------------------------------------- init */
  buildIntro();
  buildCardFx();
  countdown();
  calendars();
  share();
  reveals();

  if (intro) {
    intro.addEventListener('click', openInvite);                        // tap = open sooner
    Promise.all([ready, wait(reduce ? 0 : 1600)]).then(openInvite);     // otherwise open on its own
  } else { document.documentElement.classList.add('opened'); playCard(); }
})();
