'use client'

export default function Contact() {
  return (
    <section className="band contact zig-l" id="contact">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow rise">GET IN TOUCH</p>
          <h2 className="rise">Let&apos;s build something <em>meaningful</em>.</h2>
          <p className="rise">
            Open to frontend and mobile roles, consulting, and technical collaborations. Whether you have a vision for a cross-platform app or need high-performance web architecture, let&apos;s talk.
          </p>
        </div>

        <a className="contact__mail rise" href="mailto:selvarajanelakkiya@gmail.com">
          selvarajanelakkiya@gmail.com
        </a>

        <div className="channels rise">
          <a
            className="btn btn--solid"
            href="mailto:selvarajanelakkiya@gmail.com"
          >
            Send an Email <span aria-hidden="true">→</span>
          </a>
          <a
            className="btn btn--ghost resume-cta"
            href="mailto:selvarajanelakkiya@gmail.com?subject=Resume%20Request%20-%20Elakkiya%20Selvarajan"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3v11m0 0 4-4m-4 4-4-4M4.5 17.5V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5" />
            </svg>
            Download Resume
          </a>
          <a
            className="btn btn--ghost"
            href="https://www.linkedin.com/in/elakkiya-selvarajan-384b1a1aa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="btn btn--ghost"
            href="https://github.com/Elakkiya-S-28"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn btn--ghost"
            href="https://medium.com/@selvarajanelakkiya"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medium
          </a>
        </div>
      </div>
    </section>
  )
}
