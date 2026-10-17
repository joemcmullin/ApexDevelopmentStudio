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
 * postcss.config.js: the CSS processing step.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   When the site is built, every stylesheet passes through Autoprefixer,
 *   which adds the older "-webkit-" style spellings of newer CSS rules for
 *   browsers that still need them.
 *
 * WHERE IT APPEARS
 *   Nowhere on the page. It only changes the finished CSS files.
 *
 * DEPENDS ON
 *   The "postcss" and "autoprefixer" packages in package.json. Vite finds and
 *   reads this file on its own.
 *
 * HOW TO EDIT
 *   Nothing to change in normal use.
 */

export default {
  plugins: {
    autoprefixer: {},
  },
}
