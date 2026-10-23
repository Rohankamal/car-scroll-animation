/**
 * Scroll-driven hero
 *  - Scroll progress (0..1) is eased with a lerp → drives the car, road, parallax, reveal and counters.
 *  - Input: native scroll by default; if the page can't scroll natively (e.g. embedded preview frame)
 *    it automatically switches to wheel/touch/keyboard "virtual scroll" so the car still drives.
 *  - GSAP handles the load/intro animation (with a safe fallback if the CDN is blocked).
 *  - Only transform / opacity / clip-path are animated; layout is measured on resize only.
 */
(() => {
  const $ = (s) => document.querySelector(s);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('#stage'), carWrap = $('#carWrap'), car = $('#car');

  // ---------- Headline split, then clone into the bright reveal layer ----------
  const h = $('#ghost .headline');
  const words = h.textContent.trim().split(' ');
  h.textContent = '';
  words.forEach((w) => {
    const word = document.createElement('span'); word.className = 'word'; word.setAttribute('aria-hidden', 'true');
    [...w].forEach((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; word.appendChild(s); });
    h.appendChild(word);
  });
  const bright = $('#bright');
  [...$('#ghost').children].forEach((n) => bright.appendChild(n.cloneNode(true)));
  bright.querySelector('.headline').removeAttribute('aria-label');

  const ghostStats = [...document.querySelectorAll('#ghost .stat')];
  const nums = [...bright.querySelectorAll('.stat b')];
  const bstats = [...bright.querySelectorAll('.stat')], sk = bstats.map(() => -1);
  const fin = nums.map((b) => ({ v: +b.dataset.count, s: b.dataset.suf }));

  // Speed lines
  const sl = $('#sl');
  for (let i = 0; i < 14; i++) {
    const l = document.createElement('i');
    l.style.cssText = `top:${(i * 7.3 + 3) % 100}%;width:${120 + (i * 53) % 260}px;animation-duration:${0.5 + (i % 5) * 0.12}s;animation-delay:-${(i % 7) * 0.2}s`;
    sl.appendChild(l);
  }

  // ---------- Geometry (measured on resize only) ----------
  let vw = innerWidth, cw = 300, R = 1, sx = [];
  const readRange = () => Math.max(1, root.scrollHeight - innerHeight);
  function measure() {
    vw = innerWidth; cw = carWrap.offsetWidth; R = readRange();
    sx = ghostStats.map((s) => { const r = s.getBoundingClientRect(); return r.left + r.width / 2; });
  }
  measure();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
  addEventListener('load', measure);

  // ---------- Intro (GSAP, optional) ----------
  if (window.gsap && !reduce) {
    root.classList.add('gsap');
    setTimeout(() => root.classList.remove('gsap'), 6000); // safety net
    try {
      gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: measure })
        .fromTo('#ghost .ch', { autoAlpha: 0, y: 50, rotateX: -80, transformPerspective: 600 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.05 })
        .fromTo('#ghost .stat', { autoAlpha: 0, y: 30, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 }, '-=0.5')
        .fromTo('.road', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0)
        .fromTo('.hud, .hint', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.2);
    } catch (e) { root.classList.remove('gsap'); }
  }

  // ---------- Input: native scroll, with automatic virtual-scroll fallback ----------
  let mode = 'native', vp = 0, probe = 0;
  const prog = () => (mode === 'native' ? clamp(scrollY / R) : vp);
  const vDelta = (d, e) => {
    if (e && e.cancelable && ((d > 0 && vp < 1) || (d < 0 && vp > 0))) e.preventDefault();
    vp = clamp(vp + d / (innerHeight * 4));
  };
  const probeScroll = (d) => {
    if (probe) return;
    const y0 = scrollY;
    probe = setTimeout(() => {
      probe = 0;
      const edge = R > 50 && ((d < 0 && y0 <= 1) || (d > 0 && y0 >= R - 1));
      if (scrollY === y0 && !edge && d !== 0) { mode = 'virtual'; vp = clamp(y0 / R); }
    }, 160);
  };
  addEventListener('wheel', (e) => { mode === 'virtual' ? vDelta(e.deltaY, e) : probeScroll(e.deltaY); }, { passive: false });
  let ty = 0;
  addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', (e) => {
    const y = e.touches[0].clientY, d = (ty - y); ty = y;
    mode === 'virtual' ? vDelta(d * 1.6, e) : probeScroll(d);
  }, { passive: false });
  addEventListener('keydown', (e) => {
    if (mode !== 'virtual') return;
    const k = { ArrowDown: 120, PageDown: 600, ' ': 600, ArrowUp: -120, PageUp: -600, Home: -1e5, End: 1e5 }[e.key];
    if (k) vDelta(k, e);
  });

  // ---------- Main loop ----------
  const dashEl = $('#lanes'), d1 = $('#d1'), d2 = $('#d2'), trail = $('#trail'), edge = $('#edge');
  const bar = $('#progress'), speedEl = $('#speed'), beams = $('#beamsG'), glow = $('#underglow');
  const mod = (x, p) => ((x % p) + p) % p;
  const t0 = performance.now();
  let smooth = prog(), last = t0, vel = 0, speed = 0, shown = -1, lastClip = -1, done = false;
  const cnt = nums.map(() => ({ on: false, t: 0, fin: false }));

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 0.016; last = now;
    const target = prog(), prev = smooth;
    smooth += (target - smooth) * (1 - Math.exp(-dt * 6));
    if (Math.abs(target - smooth) < 1e-5) smooth = target;

    const span = mode === 'native' ? R : innerHeight * 4;
    vel += ((smooth - prev) * span / dt - vel) * 0.15;
    const n = clamp(vel / 1600, -1, 1), a = Math.abs(n);

    // Car: starts on-screen left, ends at the right edge; plus intro drive-in
    const introT = reduce ? 1 : clamp((now - t0 - 250) / 1900);
    const introX = -(1 - (1 - Math.pow(1 - introT, 3))) * 1.4; // easeOutCubic, in car-widths
    const x0 = Math.max(12, vw * 0.02), x1 = vw - cw - 12;
    const carX = x0 + smooth * (x1 - x0) + introX * cw;
    carWrap.style.transform = `translate3d(${carX}px,0,0)`;
    const front = carX + cw * 0.97;

    // Reveal text behind the car, light trail + scanner edge
    const clip = Math.round(clamp(vw - front, 0, vw));
    if (clip !== lastClip) { lastClip = clip; bright.style.clipPath = `inset(0 ${clip}px 0 0)`; }
    trail.style.transform = `scaleX(${clamp(front / vw)})`;
    edge.style.transform = `translate3d(${front}px,0,0)`;

    // Ground / lanes / particles scroll backwards for speed
    const dist = smooth * 5200;
    dashEl.style.transform = `translate3d(${-mod(dist, 90)}px,0,0)`;
    d1.style.transform = `translate3d(${-mod(dist * 0.3, 120)}px,0,0)`;
    d2.style.transform = `translate3d(${-mod(dist * 0.7, 200)}px,0,0)`;

    // Car feel: idle rumble, yaw, beams, underglow, speed lines
    const rumble = reduce ? 0 : (Math.random() - 0.5) * (0.5 + a * 2.4);
    car.style.transform = `translate3d(0,${rumble + n * 5}px,0) rotate(${n * 2.2}deg)`;
    beams.style.opacity = 0.55 + a * 0.45;
    glow.style.opacity = 0.22 + a * 0.6;
    sl.style.opacity = clamp(a * 1.1);
    speed += (Math.min(Math.abs(vel) / 7, 280) - speed) * 0.12;
    const r = Math.round(speed);
    if (r !== shown) { shown = r; speedEl.textContent = String(r).padStart(3, '0'); }
    bar.style.transform = `scaleX(${smooth})`;

    // Count-up when the car reaches each stat (replays if you drive back)
    nums.forEach((b, i) => {
      const c = cnt[i];
      if (!c.on && front > sx[i]) { c.on = true; c.fin = false; c.t = now; }
      else if (c.on && front < sx[i] - 90) { c.on = false; b.textContent = '0' + fin[i].s; return; }
      if (c.on && !c.fin) {
        const k = clamp((now - c.t) / 1600), e = 1 - Math.pow(1 - k, 3);
        b.textContent = Math.round(fin[i].v * e) + fin[i].s;
        if (k >= 1) c.fin = true;
      }
    });
    nums.forEach((b, i) => { if (!cnt[i].on && !cnt[i].fin && b.textContent === fin[i].v + fin[i].s) b.textContent = '0' + fin[i].s; });

    // Stat cards fade in and float up one after another as the car reaches them
    bstats.forEach((s, i) => {
      const k = clamp((front - (sx[i] - 140)) / 280);
      if (Math.abs(k - sk[i]) > 0.002) { sk[i] = k; s.style.opacity = k; s.style.transform = `translate3d(0,${(1 - k) * 44}px,0)`; }
    });

    const arrived = smooth > 0.985;
    if (arrived !== done) { done = arrived; stage.classList.toggle('done', arrived); }
    requestAnimationFrame(frame);
  }
  nums.forEach((b, i) => (b.textContent = '0' + fin[i].s));
  requestAnimationFrame(frame);

  // ---------- Finale reveal ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.25 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
