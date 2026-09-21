'use client'

import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment as DreiEnv } from '@react-three/drei'
import * as THREE from 'three'
import DeviceActor from './DeviceActor'
import { SCREENS } from './deviceTextures'

const smooth = (v) => v * v * (3 - 2 * v)

/**
 * One scroll-driven device presentation, embedded in a project row.
 *
 * The DOM wrapper measures its own progress through the viewport (0 while
 * below the fold → 1 centred → 0 again past it) into a ref that the 3D
 * scene reads every frame — no React re-renders on scroll, and the wheel/
 * touch events are never intercepted: the canvas is pointer-events:none
 * with touch-action:pan-y, so the page always keeps scrolling.
 *
 * progress drives: entrance rise → 360° rotation (proportional, smooth) →
 * exit drift. The device texture is the real project UI, drawn once in
 * deviceTextures.js at 2–3× resolution so the screen stays crisp.
 */
export default function DeviceStage({ kind = 'phone', screen }) {
  const hostRef = useRef(null)
  // shared mutable frame state, read by the scene without re-rendering
  const frame = useRef({ p: 0, mx: 0, my: 0, visible: false })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let raf = 0

    const measure = () => {
      raf = 0
      const r = host.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 when the slot's centre is a full viewport away, 1 when centred
      const centre = r.top + r.height / 2 - vh / 2
      const span = Math.max(1, vh + r.height)
      const f = frame.current
      f.p = Math.max(0, Math.min(1, 1 - Math.abs(centre) / (span / 2)))
      f.visible = r.bottom > -80 && r.top < vh + 80
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    const onPointer = (e) => {
      // gentle parallax from the pointer over the whole window
      const f = frame.current
      f.mx = (e.clientX / (window.innerWidth || 1)) * 2 - 1
      f.my = (e.clientY / (window.innerHeight || 1)) * 2 - 1
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  const reduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <div className="deviceStage" ref={hostRef}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 32, near: 0.1, far: 60, position: [0, 0.4, kind === 'laptop' ? 8.4 : 7.2] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.setClearAlpha(0)
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 6]} intensity={1.35} castShadow />
        <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#b3a4ff" />
        <DreiEnv preset="city" environmentIntensity={0.5} />
        <DeviceActor
          kind={kind}
          screen={SCREENS[screen] || SCREENS[`${kind}Default`]}
          frame={frame.current}
          reduced={reduced.current}
        />
        <ContactShadows position={[0, -2.05, 0]} opacity={0.42} scale={11} blur={2.6} far={4.2} />
      </Canvas>
    </div>
  )
}

export { smooth }
