'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'

export default function Stage() {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqNarrow = window.matchMedia('(max-width: 899px)')
    setReduced(mqMotion.matches)
    setNarrow(mqNarrow.matches)
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className={`stage-wrap${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <Canvas
        shadows
        // narrow viewports cap the pixel ratio lower and skip the reflection
        // pass inside Environment — the brief's "simplify on mobile" rule
        dpr={narrow ? [1, 1.5] : [1, 2]}
        camera={{ fov: 38, near: 0.1, far: 400, position: [0.1, 0.95, 12.6] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.setClearAlpha(0)
        }}
      >
        <Scene reduced={reduced} narrow={narrow} />
      </Canvas>
    </div>
  )
}
