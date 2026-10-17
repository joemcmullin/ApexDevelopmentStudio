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
 * render.js: turns the Privacy and Terms wording into a finished page.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   Writes a legal page (Privacy or Terms) as plain HTML when the site is
 *   built: the small header with the Apex mark, the title and "Last updated"
 *   date, the numbered sections, the "Questions?" box and the footer.
 *   The pages used to be React apps that built their text in the browser, so
 *   search engines and AI crawlers saw an empty page. Now the text is in the
 *   HTML file itself and needs no JavaScript.
 *
 * WHERE IT APPEARS
 *   /privacy/ and /terms/. The apex-legal plugin in vite.config.js replaces
 *   <!-- @legal privacy --> (or terms) in each page with this output.
 *
 * DEPENDS ON
 *   The wording in privacy.js and terms.js, and the styles in
 *   src/legal.css.
 *
 * HOW TO EDIT
 *   - The wording ............ privacy.js and terms.js. It is attorney
 *                              reviewed, so change it there and only with
 *                              the owner's say-so.
 *   - Contact address ........ the "Questions?" box below.
 *   - Footer links ........... the <footer> below.
 *   - Copyright year ......... updates itself at every build.
 */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const MARK =
  '<svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke="#F2B233" stroke-width="3"/><path d="M32 13 L45 47 L32 39 L19 47 Z" fill="#F2B233"/></svg>'

export function renderLegal({ title, updated, lede, sections }) {
  const body = sections
    .map(
      (s, i) => `
        <section class="legal-section">
          <h2><span>${String(i + 1).padStart(2, '0')}</span> ${esc(s.h)}</h2>
${s.body
  .map((para) =>
    Array.isArray(para)
      ? `          <ul>\n${para.map((li) => `            <li>${esc(li)}</li>`).join('\n')}\n          </ul>`
      : `          <p>${esc(para)}</p>`,
  )
  .join('\n')}
        </section>`,
    )
    .join('')

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
