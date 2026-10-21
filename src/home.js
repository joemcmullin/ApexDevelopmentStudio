/*
 * ==========================================================================
 *   Apex Development Studio LLC
 *   https://apexdevelopmentstudio.com
 * ==========================================================================
 *
 *   Designed and engineered by
 *
 *       A P E X   D E V E L O P M E N T   S T U D I O   L L C
 *       https://apexdevelopmentstudio.com
 *       joemcmullin@apexdevelopmentstudio.com
 *
 *   Built with plain HTML, CSS and JavaScript, bundled by Vite.
 *
 *   Copyright (c) 2026 Apex Development Studio LLC. All rights reserved.
 * ==========================================================================
 */

/*
 * ============================================================================
 * home.js: everything that moves on the home page.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   The home page's animations and interactions, in the order they appear in
 *   this file:
 *     1. Hero contour map ... the amber topographic map behind the headline.
 *                             Its summit follows the pointer, and a click or
 *                             tap plants up to 5 extra peaks.
 *     2. HINA tile .......... plays the recording of hinapacific.org while the
 *                             tile is on screen. Hovering, or pressing and
 *                             holding on a phone, pauses it for reading.
 *     3. Biography .......... the "Read more" panel closes itself once the
 *                             reader scrolls past it.
 *     4. Photography tile ... sizes the Milky Way panorama's drift and draws
 *                             the twinkling stars over it.
 *     5. Numbers band ....... the 22 / 18 / 3 / 6 figures spin in like slot
 *                             reels and land on the real numbers.
 *   It also starts the contact form (forms.js) and the phone menu (nav.js).
 *
 * WHERE IT APPEARS
 *   The home page only. index.html loads it at the bottom. Inner pages load
 *   page.js instead.
 *
 * DEPENDS ON
 *   home.css (loaded from here), forms.js, nav.js, analytics.js, and these elements in
 *   index.html: #hero, #topo, #legend, #hinaVideo, #hinaVisual, #founder,
 *   #brief, .pano, #twinkle and .nums.
 *
 * HOW TO EDIT
 *   - The numbers ............ type them in the .nums band in index.html. The
 *                              reels read them from the page.
 *   - Hero hint text ......... #legend in index.html. The "Peak planted" text
 *                              is in the hero section below.
 *   - Where the summit rests . HOME below (0 to 1, across and down the hero).
 *   - Map detail ............. CELL below. Bigger cells are coarser and
 *                              lighter on the processor.
 *   - Reel speed ............. SPEED and LOOPS in the numbers section.
 *   - HINA video ............. public/media/hina-scroll.mp4 and
 *                              hina-poster.webp, named in index.html.
 *
 * ACCESSIBILITY
 *   Visitors who ask their device for reduced motion get still versions: a
 *   static contour map, the HINA poster image in place of the video, a still
 *   panorama with no stars, and the numbers shown plainly. Screen readers
 *   hear each number once, from a hidden copy, not the spinning digits.
 */

import './home.css'
import { initForms } from './forms.js'
import { initNav } from './nav.js'
import { startAnalytics } from './analytics.js'
;(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ================= hero: amber contour map ================= */
  const hero = document.getElementById('hero')
  const cv = document.getElementById('topo'),
    ctx = cv.getContext('2d')
  // Coarser grid on phones: the field is recomputed every frame, so cell count is the CPU cost.
  const CELL = matchMedia('(max-width: 700px)').matches ? 14 : 9
  let W = 0,
    H = 0,
    cols,
    rows,
    F,
    noise
  // The fixed hills that shape the map: [across, down, spread, height], with
  // across and down from 0 to 1 over the hero.
  const hills = [
    [0.08, 0.85, 0.22, 0.38],
    [0.3, 0.12, 0.18, 0.24],
    [0.9, 0.8, 0.25, 0.4],
    [0.58, 0.98, 0.2, 0.28],
    [0.98, 0.12, 0.16, 0.24],
  ]
  const peaks = [] // peaks planted by clicks or taps, at most 5 (oldest goes first)
  // Where the summit rests when the pointer is away: 78% across, halfway down.
  const HOME = { x: 0.78, y: 0.5 }
  // The summit eases toward its target (tx, ty, th) every frame. h is its height.
  const summit = { x: HOME.x, y: HOME.y, tx: HOME.x, ty: HOME.y, h: 1.3, th: 1.3 }
  let heroVisible = true

  function resize() {
    const r = hero.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio || 1, 2)
    W = r.width
    H = r.height
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.ceil(W / CELL) + 1
    rows = Math.ceil(H / CELL) + 1
    F = new Float32Array(cols * rows)
    noise = new Float32Array(cols * rows)
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const x = (i * CELL) / W,
          y = (j * CELL) / H
        noise[j * cols + i] =
          0.05 * Math.sin(x * 11 + y * 3) +
          0.04 * Math.sin(y * 13 - x * 5 + 1.3) +
          0.03 * Math.sin((x + y) * 21)
      }
    drawTopo(performance.now())
  }
  new IntersectionObserver((e) => {
    heroVisible = e[0].isIntersecting
  }).observe(hero)

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect()
    summit.tx = (e.clientX - r.left) / W
    summit.ty = (e.clientY - r.top) / H
    summit.th = 1.45
  })
  hero.addEventListener('pointerleave', () => {
    summit.th = 1.3
    summit.tx = HOME.x
    summit.ty = HOME.y
  })
  hero.addEventListener('click', (e) => {
    if (e.target.closest('a,button')) return
    const r = hero.getBoundingClientRect()
    peaks.push([(e.clientX - r.left) / W, (e.clientY - r.top) / H, 0, 0.8])
    if (peaks.length > 5) peaks.shift()
    document.getElementById('legend').textContent = 'Peak planted · ' + peaks.length + ' of 5'
    if (reduce) {
      peaks[peaks.length - 1][2] = 0.8
      drawTopo(0)
    }
  })

  function field(t) {
    const asp = W / H
    for (let j = 0; j < rows; j++) {
      const y = (j * CELL) / H
      for (let i = 0; i < cols; i++) {
        const x = (i * CELL) / W
        let v = noise[j * cols + i]
        for (const h of hills) {
          const dx = (x - h[0]) * asp,
            dy = y - h[1]
          v += h[3] * Math.exp(-(dx * dx + dy * dy) / (2 * h[2] * h[2]))
        }
        {
          const dx = (x - summit.x) * asp,
            dy = y - summit.y
          v += summit.h * Math.exp(-(dx * dx + dy * dy) / (2 * 0.18 * 0.18))
        }
        for (const p of peaks) {
          const dx = (x - p[0]) * asp,
            dy = y - p[1]
          v += p[2] * Math.exp(-(dx * dx + dy * dy) / (2 * 0.09 * 0.09))
        }
        v += 0.025 * Math.sin(t * 0.0006 + x * 6 + y * 4)
        F[j * cols + i] = v
      }
    }
  }
  function contour(level) {
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = F[j * cols + i],
          b = F[j * cols + i + 1],
          c = F[(j + 1) * cols + i + 1],
          d = F[(j + 1) * cols + i]
        const idx =
          (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0)
        if (idx === 0 || idx === 15) continue
        const x = i * CELL,
          y = j * CELL
        const top = [x + (CELL * (level - a)) / (b - a), y],
          right = [x + CELL, y + (CELL * (level - b)) / (c - b)],
          bot = [x + (CELL * (level - d)) / (c - d), y + CELL],
          left = [x, y + (CELL * (level - a)) / (d - a)]
        const seg = (p, q) => {
          ctx.moveTo(p[0], p[1])
          ctx.lineTo(q[0], q[1])
        }
        switch (idx) {
          case 1:
          case 14:
            seg(left, bot)
            break
          case 2:
          case 13:
            seg(bot, right)
            break
          case 3:
          case 12:
            seg(left, right)
            break
          case 4:
          case 11:
            seg(top, right)
            break
          case 5:
            seg(left, top)
            seg(bot, right)
            break
          case 6:
          case 9:
            seg(top, bot)
            break
          case 7:
          case 8:
            seg(left, top)
            break
          case 10:
            seg(left, bot)
            seg(top, right)
            break
        }
      }
    }
  }
  const STEP = 0.075 // height between contour lines. Smaller draws more lines.
  function drawTopo(t) {
    if (!W) return
    field(t)
    ctx.clearRect(0, 0, W, H)
    const sx = summit.x * W,
      sy = summit.y * H
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(W, H) * 0.35)
    glow.addColorStop(0, 'rgba(242,178,51,.12)')
    glow.addColorStop(1, 'rgba(242,178,51,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
    let max = -1,
      at = 0
    for (let k = 0; k < F.length; k++)
      if (F[k] > max) {
        max = F[k]
        at = k
      }
    // the label rides the real high point of the terrain, so it never parts from the peak
    const ax = (at % cols) * CELL,
      ay = Math.floor(at / cols) * CELL
    for (let n = 1; n * STEP < max; n++) {
      const lv = n * STEP,
        index = n % 5 === 0,
        top = lv > max - STEP * 1.6
      ctx.beginPath()
      contour(lv)
      ctx.strokeStyle = top ? '#F2B233' : index ? 'rgba(242,178,51,.42)' : 'rgba(242,178,51,.17)'
      ctx.lineWidth = top ? 1.6 : index ? 1.2 : 0.8
      ctx.stroke()
    }
    // Apex mark (arrowhead) on the summit, with its label
    ctx.fillStyle = '#F2B233'
    ctx.beginPath()
    ctx.moveTo(ax, ay - 10)
    ctx.lineTo(ax + 7, ay + 8)
    ctx.lineTo(ax, ay + 4)
    ctx.lineTo(ax - 7, ay + 8)
    ctx.closePath()
    ctx.fill()
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace'
    ctx.fillStyle = '#F3EEE4'
    ctx.fillText('APEX', ax + 13, ay + 4)
  }
  let lastTopo = 0
  function topoLoop(t) {
    summit.x += (summit.tx - summit.x) * 0.16
    summit.y += (summit.ty - summit.y) * 0.16
    summit.h += (summit.th - summit.h) * 0.06
    for (const p of peaks) p[2] += (p[3] - p[2]) * 0.04
    // redraw at most every 24ms, and only while the hero is on screen and the tab is visible
    if (heroVisible && !document.hidden && t - lastTopo > 24) {
      drawTopo(t)
      lastTopo = t
    }
    requestAnimationFrame(topoLoop)
  }
  // Let the headline paint first (it is the page's largest element). The map starts once the
  // browser is idle.
  const startTopo = () => {
    new ResizeObserver(resize).observe(hero)
    if (!reduce) requestAnimationFrame(topoLoop)
  }
  if (document.readyState === 'complete')
    (window.requestIdleCallback || setTimeout)(startTopo, { timeout: 1200 })
  else
    addEventListener(
      'load',
      () => (window.requestIdleCallback || setTimeout)(startTopo, { timeout: 1200 }),
      { once: true },
    )

    /* ================= HINA: a recording of the real site scrolling itself ================= */
  ;(function hina() {
    const v = document.getElementById('hinaVideo')
    if (reduce) return // reduced motion keeps the still poster
    // Plays while on screen. Hovering (or pressing and holding on a phone) holds the page still
    // for reading.
    let inView = false,
      holding = false
    const sync = () => {
      if (inView && !holding) v.play().catch(() => {})
      else v.pause()
    }
    new IntersectionObserver(
      (e) => {
        inView = e[0].isIntersecting
        if (inView && v.preload === 'none') {
          v.preload = 'auto'
          v.load()
        }
        sync()
      },
      { threshold: 0.2 },
    ).observe(v)
    const box = document.getElementById('hinaVisual')
    // always show the page's full width: fill the tile when it is wider than the video,
    // otherwise fit the whole video (the strips above and below match the page's white)
    const VA = 800 / 840
    const fit = () => {
      const r = box.getBoundingClientRect()
      v.style.objectFit = r.width / r.height >= VA ? 'cover' : 'contain'
    }
    new ResizeObserver(fit).observe(box)
    fit()
    box.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') {
        holding = true
        sync()
      }
    })
    box.addEventListener('pointerleave', () => {
      holding = false
      sync()
    })
    box.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') {
        holding = true
        sync()
      }
    })
    box.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') {
        holding = false
        sync()
      }
    })
    box.addEventListener('pointercancel', () => {
      holding = false
      sync()
    })
  })()

  /* ================= biography: closes itself once the reader scrolls away ================= */
  ;(function bio() {
    const brief = document.getElementById('brief')
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || !brief.open) return
        const above = brief.getBoundingClientRect().bottom <= 0 // the reader scrolled on past it, down the page
        const after = document.getElementById('founder').nextElementSibling
        const before = after.getBoundingClientRect().top
        brief.open = false
        // keep what the reader is looking at still: undo any shift (browsers that anchor scrolling shift less, or none)
        if (above) {
          const moved = after.getBoundingClientRect().top - before
          if (moved) window.scrollBy({ top: moved, behavior: 'instant' })
        }
      },
      { threshold: 0 },
    ).observe(brief)
  })()

  /* ================= personal project: panorama drift + twinkle ================= */
  ;(function pano() {
    // the biography's drifting panorama pans across its own frame width
    document.querySelectorAll('.pano').forEach((el) => {
      const setW = () => el.style.setProperty('--pano-w', el.clientWidth + 'px')
      new ResizeObserver(setW).observe(el)
      setW()
    })
    const box = document.querySelector('.pano')
    if (reduce) return
    const cv = document.getElementById('twinkle'),
      c = cv.getContext('2d')
    let w = 0,
      h = 0,
      stars = [],
      on = false
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2)
      w = box.clientWidth
      h = box.clientHeight
      cv.width = w * d
      cv.height = h * d
      c.setTransform(d, 0, 0, d, 0, 0)
      stars = Array.from({ length: Math.round((w * h) / 2600) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.7,
        r: Math.random() * 1.1 + 0.3,
        s: Math.random() * 2 + 0.6,
        p: Math.random() * 6.3,
      }))
    }
    new ResizeObserver(size).observe(box)
    new IntersectionObserver((e) => {
      on = e[0].isIntersecting
    }).observe(box)
    ;(function tick(t) {
      if (on && !document.hidden) {
        c.clearRect(0, 0, w, h)
        for (const st of stars) {
          const a = Math.max(0, Math.sin(t * 0.001 * st.s + st.p))
          if (a < 0.55) continue
          c.globalAlpha = (a - 0.55) * 1.6
          c.fillStyle = '#FFF4D6'
          c.beginPath()
          c.arc(st.x, st.y, st.r, 0, 6.283)
          c.fill()
        }
        c.globalAlpha = 1
      }
      requestAnimationFrame(tick)
    })(0)
  })()

  /* ================= numbers: slot-reel digits =================
     Each digit becomes a reel. Reels spin while the band scrolls into view,
     then slow down and snap onto the real number once the middle of the band
     rises to 58% of the way down the screen (and has spun for at least 0.6 s).
     The final number is never shown before the spin. */
  ;(() => {
    const band = document.querySelector('.nums')
    if (!band || reduce) return
    const SPEED = 26 // cells per second while spinning
    const LOOPS = 7 // strip length in 0-9 loops
    const reels = []
    band.querySelectorAll('.num b').forEach((b, n) => {
      const target = b.textContent.trim()
      b.textContent = ''
      const sr = document.createElement('span')
      sr.className = 'sr-only'
      sr.textContent = target
      b.append(sr)
      ;[...target].forEach((ch, i) => {
        if (!/\d/.test(ch)) {
          const s = document.createElement('span')
          s.textContent = ch
          s.setAttribute('aria-hidden', 'true')
          b.append(s)
          return
        }
        const win = document.createElement('span')
        win.className = 'reel'
        win.setAttribute('aria-hidden', 'true')
        const strip = document.createElement('span')
        strip.className = 'reel-strip'
        strip.innerHTML = Array.from(
          { length: LOOPS * 10 },
          (_, k) => `<span>${k % 10}</span>`,
        ).join('')
        win.append(strip)
        b.append(win)
        reels.push({ strip, d: +ch, delay: n * 0.18 + i * 0.22, off: Math.random() * 10 })
      })
    })

    // easeOutBack with a light overshoot: fast start, slow finish, small snap past and back.
    const S = 0.7,
      ease = (x) => 1 + (S + 1) * Math.pow(x - 1, 3) + S * Math.pow(x - 1, 2)
    const set = (r, pos, vel) => {
      r.strip.style.transform = `translateY(${-pos}em)`
      r.strip.style.filter = vel > 6 ? `blur(${Math.min(1.4, vel / 22).toFixed(2)}px)` : ''
    }
    const spinPos = (r, t) => 10 + ((r.off + SPEED * t) % 10)

    let state = 'idle',
      t0 = 0,
      tLand = 0,
      raf = 0
    const reset = () => {
      state = 'idle'
      cancelAnimationFrame(raf)
      raf = 0
      reels.forEach((r) => {
        r.land = null
        r.off = Math.random() * 10
        set(r, spinPos(r, 0), 0)
      })
    }
    reset()

    const frame = (now) => {
      raf = 0
      const t = (now - t0) / 1000
      const rect = band.getBoundingClientRect(),
        mid = rect.top + rect.height / 2
      if (state === 'spin' && t > 0.6 && mid <= innerHeight * 0.58) {
        state = 'land'
        tLand = t
        reels.forEach((r) => {
          const p0 = spinPos(r, t + r.delay),
            dur = 1.5 + r.delay * 1.6
          const ideal = (SPEED * dur) / (3 + S) // matches spin speed at the start of the ease
          const dist = ideal + ((((r.d - (p0 + ideal)) % 10) + 10) % 10)
          r.land = { p0, dist, dur, start: tLand }
        })
      }
      let moving = false
      reels.forEach((r) => {
        if (!r.land) {
          set(r, spinPos(r, t + r.delay), SPEED)
          moving = true
          return
        }
        const { p0, dist, dur } = r.land
        // all reels start easing together. Later digits take longer, so they land left to right.
        const x = Math.min(1, Math.max(0, (t - r.land.start) / dur))
        const e = ease(x),
          de = (ease(Math.min(1, x + 0.01)) - e) / 0.01
        set(r, p0 + dist * e, x < 1 ? (dist * de) / dur : 0)
        if (x < 1) moving = true
      })
      if (moving) raf = requestAnimationFrame(frame)
      else state = 'done'
    }

    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && state === 'idle') {
          state = 'spin'
          t0 = performance.now()
          raf = requestAnimationFrame(frame)
        } else if (!e.isIntersecting) reset() // replays next time the band comes into view
      },
      { threshold: 0 },
    ).observe(band)
  })()

  initForms()
  initNav()
  startAnalytics()
})()
