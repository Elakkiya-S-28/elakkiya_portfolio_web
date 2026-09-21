'use client'

import { useState } from 'react'

const SKILL_CATEGORIES = [
  {
    id: 'all',
    label: 'All Skills',
  },
  {
    id: 'mobile',
    label: 'Mobile & Native',
  },
  {
    id: 'frontend',
    label: 'Frontend & Web',
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
  },
  {
    id: 'data',
    label: 'State & Databases',
  },
  {
    id: 'tooling',
    label: 'Testing & DevOps',
  },
]

const SKILLS_DATA = [
  {
    category: 'mobile',
    name: 'React Native',
    tag: 'Core Focus',
    sub: 'iOS & Android cross-platform architecture, 60fps animations, Hermes engine, JSI',
    highlight: true,
  },
  {
    category: 'mobile',
    name: 'Swift / Kotlin',
    tag: 'Native Bridges',
    sub: 'Native modules, platform APIs, background tasks, watchOS companion integration',
    highlight: true,
  },
  {
    category: 'frontend',
    name: 'React / Next.js',
    tag: 'Web Platform',
    sub: 'React 18, Next.js App Router, SSR, SSG, performant component design systems',
    highlight: true,
  },
  {
    category: 'frontend',
    name: 'TypeScript / JavaScript',
    tag: 'Language',
    sub: 'Strong typing, modern ESNext, strict type safety across full application stack',
    highlight: true,
  },
  {
    category: 'backend',
    name: 'REST APIs / Axios',
    tag: 'Networking',
    sub: 'Robust HTTP client architectures, retry interceptors, offline queues, DTO typing',
    highlight: true,
  },
  {
    category: 'backend',
    name: 'NestJS / Express',
    tag: 'Backend',
    sub: 'Modular microservices, controller/service patterns, authentication, rate limiting',
    highlight: true,
  },
  {
    category: 'data',
    name: 'Redux / RTK / Saga',
    tag: 'State Management',
    sub: 'Redux Toolkit, Redux Saga side-effects, normalized caching, slice architecture',
    highlight: true,
  },
  {
    category: 'data',
    name: 'SQLite / PostgreSQL / SQL',
    tag: 'Storage',
    sub: 'Local encrypted relational storage for offline settlement, PostgreSQL schemas, indexing',
    highlight: true,
  },
  {
    category: 'tooling',
    name: 'Git / Jest',
    tag: 'Quality & CI',
    sub: 'Unit testing, React Native Testing Library, Git workflows, PR reviews, CI pipelines',
    highlight: true,
  },
  {
    category: 'tooling',
    name: 'Xcode & Android Studio',
    tag: 'Tooling',
    sub: 'Native compilation, simulator profiling, Gradle, CocoaPods, App Store submissions',
  },
  {
    category: 'backend',
    name: 'Firebase & Postman',
    tag: 'Services',
    sub: 'Cloud messaging, real-time sync, auth rules, API contract testing and mock servers',
  },
  {
    category: 'frontend',
    name: 'Figma to Code',
    tag: 'Design Systems',
    sub: 'Pixel-accurate token extraction, responsive layouts, micro-animations, glassmorphism',
  },
]

export default function Toolkit() {
  const [filter, setFilter] = useState('all')

  const visibleSkills = filter === 'all'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === filter)

  return (
    <section className="band zig-r" id="skills">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow rise">TECH STACK</p>
          <h2 className="rise">Technical Expertise</h2>
          <p className="rise">
            A dedicated 3D ecosystem of mobile, web, native, and backend technologies engineered for production.
          </p>
        </div>

        {/* Category Pills */}
        <div className="skills-filter rise">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill${filter === cat.id ? ' is-active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of structured skill cards */}
        <div className="skills-grid rise">
          {visibleSkills.map((s) => (
            <div key={s.name} className={`skill-card${s.highlight ? ' skill-card--featured' : ''}`}>
              <div className="skill-card__header">
                <span className="skill-card__name">{s.name}</span>
                <span className="skill-card__tag">{s.tag}</span>
              </div>
              <p className="skill-card__sub">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
