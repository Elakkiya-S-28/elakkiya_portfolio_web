'use client'

import dynamic from 'next/dynamic'
import { useScrollDirector } from '@/lib/useScrollDirector'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Toolkit from '@/components/Toolkit'
import Work from '@/components/Work'
import Approach from '@/components/Approach'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// The 3D layer touches window/canvas and must never run during SSR.
const Stage = dynamic(() => import('@/canvas/Stage'), { ssr: false })

export default function Page() {
  useScrollDirector()

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="glow" aria-hidden="true"></div>
      <div className="grain" aria-hidden="true"></div>
      <Stage />
      <div className="spine" aria-hidden="true">
        <div className="spine__fill" id="spineFill"></div>
      </div>

      <div className="shell" id="top">
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Toolkit />
          <Work />
          <Approach />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
