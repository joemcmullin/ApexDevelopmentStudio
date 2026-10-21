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
 * analytics.js: visitor analytics (PostHog, project "Apex Development
 * Studio LLC", id 679131).
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   Starts PostHog. PostHog records page views, time on page, scroll depth,
 *   clicks (heatmaps), session recordings, page speed (web vitals) and
 *   JavaScript errors. Every text box is masked in recordings, so nothing a
 *   visitor types into a form is ever recorded.
 *
 *   On top of that it sends a few named events, so the dashboards can count
 *   what matters without digging through raw clicks:
 *     start_clicked           a link to Start a project (/start/).
 *     contact_clicked         a link to the home page contact form (/#contact).
 *     project_form_step       the Start a project form moved on to a step.
 *                             Props: step (2 to 4).
 *     project_form_submitted  the Start a project form was sent. Props: kind.
 *     project_form_failed     it could not be sent. Props: reason.
 *     contact_form_submitted  the home page contact form was sent. Props: topic.
 *     contact_form_failed     it could not be sent. Props: reason.
 *     app_store_clicked       an App Store or Google Play link. Props: store.
 *     email_clicked / phone_clicked   mailto: and tel: links.
 *     social_clicked          a link to a social network. Props: network.
 *     outbound_clicked        any other link to another website. Props: domain.
 *     video_played / video_sound_on   a video with controls was started, or
 *                             a muted autoplaying one was unmuted. Props: video.
 *   Every event also carries "site_section", named as in the menu (Home,
 *   Work, Build, About, Start a project), so time and scrolling add up per
 *   section. Named events also carry "page" (the path). No form contents
 *   are ever sent, only the choice a visitor picked from a list.
 *
 * WHERE IT APPEARS
 *   Every page that loads home.js or page.js. Privacy, Terms and the 404
 *   page use no JavaScript, so they are not tracked.
 *
 * WHEN IT RUNS
 *   Only on apexdevelopmentstudio.com. Local previews send nothing, unless
 *   the site is built with VITE_PH_LOCAL=1 for testing (those events are
 *   tagged as internal and left out of every chart).
 *   PostHog loads after the page has drawn, so it never slows the first view.
 *   Browsers that send "Do Not Track" are not tracked at all.
 *
 * KEEPING OUR OWN VISITS OUT
 *   Open any page once with ?internal=1 on the end (for example
 *   https://apexdevelopmentstudio.com/?internal=1). That browser is then
 *   tagged as internal and left out of the dashboards. ?internal=0 undoes it.
 *
 * HOW TO EDIT
 *   - New named event: call track('event_name', { ...props }) (see forms.js).
 *   - New page or menu section: add its path to SECTIONS below.
 *   - Privacy page: src/legal/privacy.js describes what this file collects.
 *     Change both together.
 */

// PostHog's public project key. It is meant to be visible in the browser
// (it can only send events, never read them).
const POSTHOG_KEY = 'phc_D6Wkf9BcVkRdTCtNbJuDQCqBDDz89zHzVNDvix9AL4gV' // gitleaks:allow
const LIVE_HOSTS = ['apexdevelopmentstudio.com', 'www.apexdevelopmentstudio.com']
const INTERNAL_KEY = 'apex_internal'

// The menu section a path belongs to, named as in the site menu. Matched by
// prefix, longest first, so every service page counts as Build.
const SECTIONS = [
  ['/services/', 'Build'],
  ['/work/', 'Work'],
  ['/about/', 'About'],
  ['/start/', 'Start a project'],
  ['/privacy/', 'Legal'],
  ['/terms/', 'Legal'],
]
function siteSection(path) {
  if (path === '/' || path === '/index.html') return 'Home'
  return SECTIONS.find(([p]) => path.startsWith(p))?.[1] || 'Other'
}

// Social networks, by web address.
const SOCIAL = {
  'x.com': 'X',
  'twitter.com': 'X',
  'facebook.com': 'Facebook',
  'instagram.com': 'Instagram',
  'linkedin.com': 'LinkedIn',
  'youtube.com': 'YouTube',
  'tiktok.com': 'TikTok',
}
const matchHost = (host, d) => host === d || host.endsWith('.' + d)
const socialNetwork = (host) => Object.entries(SOCIAL).find(([d]) => matchHost(host, d))?.[1]

let started = false
let ph = null
const queue = []

// Sends a named event. Safe to call before PostHog has loaded (it waits in
// a queue) and on pages where analytics is off (it does nothing).
export function track(event, props = {}) {
  if (!started) return
  const payload = { page: window.location.pathname, ...props }
  if (ph) ph.capture(event, payload)
  else queue.push([event, payload])
}

// Remembers ?internal=1 / ?internal=0 for this browser.
function isInternal() {
  try {
    const flag = new URLSearchParams(window.location.search).get('internal')
    if (flag === '1') localStorage.setItem(INTERNAL_KEY, '1')
    if (flag === '0') localStorage.removeItem(INTERNAL_KEY)
    return localStorage.getItem(INTERNAL_KEY) === '1'
  } catch {
    return false
  }
}

const linkText = (a) => (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80)

// One listener for every link on the page, so pages don't each need their
// own tracking code.
function onClick(e) {
  const a = e.target.closest?.('a[href]')
  if (!a) return
  const href = a.getAttribute('href')
  if (href.startsWith('tel:')) return track('phone_clicked', { link_text: linkText(a) })
  if (href.startsWith('mailto:')) return track('email_clicked', { link_text: linkText(a) })
  let url
  try {
    url = new URL(href, window.location.href)
  } catch {
    return
  }
  if (url.origin === window.location.origin) {
    if (url.pathname.startsWith('/start')) track('start_clicked', { link_text: linkText(a) })
    else if (url.pathname === '/' && url.hash === '#contact')
      track('contact_clicked', { link_text: linkText(a) })
    return
  }
  if (matchHost(url.hostname, 'apps.apple.com'))
    return track('app_store_clicked', { store: 'App Store', url: url.href })
  if (matchHost(url.hostname, 'play.google.com'))
    return track('app_store_clicked', { store: 'Google Play', url: url.href })
  const network = socialNetwork(url.hostname)
  if (network) return track('social_clicked', { network, link_text: linkText(a) })
  if (url.protocol.startsWith('http'))
    track('outbound_clicked', { domain: url.hostname, url: url.href })
}

const videoName = (v) => (v.currentSrc || v.querySelector('source')?.src || '').split('/').pop()

function onPlay(e) {
  const v = e.target
  if (v.tagName === 'VIDEO' && v.controls) track('video_played', { video: videoName(v) })
}

function onVolume(e) {
  const v = e.target
  if (v.tagName === 'VIDEO' && !v.controls && !v.muted && !v.dataset.soundTracked) {
    v.dataset.soundTracked = '1'
    track('video_sound_on', { video: videoName(v) })
  }
}

export function startAnalytics() {
  const local = import.meta.env.VITE_PH_LOCAL === '1'
  if (started || (!LIVE_HOSTS.includes(window.location.hostname) && !local)) return
  started = true
  const internal = isInternal() || local

  // Media events don't bubble, so listen in the capture phase.
  document.addEventListener('click', onClick, true)
  document.addEventListener('play', onPlay, true)
  document.addEventListener('volumechange', onVolume, true)

  const load = () =>
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        defaults: '2026-08-30',
        person_profiles: 'always',
        respect_dnt: true,
        enable_heatmaps: true,
        capture_dead_clicks: true,
        capture_exceptions: true,
        disable_surveys: true,
        session_recording: { maskAllInputs: true },
        // Adds the menu section to every event, and tags every event from an
        // internal browser. before_send (not register) so the first page view
        // is tagged too.
        before_send: (event) => {
          if (!event) return event
          event.properties = {
            ...event.properties,
            site_section: siteSection(window.location.pathname),
            ...(internal && { internal_user: true }),
          }
          return event
        },
        loaded: (p) => {
          ph = p
          queue.splice(0).forEach(([event, payload]) => p.capture(event, payload))
        },
      })
    })

  // Wait until the browser is idle after the page has drawn.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200))
  if (document.readyState === 'complete') idle(load)
  else window.addEventListener('load', () => idle(load), { once: true })
}
