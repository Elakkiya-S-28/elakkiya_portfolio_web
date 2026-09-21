'use client'

export default function Hero() {
  return (
    <section className="band hero zig-l" id="hero">
      <div className="wrap">
        <p className="eyebrow rise">HI, I&apos;M</p>
        <h1 className="rise">
          <span>Elakkiya</span>
          <em>Selvarajan</em>
        </h1>
        <p className="hero__sub rise">
          Frontend Developer &amp;<br />
          React Native Engineer
        </p>
        <p className="hero__lede rise">
          3+ years building mobile, web, APIs and native integrations.
        </p>
        <div className="actions rise">
          <a className="btn btn--solid" href="#projects">
            View My Work <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}


