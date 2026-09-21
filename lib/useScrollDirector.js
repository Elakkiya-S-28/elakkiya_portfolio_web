'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollState } from './scrollState'

// The director: one scroll listener publishes every value the 3D scene and
// the chrome need into scrollState — act progress, per-section reveal ramps,
// the pointer, the spine fill and the nav highlight. Nothing here renders;
// it is pure choreography wiring.
//
// DOM order == act order. The contact act publishes scrollState.finale; the
// other five publish into scrollState.targets.
const SECTIONS = ['hero', 'approach', 'work', 'toolkit', 'experience', 'contact']

const clamp01 = (v) => Math.max(0, Math.min(1, v))

export function useScrollDirector() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Buttery wheel smoothing on desktop (native scroll stays untouched for
    // reduced motion). The ramps below read window scroll either way, so the
    // choreography is identical.
    let lenis = null
    let rafId = 0
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const els = SECTIONS.map((id) => document.getElementById(id))
    const spineFill = document.getElementById('spineFill')
    const navLinks = Array.from(document.querySelectorAll('.bar__links a'))

    let frame = 0
    function measure() {
      frame++
      const vh = window.innerHeight
      const doc = document.documentElement
      const y = window.scrollY
      const maxY = Math.max(1, doc.scrollHeight - vh)

      scrollState.p = clamp01(y / maxY)
      scrollState.narrow = window.innerWidth < 900
      if (spineFill && frame % 2 === 0) {
        spineFill.style.height = `${(scrollState.p * 100).toFixed(2)}%`
      }

      // generic band ramp: a section's target rises as it enters and falls
      // as it leaves, so each visual act hands over to the next one cleanly
      const ramp = (el, inAt = 0.92, outAt = 0.3) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        const on = clamp01((vh * inAt - r.top) / (vh * 0.6))
        const off = clamp01((r.bottom - vh * outAt) / (vh * 0.6))
        return Math.min(on, off)
      }

      const [hero, approach, work, toolkit, experience, contact] = els
      const t = scrollState.targets
      t.arch = ramp(hero)
      t.journey = ramp(approach)
      t.lattice = ramp(toolkit)
      t.timeline = ramp(experience)

      // The lead device is the hero's visual centerpiece and stays through
      // the whole Work act (its screen swaps as you pass the projects), then
      // sinks away once Toolkit takes the stage.
      const heroTop = hero ? hero.getBoundingClientRect().top : vh
      const heroOn = clamp01((vh * 0.92 - heroTop) / (vh * 0.6))
      const workOff = work
        ? clamp01((work.getBoundingClientRect().bottom - vh * 0.3) / (vh * 0.6))
        : 0
      t.phone = Math.min(heroOn, workOff)

      // continuous 0..1 through the Work band → phone screen swap index
      if (work) {
        const r = work.getBoundingClientRect()
        scrollState.work = clamp01((vh * 0.55 - r.top) / Math.max(1, r.height - vh * 0.4))
      }

      // contact finale: rises while the band scrolls into view
      if (contact) {
        const r = contact.getBoundingClientRect()
        scrollState.finale = clamp01((vh - r.top) / (r.height + vh * 0.35))
      }

      // continuous act position 0..6 for the camera rig (raw fraction — the
      // rig smoothsteps and damps it, so this can stay cheap and exact)
      const switchY = vh * 0.42
      let k = 0
      for (let i = 0; i < els.length; i++) {
        if (els[i] && els[i].getBoundingClientRect().top <= switchY) k = i
      }
      let frac = 1
      if (k < els.length - 1 && els[k + 1]) {
        const a = els[k].getBoundingClientRect().top
        const b = els[k + 1].getBoundingClientRect().top
        frac = clamp01((switchY - a) / Math.max(1, b - a))
      }
      scrollState.act = k + frac

      // nav highlight by target id, not index: the nav is a subset of the
      // sections (no link for #approach) and Home targets #hero. Home stays
      // lit through the approach act — the journey is still the intro.
      const activeId = els[k] ? els[k].id : null
      navLinks.forEach((a2) => {
        const target = (a2.getAttribute('href') || '').slice(1)
        const hit =
          target === activeId ||
          (activeId === 'hero' && target === 'top') ||
          (activeId === 'approach' && target === 'hero')
        a2.classList.toggle('is-here', hit)
      })
    }

    let ticking = false
    const schedule = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        measure()
      })
    }
    if (lenis) lenis.on('scroll', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    const onPointer = (e) => {
      scrollState.mx = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.my = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    // smooth anchor navigation without a reload (Home button, nav, CTAs)
    const onClick = (e) => {
      const anchor = e.target.closest && e.target.closest('a[href^="#"]')
      if (!anchor || anchor.classList.contains('skip')) return
      const id = (anchor.getAttribute('href') || '').slice(1)
      const el = id && document.getElementById(id)
      if (!el) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(el, { duration: 1.35 })
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      history.replaceState(null, '', anchor.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    measure()

    return () => {
      cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('click', onClick)
    }
  }, [])
}

