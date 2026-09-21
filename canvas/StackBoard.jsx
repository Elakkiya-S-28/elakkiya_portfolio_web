'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'
import useDragSpin, { stepDrag } from './useDragSpin'

const smooth = (v) => v * v * (2.6 - 1.6 * v)

/**
 * Act 2 (About): three etched plaques on a steel frame, arranged as an
 * orbit ring of abstract geometry rather than a flat board — the "animated
 * 3D abstract geometry" of the brief. Each plaque counter-rotates slightly
 * so the group never reads as a static slab.
 *
 * Parked in the RIGHT half (the About copy owns the left rail). The board
 * takes 360° drag rotation on mouse, and sinks away once the Experience
 * timeline takes the stage.
 */
const ROWS = [
  { title: 'One codebase', sub: 'TypeScript · shared logic · one design system' },
  { title: 'Mobile + Web', sub: 'iOS · Android · Next.js — shipped in production' },
  { title: 'APIs & Native', sub: 'Node · NestJS · Swift/Kotlin integrations' },
]
const HOME = new THREE.Vector3(2.6, 0.55, 0.4)
const GONE = new THREE.Vector3(2.6, -6.2, 2.4)
const ROW_W = 3.9
const ROW_H = 1.02
const GAP = 0.42

export default function StackBoard({ reduced = false }) {
  const group = useRef()
  const rowRefs = useRef([])
  const reveal = useRef(0)
  const scratch = useRef(new THREE.Vector3())
  const drag = useDragSpin({ side: 1, isLive: () => reveal.current > 0.35 })

  const plaqueMats = useMemo(
    () =>
      ROWS.map((r) => {
        const m = makePlaqueMaterial(r.title, 44, r.sub)
        m.roughness = 0.32
        m.envMapIntensity = 2.1
        return m
      }),
    []
  )

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.02, Math.min(dt, 0.05))
    reveal.current += (scrollState.targets.about - reveal.current) * damp * 1.2
    const r = reveal.current
    if (!group.current) return
    group.current.visible = r > 0.015

    stepDrag(drag, dt, r > 0.35)

    scratch.current.lerpVectors(GONE, HOME, smooth(r))
    group.current.position.copy(scratch.current)

    const t = state.clock.elapsedTime
    const transit = scrollState.transit || 0
    // one slow breathing sway — barely visible, keeps the board alive
    const sway = reduced || drag.dragging.current ? 0 : Math.sin(t * 0.16) * 0.02

    group.current.rotation.y = 0.3 + sway + drag.yaw.current + scrollState.mx * 0.04
    group.current.rotation.x = 0.02 + (1 - smooth(r)) * 0.3 + drag.pitch.current - scrollState.my * 0.025
    group.current.scale.setScalar(0.92 + 0.08 * smooth(r))

    // Each row settles on a staggered phase; motion is entrance-only, so the
    // parked board sits still and lets the copy carry the section.
    ROWS.forEach((_, i) => {
      const g = rowRefs.current[i]
      if (!g) return
      const arrive = reduced ? 1 : smooth(Math.max(0, Math.min(1, r * 1.55 - i * 0.18)))
      g.visible = arrive > 0.01
      g.position.y = (1 - i) * (ROW_H + GAP) - (1 - arrive) * 1.2
      g.position.z = Math.sin(t * 0.3 + i) * 0.05
      g.rotation.z = Math.sin(t * 0.22 + i * 1.2) * 0.008
      g.scale.setScalar(0.9 + 0.1 * arrive)
    })

    // transit dim, same contract as every other act's plaques
    const dim = 1 - 0.72 * transit
    const envDim = 2.1 * (1 - 0.85 * transit)
    for (const m of plaqueMats) {
      m.color.setScalar(dim)
      m.envMapIntensity = envDim
    }
  })

  return (
    <group ref={group} position={GONE} visible={false}>
      {/* steel frame: two vertical struts behind the rows */}
      {[-1.68, 1.68].map((x) => (
        <mesh key={x} position={[x, 0, -0.14]} material={materials.strut}>
          <cylinderGeometry args={[0.035, 0.035, 4.6, 12]} />
        </mesh>
      ))}
      {ROWS.map((row, i) => (
        <group key={row.title} ref={(el) => (rowRefs.current[i] = el)} position={[0, (1 - i) * (ROW_H + GAP), 0]}>
          <RoundedBox args={[ROW_W, ROW_H, 0.1]} radius={0.05} smoothness={3} material={materials.steel} castShadow />
          <mesh position={[0, 0, 0.056]} material={plaqueMats[i]} castShadow>
            <planeGeometry args={[ROW_W - 0.16, ROW_H - 0.14]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
