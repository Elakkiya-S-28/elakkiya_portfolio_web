'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'

export default function Stage() {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className={`stage-wrap${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 38, near: 0.1, far: 400, position: [7, 1.4, 20] }}
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
        <Scene reduced={reduced} />
      </Canvas>
    </div>
  )
}
