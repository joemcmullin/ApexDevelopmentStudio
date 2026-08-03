import React from 'react'
import ReactDOM from 'react-dom/client'
import { LegalPage } from './components/LegalPage.jsx'
import './index.css'

/**
 * Terms of service.
 *
 * NOTE FOR THE OWNER: the governing-law section carries a placeholder that
 * must be set to the state Apex Development Studio LLC is registered in
 * before this is relied upon. It is marked clearly in the copy.
 */
const SECTIONS = [
  {
    h: 'AGREEMENT',
    body: [
      'These terms apply to the Apex Development Studio LLC website and to the applications we publish. By using them you agree to what follows. If you do not agree, please do not use them.',
    ],
  },
  {
    h: 'YOUR LICENCE TO USE OUR APPS',
    body: [
      'When you download one of our apps you get a personal, non-exclusive, non-transferable licence to use it on devices you own or control, in line with the App Store Terms of Service. You do not acquire ownership of the software.',
      'You agree not to reverse engineer, decompile, resell, or redistribute our applications, except where that restriction is prohibited by law.',
    ],
  },
  {
    h: 'SUBSCRIPTIONS AND BILLING',
    body: [
      'Some apps offer paid subscriptions or one-time purchases. All billing is handled by Apple through the App Store; we never process your payment details.',
      'Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. You manage and cancel subscriptions in your Apple Account settings, not through us. Refunds are administered by Apple under their policies.',
      'Where a free trial is offered, any unused portion is forfeited if you purchase a subscription during the trial.',
    ],
  },
  {
    h: 'HEALTH AND MEDICAL DISCLAIMER',
    body: [
      'Some of our applications, including Journey Tracker, are tools for recording and reviewing information about your own health. They are not medical devices. They do not diagnose, treat, cure, or prevent any condition, and nothing in them is medical advice.',
      'Never disregard professional medical advice, or delay seeking it, because of something you read in one of our apps. Decisions about medication, dosing, or treatment belong between you and a qualified healthcare provider. If you think you are having a medical emergency, contact emergency services.',
    ],
  },
  {
    h: 'ENTERTAINMENT CONTENT',
    body: [
      'Applications dealing with tarot, astrology, runes, or similar traditions — including Gleaming Beacon — are provided for reflection and entertainment. They are not predictive, and they are not a substitute for professional advice of any kind, whether medical, legal, financial, or psychological.',
    ],
  },
  {
    h: 'ACCEPTABLE USE',
    body: [
      'Please do not use our website or applications to break the law, to interfere with their operation or security, to attempt unauthorised access, or to harass anyone. We may suspend access where necessary to protect the service or other people.',
    ],
  },
  {
    h: 'DISCONTINUED PRODUCTS',
    body: [
      'We sometimes retire an application — ScreenPass, for example, was discontinued once iOS shipped equivalent functionality. Where we do, we will say so publicly. A discontinued app may stop receiving updates and may eventually stop working with newer operating systems. Data already stored on your device remains yours.',
    ],
  },
  {
    h: 'NO WARRANTY',
    body: [
      'Our website and applications are provided “as is” and “as available”, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that they will be uninterrupted, timely, secure, or error-free.',
    ],
  },
  {
    h: 'LIMITATION OF LIABILITY',
    body: [
      'To the fullest extent permitted by law, Apex Development Studio LLC is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or lost data, arising from your use of our website or applications. Where liability cannot be excluded, it is limited to the amount you paid us in the twelve months before the claim.',
      'Some jurisdictions do not allow these exclusions, in which case they apply only to the extent permitted.',
    ],
  },
  {
    h: 'GOVERNING LAW',
    body: [
      'These terms are governed by the laws of the State of [STATE TO BE CONFIRMED], United States, without regard to its conflict-of-law rules. This placeholder must be completed with the state in which Apex Development Studio LLC is registered before these terms are relied upon.',
    ],
  },
  {
    h: 'CHANGES',
    body: [
      'We may update these terms. When we do, the date at the top of this page changes. Continuing to use our website or applications after an update means you accept the revised terms.',
    ],
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LegalPage
      title="TERMS"
      updated="3 August 2026"
      lede="The plain-language agreement between you and Apex Development Studio LLC covering this website and the applications we publish."
      sections={SECTIONS}
    />
  </React.StrictMode>,
)
