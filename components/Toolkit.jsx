const GROUPS = [
  { title: 'Languages', items: ['JavaScript', 'TypeScript', 'Swift', 'C++', 'SQL', 'HTML', 'CSS'] },
  { title: 'Frameworks', items: ['React', 'React Native', 'Next.js', 'NestJS'] },
  {
    title: 'Tooling & platforms',
    items: ['Git', 'GitHub', 'Xcode', 'Android Studio', 'Firebase', 'Postman', 'pgAdmin', 'Figma', 'npm', 'Cursor AI', 'Antigravity'],
  },
]

export default function Toolkit() {
  return (
    <section className="band" id="toolkit">
      <div className="wrap">
        <div className="head">
          <h2>What I build with</h2>
          <p>The stack behind the projects above, grouped by the job it does.</p>
        </div>
        <div className="kit">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
