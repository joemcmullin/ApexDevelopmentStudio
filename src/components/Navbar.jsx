import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Lockup } from './ApexMark.jsx'

const MODES = ['light', 'dark', 'system']
const ICONS = { light: Sun, dark: Moon, system: Monitor }

function applyTheme(mode) {
  const dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    applyTheme(mode)
    localStorage.setItem('theme', mode)
    if (mode !== 'system') return
    // Follow the OS while in system mode.
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => applyTheme('system')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [mode])

  const Icon = ICONS[mode]
  return (
    <button
      onClick={() => setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length])}
      className="magnetic grid place-items-center rounded-full w-9 h-9 glass"
      style={{ color: 'var(--text-mid)' }}
      aria-label={`Theme: ${mode}. Click to change.`}
      title={`Theme: ${mode}`}
    >
      <Icon size={16} />
    </button>
  )
}

/**
 * Chrome that carries the brand.
 *
 * The header is always visible, because the hero no longer holds a lockup —
 * hiding it over the hero would leave the landing view with no brand at all.
 * What it does instead is stay bare over the opening shot and take on its
 * glass panel once you scroll, so it is still scroll-reactive rather than a
 * static bar bolted to the top. Driven by an IntersectionObserver on a
 * sentinel, never a pixel threshold, so it holds at any viewport height.
 */
export function Navbar({ sentinelRef, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sentinelRef])

  return (
    <header className="fixed top-0 left-0 right-0 z-[60]">
      <div
        className={`mx-auto max-w-[1200px] mt-4 px-5 py-3 rounded-full flex items-center justify-between
                    transition-all duration-500 ${scrolled ? 'glass' : ''}`}
        style={{ width: 'calc(100% - 2rem)' }}
      >
        <a href="#top" className="flex items-center no-underline">
          <Lockup width={150} variant="anime" />
        </a>

        {/* Act links are buttons, not anchors: the acts share one sticky
            position, so `#id` cannot address them. Contact is a real element
            in normal flow, so it stays a proper link. */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[0.7rem] uppercase tracking-[0.18em]">
          {[['Story', 1], ['Promise', 3]].map(([label, act]) => (
            <button
              key={label}
              onClick={() => onNavigate?.(act)}
              className="bg-transparent border-0 p-0 cursor-pointer font-mono text-[0.7rem] uppercase tracking-[0.18em]"
              style={{ color: 'var(--text-mid)' }}
            >
              {label}
            </button>
          ))}
          <a href="#contact" className="no-underline" style={{ color: 'var(--text-mid)' }}>
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://apps.apple.com/app/id6760089056"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic hidden sm:inline-block rounded-full px-4 py-2 text-[0.78rem] font-semibold no-underline text-white"
            style={{ background: 'var(--grad-accent)' }}
          >
            Get Journey Tracker
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
