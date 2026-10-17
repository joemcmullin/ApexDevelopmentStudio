# CLAUDE.md — ApexDevelopmentStudio site

Company website for Apex Development Studio LLC at https://apexdevelopmentstudio.com.

- **Stack:** Vite multi-page build of plain HTML, CSS and JavaScript, no framework. Pages: `/`, `/services/` and its three service pages, `/work/journey-tracker/`, `/about/`, `/start/`, `/privacy/`, `/terms/`, plus `public/404.html`. React, Framer Motion, GSAP and Tailwind were removed on 2026-10-17 (nothing used them).
- **Deploy:** push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` and publishes `dist/` to Pages. Never commit built output; the repo holds source only. Pages `build_type` is `workflow`, not branch-deploy.
- **`CNAME` lives in `public/`**, so it lands in the artifact — with an Actions deploy there is no branch for Pages to read it from. The build fails if it goes missing. Note: changing Pages build type in the GitHub UI silently clears the custom domain.
- **Design (live 2026-10-01, "Signal"):** dark stage, one amber accent (#F2B233), Plus Jakarta Sans + JetBrains Mono. Home page is plain HTML (`index.html`) + `src/home.css` + `src/home.js` (vanilla JS: contour-map hero, HINA video tile, slot-reel numbers, panorama twinkle); legal pages are written to static HTML at build time (`src/legal/render.js` + `src/legal.css`). Previous anime site is tagged `anime-site-final`.
- **Forms:** both use Web3Forms with the existing key. Web3Forms sits behind Cloudflare, which blocks headless/scripted browsers, so test forms in a real browser. The site stores nothing in the browser; the privacy policy says so.
- **Every page carries `<meta name="apex-build">`** (commit + timestamp) and logs it to the console — use it to tell a real bug from a cached page before debugging.
- **Reduced motion:** every animation has a still fallback (static contours, still panorama, plain numbers, poster frame for the HINA video).
- **Code style:** Prettier (`npm run format`, `npm run format:check`). Every source file opens with the Apex credit banner and a plain-English header. `apexCredit()` in `vite.config.js` puts the banner on the built JS and CSS, and the include step strips the partials' own headers.
