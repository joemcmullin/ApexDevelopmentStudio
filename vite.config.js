import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renderLegal } from './src/legal/render.js'
import { PAGE as PRIVACY } from './src/legal/privacy.js'
import { PAGE as TERMS } from './src/legal/terms.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// base '/' is correct for a custom-domain GitHub Pages site
// (apexdevelopmentstudio.com serves from the repo root).
// If this were ever served from a project subpath it would need '/<repo>/'.
/**
 * Stamp every page with the build it came from.
 *
 * Asset filenames are content-hashed, but index.html is not — GitHub Pages
 * serves it with max-age=600, so a browser can sit on a stale copy pointing
 * at old chunks with no way to tell from the page itself. This writes the
 * commit and build time into a meta tag and logs it once to the console, so
 * "which build am I actually looking at?" takes two seconds to answer.
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
 * markup without a framework.
 */
function includes() {
  return {
    name: 'apex-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*@include\s+([\w.-]+)\s*-->/g, (_, file) =>
          readFileSync(resolve(__dirname, 'partials', file), 'utf8'))
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
      handler: html => html.replace(/<!--\s*@legal\s+(\w+)\s*-->/g, (_, k) => renderLegal(pages[k])),
    },
  }
}

export default defineConfig({
  plugins: [includes(), legalPages(), react(), buildStamp()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Multi-page: each entry is a real directory index, so the published
    // URLs are /privacy/ and /terms/ rather than /privacy.html.
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
