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
 * privacy.js: the wording of the Privacy policy (/privacy/).
 * ============================================================================
 *
 * WHAT THIS FILE IS
 *   The full text of the privacy policy: the "Last updated" date, the opening
 *   paragraph and each numbered section. src/legal/render.js turns it into
 *   the page when the site is built.
 *   It is written to be accurate rather than reassuring. The site really does
 *   make third-party requests (Web3Forms for the forms, PostHog analytics
 *   and GitHub Pages' server logs), and those are disclosed plainly below.
 *
 * WHERE IT APPEARS
 *   /privacy/, linked from every page footer.
 *
 * HOW TO EDIT
 *   - A section ............ SECTIONS below. Each has a heading (h) and a body
 *                            of paragraphs. A list inside brackets becomes
 *                            bullet points.
 *   - Date and opening ..... PAGE at the bottom (updated, lede).
 *
 * IMPORTANT
 *   Reviewed by an attorney (2026-08-03). Treat the wording as settled.
 *   2026-10-18: added "Clients and our own business records" (client billing
 *   data, the company's own bank feed through Plaid, retention periods) for
 *   Plaid's production review. That section has not yet been attorney-reviewed. The
 *   2026-10-21: PostHog analytics added to the website (see
 *   src/analytics.js). Changed "The short version", the analytics and
 *   browser storage bullets, and the bullet labels' punctuation in "What
 *   this website collects". Not yet attorney-reviewed.
 *   The disclosures track what the site really does, so if its third
 *   parties change (a new font host, a different form service, a change to
 *   what analytics.js collects), this page must be updated with it.
 */

const SECTIONS = [
  {
    h: 'THE SHORT VERSION',
    body: [
      'This website uses PostHog analytics so we can see which pages people read and where the site falls short. We do not use advertising or ad-tracking tools. We do not sell, rent, or share your personal information with anyone, and we never have.',
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
      'This site sets no advertising cookies. It does involve a few third parties, and you should know about them:',
      [
        'Hosting: the site is served by GitHub Pages. GitHub records standard web server information, including IP addresses, as described in the GitHub Privacy Statement.',
        'Contact form: if you send us a message, your name, email address, chosen subject and message are transmitted through Web3Forms, which relays them to our inbox. We use that information only to reply to you. The “Start a project” form works the same way and also sends the details you choose to share about your idea, such as its platforms, stage, timeline and budget.',
        'Analytics: we use PostHog to understand how visitors use this site. PostHog records the pages you view, how far you scroll, where you click, how fast pages load, any errors you run into, and your general location (country and city), which it works out from your IP address. It also records visits as session replays so we can see where the site is confusing. Everything you type into a form is hidden in those replays, and we never send what you write to PostHog. We use this only to improve the site, never for advertising. If your browser sends a Do Not Track signal, analytics does not run.',
        'Browser storage: PostHog sets one first-party cookie and uses your browser’s local storage to recognise a returning visitor and keep a visit together. Nothing else on this site stores anything in your browser.',
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
    h: 'CLIENTS AND OUR OWN BUSINESS RECORDS',
    body: [
      'When we do paid work for a client, we keep the client’s name, contact person, email address and postal address so we can send invoices and correspond. Invoices go out by email through Google Workspace, and payments arrive by Zelle or check into our business bank account. We use these details only to bill and work with that client.',
      'We keep our own books in internal software that runs only on our own computer. That software connects our own Wells Fargo business accounts through Plaid so their transactions flow into our books. Plaid only ever sees our company’s accounts. We never connect, request or store the bank accounts of app users, website visitors or clients.',
      'We keep financial records, invoices and client billing details for seven years after the tax year ends, because tax law requires it, and then delete them. Messages from people who did not become clients are deleted after two years. A client may ask what we hold, ask for a copy or ask us to delete it, as described under Your Rights, and we keep only what the law requires us to keep.',
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

export const PAGE = {
  title: 'Privacy',
  updated: '21 October 2026',
  lede: 'Apex Development Studio LLC builds applications that keep your information on your own device. This page explains exactly what that means, what the few exceptions are, and who else is involved when you use this website.',
  sections: SECTIONS,
}
