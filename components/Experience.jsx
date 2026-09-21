const ROLES = [
  {
    when: 'Aug 2023 — present',
    title: 'Frontend Developer, React Native',
    org: 'Plenome Technologies Pvt Ltd',
    body: 'Built scalable UI components, improved app performance, and worked closely with the design team to keep what shipped matching what was drawn.',
    now: true,
  },
  {
    when: 'Feb 2023 — Jul 2023',
    title: 'Frontend Developer, React Native — internship',
    org: 'Plenome Technologies Pvt Ltd',
    body: 'Worked on enterprise applications with a focus on accessibility and performance.',
  },
  {
    when: 'Jun 2021 — Nov 2021',
    title: 'Frontend Developer, React — internship',
    org: 'Compunet Connections',
    body: 'Automated CI/CD pipelines and improved infrastructure reliability alongside frontend work.',
  },
]

export default function Experience() {
  return (
    <section className="band zig-l" id="experience">
      <div className="wrap">
        <div className="head">
          <h2>Where I&apos;ve worked</h2>
          <p>Three years of frontend roles, mostly on React Native products.</p>
        </div>
        <div className="roles">
          {ROLES.map((r) => (
            <article className={`role${r.now ? ' role--now' : ''}`} key={r.title + r.when}>
              <p className="role__when">{r.when}</p>
              <div>
                <h3>
                  {r.title}
                  <span>{r.org}</span>
                </h3>
                <p>{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
