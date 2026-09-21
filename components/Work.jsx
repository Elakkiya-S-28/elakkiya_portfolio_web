'use client'

import dynamic from 'next/dynamic'

// The 3D device stage touches window/WebGL — client only.
const DeviceStage = dynamic(() => import('@/canvas/DeviceStage'), { ssr: false })

const PROJECTS = [
  {
    tag: 'Healthcare',
    meta: 'React Native · in production',
    title: 'Aayush',
    what: 'Patient app for booking, rescheduling and managing doctor appointments.',
    body: 'Medicine reminders, medical report uploads, navigation help, and secure ABHA integration with NHA certification. A companion smartwatch app shows upcoming appointments and appointment QR codes on the wrist. Shipped on Android and iOS.',
    stack: ['React Native', 'Firebase', 'Figma', 'GitHub'],
    device: { kind: 'phone', screen: 'aayush' },
    arch: {
      ui: 'React Native (iOS/Android)',
      api: 'REST / ABHA Gateway',
      backend: 'Node.js Microservices',
      db: 'Cloud & Local SQLite',
    },
  },
  {
    tag: 'Payments',
    meta: 'React Native · in production',
    title: 'Offline e₹',
    what: 'Digital rupee payments that complete without an internet connection.',
    body: "Built for low-connectivity environments: transactions are made and settled offline, so the app stays usable where the network isn't. Focused on the security of the exchange and on making the flow legible to first-time users.",
    stack: ['React Native', 'Figma', 'GitHub', 'npm'],
    device: { kind: 'phone', screen: 'erupee' },
    flip: true,
    arch: {
      ui: 'React Native Mobile',
      api: 'Offline P2P Crypto Sync',
      backend: 'Local Settlement Engine',
      db: 'Encrypted SQLite',
    },
  },
  {
    tag: 'On the wrist',
    meta: 'Aayush · watchOS companion',
    title: 'Appointments on the watch',
    what: 'The Aayush companion app, living on the Apple Watch.',
    body: 'Upcoming appointments and the check-in QR code, glanceable from the wrist — the same booking data from the phone app, distilled to what a patient needs in the moment: the next appointment, the doctor, and the code that opens the door.',
    stack: ['watchOS', 'React Native', 'Firebase'],
    device: { kind: 'watch', screen: 'aayushWatch' },
    arch: {
      ui: 'watchOS Companion',
      api: 'WatchConnectivity Bridge',
      backend: 'Aayush Phone Host',
      db: 'Wrist Quick-Cache',
    },
  },
  {
    tag: 'Finance',
    meta: 'Next.js · NestJS',
    title: 'Finguard AI',
    what: 'Expense tracking, budgets and spending insights in one place.',
    body: 'Secure login, transaction tracking, budget planning, and visual analytics that turn a month of spending into something a person can act on. Full-stack: Next.js on the front, NestJS behind it.',
    stack: ['Next.js', 'NestJS', 'Figma', 'GitHub'],
    device: { kind: 'laptop', screen: 'finguard' },
    flip: true,
    arch: {
      ui: 'Next.js App Router',
      api: 'NestJS REST API',
      backend: 'Analytics & Auth Engine',
      db: 'PostgreSQL Database',
    },
  },
  {
    tag: 'Personal',
    meta: 'React Native · open source',
    title: 'Note App',
    what: 'Daily notes with search, organisation and theme switching.',
    body: 'A small app about speed of capture: write, find it again, and make it look the way you like.',
    stack: ['React Native', 'Figma', 'GitHub', 'npm'],
    link: 'https://github.com/Elakkiya-S-28/NoteApps',
    quiet: true,
  },
  {
    tag: 'Personal',
    meta: 'React Native · open source',
    title: 'Lucky Pick',
    what: 'A number-guessing game played against an opponent.',
    body: 'You pick a number, the opponent tries to find it. The work here was game flow and turn state — keeping the interface calm while the round moves.',
    stack: ['React Native', 'Figma', 'GitHub', 'npm'],
    link: 'https://github.com/Elakkiya-S-28/LuckyPick',
    quiet: true,
  },
  {
    tag: 'Personal',
    meta: 'React Native · open source',
    title: 'Tic Tac Toe',
    what: 'The classic game, played against the computer.',
    body: 'Simple opponent logic and an interface that needs no explaining.',
    stack: ['React Native', 'Figma', 'GitHub', 'npm'],
    link: 'https://github.com/Elakkiya-S-28/Tic-Tac-Toe',
    quiet: true,
  },
]

function ProjectCopy({ p }) {
  return (
    <div className="proj__copy">
      <div className="proj__meta">
        <b>{p.tag}</b>
        <span>{p.meta}</span>
      </div>
      <h3>{p.title}</h3>
      <p className="proj__what">{p.what}</p>
      <p className="proj__body">{p.body}</p>

      {/* Architecture relationship: UI -> API -> Backend -> Database */}
      {p.arch && (
        <div className="proj__arch">
          <div className="arch__title">Architecture Pipeline</div>
          <div className="arch__flow">
            <span className="arch__node"><b>UI</b>{p.arch.ui}</span>
            <span className="arch__arrow">→</span>
            <span className="arch__node"><b>API</b>{p.arch.api}</span>
            <span className="arch__arrow">→</span>
            <span className="arch__node"><b>Backend</b>{p.arch.backend}</span>
            <span className="arch__arrow">→</span>
            <span className="arch__node"><b>DB</b>{p.arch.db}</span>
          </div>
        </div>
      )}

      <ul className="stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {p.link && (
        <a className="proj__link" href={p.link} target="_blank" rel="noopener noreferrer">
          Source on GitHub <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}

export default function Work() {
  return (
    <section className="band zig-l" id="projects">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow rise">CASE STUDIES</p>
          <h2 className="rise">Selected Work</h2>
          <p className="rise">
            Cross-platform mobile, web, and wearable applications built end-to-end — interface, state, backend integrations, and production release.
          </p>
        </div>

        <div className="work">
          {PROJECTS.map((p) =>
            p.quiet ? (
              <article className="proj proj--quiet rise" key={p.title}>
                <ProjectCopy p={p} />
              </article>
            ) : (
              <article className={`proj${p.flip ? ' proj--flip' : ''} rise`} key={p.title}>
                <ProjectCopy p={p} />
                <div className="proj__device">
                  <DeviceStage kind={p.device.kind} screen={p.device.screen} />
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  )
}
