/* ═══════════════════════════════════════════════
   KG TRADERS — interactions & animation
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────── Preloader ─────────── */
  var preloader = document.getElementById('preloader');
  var loadBar = document.getElementById('loadBar');
  var progress = 0;
  var loadTimer = setInterval(function () {
    progress = Math.min(progress + Math.random() * 22, 92);
    if (loadBar) loadBar.style.width = progress + '%';
  }, 180);

  function finishPreloader() {
    clearInterval(loadTimer);
    if (loadBar) loadBar.style.width = '100%';
    setTimeout(function () {
      preloader.classList.add('done');
      startHeroIntro();
    }, 450);
  }
  if (document.readyState === 'complete') { finishPreloader(); }
  else { window.addEventListener('load', finishPreloader); }
  // Safety: never trap the visitor behind the loader
  setTimeout(finishPreloader, 4000);

  /* ─────────── Smooth scroll (Lenis) ─────────── */
  var lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Anchor links work with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) { lenis.scrollTo(target, { offset: -70 }); }
      else { target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ─────────── Nav ─────────── */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* ─────────── Hero silk canvas ───────────
     Layered flowing "tissue silk" ribbons + drifting zari
     particles, with gentle mouse parallax.            */
  var canvas = document.getElementById('silk');
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext('2d');
    var W, H, t = 0;
    var mouseX = 0.5, mouseY = 0.5, mx = 0.5, my = 0.5;

    var RIBBONS = [
      { hue: 'rgba(138,132,64,',  amp: 90,  speed: 0.0016, yBase: 0.62, alpha: 0.45, width: 190 }, // olive
      { hue: 'rgba(201,162,75,',  amp: 70,  speed: 0.0022, yBase: 0.5,  alpha: 0.38, width: 130 }, // gold
      { hue: 'rgba(107,47,78,',   amp: 110, speed: 0.0012, yBase: 0.74, alpha: 0.4,  width: 230 }, // plum
      { hue: 'rgba(217,164,34,',  amp: 55,  speed: 0.0028, yBase: 0.38, alpha: 0.28, width: 90  }  // mustard
    ];

    var sparks = [];
    function seedSparks() {
      sparks = [];
      var n = Math.min(90, Math.floor(W / 14));
      for (var i = 0; i < n; i++) {
        sparks.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.4,
          vy: -(Math.random() * 0.35 + 0.08),
          vx: (Math.random() - 0.5) * 0.15,
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
      H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
      seedSparks();
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    }, { passive: true });

    function ribbon(r, time) {
      var px = (mx - 0.5) * 60;
      var py = (my - 0.5) * 40;
      ctx.beginPath();
      for (var x = -50; x <= W + 50; x += 14) {
        var y = H * r.yBase + py
          + Math.sin(x * 0.0032 + time * r.speed * 1000) * r.amp
          + Math.sin(x * 0.0011 - time * r.speed * 600) * r.amp * 0.6;
        if (x === -50) ctx.moveTo(x + px, y); else ctx.lineTo(x + px, y);
      }
      var grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, r.hue + '0)');
      grad.addColorStop(0.35, r.hue + r.alpha + ')');
      grad.addColorStop(0.7, r.hue + (r.alpha * 0.75) + ')');
      grad.addColorStop(1, r.hue + '0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = r.width;
      ctx.lineCap = 'round';
      ctx.filter = 'blur(26px)';
      ctx.stroke();
      ctx.filter = 'none';
    }

    function frame() {
      t += 1;
      mx += (mouseX - mx) * 0.03;
      my += (mouseY - my) * 0.03;

      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < RIBBONS.length; i++) ribbon(RIBBONS[i], t);

      // zari dust
      for (var s = 0; s < sparks.length; s++) {
        var p = sparks[s];
        p.y += p.vy; p.x += p.vx; p.tw += 0.04;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        var a = 0.25 + Math.sin(p.tw) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,207,143,' + a + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ─────────── GSAP scroll animations ─────────── */
  var heroIntroPlayed = false;
  function startHeroIntro() {
    if (heroIntroPlayed || !window.gsap) return;
    heroIntroPlayed = true;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-kicker span', { y: 30, opacity: 0, duration: 0.9 })
      .from('.hero-title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.14 }, '-=0.5')
      .from('.hero-sub', { y: 30, opacity: 0, duration: 0.9 }, '-=0.7')
      .from('.hero-actions .btn', { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.6')
      .from('.hero-mono', { scale: 0.8, opacity: 0, duration: 1.4, ease: 'power2.out' }, '-=1.1')
      .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.6');
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) { lenis.on('scroll', ScrollTrigger.update); }

    // Section reveals
    gsap.utils.toArray(['.section-head', '.about-copy', '.about-stats', '.craft-inner', '.size-group', '.wholesale-card', '.footer-top']).forEach(function (el) {
      gsap.from(el, {
        y: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    // Cards cascade in
    gsap.utils.toArray('.card').forEach(function (card, i) {
      gsap.from(card, {
        y: 80, opacity: 0, rotateX: 8, duration: 1,
        delay: (i % 3) * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
    });

    // Chips pop
    gsap.utils.toArray('.chips').forEach(function (group) {
      gsap.from(group.children, {
        y: 26, opacity: 0, scale: 0.85, duration: 0.55, stagger: 0.06, ease: 'back.out(2)',
        scrollTrigger: { trigger: group, start: 'top 90%' }
      });
    });

    // Hero monogram parallax on scroll
    gsap.to('.hero-mono', {
      yPercent: 30, opacity: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ─────────── Counters ─────────── */
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ─────────── 3D tilt cards ─────────── */
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (fine && !prefersReduced) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var rect;
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
        card.style.transform =
          'rotateY(' + ((x - 0.5) * 14) + 'deg) rotateX(' + ((0.5 - y) * 12) + 'deg) translateZ(6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
        setTimeout(function () { card.style.transition = ''; }, 700);
      });
    });

    /* ─────────── Magnetic buttons ─────────── */
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + dx * 0.18 + 'px,' + dy * 0.22 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ─────────── Footer year ─────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
