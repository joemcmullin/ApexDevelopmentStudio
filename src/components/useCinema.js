import { useEffect, useRef, useState } from 'react'

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** Remap v from [inA,inB] into [outA,outB], clamped at both ends. */
export const remap = (v, inA, inB, outA = 0, outB = 1) =>
  outA + (outB - outA) * clamp((v - inA) / (inB - inA))

/** Cheap ease for arrival/settle moves. */
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * The camera.
 *
 * Returns a *smoothed* scroll position measured in "acts", where 1.0 == one
 * full act travelled. The smoothing is the whole trick: raw scrollY snaps to
 * wheel deltas and reads as mechanical, while a per-frame lerp toward the
 * target gives the weighted, gliding dolly that makes this feel cinematic.
 *
 * Consumers read `ref.current` inside their own rAF/style pass rather than
 * through React state — re-rendering the tree at 60fps would defeat it.
 */
export function useCinema(actHeightVh, enabled = true) {
  const progress = useRef(0)   // smoothed, in acts
  const target = useRef(0)     // raw, in acts
  const velocity = useRef(0)   // acts/frame — drives motion blur + parallax lean

  /**
   * Snap the camera to wherever the page currently is, with no glide.
   *
   * Both refs must be set together. Setting `progress` alone leaves `target`
   * holding the OLD position, and the next frame immediately lerps back
   * toward it — so a jump to the top would fly the whole journey in reverse
   * until the scroll event lands and corrects `target`.
   */
  const snap = useRef(() => {})
  snap.current = () => {
    const actPx = (actHeightVh / 100) * window.innerHeight
    target.current = window.scrollY / actPx
    progress.current = target.current
    velocity.current = 0
  }

  useEffect(() => {
    if (!enabled) {
      progress.current = 0
      return
    }
    let raf
    const actPx = () => (actHeightVh / 100) * window.innerHeight

    const read = () => {
      target.current = window.scrollY / actPx()
    }

    const tick = () => {
      const prev = progress.current
      // Critically damped feel: fast enough to track, slow enough to glide.
      progress.current += (target.current - progress.current) * 0.085
      velocity.current = progress.current - prev
      raf = requestAnimationFrame(tick)
    }

    read()
    progress.current = target.current
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [actHeightVh, enabled])

  return { progress, velocity, snap }
}
