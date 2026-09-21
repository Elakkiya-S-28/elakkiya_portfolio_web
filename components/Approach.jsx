'use client'

import { useState } from 'react'

const PIPELINE_STEPS = [
  {
    num: '01',
    step: 'Idea',
    title: 'Product Vision & User Flows',
    desc: 'Translating problem statements and requirements into explicit information architecture, journey maps, and edge-case definitions before writing code.',
    highlight: 'Architecture & Scoping',
  },
  {
    num: '02',
    step: 'UI/UX',
    title: 'Design Systems & Tokens',
    desc: 'Translating Figma designs into pixel-accurate component tokens, fluid spacing grids, typographic hierarchies, and micro-interaction states.',
    highlight: 'Figma to Code',
  },
  {
    num: '03',
    step: 'React / RN',
    title: 'Cross-Platform Core',
    desc: 'Developing composable, clean components in React Native and React/Next.js with memoization, 60fps gesture physics, and clean separation of concerns.',
    highlight: 'Component Lifecycle',
  },
  {
    num: '04',
    step: 'API',
    title: 'Contract & Networking',
    desc: 'Architecting typed Axios client interfaces, robust error handling, automated retry policies, and JWT token refresh mechanisms.',
    highlight: 'REST & DTOs',
  },
  {
    num: '05',
    step: 'State',
    title: 'State Architecture',
    desc: 'Structuring state with Redux Toolkit and Saga for complex workflows, optimistic UI updates, and cached normalization that survives reboots.',
    highlight: 'RTK & Offline Sync',
  },
  {
    num: '06',
    step: 'Database',
    title: 'Local & Cloud Storage',
    desc: 'Designing relational schemas in SQLite for offline encrypted data on devices and PostgreSQL behind NestJS for cloud sync and integrity.',
    highlight: 'SQLite & PostgreSQL',
  },
  {
    num: '07',
    step: 'Native',
    title: 'Native Integrations',
    desc: 'Writing native iOS (Swift) and Android (Kotlin) bridges for biometric sensors, NFC payments, background scheduling, and watchOS apps.',
    highlight: 'Swift & Kotlin',
  },
  {
    num: '08',
    step: 'Testing',
    title: 'Verification & Quality',
    desc: 'Writing unit tests with Jest, integration tests with React Native Testing Library, and validating memory consumption and frame rates.',
    highlight: 'Jest & Unit Tests',
  },
  {
    num: '09',
    step: 'Production',
    title: 'Release & Monitoring',
    desc: 'Deploying to the Apple App Store, Google Play, and web hosting with automated CI/CD pipelines, crash reporting, and user telemetry.',
    highlight: 'App Store & Web CI',
  },
]

export default function Approach() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="band zig-r" id="approach">
      <div className="wrap approach-section">
        <div className="head">
          <p className="eyebrow rise">ENGINEERING METHODOLOGY</p>
          <h2 className="rise">From Idea to Production</h2>
          <p className="rise">
            A battle-tested 9-stage engineering pipeline that takes products from initial spark to millions of operations in production.
          </p>
        </div>

        {/* The 9-stage animated flow pipeline */}
        <div className="pipeline-flow rise">
          {PIPELINE_STEPS.map((s, idx) => (
            <button
              key={s.step}
              className={`pipeline-node${activeStep === idx ? ' is-active' : ''}`}
              onClick={() => setActiveStep(idx)}
              title={`${s.num} ${s.step}: ${s.title}`}
            >
              <span className="pipeline-node__idx">{s.num}</span>
              <span className="pipeline-node__name">{s.step}</span>
              {idx < PIPELINE_STEPS.length - 1 && (
                <span className="pipeline-connector" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>

        {/* Detail inspection card for selected step */}
        <div className="pipeline-detail rise">
          <div className="pipeline-detail__header">
            <div>
              <span className="pipeline-detail__num">
                STEP {PIPELINE_STEPS[activeStep].num} / 09
              </span>
              <h3>{PIPELINE_STEPS[activeStep].title}</h3>
            </div>
            <span className="pipeline-detail__badge">
              {PIPELINE_STEPS[activeStep].highlight}
            </span>
          </div>
          <p className="pipeline-detail__desc">
            {PIPELINE_STEPS[activeStep].desc}
          </p>
          <div className="pipeline-detail__quote">
            <blockquote>
              I build digital bridges between what people need and what the <em>machine can do</em>.
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
