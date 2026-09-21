'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { makeScreenMaterial } from './deviceTextures'

/**
 * A realistic device (iPhone / Apple Watch / laptop) whose screen carries the
 * project's real UI. Motion is deliberately calm: a soft scale-in, a shallow
 * rise, and one gentle three-quarter → near-frontal rotation swing driven by
 * the wrapper's scroll progress. Everything is exponentially damped so fast
 * scrolling never snaps the device between poses, and pointer input adds only
 * a couple of degrees of parallax.
 */
export default function DeviceActor({ kind, screen, frame, reduced }) {
  const group = useRef()
  const inner = useRef()
  const spin = useRef(-0.34) // starts at a slight three-quarter view
  const lift = useRef(-0.45)

  const shell = useMemo(() => {
    const c = kind === 'watch' ? 0xdadde4 : 0xe8e9ee
    return new THREE.MeshPhysicalMaterial({
      color: c,
      metalness: 0.9,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.5,
    })
  }, [kind])

  const darkGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0a0a12,
        metalness: 0.4,
        roughness: 0.28,
        clearcoat: 1,
        envMapIntensity: 1.1,
      }),
    []
  )

  const screenMat = useMemo(() => makeScreenMaterial(screen), [screen])

  const dims = useMemo(() => {
    if (kind === 'watch') return { w: 1.14, h: 1.32, d: 0.3, r: 0.28 }
    if (kind === 'laptop') return { w: 4.6, h: 2.9, d: 0.12, r: 0.08 }
    return { w: 1.62, h: 3.32, d: 0.14, r: 0.26 } // iPhone proportions
  }, [kind])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    // slow cinematic settle (~0.9s time constant) — motion glides, never jumps
    const damp = 1 - Math.pow(0.02, d)
    const f = frame
    const p = reduced ? 1 : f.p || 0

    if (!group.current) return
    group.current.visible = f.visible !== false

    // gentle reveal instead of a full spin: smoothstep-eased swing from a
    // three-quarter view to near-frontal as the section scrolls into view,
    // then a few degrees further — directional, calm, keeps the UI readable
    const ease = p * p * (3 - 2 * p)
    const target = -0.34 + ease * 0.52
    spin.current += (target - spin.current) * damp * 0.55

    // soft scale-in (0.9 → 1) across the reveal + a shallow settle rise
    group.current.scale.setScalar(0.9 + 0.1 * Math.min(1, ease * 1.6))
    const targetLift = (1 - ease) * -0.45
    lift.current += (targetLift - lift.current) * damp

    const t = state.clock.elapsedTime
    const float = reduced ? 0 : Math.sin(t * 0.5) * 0.028 // slow breathing
    const mx = reduced ? 0 : f.mx || 0
    const my = reduced ? 0 : f.my || 0

    group.current.position.y = lift.current + float + (kind === 'laptop' ? -0.45 : 0)
    group.current.rotation.y = spin.current + mx * 0.03
    group.current.rotation.x = -0.05 + my * 0.018
    if (inner.current) {
      inner.current.rotation.x = kind === 'laptop' ? -0.06 : 0
    }

    // steady, even screen glow — no pulsing flicker
    screenMat.emissiveIntensity = 0.85
  })


  const sw = dims.w * (kind === 'watch' ? 0.82 : 0.94)
  const sh = kind === 'laptop' ? sw * 0.56 : sw * (dims.h / dims.w)

  return (
    <group ref={group}>
      <group ref={inner}>
        {kind === 'laptop' ? (
          <>
            {/* base deck + keyboard hint */}
            <RoundedBox args={[4.9, 0.16, 3.2]} radius={0.07} smoothness={4} material={shell} position={[0, -1.5, 0.35]} castShadow />
            <mesh position={[0, -1.41, 0.2]} material={darkGlass}>
              <boxGeometry args={[3.6, 0.02, 1.5]} />
            </mesh>
            {/* lid with the real UI */}
            <group position={[0, 0.02, -1.2]} rotation={[0.16, 0, 0]}>
              <RoundedBox args={[dims.w, dims.h, dims.d]} radius={dims.r} smoothness={4} material={shell} castShadow />
              <mesh position={[0, 0, dims.d / 2 + 0.005]} material={screenMat}>
                <planeGeometry args={[dims.w - 0.22, dims.h - 0.22]} />
              </mesh>
            </group>
          </>
        ) : kind === 'watch' ? (
          <>
            {/* case */}
            <RoundedBox args={[dims.w, dims.h, dims.d]} radius={dims.r} smoothness={5} material={shell} castShadow />
            {/* digital crown + side button */}
            <mesh position={[dims.w / 2 + 0.045, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={shell}>
              <cylinderGeometry args={[0.09, 0.09, 0.09, 20]} />
            </mesh>
            <mesh position={[dims.w / 2 + 0.04, -0.12, 0]} material={shell}>
              <boxGeometry args={[0.05, 0.3, 0.06]} />
            </mesh>
            {/* screen with the real UI */}
            <mesh position={[0, 0, dims.d / 2 + 0.006]} material={screenMat}>
              <planeGeometry args={[sw, sh]} />
            </mesh>
            {/* band stubs */}
            <mesh position={[0, dims.h / 2 + 0.42, -0.02]} material={darkGlass}>
              <boxGeometry args={[0.78, 0.62, 0.2]} />
            </mesh>
            <mesh position={[0, -dims.h / 2 - 0.42, -0.02]} material={darkGlass}>
              <boxGeometry args={[0.78, 0.62, 0.2]} />
            </mesh>
          </>
        ) : (
          <>
            {/* titanium rail */}
            <RoundedBox args={[dims.w, dims.h, dims.d]} radius={dims.r} smoothness={6} material={shell} castShadow />
            {/* action button + volume */}
            <RoundedBox args={[0.045, 0.22, 0.08]} radius={0.02} smoothness={3} material={shell} position={[-dims.w / 2 - 0.02, 0.9, 0]} />
            <RoundedBox args={[0.045, 0.34, 0.08]} radius={0.02} smoothness={3} material={shell} position={[-dims.w / 2 - 0.02, 0.4, 0]} />
            <RoundedBox args={[0.045, 0.5, 0.08]} radius={0.02} smoothness={3} material={shell} position={[dims.w / 2 + 0.02, 0.5, 0]} />
            {/* dynamic island */}
            <mesh position={[0, dims.h / 2 - 0.34, dims.d / 2 + 0.004]} material={darkGlass}>
              <planeGeometry args={[0.44, 0.13]} />
            </mesh>
            {/* the real UI */}
            <mesh position={[0, 0, dims.d / 2 + 0.006]} material={screenMat}>
              <planeGeometry args={[sw, sh]} />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}
