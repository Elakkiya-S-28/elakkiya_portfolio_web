'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollState'

const accentColor = new THREE.Color('#9aa7ff')

export default function Lighting() {
  const key = useRef()
  const rim = useRef()
  let frame = 0

  useFrame(() => {
    frame++
    if (frame % 12 === 0 && typeof window !== 'undefined') {
      try {
        const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
        if (v) accentColor.set(v)
      } catch (e) {
        // oklch() not parseable by three's Color in some browsers — ignore, keep last value
      }
      rim.current?.color.lerp(accentColor, 0.4)
    }
    if (key.current) key.current.intensity = 2.4 - smooth(scrollState.finale) * 0.5
  })

  return (
    <>
      <hemisphereLight args={[0x90a0c8, 0x2a1820, 0.45]} />
      <directionalLight
        ref={key}
        color={0xfff2e2}
        intensity={2.4}
        position={[11, 20, 12]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0008}
        shadow-normalBias={0.03}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={1}
        shadow-camera-far={70}
      />
      <directionalLight ref={rim} color={0x9aa7ff} intensity={1.5} position={[-14, 7, -11]} />
      <pointLight color={0xffb27a} intensity={18} distance={40} decay={2} position={[-5, -3, 6]} />
    </>
  )
}

function smooth(v) {
  return v * v * (3 - 2 * v)
}
