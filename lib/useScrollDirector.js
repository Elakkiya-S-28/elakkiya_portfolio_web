'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Lenis from 'lenis'
import { scrollState } from './scrollState'

gsap.registerPlugin(ScrollTrigger)

const smooth = (v) => v * v * (3 - 2 * v)
const ramp = (p) => smooth(Math.max(0, Math.min(1, Math.min(p / 0.22, (1 - p) / 0.22))))

// Section id -> which act it drives, and whether that act should never fully
// hide (the hero colonnade stays faintly present behind every later act).
const SECTION_MAP = [
  { id: 'hero', key: 'arch', hold: true },
  { id: 'approach', key: 'journey' },
  { id: 'work', key: 'phone' },
  { id: 'toolkit', key: 'lattice' },
  { id: 'experience', key: 'timeline' },
  { id: 'contact', key: null },
]

/**
 * Wires Lenis (smooth scroll) to GSAP ScrollTrigger, and ScrollTrigger to the
 * shared `scrollState` object the 3D scene reads from. Also drives the
 * existing --accent CSS variable travel and the spine fill, exactly as the
 * single-file version did, plus nav "is-here" highlighting and click-to-scroll.
 * Call this once from a top-level client component.
 */
export function useScrollDirector() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    const spineFill = document.getElementById('spineFill')
    const navLinks = Array.from(document.querySelectorAll('.bar__links a'))

    let lenis
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((t) => lenis.raf(t * 1000))
      gsap.ticker.lagSmoothing(0)

      const onClick = (e) => {
        const href = e.currentTarget.getAttribute('href')
        const el = href && document.querySelector(href)
        if (!el) return
        e.preventDefault()
        lenis.scrollTo(el, { offset: -64, duration: 1.4 })
      }
      const anchors = Array.from(document.querySelectorAll('a[href^="#"]'))
      anchors.forEach((a) => a.addEventListener('click', onClick))
      var cleanupAnchors = () => anchors.forEach((a) => a.removeEventListener('click', onClick))
    }

    // page-wide progress -> accent hue travel + spine fill
    const master = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        scrollState.p = p
        const hue = 275 - p * 220
        const chroma = 0.1 + p * 0.05
        root.style.setProperty('--accent', `oklch(${(80 + p * 4).toFixed(2)}% ${chroma.toFixed(3)} ${hue.toFixed(1)})`)
        if (spineFill) spineFill.style.height = `${(p * 100).toFixed(2)}%`
      },
    })

    // per-section triggers -> act reveal targets + nav highlighting
    const triggers = SECTION_MAP.map(({ id, key, hold }, i) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (key) scrollState.targets[key] = hold ? Math.max(0.35, ramp(self.progress)) : ramp(self.progress)
          if (id === 'work') scrollState.work = self.progress
          if (id === 'contact') scrollState.finale = smooth(Math.max(0, Math.min(1, self.progress * 1.6)))

          let here = -1
          SECTION_MAP.forEach((s, j) => {
            const sEl = document.getElementById(s.id)
            if (sEl && sEl.getBoundingClientRect().top <= window.innerHeight * 0.4) here = j
          })
          navLinks.forEach((a, j) => a.classList.toggle('is-here', j === here))
        },
      })
    }).filter(Boolean)

    // pointer parallax
    const onMove = (e) => {
      scrollState.mx = (e.clientX / window.innerWidth - 0.5) * 2
      scrollState.my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      master.kill()
      triggers.forEach((t) => t.kill())
      if (!reduced) {
        window.removeEventListener('pointermove', onMove)
        cleanupAnchors && cleanupAnchors()
        lenis && lenis.destroy()
      }
    }
  }, [])
}
