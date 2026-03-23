# Apex Development Studio LLC — Company Website

The official company website for **Apex Development Studio LLC**, an independent Apple platform studio crafting thoughtful, privacy-first iOS applications for iPhone, iPad, and Mac.

> **Live Site:** [https://apexdevelopmentstudio.com](https://apexdevelopmentstudio.com)

---

## Table of Contents

- [Overview](#overview)
- [Site Structure](#site-structure)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [Theme System — Dark / Light / System](#theme-system--dark--light--system)
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

- **Brand presence** — establishing Apex Development Studio LLC as a professional, independent iOS app studio
- **Product showcase** — surfacing Journey Tracker and future app releases to prospective users and partners
- **Business contact** — providing a reliable contact channel for business inquiries, press, and support escalations
- **Company identity** — presenting the company's mission, values, and philosophy to the public
- **SEO foundation** — structured data and semantic markup for Google indexing and rich results

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
└── README.md           # This file
```

---

## Pages & Sections

The site is a single-page layout with anchor-linked navigation. All sections are accessible from the fixed navigation bar.

| Anchor | Section | Description |
|--------|---------|-------------|
| `#home` | Hero | Company name, tagline, mission statement, dual CTA buttons |
| `#about` | About | Company story, mission, four value cards |
| (inline) | Stats Bar | Three key company metrics — Apps Released, Platform Focus, Privacy Commitment |
| `#products` | Products | Product cards — Journey Tracker featured, placeholder for future apps |
| `#contact` | Contact | Company contact panel + email contact form |
| (footer) | Footer | Copyright, company name, Products / Contact footer links |

### Hero Section
The hero uses a full-viewport dark background with a subtle crimson grid pattern and a radial crimson glow at the center. Copy includes:
- **Eyebrow label** — "Independent iOS App Studio"
- **Headline** — "Apex Development Studio"
- **Subheadline** — Company tagline and mission
- **CTA buttons** — "View Our Apps" (primary, crimson) and "Get In Touch" (ghost/outline)

All hero elements animate in on page load with a staggered `heroFadeUp` keyframe sequence (eyebrow → title → description → buttons).

### About Section
Two-column layout (text left, value cards right) covering:
- Company origin and mission
- Four value cards: **Craftsmanship**, **Privacy First**, **Platform Native**, **User Focused**

### Stats Bar
Full-width surface band with three stat blocks:
- Apps Released
- Platform Focus (Apple Ecosystem)
- Privacy Commitment (Zero Data Brokers)

### Products Section
Card-based product showcase. Currently features:
- **Journey Tracker** — GLP-1 therapy and health progress tracker for iPhone, iPad, and Mac. Links to [journeytracker.app](https://journeytracker.app)
- **More Coming Soon** — placeholder card for future apps

### Contact Section
Two-column layout:
- **Left panel** — company contact info, business email, response time note
- **Right panel** — contact form (name, email, subject dropdown, message textarea)

### Footer
Dark footer with company name, copyright, and footer navigation links.

---

## Design System

The entire design is driven by CSS custom properties (design tokens) defined in `:root` for dark mode and overridden in `[data-theme="light"]` for light mode.

### Brand Colors

| Token | Dark Value | Light Value | Purpose |
|-------|-----------|-------------|---------|
| `--crimson` | `#C0182E` | (unchanged) | Primary brand accent, buttons, links |
| `--crimson-dark` | `#8B0015` | (unchanged) | Hover states, pressed states |
| `--crimson-light` | `#E03A50` | (unchanged) | Text on dark surfaces, highlights |
| `--crimson-glow` | `rgba(192,24,46,0.10)` | `rgba(192,24,46,0.07)` | Radial hero glow, card hover glow |
| `--crimson-border` | `rgba(192,24,46,0.28)` | `rgba(192,24,46,0.22)` | Crimson-tinted card borders |

### Surface Colors

| Token | Dark Value | Light Value | Purpose |
|-------|-----------|-------------|---------|
| `--bg` | `#111115` | `#F2F3F5` | Page background (rich charcoal / cool off-white) |
| `--bg-surface` | `#17171C` | `#E6E8EC` | Alternating section backgrounds |
| `--bg-card` | `#1F1F27` | `#FFFFFF` | Card backgrounds |
| `--bg-card-hover` | `#26262F` | `#FAFAFA` | Card hover state background |

### Text Colors

| Token | Dark Value | Light Value | Purpose |
|-------|-----------|-------------|---------|
| `--text-hi` | `#F5F5F7` | `#0D0D0F` | Primary headings and body text |
| `--text-mid` | `#AEAEB2` | `#3A3A3F` | Secondary text, descriptions |
| `--text-lo` | `#6E6E73` | `#9A9A9F` | Tertiary text, labels, borders |

> **Design rationale for light mode:** The `#999`-family grey requested by the brand appears purposefully in `--text-lo` (`#9A9A9F`), borders, chips, and UI labels — not as a full-page background. The canvas is a cool off-white (`#F2F3F5`) so grey is present as a brand accent without overwhelming the layout. White (`#FFFFFF`) cards float above the canvas creating visual depth.

### Typography

The site uses the native system font stack — no external font requests:

```css
--font: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

This eliminates render-blocking font requests, provides perfect rendering on every platform, and matches the native iOS/macOS feel of the products being showcased.

### Spacing & Shape Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-h` | `64px` | Fixed nav bar height; used for `scroll-padding-top` |
| `--pad-section` | `96px` | Top/bottom padding for all major sections |
| `--r-sm` | `8px` | Small border radius (tags, chips) |
| `--r-md` | `12px` | Medium radius (buttons, inputs) |
| `--r-lg` | `20px` | Large radius (cards) |
| `--r-xl` | `28px` | Extra-large radius (feature cards) |

---

## Theme System — Dark / Light / System

The site supports three explicit theme modes, selectable via a toggle in the nav bar.

### Toggle UI
Three icon buttons in the navigation bar (top right):
- **Moon icon** → forces dark mode
- **Sun icon** → forces light mode
- **Monitor icon** → follows the operating system's `prefers-color-scheme` setting

### Persistence
Selected theme is saved to `localStorage` under the key `apex-theme`. On every subsequent page load, a blocking inline script reads this value and sets `data-theme` on `<html>` before the first paint, preventing any flash of unstyled content (FOUC).

### How It Works

```
localStorage['apex-theme'] = 'dark' | 'light' | null (system)
      ↓
<html data-theme="dark|light"> or no attribute (system)
      ↓
CSS [data-theme="light"] { ... } overrides :root tokens
@media (prefers-color-scheme: light) { :root:not([data-theme]) { ... } }
      ↓
All colors update via CSS custom property inheritance — zero JS repaints
```

### Anti-FOUC Script
```html
<script>
  (function(){
    var t = localStorage.getItem('apex-theme');
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```
This inline script runs synchronously before any CSS is parsed, ensuring the correct theme attribute is applied before the browser renders the first frame.

---

## Scroll Animation System

All below-the-fold content animates in as the user scrolls using the **IntersectionObserver API**. No scroll event listeners — animations are triggered once and never fire again.

### Animation Classes

| Class | Effect | Used On |
|-------|--------|---------|
| `.reveal` | Fade up (translateY 32px → 0) | Default for most elements |
| `.reveal-left` | Slide in from left (translateX -40px → 0) | Contact left panel |
| `.reveal-right` | Slide in from right (translateX 40px → 0) | Value cards, contact form |
| `.reveal-scale` | Scale up + fade (scale 0.92 → 1) | Product cards |
| `.reveal-fade` | Fade only (no transform) | Subtle elements |

### Stagger Delays

Child elements within a group use delay classes for a cascading entrance:

| Class | Delay |
|-------|-------|
| `.d1` | 80ms |
| `.d2` | 160ms |
| `.d3` | 240ms |
| `.d4` | 320ms |
| `.d5` | 420ms |

### Hero Entrance (Load-Time)
The hero section does not use IntersectionObserver — it uses CSS `@keyframes` animations triggered immediately on page load with staggered `animation-delay` values:

| Element | Delay | Animation |
|---------|-------|-----------|
| `.hero-eyebrow` | 100ms | `heroFadeUp` |
| `.hero-title` | 260ms | `heroFadeUp` |
| `.hero-desc` | 420ms | `heroFadeUp` |
| `.hero-actions` | 580ms | `heroFadeUp` |

### Reduced Motion Support
All scroll animations and hero entrance animations are suppressed for users who have enabled **Reduce Motion** in their OS accessibility settings:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, [class*="hero-"] { animation: none; transition: none; opacity: 1; transform: none; }
}
```

---

## Contact Form

The contact form collects: **Name**, **Email**, **Subject** (dropdown), and **Message**.

### Current Implementation — mailto:
On submit, the form validates all fields client-side, constructs a `mailto:` URL with all form data pre-populated (subject line formatted as `[Subject] from Name`, body includes all fields), and opens the user's default email client addressed to `apexdevstudio@proton.me`.

### Planned Upgrade — Web3Forms
The `mailto:` approach requires the user to have an email client configured. The planned upgrade is to integrate **Web3Forms** ([web3forms.com](https://web3forms.com)) — a static-site-compatible form service that sends email directly to `apexdevstudio@proton.me` without opening any client. Free tier: 250 submissions/month. See `project.json` item "Contact form — direct email sending" for implementation steps.

### Client-Side Validation
- All fields required
- Email validated against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Status messages shown inline below the form on success/error

---

## SEO & Structured Data

### Meta Tags
- `<title>` — keyword-targeted, under 60 characters
- `<meta name="description">` — 150-character description covering studio name, platform focus, and flagship app
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://apexdevelopmentstudio.com/">`
- `<meta name="author" content="Apex Development Studio LLC">`

### Open Graph & Twitter Card
Full Open Graph tags (`og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`) and Twitter Card (`summary` type) for clean social sharing previews.

### JSON-LD Structured Data
`Organization` schema embedded in the page `<head>`:

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
- `sitemap.xml` — single canonical URL at `https://apexdevelopmentstudio.com/`, `changefreq: monthly`, `priority: 1.0`
- `robots.txt` — `User-agent: * / Allow: /` — all crawlers allowed, sitemap reference included
- Update `sitemap.xml` `lastmod` date whenever meaningful content changes are published

---

## Security

### Content Security Policy
A `<meta http-equiv="Content-Security-Policy">` tag is embedded in the page head with the following directives:

| Directive | Value | Rationale |
|-----------|-------|-----------|
| `default-src` | `'self'` | No external resource loads |
| `script-src` | `'self' 'unsafe-inline'` | Inline JS required for theme/animation; no external scripts |
| `style-src` | `'self' 'unsafe-inline'` | All CSS is inline; no external stylesheets |
| `img-src` | `'self' data:` | Local images only; data URIs for inline SVG if needed |
| `frame-ancestors` | `'none'` | Prevents clickjacking — site cannot be embedded in an iframe |
| `base-uri` | `'self'` | Prevents base tag injection attacks |
| `object-src` | `'none'` | Blocks Flash/plugin content |

### Additional Security Headers (via meta tags)
- `referrer` — `strict-origin-when-cross-origin`
- `X-Content-Type-Options` — `nosniff`

### Contact Form Security
- All form inputs validated and sanitized client-side before the `mailto:` URL is constructed
- `maxlength` attributes on all text fields prevent oversized payloads
- Dropdown `<select>` for Subject field restricts input to a defined list — no free-text injection via subject
- Email field validated with regex before use

---

## Technology

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Markup | Semantic HTML5 | Accessibility, SEO, screen reader support |
| Styling | CSS custom properties (design tokens) | Theme switching, maintainability, zero runtime cost |
| Scripting | Vanilla ES6 JavaScript | No framework overhead, no dependencies to update |
| Animations | CSS transitions + `@keyframes` + IntersectionObserver | GPU-composited, 60fps, no layout thrash |
| Theme | `localStorage` + `data-theme` attribute | Instant, FOUC-free theme persistence |
| Hosting | GitHub Pages | Free, reliable, CDN-backed, auto SSL |
| DNS | GoDaddy → GitHub Pages A records | Custom domain routing |
| SSL | Let's Encrypt (via GitHub Pages) | Auto-provisioned, auto-renewed |
| Forms | `mailto:` (current) / Web3Forms (planned) | No backend required |
| SEO | JSON-LD, Open Graph, canonical, sitemap | Machine-readable structured data for rich results |

**Zero external dependencies.** No npm, no webpack, no CDN calls, no tracking scripts. The entire site is one HTML file + favicon + four support files.

---

## Local Development

No build step required. Open directly in a browser or serve with any static file server.

### Option A — Open directly
```bash
open /Users/joemcmullin/Projects/ApexDevelopmentStudio/index.html
```

> Note: The `mailto:` contact form works fine when opened as a file. A local server is not required for any current feature.

### Option B — Python HTTP server (recommended for testing)
```bash
cd /Users/joemcmullin/Projects/ApexDevelopmentStudio
python3 -m http.server 8765
# Open: http://localhost:8765
```

### Option C — VS Code Live Server
Install the **Live Server** extension in VS Code, right-click `index.html`, and select **Open with Live Server**. Live-reloads on save.

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
GitHub Pages automatically rebuilds and deploys on every push to `main`. There is no CI/CD pipeline or build step — GitHub Pages serves the files directly from the repository root.

Deployment typically completes within **30–60 seconds** of a push.

### Checking Deployment Status
```bash
gh run list --repo joemcmullin/ApexDevelopmentStudio --limit 5
```

Or visit: `github.com/joemcmullin/ApexDevelopmentStudio/actions`

### Publishing a Change
```bash
cd /Users/joemcmullin/Projects/ApexDevelopmentStudio
git add index.html          # or whichever files changed
git commit -m "Your message"
git push
# Site updates within ~60 seconds
```

### Deployment Checklist
Before every meaningful content push:
- [ ] Update `sitemap.xml` `lastmod` date to today's date
- [ ] Hard-refresh locally to confirm the change looks correct in both light and dark mode
- [ ] Verify responsive layout on mobile (resize browser or use DevTools)

---

## DNS Configuration — GoDaddy

The domain `apexdevelopmentstudio.com` is registered at **GoDaddy** and points to GitHub Pages via the following DNS records:

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
During initial setup, two DNS issues were identified and resolved:
1. **Rogue WebsiteBuilder A record** — GoDaddy had automatically added a 5th `A` record for `@` pointing to their Website Builder service. This competed with the 4 GitHub Pages IPs and caused a `NotServedByPagesError`. Resolution: deleted the WebsiteBuilder record via the GoDaddy DNS panel.
2. **Wrong `www` CNAME target** — GoDaddy's default `www` CNAME pointed to `@` (the domain itself) instead of `joemcmullin.github.io`. Resolution: edited the CNAME value to `joemcmullin.github.io`.

### Verifying DNS Propagation
Check current A record resolution at:
```
https://dnschecker.org/#A/apexdevelopmentstudio.com
```
All results should show `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, or `185.199.111.153`.

---

## SSL Certificate

HTTPS is enforced via a **Let's Encrypt** certificate automatically provisioned and renewed by GitHub Pages.

- **Enforce HTTPS** is enabled in GitHub Pages settings — all `http://` requests are permanently redirected to `https://`
- Certificate auto-renews — no manual action required
- To check certificate status: visit [https://apexdevelopmentstudio.com](https://apexdevelopmentstudio.com) and inspect the padlock in the browser address bar

---

## Project Tracking

All tracked work items are stored in `project.json` at the repository root, following a consistent schema:

```json
{
  "project": { "name": "...", "description": "..." },
  "items": [
    {
      "type": "enhancement | bug",
      "priority": "high | medium | low",
      "title": "Short label",
      "description": "Detailed description of the work.",
      "status": "done | todo | backlog",
      "assignee": "Joe M.",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

Current counts (as of March 2026):

| Status | Count |
|--------|-------|
| Done | 9 |
| To Do | 3 |
| Backlog | 6 |

---

## Products

### Journey Tracker
**Status:** Coming Soon to the Apple App Store

Journey Tracker is a native SwiftUI multiplatform app for iPhone, iPad, and Mac that helps individuals track their GLP-1 therapy (Ozempic, Wegovy, Zepbound, Mounjaro), weight loss progress, body composition, lab results, symptoms, hydration, fasting, and health milestones.

- **Website:** [journeytracker.app](https://journeytracker.app)
- **Repository:** [github.com/joemcmullin/JourneyTrackerStaticSite](https://github.com/joemcmullin/JourneyTrackerStaticSite) *(marketing site)*
- **Platforms:** iPhone, iPad, Mac (Apple Silicon + Intel)
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
