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
 * nav.js: the phone menu.
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   On screens 860px wide or less, the header links are hidden and a round
 *   three-line button shows instead. Pressing it turns the lines into an X and
 *   opens a full-screen menu that grows out of the button as a circle, with
 *   three amber rings rippling outward.
 *
 * WHERE IT APPEARS
 *   Every page with the shared header (partials/nav.html): all pages except
 *   Privacy, Terms and the 404 page.
 *
 * DEPENDS ON
 *   #menuBtn and #menu in partials/nav.html, and the "phone menu" styles in
 *   home.css.
 *
 * HOW TO EDIT
 *   - Menu links ............. partials/nav.html (the .menu-in list).
 *   - Open and close speed ... the .menu transition in home.css (0.65s). Keep
 *                              the 650 in hide() below in step with it.
 *   - Phone width ............ 860px in home.css and 861px below. Change both
 *                              together.
 *
 * ACCESSIBILITY
 *   Escape, a menu link or the X closes the menu. Focus moves into the menu
 *   when it opens, stays inside it while open, and returns to the button when
 *   it closes. With reduced motion the menu opens and closes at once.
 */

export function initNav() {
  const btn = document.getElementById('menuBtn'),
    menu = document.getElementById('menu')
  if (!btn || !menu) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let open = false,
    timer = 0

  const setOrigin = () => {
    const r = btn.getBoundingClientRect()
    menu.style.setProperty('--ox', r.left + r.width / 2 + 'px')
    menu.style.setProperty('--oy', r.top + r.height / 2 + 'px')
  }
  const show = () => {
    clearTimeout(timer)
    setOrigin()
    menu.hidden = false
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')))
    document.documentElement.classList.add('menu-open')
    btn.setAttribute('aria-expanded', 'true')
    btn.setAttribute('aria-label', 'Close menu')
    const first = menu.querySelector('a')
    if (first) setTimeout(() => first.focus({ preventScroll: true }), reduce ? 0 : 250)
    open = true
  }
  const hide = (returnFocus = true) => {
    menu.classList.remove('open')
    document.documentElement.classList.remove('menu-open')
    btn.setAttribute('aria-expanded', 'false')
    btn.setAttribute('aria-label', 'Open menu')
    timer = setTimeout(
      () => {
        menu.hidden = true
      },
      reduce ? 0 : 650,
    )
    if (returnFocus) btn.focus({ preventScroll: true })
    open = false
  }
  btn.addEventListener('click', () => (open ? hide() : show()))
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) hide(false)
  })
  addEventListener('keydown', (e) => {
    if (open && e.key === 'Escape') hide()
  })
  // keep keyboard focus inside the open menu (the button stays reachable to close it)
  addEventListener('keydown', (e) => {
    if (!open || e.key !== 'Tab') return
    const items = [btn, ...menu.querySelectorAll('a')]
    const i = items.indexOf(document.activeElement)
    if (e.shiftKey && i <= 0) {
      e.preventDefault()
      items[items.length - 1].focus()
    } else if (!e.shiftKey && i === items.length - 1) {
      e.preventDefault()
      items[0].focus()
    }
  })
  // if the window grows past the phone layout while open, put everything back
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
    if (e.matches && open) hide(false)
  })
}
