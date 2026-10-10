/**
 * Renders a legal page (privacy, terms) to static HTML at build time.
 *
 * The pages used to be React apps that built their content in the browser,
 * so search engines and AI crawlers saw an empty <div id="root">. This
 * produces the same markup the old LegalPage component did, straight into
 * the HTML file, with no JavaScript needed to read it. The wording lives in
 * privacy.js and terms.js and is attorney-reviewed: edit it there, not here.
 *
 * Used by the `apex-legal` plugin in vite.config.js, which replaces
 * <!-- @legal privacy --> (or terms) in the page with this output.
 */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const MARK = '<svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke="#F2B233" stroke-width="3"/><path d="M32 13 L45 47 L32 39 L19 47 Z" fill="#F2B233"/></svg>'

export function renderLegal({ title, updated, lede, sections }) {
  const body = sections.map((s, i) => `
        <section class="legal-section">
          <h2><span>${String(i + 1).padStart(2, '0')}</span> ${esc(s.h)}</h2>
${s.body.map(para => Array.isArray(para)
    ? `          <ul>\n${para.map(li => `            <li>${esc(li)}</li>`).join('\n')}\n          </ul>`
    : `          <p>${esc(para)}</p>`).join('\n')}
        </section>`).join('')

  return `<div class="legal">
      <header class="legal-nav">
        <div class="legal-wrap legal-nav-row">
          <a href="/" class="legal-brand" aria-label="Apex Development Studio LLC">${MARK}<span>Apex Development Studio LLC</span></a>
          <a href="/" class="legal-back">← Back to the studio</a>
        </div>
      </header>

      <main class="legal-wrap legal-main">
        <p class="legal-eyebrow">Legal</p>
        <h1>${esc(title)}</h1>
        <p class="legal-updated">Last updated ${esc(updated)}</p>
        <p class="legal-lede">${esc(lede)}</p>
${body}

        <div class="legal-questions">
          <h3>Questions?</h3>
          <p>Write to <a href="mailto:support@apexdevelopmentstudio.com">support@apexdevelopmentstudio.com</a> and a person will answer.</p>
        </div>
      </main>

      <footer class="legal-footer">
        <div class="legal-wrap legal-footer-row">
          <span>© ${new Date().getFullYear()} Apex Development Studio LLC</span>
          <nav>
            <a href="/">Home</a>
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>`
}
