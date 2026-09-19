export default function Hero() {
  return (
    <section className="band hero" id="hero">
      <div className="wrap">
        <p className="status lift">
          <i aria-hidden="true"></i> Available for new projects
        </p>
        <h1 className="lift">Apps that hold up outside the demo.</h1>
        <p className="hero__lede lift">
          I&apos;m <b>Elakkiya Selvarajan</b>, a frontend developer with 2+ years building React
          Native and web products that run in production — hospital appointment booking,
          offline rupee payments, and personal finance tools. I work across the line where
          backend logic meets the screen someone actually taps.
        </p>
        <div className="actions lift">
          <a className="btn btn--solid" href="mailto:selvarajanelakkiya@gmail.com">Email me</a>
          <a className="btn btn--ghost" href="#work">See the work</a>
        </div>
        <dl className="facts lift">
          <div className="fact"><dt>Experience</dt><dd>2+ years</dd></div>
          <div className="fact"><dt>Shipped</dt><dd>6 projects</dd></div>
          <div className="fact"><dt>Platforms</dt><dd>iOS · Android · Web</dd></div>
          <div className="fact"><dt>Based in</dt><dd>India</dd></div>
        </dl>
      </div>
    </section>
  )
}
