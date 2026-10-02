# Apex Development Studio LLC — Company Website

The public website for **Apex Development Studio LLC**: native iOS and Android apps and mission-driven websites. The "Signal" design went live on 2026-10-01 and replaced the anime-themed site.

> **Live site:** [https://apexdevelopmentstudio.com](https://apexdevelopmentstudio.com)
> **Repository:** [github.com/joemcmullin/ApexDevelopmentStudio](https://github.com/joemcmullin/ApexDevelopmentStudio) (local: `~/Projects/Sites/ApexDevelopmentStudio`)
> **Rollback:** the previous site is tagged `anime-site-final`.

---

## Deploy pipeline

Every push to `main` runs GitHub Actions (`.github/workflows/deploy.yml`): `npm ci && npm run build`, then `dist/` is published to GitHub Pages, usually within about two minutes. `public/CNAME` binds the custom domain. Every page carries `<meta name="apex-build">` with the commit and build time. Use it to check whether a browser is showing a cached copy, because GitHub Pages lets browsers cache pages for up to 10 minutes.

```mermaid
flowchart LR
    A["Edit source"] --> B["git push origin main"]
    B --> C["GitHub Actions<br/>npm ci + vite build"]
    C --> D["GitHub Pages"]
    D --> E["apexdevelopmentstudio.com"]
```

---

## Page structure (home)

| Section | What it does |
|---|---|
| Header | Menu links on the right (desktop); menu button and ripple menu (phones). No call-to-action button in the header. |
| Hero | "Built to hold up in the field." over a live amber contour map; the summit and APEX label follow the cursor, and a tap plants a peak |
| Work | Three seamless tiles. **Journey Tracker:** a deck of iPhone screens (hover shuffles, press-and-hold pauses). **Gleaming Beacon:** the animated lighthouse medallion in a sand stream ported from gleamingbeacon.com. **HINA** (client work): a real-time recording of hinapacific.org scrolling, which pauses on hover. **Joe McMullin Photography** (personal project) with a drifting Milky Way panorama |
| What we build | White band: iOS, Android and Web capabilities |
| Numbers | 22 / 18 / 3 / 6, slot-reel digits that spin in and land when the band reaches mid-screen |
| Founder | "Built on service. Technology for life's essential needs." A Biography accordion that closes itself once scrolled away, plus a joemcmullin.com photography tile |
| Start a project | 4-step intake: kind → platforms and stage → the idea, timeline and budget → contact details and optional NDA request, with a review before sending |
| Contact | Compact amber band with the contact form |

## Other pages

| URL | Page |
|---|---|
| `/services/` | Services overview and the 6-step process (Discovery → Security, before design → Design → Build → Launch → Support) |
| `/services/ios-app-development/`, `/services/android-app-development/`, `/services/web-development/` | Service pages with FAQs |
| `/work/journey-tracker/` | Journey Tracker case study |
| `/about/` | Founder biography |
| `/start/` | Standalone 4-step project intake |
| `/404.html` | Branded not-found page |

Shared header and footer live in `partials/` and are inserted at build time by the `apex-includes` plugin in `vite.config.js` (`<!-- @include nav.html -->`). Inner pages load `src/page.js`, forms live in `src/forms.js`, and the phone menu is `src/nav.js`. On phones the header shows a menu button that opens a full-screen "contour ripple" menu.

Privacy (`/privacy/`) and Terms (`/terms/`) keep their attorney-reviewed text, restyled to match.

---

## Technology

| Layer | Technology |
|---|---|
| Home page | Plain HTML (`index.html`) + `src/home.css` + `src/home.js` (vanilla JS, canvas animations), built by Vite |
| Legal pages | React 19 (`src/privacy.jsx`, `src/terms.jsx`, `src/components/LegalPage.jsx`) + `src/legal.css` |
| Media | `public/media/` (app screenshots, animated medallion WebP, HINA scroll video, Milky Way panorama) |
| Forms | **Web3Forms** (`POST https://api.web3forms.com/submit`), same access key as before. Honeypot field, length limits, one send per form per minute (in memory only) |
| Fonts | Google Fonts: Plus Jakarta Sans, JetBrains Mono |
| Social card | `public/og-image.png`, generated from `og-card.html` |

The site stores nothing in the browser (no cookies, no local storage), and the privacy policy says so. Keep it that way, or update the policy along with the code.

Web3Forms sits behind Cloudflare, which challenges headless or scripted browsers. That makes automated form tests fail with a CORS error even though real browsers succeed. To test a form, use a normal browser.

---

## Local development

```bash
cd ~/Projects/Sites/ApexDevelopmentStudio
npm run dev        # http://127.0.0.1:4311
npm run build && npm run preview   # production build at http://127.0.0.1:4312
```

---

## Products featured

| Product | Status | Link |
|---|---|---|
| **Journey Tracker** | Live on the App Store (iPhone, iPad, Mac); Android planned | [journeytracker.app](https://journeytracker.app) |
| **Gleaming Beacon** | Coming soon (iOS and Android) | [gleamingbeacon.com](https://gleamingbeacon.com) |
| **HINA** | Client website | [hinapacific.org](https://hinapacific.org) |

---

## Contact

support@apexdevelopmentstudio.com · [apexdevelopmentstudio.com](https://apexdevelopmentstudio.com)

*© 2026 Apex Development Studio LLC. All rights reserved.*
