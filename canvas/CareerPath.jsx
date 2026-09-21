'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)
// Career rail is nudged right so it frames beside the left-aligned text of
// the Experience section in the zigzag layout; for the finale it sinks low
// right, clear of the Contact text rail.
const HOME = new THREE.Vector3(3.1, -0.6, 0)
const FIN = new THREE.Vector3(1.6, -3.6, -2.5)

const STOPS = [
  { t: 0.1, a: 'Compunet Connections', b: '2021 · React intern' },
  { t: 0.5, a: 'Plenome Technologies', b: '2023 · React Native intern' },
  { t: 0.95, a: 'Plenome Technologies', b: 'Aug 2023 — present' },
]

export default function CareerPath() {
  const group = useRef()
  const reveal = useRef(0)

  // The rail hugs the right half: starting it at world x -6.4 (the old curve)
  // parked the first stop plate deep inside the LEFT text rail — the rise now
  // begins near the midline and climbs to the upper right, clear of both.
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.0, -3.2, 1.8),
        new THREE.Vector3(0.6, -1.4, 0.5),
        new THREE.Vector3(2.2, 0.5, -0.2),
        new THREE.Vector3(3.6, 2.4, 0.2),
      ]),
    []
  )

  const railGeo = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.075, 12, false), [curve])
  const ledgeGeo = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.22, 4, false), [curve])
  const stopPlates = useMemo(
    () =>
      STOPS.map((s) => {
        const p = curve.getPointAt(s.t)
        return { p, mat: makePlaqueMaterial(s.a, 34, s.b) }
      }),
    [curve]
  )

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    reveal.current += (Math.max(scrollState.targets.timeline, scrollState.finale * 0.9) - reveal.current) * damp * 1.2
    if (!group.current) return
    group.current.visible = reveal.current > 0.015

    const f = smooth(scrollState.finale)
    group.current.position.lerpVectors(HOME, FIN, f)
    group.current.rotation.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.42) * 0.06

    // Transit dim, same contract as the Lattice plaques: visible but not
    // glaring while the act crosses the narrow-viewport text column.
    const transit = scrollState.transit || 0
    const dim = 1 - 0.72 * transit
    const envDim = 1.2 * (1 - 0.85 * transit)
    for (const s of stopPlates) {
      s.mat.color.setScalar(dim)
      s.mat.envMapIntensity = envDim
    }
  })

  return (
    <group ref={group} position={HOME}>
      <mesh geometry={railGeo} material={materials.steel} castShadow />
      <mesh geometry={ledgeGeo} material={materials.dark} position={[0, -0.42, 0]} receiveShadow />
      {stopPlates.map((s, i) => (
        <group key={i} position={s.p}>
          <mesh rotation={[0, Math.PI / 2, 0]} material={materials.steel} castShadow>
            <torusGeometry args={[0.3, 0.05, 12, 32]} />
          </mesh>
          <RoundedBox
            args={[3.1, 1.05, 0.09]}
            radius={0.05}
            smoothness={2}
            position={[0.1, 0.95, 0.35]}
            material={s.mat}
            castShadow
          />
        </group>
      ))}
    </group>
  )
}
