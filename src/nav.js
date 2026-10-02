/* Header menu for phones: the three-line button turns into an X and the menu
   opens as a ripple of amber contour rings spreading from the button. Shared by
   every page. Escape, a link, or the X closes it; focus moves in and back out. */
export function initNav(){
  const btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  if (!btn || !menu) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let open = false, timer = 0;

  const setOrigin = () => {
    const r = btn.getBoundingClientRect();
    menu.style.setProperty('--ox', (r.left + r.width / 2) + 'px');
    menu.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
  };
  const show = () => {
    clearTimeout(timer); setOrigin();
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    document.documentElement.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Close menu');
    const first = menu.querySelector('a'); if (first) setTimeout(() => first.focus({ preventScroll: true }), reduce ? 0 : 250);
    open = true;
  };
  const hide = (returnFocus = true) => {
    menu.classList.remove('open');
    document.documentElement.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu');
    timer = setTimeout(() => { menu.hidden = true; }, reduce ? 0 : 650);
    if (returnFocus) btn.focus({ preventScroll: true });
    open = false;
  };
  btn.addEventListener('click', () => (open ? hide() : show()));
  menu.addEventListener('click', e => { if (e.target.closest('a')) hide(false); });
  addEventListener('keydown', e => { if (open && e.key === 'Escape') hide(); });
  // keep keyboard focus inside the open menu (the button stays reachable to close it)
  addEventListener('keydown', e => {
    if (!open || e.key !== 'Tab') return;
    const items = [btn, ...menu.querySelectorAll('a')];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0){ e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1){ e.preventDefault(); items[0].focus(); }
  });
  // if the window grows past the phone layout while open, put everything back
  matchMedia('(min-width: 861px)').addEventListener('change', e => { if (e.matches && open) hide(false); });
}
