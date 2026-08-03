import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Lockup, ApexMark } from './ApexMark.jsx'
import { ThemeToggle } from './Navbar.jsx'

/**
 * Shared shell for the legal documents.
 *
 * Same world as the landing page — painted header plate, ink rules, display
 * type — but the body deliberately drops the effects. A privacy policy that
 * is hard to read is a privacy policy nobody reads, and that defeats the
 * point of having one.
 */
export function LegalPage({ title, updated, lede, sections }) {
  useEffect(() => { document.title = `${title} — Apex Development Studio` }, [title])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header plate */}
      <header
        className="relative px-6 sm:px-12 pt-6 pb-20"
        style={{
          background: `linear-gradient(var(--veil-top), var(--veil-bottom)),
                       url(/plates/scene-studio.jpg) center/cover no-repeat`,
          borderBottom: '3px solid var(--ink)',
        }}
      >
        <div className="max-w-[820px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="no-underline"><Lockup width={150} variant="anime" /></a>
            <ThemeToggle />
          </div>

          <a href="/"
             className="inline-flex items-center gap-1.5 mt-10 no-underline font-mono text-[0.6rem] uppercase tracking-[0.2em]"
             style={{ color: 'var(--text-mid)' }}>
            <ArrowLeft size={12} strokeWidth={2.5} /> Back to the studio
          </a>

          <h1 className="display text-[clamp(2.6rem,8vw,5rem)] cel mt-4" style={{ color: 'var(--ink)' }}>
            {title}
          </h1>
          <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.2em]"
             style={{ color: 'var(--text-lo)' }}>
            Last updated {updated}
          </p>
        </div>
      </header>

      <main className="px-6 sm:px-12 py-14">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[1.05rem] leading-relaxed font-semibold body-copy mb-12" style={{ color: 'var(--text-hi)' }}>
            {lede}
          </p>

          {sections.map((s, i) => (
            <section key={s.h} className="mb-11">
              <h2 className="display text-[1.6rem] tracking-[0.06em] mb-3"
                  style={{ color: 'var(--ink)' }}>
                <span style={{ color: 'var(--coral)' }}>{String(i + 1).padStart(2, '0')}</span>{' '}
                {s.h}
              </h2>
              {s.body.map((para, j) =>
                Array.isArray(para) ? (
                  <ul key={j} className="list-none p-0 m-0 mt-3 space-y-2">
                    {para.map((li) => (
                      <li key={li} className="flex gap-2.5 text-[0.97rem] leading-relaxed"
                          style={{ color: 'var(--text-mid)' }}>
                        <span style={{ color: 'var(--coral)' }}>—</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className="text-[0.97rem] leading-relaxed mt-3"
                     style={{ color: 'var(--text-mid)' }}>{para}</p>
                ),
              )}
            </section>
          ))}

          <div className="panel px-6 py-5 mt-14">
            <h3 className="display text-[1.2rem] tracking-[0.06em]" style={{ color: 'var(--ink)' }}>
              QUESTIONS?
            </h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>
              Write to{' '}
              <a href="mailto:support@apexdevelopmentstudio.com"
                 className="font-semibold no-underline" style={{ color: 'var(--coral)' }}>
                support@apexdevelopmentstudio.com
              </a>{' '}
              and a person will answer.
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 sm:px-12 py-8" style={{ borderTop: '2px solid var(--panel-border)' }}>
        <div className="max-w-[720px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ApexMark size={24} variant="anime" />
            <span className="font-mono text-[0.6rem]" style={{ color: 'var(--text-lo)' }}>
              © {new Date().getFullYear()} Apex Development Studio LLC
            </span>
          </div>
          <nav className="flex items-center gap-5 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
            <a href="/" className="no-underline" style={{ color: 'var(--text-mid)' }}>Home</a>
            <a href="/privacy/" className="no-underline" style={{ color: 'var(--text-mid)' }}>Privacy</a>
            <a href="/terms/" className="no-underline" style={{ color: 'var(--text-mid)' }}>Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
