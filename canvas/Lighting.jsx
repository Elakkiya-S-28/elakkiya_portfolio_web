'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollState'

const accentColor = new THREE.Color('#b3a4ff')

/**
 * The redesigned scene is lit like a product shot: a cool key from the front
 * left, a saturated violet rim from behind (the volumetric glow that picks
 * the ribbons and the phone's titanium edge out of the fog) and a soft blue
 * bounce from below. Every source leans with the pointer, so moving the
 * cursor shifts the whole lighting setup rather than just the geometry.
 */
export default function Lighting() {
  const key = useRef()
  const rim = useRef()
  const bounce = useRef()
  let frame = 0

  useFrame(() => {
    frame++
    const mx = scrollState.mx
    const my = scrollState.my
    const finale = scrollState.finale

    // the theme can swap the accent at runtime; re-read it a few times a
    // second so the rim light follows the toggle
    if (frame % 12 === 0 && typeof window !== 'undefined') {
      try {
        const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
        if (v) accentColor.set(v)
      } catch (e) {
        // oklch()/color-mix() not parseable by three's Color in some
        // browsers — keep the last good value
      }
      rim.current?.color.lerp(accentColor, 0.35)
    }

    if (key.current) {
      key.current.position.set(11 + mx * 3.2, 18 - my * 2.6, 12)
      key.current.intensity = 2.2 - finale * 0.4
    }
    if (rim.current) {
      // the violet wash behind the subject, tracking the cursor the opposite
      // way so the rim reads as a real world light, not a screen effect
      rim.current.position.set(-13 - mx * 4.5, 6 - my * 1.8, -12)
      rim.current.intensity = 2.6 + finale * 0.9
    }
    if (bounce.current) {
      bounce.current.position.set(-4 + mx * 2.4, -3.2, 6)
    }
  })

  return (
    <>
      <hemisphereLight args={[0x8f9dd6, 0x1a1030, 0.5]} />
      <directionalLight
        ref={key}
        color={0xf4efff}
        intensity={2.2}
        position={[11, 18, 12]}
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
      {/* volumetric violet rim behind the composition */}
      <directionalLight ref={rim} color={0xb3a4ff} intensity={2.6} position={[-13, 6, -12]} />
      {/* cool bounce off the liquid floor */}
      <pointLight ref={bounce} color={0x7c6cf0} intensity={26} distance={46} decay={2} position={[-4, -3.2, 6]} />
      <pointLight color={0x9fd0ff} intensity={14} distance={34} decay={2} position={[6, 1.5, 5]} />
    </>
  )
}
