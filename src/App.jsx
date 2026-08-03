import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Navbar } from './components/Navbar.jsx'
import { ApexMark } from './components/ApexMark.jsx'
import { ContactForm } from './components/ContactForm.jsx'
import { useCinema, usePrefersReducedMotion, clamp, remap, easeOut } from './components/useCinema.js'

/* ------------------------------------------------------------------
   THE ROOMS

   One room, one round window, and the window is always a way through.
   The camera never stops travelling: it pushes into the window until the
   glass fills the frame, passes through it, and arrives in the next room
   — where another window is already waiting.

   The rooms cycle through a single day (morning -> afternoon -> sunset ->
   dusk -> morning again), so the journey closes its own loop rather than
   ending. PLATES is indexed modulo, which is what makes it continuous:
   there is always a next room, and after the last one you are back where
   you started.
------------------------------------------------------------------ */

const ACT_VH = 165
const DOLLY = 3.1
const OPEN_AT = 0.36

/**
 * Five scenes across one day. Only the first and last are interiors — the
 * journey goes out into the world in between, because a wall of rooms with
 * round windows reads as one idea repeated rather than a story.
 *
 * The circular transition is an IRIS WIPE, a stock anime device. It does
 * not need a literal circle in the artwork to land, which is what frees
 * these scenes to be a hilltop, a train, a street at dusk.
 *
 * Indexed modulo, so adding or removing a scene just lengthens or shortens
 * the loop — there is always a next one.
 */
const PLATES = [
  '/plates/scene-window.jpg',  // sunset studio — the anchor image
  '/plates/scene-hill.jpg',    // out to the hilltop, golden hour
  '/plates/scene-train.jpg',   // the journey itself
  '/plates/scene-street.jpg',  // blue hour, heading home
  '/plates/scene-studio.jpg',  // morning again — the day comes round
]

const FALLBACKS = [
  'linear-gradient(180deg,#ffc9a0 0%,#e8a882 60%,#b98a72 100%)',
  'linear-gradient(180deg,#ffd9a8 0%,#f0c088 55%,#9cb87a 100%)',
  'linear-gradient(180deg,#ffe2b0 0%,#e8c99a 60%,#bfa886 100%)',
  'linear-gradient(180deg,#3b4a72 0%,#54506e 60%,#2e2b44 100%)',
  'linear-gradient(180deg,#ffe9c9 0%,#f6d9b8 60%,#d8bfa0 100%)',
]

/* Five acts across one day. The story is the studio's promise — what it
   is like to be the person on the other end of the software — not a
   product catalogue. The app list will keep growing and would date this
   page within a quarter; the commitment behind it will not. */
const ACTS = [
  { id: 'top' },      // who we are
  { id: 'story' },    // who we build for
  { id: 'data' },     // what we do with what you give us
  { id: 'promise' },  // what we will never do
  { id: 'next' },     // what comes next
]

/**
 * Where an act actually lives on the page.
 *
 * The acts are stacked inside one sticky viewport, so they all share the same
 * DOM position — a plain `#id` anchor lands every one of them at the top of
 * the track. Navigation has to be computed from the scroll track instead:
 * act i begins i act-heights down.
 */
export function actScrollTop(index) {
  return index * (ACT_VH / 100) * window.innerHeight
}

const PRODUCTS = [
  {
    name: 'Journey Tracker',
    kind: 'For people on GLP-1 therapy',
    status: 'live',
    statusLabel: 'On the App Store',
    href: 'https://apps.apple.com/app/id6760089056',
    cta: 'Download',
    line: 'Weight, injections, labs, and the small wins that never show up on a scale. All of it stays on your phone.',
    tint: 'var(--cyan)',
  },
  {
    name: 'Gleaming Beacon',
    kind: 'For the curious',
    status: 'soon',
    statusLabel: 'Coming soon',
    href: 'https://gleamingbeacon.com/',
    cta: 'Take a look',
    line: 'Tarot, Lenormand, runes and BaZi charts — unhurried readings that belong to you and nobody else.',
    tint: 'var(--lavender)',
  },
  {
    name: 'ScreenPass',
    kind: 'For families',
    status: 'retired',
    statusLabel: 'Discontinued',
    href: 'https://screenpassapp.com/',
    cta: 'Read why',
    line: 'Retired when iOS shipped flexible Screen Time schedules. Knowing when to stop is part of the job.',
    tint: 'var(--text-lo)',
  },
]

export default function App() {
  const reduced = usePrefersReducedMotion()
  const { progress, velocity, snap } = useCinema(ACT_VH, !reduced)

  const actRefs = useRef([])
  const contentRefs = useRef([])
  const sentinelRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    if (reduced) return
    let raf
    const frame = () => {
      const p = progress.current
      const lean = clamp(velocity.current * 40, -1, 1)

      ACTS.forEach((_, i) => {
        const el = actRefs.current[i]
        const content = contentRefs.current[i]
        if (!el) return

        const arrive = i === 0 ? 1 : clamp(p - (i - 1))
        const t = clamp(p - i)

        // Off-stage. The content layer must be cleared too — it lives in a
        // separate element, so returning here without zeroing it leaves the
        // last frame's copy painted over whatever act is now on screen.
        if (p > i + 1.2 || arrive <= 0) {
          el.style.visibility = 'hidden'
          if (content) {
            content.style.opacity = '0'
            content.style.pointerEvents = 'none'
          }
          return
        }
        el.style.visibility = 'visible'

        const arriveScale = i === 0 ? 1 : 1 + 0.3 * (1 - easeOut(remap(arrive, OPEN_AT, 1)))
        const dolly = 1 + DOLLY * t * t
        el.style.transform =
          `scale(${(arriveScale * dolly).toFixed(4)}) translate3d(${(lean * -12).toFixed(2)}px,0,0)`

        // The window. Every room after the first arrives through a circle
        // widening from the exact centre of the room before it.
        if (i > 0) {
          const r = easeOut(remap(arrive, OPEN_AT, 1)) * 165
          el.style.clipPath = `circle(${r.toFixed(2)}vmax at 50% 50%)`
        }

        if (content) {
          const fadeIn = i === 0 ? 1 : remap(arrive, 0.6, 0.92)
          const fadeOut = 1 - remap(t, 0.28, 0.6)
          const op = fadeIn * fadeOut
          content.style.opacity = op.toFixed(3)
          content.style.transform = `scale(${(1 + t * 0.5).toFixed(4)})`
          // Only the act you can actually see accepts input. All five layers
          // sit at inset-0, so without this the invisible ones swallow clicks
          // meant for the visible one.
          content.style.pointerEvents = op > 0.5 ? 'auto' : 'none'
        }
      })

      if (hintRef.current) hintRef.current.style.opacity = (1 - remap(p, 0.02, 0.16)).toFixed(3)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [reduced, progress, velocity])

  /**
   * Return to the top — only ever when the visitor asks for it.
   *
   * The camera is snapped along with the scroll. Without that, the smoothed
   * progress would lerp back from act 5 to act 0 and fly the entire journey
   * in reverse at speed.
   */
  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    snap.current()
  }, [snap])

  /**
   * Jump to an act. Smooth, because this one is a navigation, not a reset.
   *
   * The two layouts measure differently and must not share one formula.
   * Cinematic mode stacks the acts in a 165vh-per-act scroll track, so the
   * position has to be computed. Reduced-motion mode renders them as ordinary
   * ~100vh sections, where the computed offset overshoots — far enough by the
   * last act to land in the footer instead. There the element is real, so ask
   * the DOM where it is rather than doing arithmetic.
   */
  const goToAct = useCallback((index) => {
    const el = document.getElementById(ACTS[index]?.id)
    if (reduced && el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo({ top: actScrollTop(index), behavior: 'smooth' })
  }, [reduced])


  const plateFor = (i) => PLATES[i % PLATES.length]
  const fallbackFor = (i) => FALLBACKS[i % FALLBACKS.length]

  /* -------- Reduced motion: same rooms, plain stacked document -------- */
  if (reduced) {
    return (
      <>
        <Navbar sentinelRef={sentinelRef} onNavigate={goToAct} />
        <main>
          {ACTS.map((a, i) => (
            <section
              key={a.id}
              id={a.id}
              className="relative min-h-screen flex items-center px-6 sm:px-12 py-24"
              style={{ background: `linear-gradient(var(--veil-top),var(--veil-bottom)), url(${plateFor(i)}) center/cover, ${fallbackFor(i)}` }}
            >
              <div className="max-w-[1180px] mx-auto w-full"><ActContent index={i} onNavigate={goToAct} /></div>
              {i === 0 && <div ref={sentinelRef} className="absolute bottom-0 h-px w-full" />}
            </section>
          ))}
        </main>
        <Outro onTop={goTop} onNavigate={goToAct} />
      </>
    )
  }

  return (
    <>
      <Navbar sentinelRef={sentinelRef} onNavigate={goToAct} />

      <div id="top" style={{ height: `${ACTS.length * ACT_VH}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {ACTS.map((a, i) => (
            <div
              key={a.id}
              className="absolute inset-0"
              style={{ zIndex: i + 1, willChange: 'transform, clip-path' }}
              ref={(el) => { actRefs.current[i] = el }}
            >
              <div className="absolute inset-0"
                   style={{ background: `url(${plateFor(i)}) center/cover no-repeat, ${fallbackFor(i)}` }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: `linear-gradient(to bottom, var(--veil-top) 0%,
                       color-mix(in srgb, var(--veil-top) 40%, transparent) 45%,
                       var(--veil-bottom) 100%)`,
                   }} />
            </div>
          ))}

          {ACTS.map((a, i) => (
            <div
              key={`c-${a.id}`}
              ref={(el) => { contentRefs.current[i] = el }}
              className="absolute inset-0 z-[40] flex items-center px-6 sm:px-12"
              style={{
                opacity: i === 0 ? 1 : 0,
                // Driven per frame alongside opacity. Previously this layer was
                // pointer-events-none with an allowlist that named only <a>,
                // which silently killed every <button> in an act — including the
                // hero's. An allowlist of tag names breaks the next time an
                // element type is added; gating the whole layer on visibility
                // cannot.
                pointerEvents: i === 0 ? 'auto' : 'none',
                willChange: 'transform, opacity',
              }}
            >
              <div className="max-w-[1180px] mx-auto w-full">
                <ActContent index={i} onNavigate={goToAct} />
              </div>
            </div>
          ))}

          <div ref={hintRef}
               className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[45] flex flex-col items-center gap-2">
            <span className="display text-[0.9rem] tracking-[0.24em]" style={{ color: 'var(--text-mid)' }}>
              KEEP GOING
            </span>
            <ArrowDown size={16} strokeWidth={2.5} style={{ color: 'var(--ink)' }} className="animate-bounce" />
          </div>
        </div>
      </div>

      <div ref={sentinelRef} style={{ position: 'absolute', top: '90vh', height: 1, width: '100%' }} />
      <Outro onTop={goTop} onNavigate={goToAct} />
    </>
  )
}

/* ------------------------------------------------------------------ */

function ActContent({ index, onNavigate }) {
  if (index === 0) return <ActHero onNavigate={onNavigate} />
  if (index === 1) return <ActWhoFor />
  if (index === 2) return <ActPrivacy />
  if (index === 3) return <ActPromise />
  return <ActNext />
}

function Eyebrow({ children }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="h-[3px] w-9" style={{ background: 'var(--coral)' }} />
      <span className="display text-[1.05rem] tracking-[0.18em]" style={{ color: 'var(--ink)' }}>
        {children}
      </span>
    </div>
  )
}

function Sparkles({ points }) {
  return points.map(([l, t, d], i) => (
    <span key={i} className="sparkle" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${d}s` }} />
  ))
}

function ActHero({ onNavigate }) {
  return (
    <div className="relative max-w-[820px]">
      <div className="speedlines" aria-hidden="true" />
      <Sparkles points={[[88, 12, 0], [72, 66, 1.1], [95, 44, 2.2], [64, 8, 1.7]]} />

      {/* No lockup here on purpose — the brand lives in the header now, so
          the opening shot is the headline and nothing competing with it. */}
      <div className="relative">
        <h1>
          <span className="display block text-[clamp(3.4rem,10.5vw,8.6rem)] cel" style={{ color: 'var(--ink)' }}>
            QUIET THINGS
          </span>
          <span className="display block text-[clamp(2.6rem,7.6vw,6.2rem)] sunset-text outline-title headline-line">
            PEOPLE LEAN ON
          </span>
        </h1>

        <p className="mt-7 max-w-[46ch] text-[1.02rem] leading-relaxed font-semibold body-copy"
           style={{ color: 'var(--text-mid)' }}>
          An independent studio making apps that respect whoever is holding the
          phone. Nothing tracked, nothing sold, nothing shouted.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button onClick={() => onNavigate?.(1)}
                  className="ink-btn px-7 py-3 display text-[1.15rem] tracking-[0.1em] cursor-pointer"
                  style={{ background: 'var(--coral)', color: '#fff' }}>
            HOW WE WORK
          </button>
          <a href="#contact" className="ink-btn inline-block px-7 py-3 display text-[1.15rem] tracking-[0.1em] no-underline"
             style={{ background: 'var(--bg-card)', color: 'var(--ink)' }}>
            SAY HELLO
          </a>
        </div>
      </div>
    </div>
  )
}

function ActWhoFor() {
  return (
    <div className="max-w-[760px]">
      {/* Do not rewrite this beat. The founder called it out by name as the
          emotional centre of the page: "How we work / Every app starts with
          someone." Keep the eyebrow and both headline lines verbatim. */}
      <Eyebrow>HOW WE WORK</Eyebrow>
      <h2>
        <span className="display block text-[clamp(2.6rem,7vw,5.4rem)] cel" style={{ color: 'var(--ink)' }}>
          EVERY APP STARTS
        </span>
        <span className="display block text-[clamp(2.6rem,7vw,5.4rem)] sunset-text headline-line">
          WITH SOMEONE
        </span>
      </h2>
      <p className="mt-7 max-w-[46ch] text-[1.02rem] leading-relaxed font-semibold body-copy"
         style={{ color: 'var(--text-mid)' }}>
        Not a market segment — a person, with a problem nobody had bothered to
        solve properly. We build it for them first. If it holds up for one real
        life, it will hold up for a great many.
      </p>

      {/* The link in the header is named for this section, so it has to be
          worth arriving at — three steps rather than a single assertion. */}
      <ol className="mt-9 list-none p-0 m-0 grid sm:grid-cols-3 gap-4 max-w-[720px]">
        {[
          ['01', 'START WITH ONE PERSON',
            'A real problem belonging to someone real. Whose day does this have to survive?'],
          ['02', 'BUILD IT NATIVE, KEEP IT CLOSE',
            'On the device by default. Privacy is a constraint we design under, not a feature we add.'],
          ['03', 'KNOW WHEN TO STOP',
            'When the platform solves it better, we retire the app and say so. ScreenPass was exactly that.'],
        ].map(([n, t, d]) => (
          <li key={n} className="panel px-5 py-4">
            <span className="display text-[1.5rem] leading-none" style={{ color: 'var(--coral)' }}>{n}</span>
            <h3 className="display text-[1.05rem] tracking-[0.06em] mt-1.5" style={{ color: 'var(--ink)' }}>{t}</h3>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed font-semibold body-copy"
               style={{ color: 'var(--text-mid)' }}>{d}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ActPrivacy() {
  return (
    <div className="max-w-[680px]">
      <Eyebrow>WHAT WE DO WITH IT</Eyebrow>
      <h2>
        <span className="display block text-[clamp(2.4rem,6.4vw,5rem)] cel" style={{ color: 'var(--ink)' }}>
          WHAT YOU PUT IN
        </span>
        <span className="display block text-[clamp(2.4rem,6.4vw,5rem)] sunset-text headline-line">
          STAYS YOURS
        </span>
      </h2>
      <p className="mt-7 max-w-[48ch] text-[1.02rem] leading-relaxed font-semibold body-copy" style={{ color: 'var(--text-mid)' }}>
        Health records, private questions, a family's habits — none of that
        belongs on somebody else's server. It syncs through your own iCloud, or
        it does not sync at all. There is no analytics pipeline behind the
        curtain, because there is no curtain.
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 max-w-[460px]">
        {[
          ['100%', 'ON YOUR DEVICE', 'var(--cyan)'],
          ['0', 'DATA EVER SOLD', 'var(--coral)'],
          ['0', 'TRACKING SDKs', 'var(--gold)'],
        ].map(([n, l, c]) => (
          <div key={l} className="panel px-3 py-4 text-center">
            <dt className="display text-[2.6rem] leading-none" style={{ color: c }}>{n}</dt>
            <dd className="mt-1 font-mono text-[0.5rem] tracking-[0.14em]" style={{ color: 'var(--text-mid)' }}>{l}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ActPromise() {
  const promises = [
    ['NO AD NETWORKS', 'Nothing you do is auctioned to anyone.'],
    ['NO THIRD-PARTY SDKs', 'No borrowed code quietly phoning home.'],
    ['NO ACCOUNT REQUIRED', 'Open it and start. We do not need to know you.'],
    ['NO DARK PATTERNS', 'Cancelling is as easy as subscribing.'],
  ]
  return (
    <div className="w-full max-w-[900px]">
      <Eyebrow>WHAT WE WILL NEVER DO</Eyebrow>
      <h2 className="mb-8">
        <span className="display block text-[clamp(2.4rem,6.4vw,4.8rem)] cel" style={{ color: 'var(--ink)' }}>
          THE SHORT LIST
        </span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {promises.map(([t, d]) => (
          <div key={t} className="panel px-5 py-4">
            <h3 className="display text-[1.35rem] tracking-[0.06em]" style={{ color: 'var(--coral)' }}>{t}</h3>
            <p className="mt-1 text-[0.88rem] leading-relaxed font-semibold body-copy" style={{ color: 'var(--text-mid)' }}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActNext() {
  return (
    <div className="relative max-w-[720px]">
      <div className="speedlines" aria-hidden="true" />
      <Sparkles points={[[90, 18, 0.4], [78, 72, 1.6]]} />
      <div className="relative">
        <Eyebrow>AND ROUND AGAIN</Eyebrow>
        <h2>
          <span className="display block text-[clamp(2.6rem,7vw,5.4rem)] cel" style={{ color: 'var(--ink)' }}>
            MORE ARE COMING
          </span>
          <span className="display block text-[clamp(2.6rem,7vw,5.4rem)] sunset-text headline-line">
            THE PROMISE HOLDS
          </span>
        </h2>
        <p className="mt-7 max-w-[46ch] text-[1.02rem] leading-relaxed font-semibold body-copy" style={{ color: 'var(--text-mid)' }}>
          The shelf will keep filling — new subjects, new people, new problems
          worth solving properly. What will not change is who the software
          answers to. Same room, new light.
        </p>
        <a href="#contact" className="ink-btn inline-block mt-9 px-7 py-3 display text-[1.15rem] tracking-[0.1em] no-underline"
           style={{ background: 'var(--coral)', color: '#fff' }}>
          SAY HELLO
        </a>
      </div>
    </div>
  )
}

/**
 * Return-to-top, as a launch.
 *
 * The Apex mark is already an upward arrow inside a ring, so it does not
 * need a separate chevron bolted on — the brand IS the affordance. Idle it
 * breathes; on hover the ring lights and speed lines rush in; on click the
 * arrow shoots up its own trail before the page snaps to the start.
 *
 * It is a real <button>, so keyboard and screen-reader users get it too.
 * Under prefers-reduced-motion the launch is skipped and the jump happens
 * immediately — the animation is decoration, never the mechanism.
 */
function ReturnToTop({ onTop }) {
  const [launching, setLaunching] = useState(false)

  const fire = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { onTop?.(); return }
    setLaunching(true)
    // finally: the button must never get stuck mid-launch, even if the
    // scroll handler is missing or throws.
    window.setTimeout(() => {
      try { onTop?.() } finally { setLaunching(false) }
    }, 460)
  }

  return (
    <div className="mt-16 flex flex-col items-center gap-3">
      <button
        onClick={fire}
        aria-label="Return to the top"
        className={`rtt group ${launching ? 'rtt--launch' : ''}`}
      >
        <span className="rtt-lines" aria-hidden="true" />
        <span className="rtt-ring" aria-hidden="true" />
        <ApexMark size={44} variant="anime" className="rtt-mark" />
        <span className="rtt-trail" aria-hidden="true" />
      </button>
      <span className="display text-[0.82rem] tracking-[0.26em]" style={{ color: 'var(--text-lo)' }}>
        BACK TO THE TOP
      </span>
    </div>
  )
}

function Outro({ onTop, onNavigate }) {
  return (
    <footer id="contact" className="relative z-[50] px-6 sm:px-12 pt-20 pb-10"
            style={{ background: 'var(--bg)', borderTop: '3px solid var(--ink)' }}>
      <div className="max-w-[1180px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="display text-[clamp(3rem,8vw,6rem)] cel" style={{ color: 'var(--ink)' }}>
              SAY HELLO
            </h2>
            <p className="mt-5 max-w-[40ch] leading-relaxed font-semibold body-copy" style={{ color: 'var(--text-mid)' }}>
              A question, a business inquiry, or just to tell us what you think.
              We read everything.
            </p>
            <a href="mailto:support@apexdevelopmentstudio.com"
               className="inline-block mt-4 text-[0.9rem] font-semibold no-underline"
               style={{ color: 'var(--coral)' }}>
              support@apexdevelopmentstudio.com
            </a>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:justify-self-end">
            {/* The catalogue lives down here on purpose. It is a snapshot that
                will be out of date within a quarter; the promise above it is
                the thing that lasts. */}
            <div>
              <h5 className="display text-[1.1rem] tracking-[0.14em] mb-4" style={{ color: 'var(--ink)' }}>
                OUT NOW
              </h5>
              <ul className="list-none p-0 m-0 space-y-2.5">
                {PRODUCTS.map((p) => (
                  <li key={p.name} className="flex items-center gap-2">
                    <a href={p.href} target="_blank" rel="noopener noreferrer"
                       className="no-underline text-[0.9rem] font-semibold body-copy"
                       style={{ color: 'var(--text-mid)', opacity: p.status === 'retired' ? 0.6 : 1 }}>
                      {p.name}
                    </a>
                    {p.status !== 'live' && (
                      <span className="font-mono text-[0.5rem] tracking-[0.1em] uppercase"
                            style={{ color: 'var(--text-lo)' }}>
                        {p.status === 'soon' ? 'soon' : 'retired'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <a href="https://apps.apple.com/app/id6760089056"
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 mt-4 no-underline text-[0.8rem] font-semibold"
                 style={{ color: 'var(--coral)' }}>
                Download Journey Tracker <ArrowUpRight size={13} strokeWidth={2.5} />
              </a>
            </div>
            <div>
              <h5 className="display text-[1.1rem] tracking-[0.14em] mb-4" style={{ color: 'var(--ink)' }}>STUDIO</h5>
              {/* Real destinations. Privacy and Terms point at the same
                  published policies the previous site linked to — a company
                  footer with dead legal links is not shippable. */}
              <ul className="list-none p-0 m-0 space-y-2.5">
                <li>
                  <button
                    onClick={() => onNavigate?.(1)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-[0.9rem] font-semibold body-copy text-left"
                    style={{ color: 'var(--text-mid)', font: 'inherit' }}
                  >
                    How we work
                  </button>
                </li>
                {[['Privacy', '/privacy/'], ['Terms', '/terms/']].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="no-underline text-[0.9rem] font-semibold body-copy"
                       style={{ color: 'var(--text-mid)' }}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ReturnToTop onTop={onTop} />

        <div className="mt-4 pt-6 flex flex-wrap items-center justify-between gap-4"
             style={{ borderTop: '2px solid var(--panel-border)' }}>
          <div className="flex items-center gap-3">
            <ApexMark size={26} variant="anime" />
            <span className="font-mono text-[0.62rem]" style={{ color: 'var(--text-lo)' }}>
              © {new Date().getFullYear()} Apex Development Studio LLC
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
