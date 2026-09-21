const ROLES = [
  {
    when: 'Aug 2023 — Present',
    title: 'Frontend Developer, React Native',
    org: 'Plenome Technologies Pvt Ltd',
    body: 'Built scalable UI components, optimized native bridging and app performance, and engineered cross-platform experiences that shipped to Google Play and the Apple App Store. Collaborated on ABHA health records integration and companion smartwatch interfaces.',
    stack: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'REST APIs', 'SQLite', 'Git'],
    now: true,
  },
  {
    when: 'Feb 2023 — Jul 2023',
    title: 'Frontend Developer, React Native — Internship',
    org: 'Plenome Technologies Pvt Ltd',
    body: 'Worked on production enterprise mobile applications with a focus on accessibility, state machines, offline data persistence, and UI responsiveness.',
    stack: ['React Native', 'JavaScript', 'REST APIs', 'Redux', 'Git'],
  },
  {
    when: 'Jun 2021 — Nov 2021',
    title: 'Frontend Developer, React — Internship',
    org: 'Compunet Connections',
    body: 'Automated CI/CD pipelines, engineered reactive user interfaces, and improved web infrastructure reliability alongside core frontend feature delivery.',
    stack: ['React', 'TypeScript', 'REST APIs', 'CI/CD', 'Git'],
  },
]

export default function Experience() {
  return (
    <section className="band zig-l" id="experience">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow rise">CAREER</p>
          <h2 className="rise">Where I&apos;ve worked</h2>
          <p className="rise">Three years delivering production mobile, web, and native software.</p>
        </div>
        <div className="timeline rise">
          <div className="timeline__fill" id="timelineFill"></div>
          {ROLES.map((r) => (
            <article className={`role${r.now ? ' role--now' : ''}`} key={r.title + r.when}>
              <span className="role__node" aria-hidden="true"></span>
              <p className="role__when">{r.when}</p>
              <div>
                <h3>
                  {r.title}
                  <span>{r.org}</span>
                </h3>
                <p>{r.body}</p>
                <ul className="stack">
                  {r.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
