#!/usr/bin/env node
// ─── Post-deploy live check (written by ApexSuite) ───────────────────────────
// Runs in GitHub Actions right after a site deploys. Read-only: one HTTPS GET,
// one plain-HTTP GET and one TLS handshake against the site itself.
//
//   fails  certificate expired or expiring within 14 days, or plain HTTP not
//          redirecting to HTTPS (the critical and high live checks)
//   warns  security headers that are missing (these are tracked in ApexSuite)
//   skips  when the host answers with a bot-check page: the full live checks
//          then come from ApexSuite's monthly scan
//
// Do not edit this copy: it is replaced by `npm run site:security -- --sync-ci`
// in ApexSuite (server/security/ci/live-check.mjs).
//
//   node .github/security/live-check.mjs https://example.com [--wait 60]
import fs from 'node:fs'
import tls from 'node:tls'
import { pathToFileURL } from 'node:url'

const UA = 'ApexSuite-SiteSecurity/1.0 (+https://apexdevelopmentstudio.com)'

export const looksLikeBotChallenge = body =>
  /<title>\s*(One moment, please|Just a moment|Attention Required)/i.test(body) || /cf-chl-|challenge-platform|sgcaptcha|wsidchk/i.test(body.slice(0, 20_000))

/** Pure: what the probes saw, turned into failures and warnings. */
export function judge({ certDays, redirectStatus, redirectTo, headers }) {
  const fail = [], warn = []
  if (certDays === null) fail.push('HTTPS certificate could not be read')
  else if (certDays < 0) fail.push('HTTPS certificate has expired')
  else if (certDays < 14) fail.push(`HTTPS certificate expires in ${certDays} days`)
  else if (certDays < 30) warn.push(`HTTPS certificate expires in ${certDays} days`)
  if (!(redirectStatus >= 300 && redirectStatus < 400 && (redirectTo ?? '').startsWith('https://'))) fail.push(`Plain HTTP answered ${redirectStatus} instead of redirecting to HTTPS`)
  const h = k => headers[k] ?? null
  if (!h('strict-transport-security')) warn.push('No Strict-Transport-Security header')
  if (!h('content-security-policy')) warn.push('No Content-Security-Policy header')
  if (!h('x-frame-options') && !/frame-ancestors/i.test(h('content-security-policy') ?? '')) warn.push('No frame protection (X-Frame-Options or frame-ancestors)')
  if ((h('x-content-type-options') ?? '').toLowerCase() !== 'nosniff') warn.push('No X-Content-Type-Options: nosniff')
  if (!h('referrer-policy')) warn.push('No Referrer-Policy header')
  return { fail, warn, pass: fail.length === 0 }
}

const certValidTo = host => new Promise((resolve, reject) => {
  const s = tls.connect({ host, port: 443, servername: host, timeout: 15_000 }, () => { const c = s.getPeerCertificate(); s.end(); c?.valid_to ? resolve(c.valid_to) : reject(new Error('no certificate')) })
  s.on('error', reject)
  s.on('timeout', () => { s.destroy(); reject(new Error('timed out')) })
})

async function main() {
  const url = new URL(process.argv[2])
  const wait = Number(process.argv[process.argv.indexOf('--wait') + 1]) || 0
  if (process.argv.includes('--wait') && wait) await new Promise(r => setTimeout(r, wait * 1000))
  const out = text => { console.log(text); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`) }

  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
  const body = await res.text()
  if (looksLikeBotChallenge(body)) {
    out(`## Live check: skipped\n\n${url.host} answered with its host's bot-check page, so headers and redirects cannot be read from GitHub. ApexSuite's monthly scan covers them.`)
    console.log(`::notice title=Live check skipped::${url.host} answered with a bot-check page`)
    return 0
  }
  const headers = Object.fromEntries([...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]))
  let certDays = null
  try { certDays = Math.floor((Date.parse(await certValidTo(url.hostname)) - Date.now()) / 86_400_000) } catch { /* reported as a failure */ }
  const plain = await fetch(`http://${url.host}/`, { redirect: 'manual', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20_000) })
  const result = judge({ certDays, redirectStatus: plain.status, redirectTo: plain.headers.get('location'), headers })
  out([`## Live check: ${result.pass ? 'passed' : 'failed'}`, '', `${url.href} answered ${res.status}. Certificate: ${certDays ?? '?'} days left.`,
    ...result.fail.map(f => `- **Fail:** ${f}`), ...result.warn.map(w => `- Warn: ${w}`)].join('\n'))
  for (const f of result.fail) console.log(`::error title=Live check::${f}`)
  for (const w of result.warn) console.log(`::warning title=Live check::${w}`)
  return result.pass ? 0 : 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().then(code => process.exit(code)).catch(e => { console.log(`::error title=Live check could not run::${e instanceof Error ? e.message : e}`); process.exit(1) })
}
