import './home.css'
import { initForms } from './forms.js'
import { initNav } from './nav.js'

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= hero: amber contour map ================= */
  const hero = document.getElementById('hero');
  const cv = document.getElementById('topo'), ctx = cv.getContext('2d');
  // Coarser grid on phones: the field is recomputed every frame, so cell count is the CPU cost.
  const CELL = matchMedia('(max-width: 700px)').matches ? 14 : 9;
  let W = 0, H = 0, cols, rows, F, noise;
  const hills = [[.08,.85,.22,.38],[.30,.12,.18,.24],[.90,.80,.25,.4],[.58,.98,.2,.28],[.98,.12,.16,.24]];
  const peaks = [];
  const HOME = { x:.78, y:.5 };
  const summit = { x:HOME.x, y:HOME.y, tx:HOME.x, ty:HOME.y, h:1.3, th:1.3 };
  let apexX = HOME.x, apexY = HOME.y;
  let heroVisible = true;

  function resize(){
    const r = hero.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio||1, 2); W = r.width; H = r.height;
    cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    cols = Math.ceil(W/CELL)+1; rows = Math.ceil(H/CELL)+1; F = new Float32Array(cols*rows); noise = new Float32Array(cols*rows);
    for (let j=0;j<rows;j++) for (let i=0;i<cols;i++){ const x=i*CELL/W, y=j*CELL/H; noise[j*cols+i] = .05*Math.sin(x*11+y*3) + .04*Math.sin(y*13 - x*5 + 1.3) + .03*Math.sin((x+y)*21); }
    drawTopo(performance.now());
  }
  new IntersectionObserver(e => { heroVisible = e[0].isIntersecting; }).observe(hero);

  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); summit.tx = (e.clientX-r.left)/W; summit.ty = (e.clientY-r.top)/H; summit.th = 1.45; });
  hero.addEventListener('pointerleave', () => { summit.th = 1.3; summit.tx = HOME.x; summit.ty = HOME.y; });
  hero.addEventListener('click', e => {
    if (e.target.closest('a,button')) return;
    const r = hero.getBoundingClientRect(); peaks.push([(e.clientX-r.left)/W, (e.clientY-r.top)/H, 0, .8]); if (peaks.length>5) peaks.shift();
    document.getElementById('legend').textContent = 'Peak planted · ' + peaks.length + ' of 5';
    if (reduce){ peaks[peaks.length-1][2] = .8; drawTopo(0); }
  });

  function field(t){
    const asp = W/H;
    for (let j=0;j<rows;j++){
      const y = j*CELL/H;
      for (let i=0;i<cols;i++){
        const x = i*CELL/W; let v = noise[j*cols+i];
        for (const h of hills){ const dx=(x-h[0])*asp, dy=y-h[1]; v += h[3]*Math.exp(-(dx*dx+dy*dy)/(2*h[2]*h[2])); }
        { const dx=(x-summit.x)*asp, dy=y-summit.y; v += summit.h*Math.exp(-(dx*dx+dy*dy)/(2*.18*.18)); }
        for (const p of peaks){ const dx=(x-p[0])*asp, dy=y-p[1]; v += p[2]*Math.exp(-(dx*dx+dy*dy)/(2*.09*.09)); }
        v += .025*Math.sin(t*.0006 + x*6 + y*4);
        F[j*cols+i] = v;
      }
    }
  }
  function contour(level){
    for (let j=0;j<rows-1;j++){
      for (let i=0;i<cols-1;i++){
        const a=F[j*cols+i], b=F[j*cols+i+1], c=F[(j+1)*cols+i+1], d=F[(j+1)*cols+i];
        const idx = (a>level?8:0)|(b>level?4:0)|(c>level?2:0)|(d>level?1:0);
        if (idx===0||idx===15) continue;
        const x=i*CELL, y=j*CELL;
        const top=[x+CELL*(level-a)/(b-a), y], right=[x+CELL, y+CELL*(level-b)/(c-b)], bot=[x+CELL*(level-d)/(c-d), y+CELL], left=[x, y+CELL*(level-a)/(d-a)];
        const seg=(p,q)=>{ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);};
        switch(idx){
          case 1: case 14: seg(left,bot); break;
          case 2: case 13: seg(bot,right); break;
          case 3: case 12: seg(left,right); break;
          case 4: case 11: seg(top,right); break;
          case 5: seg(left,top); seg(bot,right); break;
          case 6: case 9: seg(top,bot); break;
          case 7: case 8: seg(left,top); break;
          case 10: seg(left,bot); seg(top,right); break;
        }
      }
    }
  }
  const STEP = .075;
  function drawTopo(t){
    if (!W) return;
    field(t);
    ctx.clearRect(0,0,W,H);
    const sx = summit.x*W, sy = summit.y*H;
    const glow = ctx.createRadialGradient(sx,sy,0,sx,sy,Math.max(W,H)*.35);
    glow.addColorStop(0,'rgba(242,178,51,.12)'); glow.addColorStop(1,'rgba(242,178,51,0)');
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);
    let max = -1, at = 0; for (let k=0;k<F.length;k++) if (F[k]>max){ max=F[k]; at=k; }
    // the label rides the real high point of the terrain, so it never parts from the peak
    const ax = (at % cols)*CELL, ay = Math.floor(at / cols)*CELL;
    for (let n=1; n*STEP < max; n++){
      const lv = n*STEP, index = n%5===0, top = lv > max - STEP*1.6;
      ctx.beginPath(); contour(lv);
      ctx.strokeStyle = top ? '#F2B233' : (index ? 'rgba(242,178,51,.42)' : 'rgba(242,178,51,.17)');
      ctx.lineWidth = top ? 1.6 : (index ? 1.2 : .8);
      ctx.stroke();
    }
    // Apex mark (arrowhead) on the summit, with its label
    ctx.fillStyle = '#F2B233';
    ctx.beginPath(); ctx.moveTo(ax, ay-10); ctx.lineTo(ax+7, ay+8); ctx.lineTo(ax, ay+4); ctx.lineTo(ax-7, ay+8); ctx.closePath(); ctx.fill();
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace'; ctx.fillStyle = '#F3EEE4';
    ctx.fillText('APEX', ax+13, ay+4);
  }
  let lastTopo = 0;
  function topoLoop(t){
    summit.x += (summit.tx - summit.x)*.16; summit.y += (summit.ty - summit.y)*.16; summit.h += (summit.th - summit.h)*.06;
    for (const p of peaks) p[2] += (p[3]-p[2])*.04;
    if (heroVisible && !document.hidden && t - lastTopo > 24){ drawTopo(t); lastTopo = t; }
    requestAnimationFrame(topoLoop);
  }
  // Let the headline paint first (it is the page's largest element); the map starts once the browser is idle.
  const startTopo = () => { new ResizeObserver(resize).observe(hero); if (!reduce) requestAnimationFrame(topoLoop); };
  if (document.readyState === 'complete') (window.requestIdleCallback || setTimeout)(startTopo, { timeout: 1200 });
  else addEventListener('load', () => (window.requestIdleCallback || setTimeout)(startTopo, { timeout: 1200 }), { once:true });

  /* ================= Journey Tracker: shuffling iPhone deck ================= */
  const deck = document.getElementById('deck');
  const cards = [...deck.querySelectorAll('.iphone')];
  let order = cards.map((_, i) => i), timer = null, busy = false;
  function layout(){
    order.forEach((ci, pos) => {
      const el = cards[ci];
      el.style.zIndex = String(cards.length - pos);
      const shown = pos < 4;
      el.style.opacity = shown ? '1' : '0';
      el.style.transform = `translate(calc(-50% + ${pos*26 - 39}px), calc(-50% + ${pos*-10 + 15}px)) rotate(${pos*4 - 2}deg) scale(${1 - pos*.05})`;
    });
  }
  function shuffle(){
    if (busy) return; busy = true;
    const topEl = cards[order[0]];
    topEl.style.transform = 'translate(-160%, -40%) rotate(-14deg) scale(.96)';
    setTimeout(() => {
      order.push(order.shift());
      layout(); busy = false;
    }, reduce ? 0 : 340);
  }
  // hover shuffles; press and hold pauses on the current screen; release resumes
  let hovering = false, held = false, downAt = 0;
  const start = () => { if (!timer && hovering && !held){ timer = setInterval(shuffle, 1100); } };
  const stop = () => { clearInterval(timer); timer = null; };
  deck.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; hovering = true; shuffle(); start(); });
  deck.addEventListener('pointerleave', () => { hovering = false; held = false; stop(); });
  deck.addEventListener('pointerdown', e => { held = true; downAt = performance.now(); stop(); });
  const release = e => {
    if (!held) return; held = false;
    const tap = performance.now() - downAt < 250;
    if (e.pointerType !== 'mouse' && tap) shuffle();   // a quick tap on a phone shows the next screen
    start();
  };
  deck.addEventListener('pointerup', release); deck.addEventListener('pointercancel', release);
  deck.addEventListener('contextmenu', e => e.preventDefault());
  layout();

  /* ================= Gleaming Beacon: sand stream (ported from gleamingbeacon.com) ================= */
  (function sand(){
    const box = document.getElementById('gbTile');
    const canvas = document.getElementById('sand'), c = canvas.getContext('2d');
    let w = 0, h = 0, grains = [], t = 0, last = 0, visible = false;
    const mouse = { cx:-1e4, cy:-1e4, vx:0, vy:0, lx:-1e4, ly:-1e4 };
    const rnd = (a,b) => a + Math.random()*(b-a);
    const bandCenter = (nx, time) => .5 + .17*Math.sin(time*.16 + nx*2.3) + .06*Math.sin(time*.47 + nx*5.7 + 1.1);
    const spawn = () => ({ x:rnd(-.15,1.15)*w, off:(Math.random()<.5?-1:1)*Math.pow(Math.random(),1.7), spd:rnd(.55,1.7), thick:rnd(.5,1.1), a:rnd(.16,.42), tw:rnd(0,Math.PI*2), twS:rnd(.4,1.5), len:rnd(.4,1.3), eA:rnd(4,22), eS:rnd(.5,1.8)*(Math.random()<.5?-1:1), eP:rnd(0,Math.PI*2), ox:0, oy:0, px:0, py:0, init:false });
    function resize(){
      const dpr = Math.min(devicePixelRatio||1, 2), r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w*dpr)); canvas.height = Math.max(1, Math.round(h*dpr)); c.setTransform(dpr,0,0,dpr,0,0);
      grains = Array.from({ length: Math.min(5200, Math.round(w*h/550*3.1)) }, spawn);
      if (reduce) drawStatic();
    }
    function step(dt){
      t += dt;
      c.clearRect(0,0,w,h); c.globalCompositeOperation = 'source-over'; c.lineCap = 'round'; c.strokeStyle = 'rgb(196,164,108)';
      const rect = canvas.getBoundingClientRect(), mx = mouse.cx - rect.left, my = mouse.cy - rect.top;
      if (mouse.lx > -9e3){ mouse.vx = mouse.cx - mouse.lx; mouse.vy = mouse.cy - mouse.ly; }
      mouse.lx = mouse.cx; mouse.ly = mouse.cy;
      const R = 110, R2 = R*R;
      const gust = 1 + .5*Math.sin(t*.22) + .22*Math.sin(t*.63 + 2), wind = 110*gust, band = h*.32, spring = Math.pow(.001, dt);
      for (const p of grains){
        p.x += wind*(.55 + p.spd*.6)*dt;
        const nx = p.x/w, cy = bandCenter(nx, t)*h, flow = Math.sin(nx*6 + t*.9 + p.off*3)*band*.14;
        const eddy = t*p.eS + nx*9 + p.eP, ex = Math.cos(eddy)*p.eA, ey = Math.sin(eddy)*p.eA*.65;
        let y = cy + p.off*band*p.thick + flow + ey;
        const dxm = p.x + p.ox + ex - mx, dym = y + p.oy - my, d2 = dxm*dxm + dym*dym;
        if (d2 < R2 && d2 > .01){ const d = Math.sqrt(d2), f = (1 - d/R)*260*dt; p.ox += dxm/d*f; p.oy += dym/d*f; p.ox += mouse.vx*.35*(1 - d/R); p.oy += mouse.vy*.35*(1 - d/R); }
        p.ox *= spring; p.oy *= spring;
        const fx = p.x + p.ox + ex; y += p.oy;
        if (!p.init){ p.px = fx; p.py = y; p.init = true; }
        if (p.x > w + 60){ p.x -= w + 120; p.ox = 0; p.oy = 0; p.px = p.x; p.py = y; }
        const dx = fx - p.px, dy = y - p.py, d = Math.hypot(dx, dy) || 1;
        const streak = Math.min(2.5 + p.len*5.5*gust + Math.min(d*.6, 8), 16);
        const twk = .55 + .45*Math.sin(t*p.twS*2.4 + p.tw), edge = 1 - Math.abs(p.off)*.35;
        c.globalAlpha = Math.min(1, p.a*twk*edge); c.lineWidth = .55 + p.thick*.5;
        c.beginPath(); c.moveTo(fx - dx/d*streak, y - dy/d*streak); c.lineTo(fx, y); c.stroke();
        p.px = fx; p.py = y;
      }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
    function drawStatic(){
      c.clearRect(0,0,w,h); c.globalCompositeOperation = 'source-over'; c.lineCap = 'round'; c.strokeStyle = 'rgb(196,164,108)';
      const band = h*.32;
      for (const p of grains){ const y = bandCenter(p.x/w, 0)*h + p.off*band*p.thick; c.globalAlpha = Math.min(1, p.a*(1 - Math.abs(p.off)*.35)*.85); c.lineWidth = .45 + p.thick*.45; const s = 2.5 + p.len*5; c.beginPath(); c.moveTo(p.x - s, y); c.lineTo(p.x, y); c.stroke(); }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
    function frame(ts){
      if (!last) last = ts; let dt = (ts - last)/1000; last = ts; if (dt > .05) dt = .05;
      if (visible && !document.hidden) step(dt);
      requestAnimationFrame(frame);
    }
    new ResizeObserver(resize).observe(box);
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(box);
    addEventListener('pointermove', e => { mouse.cx = e.clientX; mouse.cy = e.clientY; }, { passive:true });
    box.addEventListener('pointerleave', () => { mouse.cx = mouse.cy = -1e4; mouse.lx = mouse.ly = -1e4; });
    resize();
    if (!reduce) requestAnimationFrame(frame);
  })();

  /* ================= HINA: a recording of the real site scrolling itself ================= */
  (function hina(){
    const v = document.getElementById('hinaVideo');
    if (reduce) return; // reduced motion keeps the still poster
    // plays while on screen; hovering (or pressing and holding on a phone) holds the page still for reading
    let inView = false, holding = false;
    const sync = () => { if (inView && !holding) v.play().catch(() => {}); else v.pause(); };
    new IntersectionObserver(e => {
      inView = e[0].isIntersecting;
      if (inView && v.preload === 'none'){ v.preload = 'auto'; v.load(); }
      sync();
    }, { threshold:.2 }).observe(v);
    const box = document.getElementById('hinaVisual');
    // always show the page's full width: fill the tile when it is wider than the video,
    // otherwise fit the whole video (the strips above and below match the page's white)
    const VA = 800/634;
    const fit = () => { const r = box.getBoundingClientRect(); v.style.objectFit = (r.width / r.height) >= VA ? 'cover' : 'contain'; };
    new ResizeObserver(fit).observe(box); fit();
    box.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse'){ holding = true; sync(); } });
    box.addEventListener('pointerleave', () => { holding = false; sync(); });
    box.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse'){ holding = true; sync(); } });
    box.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse'){ holding = false; sync(); } });
    box.addEventListener('pointercancel', () => { holding = false; sync(); });
  })();

  /* ================= biography: closes itself once the reader scrolls away ================= */
  (function bio(){
    const brief = document.getElementById('brief');
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting || !brief.open) return;
      const above = brief.getBoundingClientRect().bottom <= 0;   // the reader scrolled on past it, down the page
      const after = document.getElementById('founder').nextElementSibling;
      const before = after.getBoundingClientRect().top;
      brief.open = false;
      // keep what the reader is looking at still: undo any shift (browsers that anchor scrolling shift less, or none)
      if (above){ const moved = after.getBoundingClientRect().top - before; if (moved) window.scrollBy({ top: moved, behavior: 'instant' }); }
    }, { threshold: 0 }).observe(brief);
  })();

  /* ================= personal project: panorama drift + twinkle ================= */
  (function pano(){
    // the biography's drifting panorama pans across its own frame width
    document.querySelectorAll('.pano').forEach(el => {
      const setW = () => el.style.setProperty('--pano-w', el.clientWidth + 'px');
      new ResizeObserver(setW).observe(el); setW();
    });
    const box = document.querySelector('.pano');
    if (reduce) return;
    const cv = document.getElementById('twinkle'), c = cv.getContext('2d');
    let w = 0, h = 0, stars = [], on = false;
    const size = () => { const d = Math.min(devicePixelRatio||1, 2); w = box.clientWidth; h = box.clientHeight; cv.width = w*d; cv.height = h*d; c.setTransform(d,0,0,d,0,0);
      stars = Array.from({length: Math.round(w*h/2600)}, () => ({ x:Math.random()*w, y:Math.random()*h*.7, r:Math.random()*1.1+.3, s:Math.random()*2+.6, p:Math.random()*6.3 })); };
    new ResizeObserver(size).observe(box);
    new IntersectionObserver(e => { on = e[0].isIntersecting; }).observe(box);
    (function tick(t){
      if (on && !document.hidden){
        c.clearRect(0,0,w,h);
        for (const st of stars){ const a = Math.max(0, Math.sin(t*.001*st.s + st.p)); if (a < .55) continue; c.globalAlpha = (a-.55)*1.6; c.fillStyle = '#FFF4D6'; c.beginPath(); c.arc(st.x, st.y, st.r, 0, 6.283); c.fill(); }
        c.globalAlpha = 1;
      }
      requestAnimationFrame(tick);
    })(0);
  })();

  /* ================= numbers: slot-reel digits =================
     Each digit becomes a reel. Reels spin while the band scrolls into view,
     then decelerate and snap onto the real number once the band reaches the
     middle of the screen. The final number is never shown before the spin. */
  (() => {
    const band = document.querySelector('.nums');
    if (!band || reduce) return;
    const SPEED = 26;          // cells per second while spinning
    const LOOPS = 7;           // strip length in 0-9 loops
    const reels = [];
    band.querySelectorAll('.num b').forEach((b, n) => {
      const target = b.textContent.trim();
      b.setAttribute('aria-label', target);
      b.textContent = '';
      [...target].forEach((ch, i) => {
        if (!/\d/.test(ch)) { const s = document.createElement('span'); s.textContent = ch; s.setAttribute('aria-hidden', 'true'); b.append(s); return; }
        const win = document.createElement('span'); win.className = 'reel'; win.setAttribute('aria-hidden', 'true');
        const strip = document.createElement('span'); strip.className = 'reel-strip';
        strip.innerHTML = Array.from({length: LOOPS*10}, (_, k) => `<span>${k % 10}</span>`).join('');
        win.append(strip); b.append(win);
        reels.push({ strip, d: +ch, delay: n*.18 + i*.22, off: Math.random()*10 });
      });
    });

    // easeOutBack with a light overshoot: fast start, slow finish, small snap past and back.
    const S = .7, ease = x => 1 + (S+1)*Math.pow(x-1, 3) + S*Math.pow(x-1, 2);
    const set = (r, pos, vel) => { r.strip.style.transform = `translateY(${-pos}em)`; r.strip.style.filter = vel > 6 ? `blur(${Math.min(1.4, vel/22).toFixed(2)}px)` : ''; };
    const spinPos = (r, t) => 10 + ((r.off + SPEED*t) % 10);

    let state = 'idle', t0 = 0, tLand = 0, raf = 0;
    const reset = () => { state = 'idle'; cancelAnimationFrame(raf); raf = 0; reels.forEach(r => { r.land = null; r.off = Math.random()*10; set(r, spinPos(r, 0), 0); }); };
    reset();

    const frame = now => {
      raf = 0;
      const t = (now - t0) / 1000;
      const rect = band.getBoundingClientRect(), mid = rect.top + rect.height/2;
      if (state === 'spin' && t > .6 && mid <= innerHeight*.58){
        state = 'land'; tLand = t;
        reels.forEach(r => {
          const p0 = spinPos(r, t + r.delay), dur = 1.5 + r.delay*1.6;
          const ideal = SPEED*dur/(3+S);                 // matches spin speed at the start of the ease
          const dist = ideal + (((r.d - (p0 + ideal)) % 10) + 10) % 10;
          r.land = { p0, dist, dur, start: tLand };
        });
      }
      let moving = false;
      reels.forEach(r => {
        if (!r.land){ set(r, spinPos(r, t + r.delay), SPEED); moving = true; return; }
        const { p0, dist, dur } = r.land;
        // all reels start easing together; later digits take longer, so they land left to right
        const x = Math.min(1, Math.max(0, (t - r.land.start) / dur));
        const e = ease(x), de = (ease(Math.min(1, x + .01)) - e) / .01;
        set(r, p0 + dist*e, x < 1 ? dist*de/dur : 0);
        if (x < 1) moving = true;
      });
      if (moving) raf = requestAnimationFrame(frame);
      else state = 'done';
    };

    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && state === 'idle'){ state = 'spin'; t0 = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting) reset();       // replays next time the band comes into view
    }, { threshold: 0 }).observe(band);
  })();

  initForms();
  initNav();
})();
