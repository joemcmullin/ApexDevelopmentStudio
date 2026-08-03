import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

// base '/' is correct for a custom-domain GitHub Pages site
// (apexdevelopmentstudio.com serves from the repo root).
// If this were ever served from a project subpath it would need '/<repo>/'.
export default defineConfig({
  plugins: [react()],
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
