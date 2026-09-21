'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#approach', label: 'Approach' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('dark')

  // theme persistence + the scroll listener that turns the bar glassy
  useEffect(() => {
    try {
      const saved = localStorage.getItem('es-theme')
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
        document.documentElement.dataset.theme = saved
      }
    } catch (e) {
      /* private mode — default dark */
    }
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('es-theme', next)
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <>
      <header className={`bar${scrolled ? ' is-scrolled' : ''}`}>
        <a className="bar__brand" href="#hero" aria-label="Elakkiya Selvarajan — home">
          <span className="bar__mark" aria-hidden="true">ES</span>
          <span className="bar__name">Elakkiya Selvarajan</span>
        </a>

        <nav className="bar__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className="bar__tools">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle color theme">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
              </svg>
            )}
          </button>
          <a className="resume" href="#contact" title="Download Elakkiya's Resume">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3v11m0 0 4-4m-4 4-4-4M4.5 17.5V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5" />
            </svg>
            <span>Download Resume</span>
          </a>
          <button
            className={`bar__burger icon-btn${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </header>

      <nav className={`sheet${open ? ' is-open' : ''}`} aria-label="Sections (mobile)">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
      </nav>
    </>
  )
}

