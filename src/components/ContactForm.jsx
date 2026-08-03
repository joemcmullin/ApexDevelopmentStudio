import { useState } from 'react'

/**
 * Contact form — same Web3Forms endpoint and access key as the site this
 * replaces, so submissions keep arriving in the same inbox with the same
 * subject format. The key is public by design for Web3Forms; it is not a
 * secret and carries no account access.
 */
const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = 'dc20b60f-c2b1-42d8-aaca-3baac1ec76d0'

const TOPICS = [
  ['business', 'Business Inquiry'],
  ['press', 'Press / Media'],
  ['partnership', 'Partnership'],
  ['other', 'Other'],
]

export function ContactForm() {
  const [status, setStatus] = useState(null) // {type:'error'|'success', msg}
  const [sending, setSending] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = (f.get('name') || '').trim()
    const email = (f.get('email') || '').trim()
    const inquiryType = f.get('inquiry_type') || ''
    const message = (f.get('message') || '').trim()

    if (!name || !email || !inquiryType || !message) {
      setStatus({ type: 'error', msg: 'Please fill in every field before sending.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', msg: 'Please enter a valid email address.' })
      return
    }

    setSending(true)
    setStatus(null)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `[${inquiryType}] Message from ${name}`,
          name, email, inquiry_type: inquiryType, message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: 'success', msg: 'Message sent. We will be in touch soon.' })
        e.target.reset()
      } else {
        setStatus({ type: 'error', msg: data.message || 'Submission failed.' })
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `Network error: ${err.message}` })
    } finally {
      setSending(false)
    }
  }

  const field =
    'w-full px-3.5 py-2.5 text-[0.9rem] rounded-xl outline-none transition-colors'
  const fieldStyle = {
    background: 'var(--bg-card)',
    border: '2px solid var(--panel-border)',
    color: 'var(--text-hi)',
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[520px]">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase"
                style={{ color: 'var(--text-lo)' }}>Name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Your name"
                 className={`${field} mt-1.5`} style={fieldStyle} />
        </label>
        <label className="block">
          <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase"
                style={{ color: 'var(--text-lo)' }}>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com"
                 className={`${field} mt-1.5`} style={fieldStyle} />
        </label>
      </div>

      <label className="block mt-3">
        <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase"
              style={{ color: 'var(--text-lo)' }}>Subject</span>
        <select name="inquiry_type" defaultValue="" className={`${field} mt-1.5`} style={fieldStyle}>
          <option value="" disabled>Select a topic…</option>
          {TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>

      <label className="block mt-3">
        <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase"
              style={{ color: 'var(--text-lo)' }}>Message</span>
        <textarea name="message" rows={4} placeholder="Tell us about your inquiry…"
                  className={`${field} mt-1.5 resize-y`} style={fieldStyle} />
      </label>

      <button type="submit" disabled={sending}
              className="ink-btn mt-4 px-7 py-3 display text-[1.1rem] tracking-[0.1em]"
              style={{ background: 'var(--coral)', color: '#fff', opacity: sending ? 0.7 : 1 }}>
        {sending ? 'SENDING…' : 'SEND MESSAGE'}
      </button>

      {status && (
        <p role="status" aria-live="polite"
           className="mt-3 text-[0.85rem] font-medium"
           style={{ color: status.type === 'error' ? 'var(--coral)' : '#3f7a4a' }}>
          {status.msg}
        </p>
      )}
    </form>
  )
}
