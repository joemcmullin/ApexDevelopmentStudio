# CLAUDE.md — ApexDevelopmentStudio site

Company website for Apex Development Studio LLC at https://apexdevelopmentstudio.com.

- **Stack:** Vite multi-page build — `/`, `/privacy/`, `/terms/`. Since 2026-10-01 the home page is plain HTML/CSS/JS; only the legal pages use React 19. Tailwind is still installed but unused.
- **Deploy:** push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` and publishes `dist/` to Pages. Never commit built output; the repo holds source only. Pages `build_type` is `workflow`, not branch-deploy.
- **`CNAME` lives in `public/`**, so it lands in the artifact — with an Actions deploy there is no branch for Pages to read it from. The build fails if it goes missing. Note: changing Pages build type in the GitHub UI silently clears the custom domain.
- **Design (live 2026-10-01, "Signal"):** dark stage, one amber accent (#F2B233), Plus Jakarta Sans + JetBrains Mono. Home page is plain HTML (`index.html`) + `src/home.css` + `src/home.js` (vanilla JS canvas: contour-map hero, sand stream, iPhone deck); legal pages stay React (`LegalPage.jsx` + `src/legal.css`). Previous anime site is tagged `anime-site-final`.
- **Forms:** both use Web3Forms with the existing key. Web3Forms sits behind Cloudflare, which blocks headless/scripted browsers, so test forms in a real browser. The site stores nothing in the browser; the privacy policy says so.
- **Every page carries `<meta name="apex-build">`** (commit + timestamp) and logs it to the console — use it to tell a real bug from a cached page before debugging.
- **Reduced motion:** every animation has a still fallback (static contours, still sand, poster frame for the HINA video).
