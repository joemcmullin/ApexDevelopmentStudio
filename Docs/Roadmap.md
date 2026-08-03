---
title: "Apex Development Studio Site — Roadmap"
type: roadmap
status: active
project: apex-development-studio-site
updated: 2026-06-06
---

# Apex Development Studio Site — Roadmap

> **Status:** Live, light upkeep · **Owner:** Joe McMullin
> Company website (apexdevelopmentstudio.com), static HTML/CSS/JS on GitHub Pages. Portfolio rollup: `01 - Apex Business/Strategy & Planning/Portfolio Roadmap.md`.
> _Draft scaffold generated 2026-06-06 from repo state + git history. Edit freely._

## Now (current focus)
- **Commit the pending favicon cleanup** (7 uncommitted changes — deleted legacy favicons in favor of Apex-mark.png + favicon.svg).
- Resolve the untracked `_brand_assets/` folder — keep as an asset library or remove.

## Next (2–6 weeks)
- Replace `mailto:` contact with an API-backed form (e.g. Web3Forms free tier) for better mobile UX.
- Add a transparency/pipeline section or an extra "Coming Soon" product card.
- Refresh `sitemap.xml` `lastmod` on each deploy (currently manual).

## Later (backlog)
- Blog/insights section (privacy-first design, GLP-1 space) for SEO + authority.
- Case studies / testimonials once products launch (especially ScreenPass).
- Lightweight analytics to track portfolio → app-download conversion.

## Recently shipped
- ScreenPass added to portfolio, footer, support, and structured data.
- Real app icons for both products; red-shaded product tiles.
- Dark-mode redesign (cinematic orbs, gradient accents).

## Risks & blockers
- No form backend yet — `mailto:` is poor UX on mobile.
- No analytics — can't measure traffic or conversion.

## Open questions
- Keep `_brand_assets/` in this repo or move to the dedicated brand-assets location?
- Coordinate ScreenPass site visibility with screenpassapp.com launch.
