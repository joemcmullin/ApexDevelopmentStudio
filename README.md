# Apex Development Studio LLC — Company Website

The official company website for **Apex Development Studio LLC**, an independent software studio crafting thoughtful, privacy-first applications built with precision and care.

> **Live Site:** [https://apexdevelopmentstudio.com](https://apexdevelopmentstudio.com)
> **Current Version:** 2.0

---

## Table of Contents

- [Overview](#overview)
- [Version History](#version-history)
- [Site Structure](#site-structure)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [Theme System — Light / Dark / System](#theme-system--light--dark--system)
- [Scroll Animation System](#scroll-animation-system)
- [Contact Form](#contact-form)
- [SEO & Structured Data](#seo--structured-data)
- [Security](#security)
- [Technology](#technology)
- [Local Development](#local-development)
- [Deployment — GitHub Pages](#deployment--github-pages)
- [DNS Configuration — GoDaddy](#dns-configuration--godaddy)
- [SSL Certificate](#ssl-certificate)
- [Project Tracking](#project-tracking)
- [Products](#products)
- [Contact & Business Inquiries](#contact--business-inquiries)

---

## Overview

This repository contains the complete static company website for Apex Development Studio LLC. The site is a self-contained `index.html` file with all CSS embedded in a `<style>` block and vanilla JavaScript — no frameworks, no build tools, no external CDN dependencies. It is hosted on GitHub Pages with a custom domain and full HTTPS/SSL.

The site serves the following purposes:

- **Brand presence** — establishing Apex Development Studio LLC as a professional, independent software studio
- **Product showcase** — surfacing Journey Tracker and future app releases to prospective users and partners
- **Business contact** — providing a reliable contact channel for business inquiries, press, and support escalations
- **Company identity** — presenting the company's mission, values, and philosophy to the public
- **SEO foundation** — structured data and semantic markup for Google indexing and rich results

---

## Version History

### v2.0 — March 2026
- **Dark & cinematic redesign** — deep blue-black backgrounds, animated gradient orbs in the hero, glass morphism cards, and a crimson→purple gradient accent system
- **Light mode is now the default** — clean off-white canvas on first visit; dark cinematic mode is an explicit user toggle
- **Gradient system** — primary buttons, nav CTA, stat numbers, and hero title accent use a crimson→purple gradient (`#C0182E` → `#9B1DB5`)
- **Glass morphism** — value cards, product card, form card, and stats bar use `backdrop-filter` blur with semi-transparent backgrounds in dark mode
- **Hero background** — two animated glowing orbs (crimson + purple) that slowly breathe and drift behind the hero content
- **Grid lines enhanced** — dark mode grid boosted to `0.22` opacity for visibility on near-black backgrounds
- **Studio copy broadened** — removed Apple-exclusivity language; studio positioned as a platform-agnostic independent software studio

### v1.0 — March 2026
- Initial site build with dark/light/system theme toggle, scroll animations, contact form (mailto), and full SEO/structured data implementation

---

## Site Structure

```
ApexDevelopmentStudio/
├── index.html          # Complete single-page site (HTML + embedded CSS + JS)
├── favicon.svg         # SVG favicon — served at /favicon.svg
├── CNAME               # Custom domain: apexdevelopmentstudio.com
├── robots.txt          # Allow all crawlers; references sitemap
├── sitemap.xml         # Single-URL sitemap for SEO indexing
├── project.json        # Project tracking: items, status, priorities, tags
├── .claude/
│   ├── launch.json     # Dev server configurations (npx serve, ports)
│   └── settings.local.json
└── README.md           # This file
```

---

## Pages & Sections

The site is a single-page layout with anchor-linked navigation. All sections are accessible from the fixed navigation bar.

| Anchor | Section | Description |
|--------|---------|-------------|
| `#home` | Hero | Tagline, mission statement, dual CTA buttons, animated orbs |
| `#about` | About | Studio story, mission, four value cards |
| (inline) | Stats Bar | Three studio metrics — Native-First, Compromises on Quality, Data Sales |
| `#products` | Products | Product cards — Journey Tracker featured, placeholder for future apps |
| `#contact` | Contact | Studio contact panel + mailto contact form |
| (footer) | Footer | Copyright, studio name, navigation links |

### Hero Section
Full-viewport background with a subtle crimson grid pattern, two animated glowing orbs (crimson + purple), and staggered entrance animations. In dark mode the orbs are significantly more vibrant. Copy includes:
- **Eyebrow label** — "Independent Software Studio"
- **Headline** — "Apps Built with Purpose & Precision" (accent text renders as crimson→purple gradient in dark mode)
- **Description** — Studio mission
- **CTA buttons** — "View Our Work" (gradient primary) and "About the Studio" (ghost/glass)

### About Section
Two-column layout (text left, value cards right). In dark mode, value cards use glass morphism with `backdrop-filter` blur. Four values: **Privacy by Default**, **Native by Design**, **Thoughtful Craft**, **User-First Thinking**.

### Stats Bar
Full-width band with three stat blocks — **100% Native-First Development**, **0 Compromises on Quality**, **0 Third-Party Data Sales**. In dark mode, stat numbers render as the crimson→purple gradient and the bar uses glass morphism.

### Products Section
Card-based showcase. Currently features:
- **Journey Tracker** — GLP-1 therapy and health progress tracker. Links to [journeytracker.app](https://journeytracker.app)
- **More Coming Soon** — placeholder card for future products

### Contact Section
Two-column layout — contact info panel (left) + form card (right). In dark mode the form card uses glass morphism.

### Footer
Dark footer with studio name, copyright, and navigation links. In dark mode a subtle crimson→purple gradient line accents the top border.

---

## Design System

The entire design is driven by CSS custom properties (design tokens). **Light mode is the default** (`:root`), with dark cinematic mode applied via `[data-theme="dark"]`.

### Brand Colors

| Token | Value | Purpose |
|-------|-------|---------|
| `--crimson` | `#C0182E` | Primary brand accent |
| `--crimson-dark` | `#8B0015` | Hover/pressed states |
| `--crimson-light` | `#E03A50` | Text highlights in dark mode |
| `--purple` | `#9B1DB5` | Secondary cinematic accent |
| `--grad-accent` | `#E03A50 → #C0182E → #9B1DB5` | Gradient text (hero, stats) |
| `--grad-btn` | `#C0182E → #8B0DD4` (light) / `#C0182E → #9B1DB5` (dark) | Gradient fills for buttons and CTAs |

### Surface Colors

| Token | Light (default) | Dark (`[data-theme="dark"]`) | Purpose |
|-------|----------------|------------------------------|---------|
| `--bg` | `#F2F3F5` | `#07070F` | Page background |
| `--bg-surface` | `#E6E8EC` | `#0C0C1A` | Alternating section backgrounds |
| `--bg-card` | `#FFFFFF` | `rgba(255,255,255,0.035)` | Card backgrounds (glass in dark) |
| `--bg-card-hover` | `#FAFAFA` | `rgba(255,255,255,0.062)` | Card hover state |
| `--bg-form-input` | `#F8F8FA` | `#0E0E22` | Form input backgrounds |

### Text Colors

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--text-hi` | `#0D0D0F` | `#EFEFFA` | Headings, primary body |
| `--text-mid` | `#3A3A3F` | `#9292B4` | Secondary text, descriptions |
| `--text-lo` | `#9A9A9F` | `#565672` | Labels, tertiary, borders |

### Typography

Native system font stack — no external font requests:

```css
--font: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

Fluid hero title sizing using `clamp()`:
```css
font-size: clamp(3rem, 8vw, 6.5rem);
```

### Spacing & Shape Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-h` | `64px` | Fixed nav height; `scroll-padding-top` |
| `--pad-section` | `96px` (72px @ 900px, 56px @ 700px) | Section padding |
| `--r-sm` | `8px` | Inputs, tags |
| `--r-md` | `12px` | Buttons |
| `--r-lg` | `20px` | Cards |
| `--r-xl` | `28px` | Feature cards |

### Shadows

| Token | Light | Dark |
|-------|-------|------|
| `--shadow-card` | `0 2px 16px rgba(0,0,0,0.08)` | `0 8px 56px rgba(0,0,0,0.70)` |
| `--shadow-crimson` | `0 6px 28px rgba(192,24,46,0.22)` | `0 8px 48px rgba(192,24,46,0.55), 0 2px 16px rgba(155,29,181,0.22)` |

---

## Theme System — Light / Dark / System

The site supports three explicit theme modes, selectable via the toggle in the nav bar (top right).

### Default Behavior
**Light mode is the default.** On first visit (no stored preference), the site renders in light mode. This is enforced by the anti-FOUC script, which defaults to `'light'` when nothing is stored in `localStorage`.

### Toggle Cycle
`Light → Dark → System → Light …`

| Icon | Mode | Behavior |
|------|------|---------|
| Sun | Light | Forces `data-theme="light"` — overrides OS dark preference |
| Moon | Dark | Forces `data-theme="dark"` — enables full cinematic design |
| Monitor | System | Removes `data-theme` attribute — follows OS `prefers-color-scheme` |

### How It Works

```
localStorage['apex-theme'] = 'light' | 'dark' | 'system' (default: 'light')
      ↓
Anti-FOUC script (inline, runs before first paint):
  'dark'  → sets data-theme="dark"
  'light' → sets data-theme="light"  ← blocks OS-dark media query
  nothing → defaults to 'light', sets data-theme="light"
      ↓
CSS token resolution:
  :root                     → light defaults
  [data-theme="dark"]       → dark cinematic overrides
  @media prefers-color-scheme: dark
    :root:not([data-theme]) → system dark (tokens only)
      ↓
Element-level dark effects ([data-theme="dark"] .element):
  gradient text, glass morphism, animated orb intensities, glow accents
```

### Anti-FOUC Script
```html
<script>
  (function(){
    var t = localStorage.getItem('apex-theme') || 'light';
    var d = document.documentElement;
    if (t === 'dark') d.setAttribute('data-theme', 'dark');
    else              d.setAttribute('data-theme', 'light');
  })();
</script>
```
Runs synchronously before any CSS is parsed, preventing flash of unstyled content on all three modes — including dark OS preference.

---

## Scroll Animation System

All below-the-fold content animates in as the user scrolls using the **IntersectionObserver API** (threshold: `0.12`, rootMargin: `-48px` bottom). Animations trigger once and unobserve for performance.

### Animation Classes

| Class | Effect | Used On |
|-------|--------|---------|
| `.reveal` | Fade up (translateY 36px → 0) | Default for most elements |
| `.reveal-left` | Slide in from left (translateX -48px → 0) | Contact left panel |
| `.reveal-right` | Slide in from right (translateX 48px → 0) | Value cards, contact form |
| `.reveal-scale` | Scale up + fade (scale 0.90 → 1) | Product cards |
| `.reveal-fade` | Fade only (no transform) | Subtle elements |

### Stagger Delays

| Class | Delay |
|-------|-------|
| `.d1` | 80ms |
| `.d2` | 160ms |
| `.d3` | 260ms |
| `.d4` | 360ms |
| `.d5` | 460ms |

### Hero Entrance (Load-Time)
CSS `@keyframes` with staggered `animation-delay` — no IntersectionObserver needed:

| Element | Delay | Animation |
|---------|-------|-----------|
| `.hero-eyebrow` | 100ms | `heroFadeUp` |
| `.hero-title` | 280ms | `heroFadeUp` |
| `.hero-description` | 460ms | `heroFadeUp` |
| `.hero-actions` | 620ms | `heroFadeUp` |
| `.hero-scroll` | 1000ms | `heroFadeIn` |

### Cinematic Orb Animations (Dark Mode)
Two absolutely-positioned orbs in the hero animate continuously via CSS `@keyframes`:

| Element | Animation | Duration | Effect |
|---------|-----------|----------|--------|
| `.hero-orb--crimson` | `orbCrimson` | 11s | Slow scale + drift, opacity pulse |
| `.hero-orb--purple` | `orbPurple` | 15s | Offset drift pattern, opacity variation |

Both are suppressed by `@media (prefers-reduced-motion: reduce)`.

---

## Contact Form

The contact form collects: **Name**, **Email**, **Subject** (dropdown), and **Message**.

### Current Implementation — mailto:
On submit, validates all fields client-side, constructs a `mailto:` URL with all form data pre-populated, and opens the user's default email client addressed to `apexdevstudio@proton.me`.

### Planned Upgrade — Web3Forms
The `mailto:` approach requires a configured email client. The planned upgrade is **Web3Forms** ([web3forms.com](https://web3forms.com)) — free tier: 250 submissions/month, no backend required. See `project.json` for implementation details.

### Client-Side Validation
- All fields required
- Email validated against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Status messages shown inline below the form on success/error
- Focus ring follows `--crimson` with purple shadow in dark mode

---

## SEO & Structured Data

### Meta Tags
- `<title>` — "Apex Development Studio — Independent Software Studio"
- `<meta name="description">` — studio description, privacy focus, flagship app
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://apexdevelopmentstudio.com/">`

### Open Graph & Twitter Card
Full OG tags and Twitter Card (`summary`) for clean social sharing previews.

### JSON-LD Structured Data
`Organization` schema in `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Apex Development Studio LLC",
  "url": "https://apexdevelopmentstudio.com/",
  "logo": "https://apexdevelopmentstudio.com/favicon.svg",
  "contactPoint": { "@type": "ContactPoint", "email": "apexdevstudio@proton.me" },
  "makesOffer": {
    "@type": "SoftwareApplication",
    "name": "Journey Tracker",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "iOS, iPadOS, macOS",
    "url": "https://journeytracker.app"
  }
}
```

### Sitemap & robots.txt
- `sitemap.xml` — single canonical URL, `changefreq: monthly`, `priority: 1.0`
- `robots.txt` — all crawlers allowed, sitemap reference included
- Update `sitemap.xml` `lastmod` on every meaningful content push

---

## Security

### Content Security Policy

| Directive | Value | Rationale |
|-----------|-------|-----------|
| `default-src` | `'self'` | No external resource loads |
| `script-src` | `'self' 'unsafe-inline'` | Inline JS for theme/animation |
| `style-src` | `'self' 'unsafe-inline'` | All CSS is inline |
| `img-src` | `'self' data:` | Local images + inline SVG |
| `frame-ancestors` | `'none'` | Prevents clickjacking |
| `base-uri` | `'self'` | Prevents base tag injection |
| `object-src` | `'none'` | Blocks Flash/plugin content |

### Additional Headers (via meta tags)
- `referrer` — `strict-origin-when-cross-origin`
- `X-Content-Type-Options` — `nosniff`

---

## Technology

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Markup | Semantic HTML5 | Accessibility, SEO, screen reader support |
| Styling | CSS custom properties + `[data-theme]` | Theme switching, maintainability, zero runtime cost |
| Scripting | Vanilla ES6 JavaScript | No framework overhead, no dependencies |
| Animations | CSS `@keyframes` + IntersectionObserver | GPU-composited, 60fps, no layout thrash |
| Glass effects | `backdrop-filter: blur()` | Native CSS, no JS |
| Theme | `localStorage` + `data-theme` attribute | Instant, FOUC-free persistence |
| Hosting | GitHub Pages | Free, CDN-backed, auto SSL |
| DNS | GoDaddy → GitHub Pages A records | Custom domain routing |
| SSL | Let's Encrypt (via GitHub Pages) | Auto-provisioned, auto-renewed |
| Forms | `mailto:` (current) / Web3Forms (planned) | No backend required |
| SEO | JSON-LD, Open Graph, canonical, sitemap | Structured data for rich results |

**Zero external dependencies.** No npm, no webpack, no CDN calls, no tracking scripts.

---

## Local Development

No build step required. Configurations are stored in `.claude/launch.json`.

### Option A — Claude Code Launch Config (recommended)
```bash
# Configs are in .claude/launch.json — two servers:
# • V1 (current live): npx serve on port 3000 (autoPort)
# • V2 (redesign):     npx serve on port 3001 (autoPort)
npx serve /Users/joemcmullin/Projects/ApexDevelopmentStudio
```

### Option B — Python HTTP server
```bash
cd /Users/joemcmullin/Projects/ApexDevelopmentStudio
python3 -m http.server 8765
# Open: http://localhost:8765
```

### Option C — Open directly
```bash
open /Users/joemcmullin/Projects/ApexDevelopmentStudio/index.html
```

### Hard Refresh (clear browser cache)
```
Mac:  Cmd + Shift + R
Win:  Ctrl + Shift + R
```

---

## Deployment — GitHub Pages

### Repository
- **URL:** [github.com/joemcmullin/ApexDevelopmentStudio](https://github.com/joemcmullin/ApexDevelopmentStudio)
- **Visibility:** Public
- **Default branch:** `main`
- **Pages source:** `main` branch / root `/`

### Deployment Workflow
GitHub Pages automatically rebuilds and deploys on every push to `main`. No CI/CD pipeline or build step — files are served directly from the repo root. Deployment typically completes within **30–60 seconds**.

### Checking Deployment Status
```bash
gh run list --repo joemcmullin/ApexDevelopmentStudio --limit 5
```
Or visit: `github.com/joemcmullin/ApexDevelopmentStudio/actions`

### Publishing a Change
```bash
cd /Users/joemcmullin/Projects/ApexDevelopmentStudio
git add index.html
git commit -m "Your message"
git push
# Site updates within ~60 seconds
```

### Deployment Checklist
Before every meaningful content push:
- [ ] Update `sitemap.xml` `lastmod` date to today's date
- [ ] Hard-refresh locally to confirm changes look correct in light mode (default)
- [ ] Toggle to dark mode and verify cinematic effects (orbs, glass cards, gradient text)
- [ ] Verify responsive layout at mobile width (resize or DevTools)

---

## DNS Configuration — GoDaddy

The domain `apexdevelopmentstudio.com` is registered at **GoDaddy** and points to GitHub Pages.

### A Records (apex/root domain `@`)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `185.199.108.153` | 1 Hour |
| `A` | `@` | `185.199.109.153` | 1 Hour |
| `A` | `@` | `185.199.110.153` | 1 Hour |
| `A` | `@` | `185.199.111.153` | 1 Hour |

### CNAME Record (www subdomain)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `www` | `joemcmullin.github.io` | 1 Hour |

### Troubleshooting History
1. **Rogue WebsiteBuilder A record** — GoDaddy auto-added a 5th `A` record competing with GitHub Pages IPs. Resolution: deleted via GoDaddy DNS panel.
2. **Wrong `www` CNAME target** — GoDaddy default pointed to `@` instead of `joemcmullin.github.io`. Resolution: edited the CNAME value.

### Verifying DNS Propagation
```
https://dnschecker.org/#A/apexdevelopmentstudio.com
```
All results should show one of the four GitHub Pages IPs above.

---

## SSL Certificate

HTTPS enforced via **Let's Encrypt** auto-provisioned by GitHub Pages.

- **Enforce HTTPS** enabled in GitHub Pages settings
- Certificate auto-renews — no manual action required
- To verify: visit [https://apexdevelopmentstudio.com](https://apexdevelopmentstudio.com) and inspect the padlock

---

## Project Tracking

All tracked work items are stored in `project.json`:

```json
{
  "project": { "name": "...", "description": "..." },
  "items": [
    {
      "type": "enhancement | bug",
      "priority": "high | medium | low",
      "title": "Short label",
      "description": "Detailed description.",
      "status": "done | todo | backlog",
      "assignee": "Joe M.",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

---

## Products

### Journey Tracker
**Status:** Coming Soon

Journey Tracker is a native multiplatform app that helps individuals track their GLP-1 therapy (Ozempic, Wegovy, Zepbound, Mounjaro), weight loss progress, body composition, lab results, symptoms, hydration, fasting, and health milestones.

- **Website:** [journeytracker.app](https://journeytracker.app)
- **Repository:** [github.com/joemcmullin/JourneyTrackerStaticSite](https://github.com/joemcmullin/JourneyTrackerStaticSite) *(marketing site)*
- **Platforms:** iPhone, iPad, Mac
- **Developer:** Apex Development Studio LLC

---

## Contact & Business Inquiries

| Purpose | Contact |
|---------|---------|
| General / Business inquiries | apexdevstudio@proton.me |
| Journey Tracker support | support@journeytracker.app |
| Company website | [apexdevelopmentstudio.com](https://apexdevelopmentstudio.com) |

---

*© 2026 Apex Development Studio LLC. All rights reserved.*
