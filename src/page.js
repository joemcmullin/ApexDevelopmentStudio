// Inner pages: shared styles plus whichever forms the page carries.
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
