import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

export default defineConfig({
  plugins: [react(), buildStamp()],
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
      },
    },
  },
})
