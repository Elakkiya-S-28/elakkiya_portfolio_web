'use client'

import { useEffect } from 'react'
import Lenis from './nativeScroll'
import { scrollState } from './scrollState'

// The director: one scroll listener publishes every value the 3D scene and
// the chrome need into scrollState — act progress, per-section reveal ramps,
// the pointer, the spine fill and the nav highlight. Nothing here renders;
// it is pure choreography wiring.
//
// DOM order == act order. The contact act publishes scrollState.finale; the
// others publish into scrollState.targets. Approach is DOM-only (no act of
// its own — the camera simply pulls back through it).
const SECTIONS = ['hero', 'about', 'experience', 'skills', 'projects', 'approach', 'contact']
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// Expo ease-out: fast start, silky stop — much more cinematic than linear.
const expoEaseOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useScrollDirector() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // `Lenis` here is lib/nativeScroll — a passive wrapper over the browser's
    // own scroll. It never intercepts the wheel or touch, never re-drives
    // scrollTop and never calls preventDefault, so the page stays natively
    // scrollable at all times; the 3D scene simply *reacts* to the position.
    // The only remaining job is calling the (empty) raf so the `on('scroll')`
    // subscription keeps its expected call surface.
    let lenis = null
    let rafId = 0
    if (!reduced) {
      lenis = new Lenis({ duration: 1.6, easing: expoEaseOut })
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

      // Wider ramp window (0.85 vh) = longer crossfade between acts.
      // Acts blend into each other cinematically rather than switching.
      const ramp = (el, inAt = 0.88, outAt = 0.28) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        const on = clamp01((vh * inAt - r.top) / (vh * 0.85))
        const off = clamp01((r.bottom - vh * outAt) / (vh * 0.85))
        return Math.min(on, off)
      }

      const [hero, about, experience, skills, projects, approach, contact] = els
      const t = scrollState.targets
      t.hero = ramp(hero)
      t.about = ramp(about)
      t.experience = ramp(experience)
      t.skills = ramp(skills)
      t.projects = ramp(projects)

      // The hero composition stays parked through the About act (its copy
      // keeps the left rail while the phone drifts behind it), then it is
      // gone once the Experience timeline takes the stage.
      const expTop = experience ? experience.getBoundingClientRect().top : 0
      const expOn = clamp01((vh * 0.85 - expTop) / (vh * 0.85))
      t.hero = Math.min(t.hero, 1 - expOn)
      // HeroCluster listens on `phone`, an alias of the hero ramp — kept
      // separate so the two acts can diverge later without re-wiring.
      t.phone = t.hero

      // projects ramp is a plain reveal; pfan is the section's own scroll
      // progress (0 at entry → 1 at exit) and scrubs the 3D card fan apart
      const projR = projects ? projects.getBoundingClientRect() : null
      if (projR) {
        t.projects = clamp01((vh * 0.85 - projR.top) / (vh * 0.85))
        scrollState.pfan = clamp01((vh - projR.top) / Math.max(1, projR.height - vh * 0.35))
      }

      // experience timeline fill: how far the section has travelled past the
      // viewport middle, 0..1 — drives .timeline__fill and the 3D beam
      const timelineFill = document.getElementById('timelineFill')
      if (timelineFill && experience) {
        const r = experience.getBoundingClientRect()
        const k = clamp01((vh * 0.7 - r.top) / Math.max(1, r.height * 0.9))
        timelineFill.style.height = `${(k * 100).toFixed(1)}%`
        scrollState.timeline = k
      }

      // contact finale: gentle wide ramp so the orb builds slowly
      if (contact) {
        const r = contact.getBoundingClientRect()
        scrollState.finale = clamp01((vh - r.top) / (r.height + vh * 0.5))
      }

      // continuous act position 0..7 for the camera rig (raw fraction — the
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

      // nav highlight by target id, not index. Home is the hero band; About,
      // Experience, Skills, Projects and Contact are direct matches.
      const activeId = els[k] ? els[k].id : null
      navLinks.forEach((a2) => {
        const target = (a2.getAttribute('href') || '').slice(1)
        const hit =
          target === activeId ||
          (activeId === 'hero' && target === 'about') ||
          (activeId === 'approach' && target === 'projects')
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
      if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: expoEaseOut })
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      history.replaceState(null, '', anchor.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    // ---------------------------------------------------------------------
    // Entrance choreography for the DOM. Anything marked .rise or .veil gets
    // .is-in the first time it enters the viewport (stat counters use the
    // same hook to start counting). This is the DOM half of the brief's
    // numbered entrance — the 3D half is the act ramps above.
    // ---------------------------------------------------------------------
    const reveals = Array.from(document.querySelectorAll('.rise, .veil, .count'))
    let io = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-in')
            if (entry.target.dataset.count !== undefined) startCount(entry.target)
            io.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      )
      reveals.forEach((el) => io.observe(el))
    } else {
      reveals.forEach((el) => el.classList.add('is-in'))
    }

    // counts a stat up to its data-count value once, on the reveal
    function startCount(el) {
      const to = parseFloat(el.dataset.count || '0')
      const suffix = el.dataset.suffix || ''
      if (reduced) {
        el.textContent = `${to}${suffix}`
        return
      }
      const from = 0
      const dur = 1400
      const t0 = performance.now()
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur)
        const eased = 1 - Math.pow(1 - k, 3)
        el.textContent = `${Math.round(from + (to - from) * eased)}${suffix}`
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    measure()

    return () => {
      cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
      if (io) io.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('click', onClick)
    }
  }, [])
}
