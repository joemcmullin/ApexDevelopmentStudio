#!/usr/bin/env node
// ─── Pre-deploy security gate (written by ApexSuite) ─────────────────────────
// Runs in GitHub Actions before a site deploys. Reads the npm audit, gitleaks
// and Semgrep reports, applies the exceptions accepted in ApexSuite
// (.github/security/exceptions.json), and fails on any open critical or high
// finding, so the deploy job never starts.
//
// Do not edit this copy: it is replaced by `npm run site:security -- --sync-ci`
// in ApexSuite (server/security/ci/gate.mjs).
//
//   node .github/security/gate.mjs <reports-dir>
//     <reports-dir>/npm-audit.json   optional (absent when the repo has no package-lock.json)
//     <reports-dir>/gitleaks.json    required
//     <reports-dir>/semgrep.json     required
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const BLOCKS = new Set(['critical', 'high'])
const NPM = { critical: 'critical', high: 'high', moderate: 'medium', low: 'low' }
const SEMGREP = { ERROR: 'high', WARNING: 'medium', INFO: 'low' }

/** Pure: every finding with its severity and whether an exception covers it. */
export function decide({ npm = null, gitleaks, semgrep, exceptions = {}, today, root = '' }) {
  const rows = []
  if (npm?.error) throw new Error(`npm audit failed: ${npm.error.summary ?? 'unknown error'}`)
  const npmEx = (exceptions.npm ?? []).filter(e => e.review >= today)
  for (const [key, v] of Object.entries(npm?.vulnerabilities ?? {})) {
    const severity = NPM[v.severity]
    if (!severity) continue
    const name = v.name ?? key
    const ex = severity === 'critical' ? null : npmEx.find(e => e.packages.includes(name))
    rows.push({ tool: 'npm audit', severity, title: name, where: 'package-lock.json', accepted: ex ? `exception, review ${ex.review}` : null })
  }
  if (!Array.isArray(gitleaks)) throw new Error('gitleaks report missing')
  for (const f of gitleaks) rows.push({ tool: 'gitleaks', severity: 'high', title: `Possible ${f.RuleID ?? 'secret'}`, where: `${f.File}${f.StartLine ? `:${f.StartLine}` : ''}`, accepted: null })
  if (!semgrep || !Array.isArray(semgrep.results)) throw new Error('Semgrep report missing')
  const semEx = exceptions.semgrep ?? []
  for (const r of semgrep.results) {
    const file = root && r.path.startsWith(root) ? r.path.slice(root.length).replace(/^\/+/, '') : r.path.replace(/^\.\//, '')
    const ex = semEx.find(e => e.rule === r.check_id && e.path === file)
    rows.push({ tool: 'semgrep', severity: SEMGREP[r.extra?.severity] ?? 'low', title: r.check_id.split('.').slice(-1)[0].replace(/-/g, ' '), where: `${file}${r.start?.line ? `:${r.start.line}` : ''}`, accepted: ex ? 'accepted in ApexSuite' : null })
  }
  const blocking = rows.filter(r => BLOCKS.has(r.severity) && !r.accepted)
  return { rows, blocking, pass: blocking.length === 0 }
}

export function summary(result) {
  const count = s => result.rows.filter(r => r.severity === s && !r.accepted).length
  const lines = [
    `## Security gate: ${result.pass ? 'passed' : 'blocked'}`,
    '',
    `Open: ${count('critical')} critical, ${count('high')} high, ${count('medium')} medium, ${count('low')} low. Accepted: ${result.rows.filter(r => r.accepted).length}.`,
  ]
  if (result.blocking.length) {
    lines.push('', '| Severity | Tool | Finding | Where |', '|---|---|---|---|')
    for (const r of result.blocking) lines.push(`| ${r.severity} | ${r.tool} | ${r.title} | ${r.where} |`)
    lines.push('', 'Fix these, or accept them in ApexSuite › Operations › Security and run `npm run site:security -- --sync-ci`.')
  }
  return lines.join('\n')
}

function main() {
  const dir = process.argv[2] ?? '.'
  const read = (f, optional = false) => {
    const p = path.join(dir, f)
    if (!fs.existsSync(p)) { if (optional) return null; throw new Error(`${f} missing`) }
    return JSON.parse(fs.readFileSync(p, 'utf8') || 'null')
  }
  const exFile = path.join(path.dirname(new URL(import.meta.url).pathname), 'exceptions.json')
  const exceptions = fs.existsSync(exFile) ? JSON.parse(fs.readFileSync(exFile, 'utf8')) : {}
  const result = decide({ npm: read('npm-audit.json', true), gitleaks: read('gitleaks.json') ?? [], semgrep: read('semgrep.json'), exceptions, today: new Date().toISOString().slice(0, 10), root: process.cwd() })
  const text = summary(result)
  console.log(text)
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`)
  for (const r of result.blocking) console.log(`::error title=${r.severity} ${r.tool}::${r.title} (${r.where})`)
  process.exit(result.pass ? 0 : 1)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try { main() } catch (e) { console.log(`::error title=Security gate could not run::${e instanceof Error ? e.message : e}`); process.exit(1) }
}
