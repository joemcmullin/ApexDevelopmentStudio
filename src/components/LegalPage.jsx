import { useEffect } from 'react'

/**
 * Shared shell for the legal documents.
 *
 * Same world as the home page — dark stage, amber signal, the Apex mark —
 * but deliberately quiet. A privacy policy that is hard to read is a privacy
 * policy nobody reads, and that defeats the point of having one.
 */
function Mark({ size = 28 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#F2B233" strokeWidth="3" />
      <path d="M32 13 L45 47 L32 39 L19 47 Z" fill="#F2B233" />
    </svg>
  )
}

export function LegalPage({ title, updated, lede, sections }) {
  useEffect(() => { document.title = `${title} — Apex Development Studio LLC` }, [title])

  return (
    <div className="legal">
      <header className="legal-nav">
        <div className="legal-wrap legal-nav-row">
          <a href="/" className="legal-brand" aria-label="Apex Development Studio LLC home">
            <Mark />
            <span>Apex Development Studio LLC</span>
          </a>
          <a href="/" className="legal-back">← Back to the studio</a>
        </div>
      </header>

      <main className="legal-wrap legal-main">
        <p className="legal-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated {updated}</p>
        <p className="legal-lede">{lede}</p>

        {sections.map((s, i) => (
          <section key={s.h} className="legal-section">
            <h2><span>{String(i + 1).padStart(2, '0')}</span> {s.h}</h2>
            {s.body.map((para, j) =>
              Array.isArray(para) ? (
                <ul key={j}>
                  {para.map((li) => <li key={li}>{li}</li>)}
                </ul>
              ) : (
                <p key={j}>{para}</p>
              ),
            )}
          </section>
        ))}

        <div className="legal-questions">
          <h3>Questions?</h3>
          <p>
            Write to <a href="mailto:support@apexdevelopmentstudio.com">support@apexdevelopmentstudio.com</a> and a person will answer.
          </p>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="legal-wrap legal-footer-row">
          <span>© {new Date().getFullYear()} Apex Development Studio LLC</span>
          <nav>
            <a href="/">Home</a>
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
