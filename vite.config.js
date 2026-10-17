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
 * vite.config.js: settings for Vite, the tool that runs and builds the site.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   Vite does two jobs:
 *     1. "npm run dev"   runs a local preview at http://127.0.0.1:4311 that
 *                        refreshes the page when a file is saved.
 *     2. "npm run build" turns the source files into the finished website in
 *                        the dist/ folder. GitHub Actions runs this on every
 *                        push to main and publishes dist/ to GitHub Pages
 *                        (see .github/workflows/deploy.yml).
 *   It also runs four small add-ons ("plugins"), each explained below:
 *     apex-includes ..... drops the shared header and footer into every page
 *     apex-legal ........ writes the Privacy and Terms text into their pages
 *     apex-build-stamp .. labels every page with the build it came from
 *     apex-credit ....... keeps the Apex credit at the top of shipped code
 *
 * WHERE IT APPEARS
 *   Nowhere on the page. It only affects how the site is served and built.
 *
 * DEPENDS ON
 *   The "vite" package in package.json. postcss.config.js adds browser
 *   prefixes to the CSS during the build.
 *
 * HOW TO EDIT
 *   - Add a new page ......... create its folder with an index.html, then add
 *                              a line to "input" at the bottom of this file.
 *                              Also add it to public/sitemap.xml and
 *                              public/llms.txt.
 *   - Shared header/footer ... edit partials/nav.html or partials/footer.html,
 *                              not this file.
 *   - Privacy or Terms text .. edit src/legal/privacy.js or src/legal/terms.js.
 *   - Local preview ports .... the "dev" and "preview" scripts in package.json.
 *   Most people never need to touch this file.
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { renderLegal } from './src/legal/render.js'
import { PAGE as PRIVACY } from './src/legal/privacy.js'
import { PAGE as TERMS } from './src/legal/terms.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Stamp every page with the build it came from.
 *
 * Asset file names change with every build, but index.html keeps its name.
 * GitHub Pages lets browsers cache a page for 10 minutes (max-age=600), so a
 * browser can hold an old copy that points at old files, and the page itself
 * gives no clue. This writes the commit and build time into
 * <meta name="apex-build"> and logs it once to the browser console, so
 * "which build am I looking at?" takes two seconds to answer. A local build
 * shows "local" in place of the commit.
 */
function buildStamp() {
  const sha = (process.env.GITHUB_SHA || 'local').slice(0, 7)
  const at = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
  const id = `${sha} · ${at}`
  return {
    name: 'apex-build-stamp',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <meta name="apex-build" content="${id}" />\n` +
          `  <script>console.info('%cApex build','color:#ff6b5a;font-weight:700','${id}')</script>\n` +
          `</head>`,
      )
    },
  }
}

/**
 * Shared header and footer. Any page can write <!-- @include nav.html --> and
 * the build replaces it with partials/nav.html, so every page carries the same
 * markup without a framework. The comments at the top of each partial (the
 * credit banner and the editing notes) are left out, so they appear once at
 * the top of the page and not again in the middle of it.
 */
const LEADING_COMMENTS = /^\s*(?:<!--[\s\S]*?-->\s*)+/
function includes() {
  return {
    name: 'apex-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*@include\s+([\w.-]+)\s*-->/g, (_, file) =>
          readFileSync(resolve(__dirname, 'partials', file), 'utf8').replace(LEADING_COMMENTS, ''),
        )
      },
    },
  }
}

/**
 * Legal pages as real HTML: replaces <!-- @legal privacy --> or
 * <!-- @legal terms --> with the rendered page (src/legal/render.js), so the
 * text is in the file itself rather than built by JavaScript in the browser.
 */
function legalPages() {
  const pages = { privacy: PRIVACY, terms: TERMS }
  return {
    name: 'apex-legal',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(/<!--\s*@legal\s+(\w+)\s*-->/g, (_, k) => renderLegal(pages[k])),
    },
  }
}

/**
 * Puts the Apex credit banner (the one at the top of this file) at the top of
 * every finished JavaScript and CSS file. It runs after minifying, which would
 * otherwise strip every comment, so the credit shows in the live site's code.
 * The pages themselves keep the banner written at the top of each HTML file.
 */
const CREDIT_BANNER = `/*!
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
`
function apexCredit() {
  return {
    name: 'apex-credit',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') file.code = CREDIT_BANNER + file.code
        else if (file.fileName.endsWith('.css')) file.source = CREDIT_BANNER + file.source
      }
    },
  }
}

export default defineConfig({
  plugins: [includes(), legalPages(), buildStamp(), apexCredit()],
  // The web address the site lives at. '/' is right for a custom domain on
  // GitHub Pages (apexdevelopmentstudio.com serves from the root). If the site
  // were ever served from a sub-folder, this would need to be '/<folder>/'.
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // One entry per page. Each is a folder with its own index.html, so the
    // published addresses are /privacy/ and /terms/ rather than /privacy.html.
    // The 404 page is public/404.html, copied as it is.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        ios: resolve(__dirname, 'services/ios-app-development/index.html'),
        android: resolve(__dirname, 'services/android-app-development/index.html'),
        web: resolve(__dirname, 'services/web-development/index.html'),
        journeyTracker: resolve(__dirname, 'work/journey-tracker/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        start: resolve(__dirname, 'start/index.html'),
      },
    },
  },
})
