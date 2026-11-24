(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(pointer:fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* mobile menu */
  const menu = $('#menu'), links = $('#navLinks');
  const setMenu = o => { links.classList.toggle('open', o); menu.classList.toggle('open', o); menu.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
  menu.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => innerWidth > 760 && setMenu(false));

  /* reveal with stagger */
  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.08 + 's'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* scroll progress + active nav */
  const bar = $('#progress');
  const upd = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${scrollY / (h.scrollHeight - innerHeight || 1)})`;
  };
  addEventListener('scroll', upd, { passive: true }); upd();
  const navA = $$('.nav-links a:not(.nav-contact)');
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'about', 'skills'].forEach(id => so.observe($('#' + id)));

  /* typing */
  const roles = ['web developer.', 'creative technologist.', '3D web builder.', 'IIT Bombay Web Team member.', 'curious problem solver.'];
  const t = $('#typed'); let ri = 0, ci = 0, del = false;
  (function type() {
    if (reduce) { t.textContent = roles[0]; return; }
    const w = roles[ri];
    t.textContent = w.slice(0, ci += del ? -1 : 1);
    let d = del ? 35 : 75;
    if (!del && ci === w.length) { del = true; d = 1600; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 350; }
    setTimeout(type, d);
  })();

  /* tilt + spotlight (mouse only) */
  $$('[data-tilt],.spot').forEach(el => {
    const tilt = el.hasAttribute('data-tilt');
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if (tilt && !reduce) {
        el.style.setProperty('--ry', ((x / r.width) - .5) * 10);
        el.style.setProperty('--rx', ((y / r.height) - .5) * -10);
      }
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', 0); el.style.setProperty('--ry', 0); });
  });

  /* magnetic buttons + cursor glow */
  if (fine && !reduce) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
  }
  const cur = $('#cursor'); let cx = 0, cy = 0, tx = 0, ty = 0;
  const mouse = { x: -999, y: -999 };
  addEventListener('pointermove', e => {
    tx = mouse.x = e.clientX; ty = mouse.y = e.clientY;
    if (e.pointerType === 'mouse') cur.classList.add('on');
  });
  document.addEventListener('pointerleave', () => { cur.classList.remove('on'); mouse.x = mouse.y = -999; });
  (function follow() {
    cx += (tx - cx) * .12; cy += (ty - cy) * .12;
    cur.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(follow);
  })();

  /* skill filters */
  $$('#filters button').forEach(b => b.addEventListener('click', () => {
    $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.skill-card').forEach(c => c.classList.toggle('dim', b.dataset.f !== 'all' && c.dataset.g !== b.dataset.f));
  }));

  /* theme colour */
  const root = document.documentElement.style;
  const setTheme = c => {
    const [a, b] = c.split(',');
    root.setProperty('--accent', a); root.setProperty('--accent2', b);
    $$('.themes button').forEach(x => x.classList.toggle('on', x.dataset.c === c));
    pc = a;
    try { localStorage.setItem('theme', c); } catch (e) {}
  };
  $$('.themes button').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.c)));

  /* toast + copy email */
  const toast = $('#toast'); let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2200); };
  $('#copyMail').addEventListener('click', async () => {
    const mail = 'ayush.thakur00540@gmail.com';
    try { await navigator.clipboard.writeText(mail); say('Email copied ✓'); }
    catch (e) { say(mail); }
  });

  /* particle network */
  const cv = $('#bg'), g = cv.getContext('2d');
  let W, H, P = [], pc = '#a18aff';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor(W * H / 16000));
    P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  };
  size(); addEventListener('resize', size);
  addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', () => mouse.x = mouse.y = -999);
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');
  (function draw() {
    g.clearRect(0, 0, W, H);
    const c = rgb(pc), R = 130;
    for (const p of P) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      g.fillStyle = `rgba(${c},.55)`; g.beginPath(); g.arc(p.x, p.y, 1.6, 0, 6.283); g.fill();
    }
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
        if (d < R) { g.strokeStyle = `rgba(${c},${(1 - d / R) * .22})`; g.lineWidth = 1; g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(P[j].x, P[j].y); g.stroke(); }
      }
      const md = Math.hypot(P[i].x - mouse.x, P[i].y - mouse.y);
      if (md < 170) { g.strokeStyle = `rgba(${c},${(1 - md / 170) * .5})`; g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(mouse.x, mouse.y); g.stroke(); }
    }
    if (!reduce) requestAnimationFrame(draw);
  })();

  /* restore saved theme */
  try { const s = localStorage.getItem('theme'); if (s) setTheme(s); } catch (e) {}
})();