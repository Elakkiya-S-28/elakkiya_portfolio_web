'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)
// Lattice lives in the LEFT half (the Toolkit text rail owns the right half
// in the zigzag), pulled close to the camera so the skill plaques read big
// and bright. A flat 3x4 constellation wall — not a ball — because a ±4
// world sphere can never fit between the frame edge and the midline; the
// wall's ~4.7-world span fits its half-column at this depth. For the contact
// finale it drifts deeper left-up as a backdrop.
const HOME = new THREE.Vector3(-6.0, 1.5, 7.0)
const FIN = new THREE.Vector3(-9.5, 3.0, -8.0)

const TECH = ['React Native', 'React', 'TypeScript', 'JavaScript', 'Next.js', 'NestJS', 'Swift', 'SQL', 'Firebase', 'Git', 'C++', 'Figma']

// 3 columns x 4 rows, yawed toward the camera, with deterministic z jitter
// for parallax depth. Index = row * 3 + col.
const COLS = [-2.35, 0, 2.35]
const ROWS = [-2.55, -0.85, 0.85, 2.55]

export default function Lattice() {
  const group = useRef()
  const reveal = useRef(0)

  const nodes = useMemo(
    () =>
      ROWS.flatMap((y, r) =>
        COLS.map((x, c) => {
          const j = Math.sin((r * 3 + c) * 12.9898) * 43758.5453
          const jitter = (j - Math.floor(j)) * 0.6 - 0.3
          return new THREE.Vector3(x, y, jitter)
        })
      ),
    []
  )

  // Bigger canvases (56px etch) + a brighter, less mirror-like finish so the
  // skill names read clearly even with the act parked deep in the frame.
  const plaqueMats = useMemo(
    () =>
      TECH.map((name) => {
        const m = makePlaqueMaterial(name, 56)
        m.roughness = 0.34
        m.envMapIntensity = 2.1
        return m
      }),
    []
  )

  const struts = useMemo(() => {
    const pairs = []
    for (let r = 0; r < ROWS.length; r++) {
      for (let c = 0; c < COLS.length; c++) {
        const i = r * COLS.length + c
        if (c < COLS.length - 1) pairs.push([i, i + 1])
        if (r < ROWS.length - 1) pairs.push([i, i + COLS.length])
      }
    }
    return pairs.map(([a, b]) => {
      const from = nodes[a]
      const to = nodes[b]
      const dir = new THREE.Vector3().subVectors(to, from)
      const len = dir.length()
      const mid = from.clone().addScaledVector(dir, 0.5)
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
      return { mid, quat, len }
    })
  }, [nodes])

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    reveal.current += (Math.max(scrollState.targets.lattice, scrollState.finale * 0.9) - reveal.current) * damp * 1.2
    if (!group.current) return
    group.current.visible = reveal.current > 0.015

    const f = smooth(scrollState.finale)
    group.current.position.lerpVectors(HOME, FIN, f)
    group.current.scale.setScalar(0.9 - f * 0.22)

    // A wall must not spin — a yaw sweep would swing the right column across
    // the midline into the text. Gentle sway + per-plaque float instead.
    const t = state.clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.4) * 0.035
    group.current.rotation.x = Math.sin(t * 0.53) * 0.028
    for (let i = 0; i < nodes.length; i++) {
      const ch = group.current.children[i]
      if (ch) ch.position.y = nodes[i].y + Math.sin(t * 0.7 + i * 1.7) * 0.07
    }

    // Mid-transit on narrow viewports the plaques would glare through the
    // full-width text column: dim albedo + env reflections while travelling,
    // restore once parked (the act stays visible, only the glare drops).
    const transit = scrollState.transit || 0
    const dim = 1 - 0.72 * transit
    const envDim = 2.1 * (1 - 0.85 * transit)
    for (const m of plaqueMats) {
      m.color.setScalar(dim)
      m.envMapIntensity = envDim
    }
  })

  return (
    <group ref={group} position={HOME}>
      {nodes.map((p, i) => (
        <group key={TECH[i]} position={p} rotation={[0, 0.55, 0]}>
          <mesh material={plaqueMats[i]} castShadow>
            <boxGeometry args={[2.4, 0.62, 0.1]} />
          </mesh>
          <mesh position={[0, 0, -0.16]} material={materials.steel}>
            <cylinderGeometry args={[0.13, 0.13, 0.18, 16]} />
          </mesh>
        </group>
      ))}
      {struts.map((s, i) => (
        <mesh key={i} position={s.mid} quaternion={s.quat} material={materials.strut}>
          <cylinderGeometry args={[0.018, 0.018, s.len, 8]} />
        </mesh>
      ))}
    </group>
  )
}
