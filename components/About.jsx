'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { n: 3, suffix: '+', label: 'Years building' },
  { n: 6, suffix: '', label: 'Projects shipped' },
  { n: 2, suffix: '', label: 'Internships → roles' },
  { n: 2, suffix: '', label: 'App stores, live' },
]

function useCountUp(target, on) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    let raf
    const t0 = performance.now()
    const dur = 1400
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - k, 3)
      setV(Math.round(target * e))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, target])
  return v
}

function Stat({ n, suffix, label, on }) {
  const v = useCountUp(n, on)
  return (
    <div className="stat rise">
      <dt>{label}</dt>
      <dd>{v}{suffix}</dd>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const seen = useRef(false)
  const [on, setOn] = useState(false)

  // counters run once, the first time the band is a third visible
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.current) {
            seen.current = true
            setOn(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="band about zig-r" id="about" ref={ref}>
      <div className="wrap">
        <p className="eyebrow rise">ABOUT</p>
        <h2 className="rise">I build digital experiences that <em>feel alive</em>.</h2>
        <p className="about__lede rise">
          3+ years bridging <strong>Mobile, Web, and Backend</strong> systems — shipping software that thrives in production: from hospital appointment booking and offline digital rupee payments to visual personal finance engines.
        </p>

        <div className="pillars rise">
          <div className="pillar">
            <span className="pillar__icon">📱</span>
            <h3>Mobile Engineering</h3>
            <p>React Native · Swift · Kotlin · watchOS. 60fps animations, offline-first sync, and native bridges.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon">💻</span>
            <h3>Web Applications</h3>
            <p>React · Next.js · TypeScript. Production web applications with fluid interactions and responsive design.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon">⚙️</span>
            <h3>APIs &amp; Systems</h3>
            <p>REST APIs · NestJS · Express · SQLite · PostgreSQL. Secure data contracts and resilient offline settlements.</p>
          </div>
        </div>

        <dl className="stats">
          {STATS.map((s) => (
            <Stat key={s.label} n={s.n} suffix={s.suffix} label={s.label} on={on} />
          ))}
        </dl>
      </div>
    </section>
  )
}
