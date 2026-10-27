/* Enzo Mixology — retro homepage behaviour.
   Everything here is an enhancement: the page reads and navigates fine without it.
   - "Dial-up" photo loading as photos scroll into view
   - a per-browser visit counter (stored locally, never sent anywhere)
   - Bar effects: champagne bubbles, falling ice, click fireworks, stardust cursor
   - a music-box tune synthesised live with the Web Audio API */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
    session(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } return null; }
  };
  document.querySelectorAll('.js-only').forEach(el => { el.hidden = false; });

  /* ---------- Dial-up photo loading ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-dialup');
    const reveal = fig => {
      const img = fig.querySelector('img');
      const go = () => fig.classList.add('is-loaded');
      if (!img || (img.complete && img.naturalWidth)) return go();
      img.addEventListener('load', go, { once: true });
      img.addEventListener('error', go, { once: true });
      setTimeout(go, 8000); // never leave a photo covered on a stalled connection
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-dialup]').forEach(fig => io.observe(fig));
    // Photos inside closed <details> are not visible yet; reveal them when opened.
    document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
      if (d.open) d.querySelectorAll('[data-dialup]:not(.is-loaded)').forEach(reveal);
    }));
  }

  /* ---------- Visit counter (this browser only) ---------- */
  const counter = document.getElementById('visit-count');
  if (counter) {
    let n = parseInt(store.get('enzo-visits') || '0', 10) || 0;
    if (!store.session('enzo-visit-counted')) {
      n += 1;
      store.set('enzo-visits', String(n));
      store.session('enzo-visit-counted', '1');
    }
    counter.textContent = String(Math.max(n, 1)).padStart(4, '0');
  }

  /* ---------- Countdown to a date (e.g. Halloween), in the visitor's local time ---------- */
  document.querySelectorAll('[data-countdown]').forEach(el => {
    const [y, m, d] = el.dataset.countdown.split('-').map(Number);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(y, m - 1, d) - today) / 864e5);
    const odo = n => `<span class="odometer">${String(n).padStart(2, '0')}</span>`;
    // Each text sits in its own span with data-zh, so the language switch can swap it.
    if (days > 1) el.innerHTML = `<span data-zh="距离万圣节还有">Halloween in</span> ${odo(days)} <span data-zh="天">days</span>`;
    else if (days === 1) el.innerHTML = '<span data-zh="明天就是万圣节！">Halloween is tomorrow!</span>';
    else if (days === 0) el.innerHTML = '<span data-zh="今天就是万圣节！">Halloween is today!</span>';
    else el.innerHTML = `<span data-zh="${y} 年万圣节限定">Halloween ${y} limited edition</span>`;
  });

  /* ---------- Music box ---------- */
  const Music = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    let ac = null, master = null, timer = 0, nextTime = 0, step = 0, playing = false;
    const eighth = 60 / 92 / 2;
    const hz = n => 440 * Math.pow(2, (n - 69) / 12);
    // An original eight-bar tune in F major: F – Dm – B♭ – C, twice.
    const chords = [[53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55], [53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55]];
    const melody = [[81, 79, 77, 72], [74, 77, 81, 79], [77, 74, 70, 74], [76, 79, 72, 0], [81, 82, 81, 77], [74, 76, 77, 81], [79, 77, 74, 76], [76, 72, 77, 0]];
    const arp = c => [c[0], c[2], c[1] + 12, c[2], c[0] + 12, c[2], c[1] + 12, c[2]];
    function tine(freq, t, vel, dur) {
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vel, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      g.connect(master);
      const o1 = ac.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq; o1.connect(g);
      const g2 = ac.createGain();
      g2.gain.setValueAtTime(vel * 0.35, t);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      g2.connect(master);
      const o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 4.02; o2.connect(g2);
      [o1, o2].forEach(o => { o.start(t); o.stop(t + dur + 0.05); });
    }
    function schedule() {
      while (nextTime < ac.currentTime + 0.15) {
        const bar = step >> 3, e = step & 7;
        tine(hz(arp(chords[bar])[e]), nextTime, 0.13, 1.3);
        if (e % 2 === 0) {
          const m = melody[bar][e >> 1];
          if (m) tine(hz(m), nextTime, 0.22, 2.1);
        }
        nextTime += eighth;
        step = (step + 1) % 64;
      }
    }
    return {
      get playing() { return playing; },
      start() {
        if (playing) return;
        if (!ac) {
          ac = new AC();
          master = ac.createGain();
          const comp = ac.createDynamicsCompressor();
          master.connect(comp); comp.connect(ac.destination);
        }
        ac.resume();
        master.gain.cancelScheduledValues(ac.currentTime);
        master.gain.setValueAtTime(0.0001, ac.currentTime);
        master.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 0.4);
        nextTime = ac.currentTime + 0.08; step = 0;
        timer = setInterval(schedule, 30);
        playing = true;
      },
      stop() {
        if (!playing) return;
        playing = false;
        clearInterval(timer);
        const t = ac.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        setTimeout(() => { if (!playing) ac.suspend(); }, 450);
      }
    };
  })();

  /* ---------- Bar effects canvas ---------- */
  const FX = (() => {
    const cv = document.createElement('canvas');
    cv.className = 'fx-canvas';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    let W = 0, H = 0, raf = 0, last = 0;
    const on = { bubbles: false, ice: false, fireworks: false, stardust: false, leaves: false };
    const parts = [];
    const count = { b: 0, i: 0, l: 0 };
    const acc = { b: 0, i: 0, l: 0 };
    const palette = ['#f2c14e', '#f08a6b', '#7fd1c7', '#fff3c4', '#f59e4c', '#e8a3c9'];
    const pick = () => palette[(Math.random() * palette.length) | 0];
    const small = () => W < 640;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const add = p => { parts.push(p); if (p.k in count) count[p.k]++; };
    const bubble = anywhere => add({ k: 'b', x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: 1.6 + Math.random() * 4.4, vy: -(16 + Math.random() * 40), ph: Math.random() * 6.3, w: .5 + Math.random() * 1.3, a: .45 + Math.random() * .35 });
    const ice = anywhere => add({ k: 'i', x: Math.random() * W, y: anywhere ? Math.random() * H : -14, s: 3 + Math.random() * 4.5, vy: 20 + Math.random() * 38, vx: -10 + Math.random() * 20, rot: Math.random() * 6.3, vr: -1 + Math.random() * 2, a: .55 + Math.random() * .35 });
    const leafColors = ['#e8792b', '#c8461f', '#f2a93b', '#9c4a1a', '#d9612a'];
    const leaf = anywhere => add({ k: 'l', x: Math.random() * W, y: anywhere ? Math.random() * H : -16, s: 6 + Math.random() * 6, vy: 22 + Math.random() * 26, sway: 18 + Math.random() * 26, ph: Math.random() * 6.3, rot: Math.random() * 6.3, vr: -1.4 + Math.random() * 2.8, c: leafColors[(Math.random() * leafColors.length) | 0], a: .7 + Math.random() * .25 });
    function burst(x, y) {
      const n = small() ? 28 : 44, main = pick();
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + Math.random() * .2, sp = 70 + Math.random() * 170;
        add({ k: 'f', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, t: 0, max: .9 + Math.random() * .6, c: Math.random() < .7 ? main : pick(), s: 2 + ((Math.random() * 2) | 0) });
      }
    }
    const dust = (x, y) => add({ k: 's', x: x + (Math.random() - .5) * 8, y: y + (Math.random() - .5) * 8, vx: (Math.random() - .5) * 30, vy: -8 + Math.random() * 30, t: 0, max: .55 + Math.random() * .5, c: pick(), s: 3 + Math.random() * 4 });

    function drawStar(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s);
      ctx.fill();
    }

    function tick(now) {
      const dt = Math.min(.05, (now - last) / 1000 || .016);
      last = now;
      if (on.bubbles) {
        acc.b += dt * (small() ? 3.5 : 7);
        while (acc.b >= 1) { acc.b -= 1; if (count.b < (small() ? 16 : 34)) bubble(false); }
      }
      if (on.ice) {
        acc.i += dt * (small() ? 3.5 : 7);
        while (acc.i >= 1) { acc.i -= 1; if (count.i < (small() ? 18 : 40)) ice(false); }
      }
      if (on.leaves) {
        acc.l += dt * (small() ? 1.6 : 3);
        while (acc.l >= 1) { acc.l -= 1; if (count.l < (small() ? 10 : 22)) leaf(false); }
      }
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        let dead = false;
        if (p.k === 'b') {
          p.y += p.vy * dt; p.ph += dt * 2.2;
          const x = p.x + Math.sin(p.ph) * p.w * 3;
          ctx.globalAlpha = p.a;
          ctx.beginPath(); ctx.arc(x, p.y, p.r + .8, 0, 6.283);
          ctx.strokeStyle = 'rgba(40,60,40,.28)'; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283);
          ctx.fillStyle = 'rgba(255,236,170,.16)'; ctx.fill();
          ctx.strokeStyle = 'rgba(255,252,236,.95)'; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.fillRect(x - p.r * .45, p.y - p.r * .45, Math.max(1, p.r * .3), Math.max(1, p.r * .3));
          dead = p.y < -12 || !on.bubbles && p.y < H * .15;
        } else if (p.k === 'i') {
          p.y += p.vy * dt; p.x += p.vx * dt; p.rot += p.vr * dt;
          ctx.globalAlpha = p.a;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.strokeStyle = 'rgba(60,95,140,.4)'; ctx.lineWidth = 3;
          ctx.beginPath();
          for (let a = 0; a < 3; a++) { const r = a * Math.PI / 3; ctx.moveTo(-Math.cos(r) * p.s, -Math.sin(r) * p.s); ctx.lineTo(Math.cos(r) * p.s, Math.sin(r) * p.s); }
          ctx.stroke();
          ctx.strokeStyle = 'rgba(235,248,255,.95)'; ctx.lineWidth = 1.3; ctx.stroke();
          ctx.restore();
          dead = p.y > H + 16;
        } else if (p.k === 'l') {
          p.y += p.vy * dt; p.ph += dt * 1.6; p.rot += p.vr * dt;
          const x = p.x + Math.sin(p.ph) * p.sway;
          ctx.globalAlpha = p.a;
          ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot + Math.sin(p.ph) * .6);
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.moveTo(0, -p.s);
          ctx.bezierCurveTo(p.s * .9, -p.s * .5, p.s * .7, p.s * .6, 0, p.s);
          ctx.bezierCurveTo(-p.s * .7, p.s * .6, -p.s * .9, -p.s * .5, 0, -p.s);
          ctx.fill();
          ctx.strokeStyle = 'rgba(60,20,5,.55)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, -p.s * .8); ctx.lineTo(0, p.s * 1.35); ctx.stroke();
          ctx.restore();
          dead = p.y > H + 20;
        } else if (p.k === 'f') {
          p.t += dt; p.vy += 150 * dt; p.vx *= .985; p.vy *= .985;
          p.x += p.vx * dt; p.y += p.vy * dt;
          ctx.globalAlpha = Math.max(0, 1 - p.t / p.max);
          ctx.fillStyle = p.c; ctx.fillRect(p.x | 0, p.y | 0, p.s, p.s);
          dead = p.t >= p.max;
        } else {
          p.t += dt; p.vy += 40 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          const life = 1 - p.t / p.max;
          ctx.globalAlpha = Math.max(0, life);
          ctx.fillStyle = p.c; drawStar(p.x, p.y, p.s * (.5 + .5 * Math.abs(Math.sin(p.t * 9))));
          dead = p.t >= p.max;
        }
        if (dead) { if (p.k in count) count[p.k]--; parts.splice(i, 1); }
      }
      ctx.globalAlpha = 1;
      if (parts.length || on.bubbles || on.ice || on.leaves) raf = requestAnimationFrame(tick);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    }
    function wake() {
      if (raf || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake();
    });
    window.addEventListener('pointerdown', e => {
      if (!on.fireworks || e.target.closest('.fx')) return;
      burst(e.clientX, e.clientY); wake();
    }, { passive: true });
    let lx = -99, ly = -99;
    window.addEventListener('pointermove', e => {
      if (!on.stardust || e.pointerType !== 'mouse') return;
      if (Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) < 9) return;
      lx = e.clientX; ly = e.clientY;
      dust(lx, ly); wake();
    }, { passive: true });

    return {
      set(name, value) {
        on[name] = value;
        if (value && name === 'bubbles') for (let i = 0; i < (small() ? 6 : 12); i++) bubble(true);
        if (value && name === 'ice') for (let i = 0; i < (small() ? 6 : 14); i++) ice(true);
        if (value && name === 'leaves') for (let i = 0; i < (small() ? 4 : 9); i++) leaf(true);
        if (!value && (name === 'ice' || name === 'leaves')) {
          const k = name === 'ice' ? 'i' : 'l';
          for (let i = parts.length - 1; i >= 0; i--) if (parts[i].k === k) { parts.splice(i, 1); count[k]--; }
        }
        wake();
      }
    };
  })();

  /* ---------- Effects panel ---------- */
  const box = document.querySelector('.fx');
  if (!box || !FX) return;
  const toggle = box.querySelector('.fx-toggle');
  const panel = box.querySelector('.fx-panel');
  const inputs = [...panel.querySelectorAll('input[data-fx]')];
  const musicButtons = [...document.querySelectorAll('.music-toggle')];
  box.hidden = false;
  document.querySelectorAll('[data-fx-open]').forEach(b => { b.hidden = false; });

  // "leaves" only has a switch on pages that offer it (the Halloween kvass page).
  const defaults = { bubbles: !reduceMotion, ice: false, fireworks: false, stardust: !reduceMotion && finePointer, leaves: !reduceMotion };
  let prefs = defaults;
  try { prefs = Object.assign({}, defaults, JSON.parse(store.get('enzo-fx') || '{}')); } catch (e) { prefs = defaults; }

  function setMusic(play) {
    if (!Music) return;
    if (play) Music.start(); else Music.stop();
    musicButtons.forEach(b => b.setAttribute('aria-pressed', String(Music.playing)));
    inputs.forEach(i => { if (i.dataset.fx === 'music') i.checked = Music.playing; });
  }
  inputs.forEach(input => {
    const name = input.dataset.fx;
    if (name === 'music') {
      if (!Music) input.closest('label').hidden = true;
      input.addEventListener('change', () => setMusic(input.checked));
      return;
    }
    input.checked = !!prefs[name];
    FX.set(name, input.checked);
    input.addEventListener('change', () => {
      prefs[name] = input.checked;
      store.set('enzo-fx', JSON.stringify(prefs));
      FX.set(name, input.checked);
    });
  });
  musicButtons.forEach(b => {
    if (!Music) { b.closest('.js-only').hidden = true; return; }
    b.addEventListener('click', () => setMusic(!Music.playing));
  });
  let resumeMusic = false;
  document.addEventListener('visibilitychange', () => {
    if (!Music) return;
    if (document.hidden && Music.playing) { resumeMusic = true; setMusic(false); }
    else if (!document.hidden && resumeMusic) { resumeMusic = false; setMusic(true); }
  });

  function openPanel(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) inputs[0].focus();
  }
  toggle.addEventListener('click', () => openPanel(panel.hidden));
  panel.querySelector('.fx-close').addEventListener('click', () => { openPanel(false); toggle.focus(); });
  document.querySelectorAll('[data-fx-open]').forEach(b => b.addEventListener('click', () => openPanel(true)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) { openPanel(false); toggle.focus(); }
  });
  document.addEventListener('pointerdown', e => {
    if (!panel.hidden && !box.contains(e.target) && !e.target.closest('[data-fx-open]')) openPanel(false);
  });
})();
