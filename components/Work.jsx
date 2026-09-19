const PROJECTS = [
  {
    tag: 'Healthcare',
    meta: 'React Native · in production',
    title: 'Aayush',
    what: 'Patient app for booking, rescheduling and managing doctor appointments.',
    body: 'Medicine reminders, medical report uploads, navigation help, and secure ABHA integration with NHA certification. A companion smartwatch app shows upcoming appointments and appointment QR codes on the wrist. Shipped on Android and iOS.',
    stack: ['React Native', 'Firebase', 'Figma', 'GitHub'],
  },
  {
    tag: 'Payments',
    meta: 'React Native · in production',
    title: 'Offline e₹',
    what: 'Digital rupee payments that complete without an internet connection.',
    body: "Built for low-connectivity environments: transactions are made and settled offline, so the app stays usable where the network isn't. Focused on the security of the exchange and on making the flow legible to first-time users.",
    stack: ['React Native', 'Figma', 'GitHub', 'npm'],
  },
  {
    tag: 'Finance',
    meta: 'Next.js · NestJS',
    title: 'Finguard AI',
    what: 'Expense tracking, budgets and spending insights in one place.',
    body: 'Secure login, transaction tracking, budget planning, and visual analytics that turn a month of spending into something a person can act on. Full-stack: Next.js on the front, NestJS behind it.',
    stack: ['Next.js', 'NestJS', 'Figma', 'GitHub'],
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

export default function Work() {
  return (
    <section className="band" id="work">
      <div className="wrap">
        <div className="head">
          <h2>Selected work</h2>
          <p>Cross-platform apps built end to end — interface, state, integrations, release.</p>
        </div>

        <div className="work">
          {PROJECTS.map((p) => (
            <article className={`proj${p.quiet ? ' proj--quiet' : ''}`} key={p.title}>
              <div className="proj__meta">
                <b>{p.tag}</b>
                {p.meta}
              </div>
              <div>
                <h3>{p.title}</h3>
                <p className="proj__what">{p.what}</p>
              </div>
              <div className="proj__body">
                <p>{p.body}</p>
                <ul className="stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.link && (
                  <a className="proj__link" href={p.link} target="_blank" rel="noopener noreferrer">
                    Source on GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
