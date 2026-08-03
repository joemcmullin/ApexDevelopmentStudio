import React from 'react'
import ReactDOM from 'react-dom/client'
import { LegalPage } from './components/LegalPage.jsx'
import './index.css'

/**
 * Privacy policy.
 *
 * Written to be accurate rather than reassuring. The site really does make
 * third-party requests — Google Fonts, Web3Forms, GitHub Pages logging — and
 * a policy that claimed "nothing leaves your device, full stop" would be
 * false. Those are disclosed plainly below.
 */
const SECTIONS = [
  {
    h: 'THE SHORT VERSION',
    body: [
      'We do not run analytics. We do not embed advertising or tracking SDKs. We do not sell, rent, or share your personal information with anyone, and we never have.',
      'What our apps record about your life stays on your device. If it syncs, it syncs through your own iCloud account, which we cannot read. We do not operate a server that holds your data, because we do not want one.',
    ],
  },
  {
    h: 'WHAT OUR APPS COLLECT',
    body: [
      'Everything you enter into an Apex app — weights, injections, lab results, photos, notes, readings, schedules — is written to storage on your own device.',
      'Where an app offers sync, it uses Apple CloudKit and your personal iCloud account. That data is held in your iCloud, under your Apple Account, governed by Apple’s terms. We have no access to it and no ability to retrieve it for you.',
      'Where an app reads health data, it does so through Apple HealthKit with permission you grant explicitly and can revoke at any time in the Health app. Health data is never transmitted off your device by us, and is never used for advertising.',
      'We do not receive a copy of any of this. If you delete the app, the on-device data goes with it.',
    ],
  },
  {
    h: 'WHAT THIS WEBSITE COLLECTS',
    body: [
      'This site sets no advertising or analytics cookies. It does, however, involve a few third parties, and you should know about them:',
      [
        'Hosting — the site is served by GitHub Pages. GitHub records standard web server information, including IP addresses, as described in the GitHub Privacy Statement.',
        'Fonts — typefaces load from Google Fonts, which means your browser makes a request to Google servers and Google receives your IP address.',
        'Contact form — if you send us a message, your name, email address, chosen subject and message are transmitted through Web3Forms, which relays them to our inbox. We use that information only to reply to you.',
        'Theme preference — your light/dark choice is stored in your browser’s local storage. It never leaves your browser and is not used to identify you.',
      ],
    ],
  },
  {
    h: 'PURCHASES AND SUBSCRIPTIONS',
    body: [
      'All purchases are processed by Apple through the App Store. We never see your card number, billing address, or any payment credential.',
      'For apps with subscriptions we use RevenueCat to know whether a subscription is currently active. RevenueCat receives a pseudonymous identifier and purchase status, not your name, email, or payment details.',
    ],
  },
  {
    h: 'CHILDREN',
    body: [
      'Our apps are not directed at children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided us information, write to us and we will address it.',
    ],
  },
  {
    h: 'YOUR RIGHTS',
    body: [
      'Because we do not hold your app data, most access and deletion requests are things you can carry out yourself: delete the app, or manage the data in iCloud and the Health app.',
      'For anything we do hold — correspondence you have sent us — you may ask what we have, ask for a copy, or ask us to delete it. Write to support@apexdevelopmentstudio.com and we will action it. Depending on where you live you may have additional rights under laws such as the GDPR or CCPA; we honour those requests regardless of where you live.',
    ],
  },
  {
    h: 'CHANGES',
    body: [
      'If this policy changes materially we will update the date at the top of this page and, where the change is significant, note it in the affected app’s release notes.',
    ],
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LegalPage
      title="PRIVACY"
      updated="3 August 2026"
      lede="Apex Development Studio LLC builds applications that keep your information on your own device. This page explains exactly what that means, what the few exceptions are, and who else is involved when you use this website."
      sections={SECTIONS}
    />
  </React.StrictMode>,
)
