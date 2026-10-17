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
 * page.js: the script every inner page loads.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   Loads the shared styles, starts whichever form the page carries and the
 *   phone menu, and sizes the About page's drifting panorama.
 *
 * WHERE IT APPEARS
 *   Build (/services/), the iOS, Android and Web service pages, the Journey
 *   Tracker case study, About and Start a project. Each loads it at the
 *   bottom of its HTML file. The home page uses home.js. Privacy and Terms
 *   use no JavaScript.
 *
 * DEPENDS ON
 *   home.css, page.css, forms.js and nav.js.
 *
 * HOW TO EDIT
 *   - Inner page styles ...... page.css
 *   - Shared styles .......... home.css
 *   - Forms .................. forms.js
 *
 * NOTE
 *   about/index.html has a <canvas id="twinkle"> over its panorama, but
 *   nothing draws on it here, so the About panorama drifts without the
 *   twinkling stars. Only the home page (home.js) draws them.
 */

import './home.css'
import './page.css'
import { initForms } from './forms.js'
import { initNav } from './nav.js'

initForms()
initNav()

// About page: the drifting Milky Way panorama needs the frame width for its pan.
const pano = document.querySelector('.pano')
if (pano) {
  const setW = () => pano.style.setProperty('--pano-w', pano.clientWidth + 'px')
  new ResizeObserver(setW).observe(pano)
  setW()
}
