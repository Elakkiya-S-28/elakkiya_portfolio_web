export default function Nav() {
  return (
    <header className="bar">
      <a className="bar__name" href="#top">
        Elakkiya Selvarajan <span>— mobile &amp; web</span>
      </a>
      <nav className="bar__links" aria-label="Sections">
        <a href="#work" className="keep">Work</a>
        <a href="#toolkit">Toolkit</a>
        <a href="#experience">Experience</a>
        <a href="#contact" className="keep">Contact</a>
      </nav>
    </header>
  )
}
