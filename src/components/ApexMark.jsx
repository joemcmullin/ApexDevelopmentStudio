/**
 * Brand assets — the studio's real lockup, not a redrawn approximation.
 *
 * `apex-lockup.png` and `Apex-mark.png` are the same files the live site
 * ships. Both are dark ink on transparency, so dark mode inverts them
 * (the live site does exactly this) rather than swapping in a second asset.
 */

/**
 * Two editions of each asset:
 *
 *   `flat`  — the studio's original line art. Dark ink on transparency,
 *             inverted in dark mode. Correct for small sizes and chrome,
 *             where the painted edition turns to mud.
 *   `anime` — a cel-shaded repaint of the SAME geometry (coral-to-gold
 *             gradient, ink outline, sparkle glints), cut out to alpha.
 *             Correct at hero scale, where it belongs to the artwork.
 *
 * `anime` never gets the dark-mode invert — it is already full colour and
 * inverting it would produce a teal logo.
 */

/** Icon only — the compass mark in its ring. */
export function ApexMark({ size = 32, className = '', variant = 'flat' }) {
  const anime = variant === 'anime'
  return (
    <img
      src={anime ? '/apex-mark-anime.png' : '/Apex-mark.png'}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`${anime ? 'brand-anime' : 'brand-ink'} ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

/** Full lockup — mark + "Apex" + "DEVELOPMENT · STUDIO". */
export function Lockup({ width = 260, className = '', variant = 'flat' }) {
  const anime = variant === 'anime'
  return (
    <img
      src={anime ? '/apex-lockup-anime.png' : '/apex-lockup.png'}
      alt="Apex Development Studio"
      width={width}
      height={Math.round(width * (anime ? 678 / 1600 : 880 / 3200))}
      className={`${anime ? 'brand-anime' : 'brand-ink'} ${className}`}
      style={{ width, height: 'auto', objectFit: 'contain' }}
    />
  )
}

/** Hero treatment — the painted edition, at full presence. */
export function HeroLockup() {
  return <Lockup width={400} variant="anime" className="hero-lockup" />
}
