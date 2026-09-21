'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)

/**
 * Act 3 (Experience): a vertical beam of light — the 3D twin of the DOM
 * timeline. A hairline rail climbs out of the floor, and one steel plaque
 * per role docks beside it; stops light up as the scroll fill passes them.
 * The beam's fill height is scrubbed by the section's scroll progress,
 * published as scrollState.timeline by the director.
 *
 * Parked in the RIGHT half (timeline copy owns the left rail).
 */
const STOPS = [
  { title: 'Plenome Technologies', sub: 'Frontend Developer · RN — 2023 → now' },
  { title: 'Plenome Technologies', sub: 'RN internship — Feb → Jul 2023' },
  { title: 'Compunet Connections', sub: 'React internship — Jun → Nov 2021' },
]
const HOME = new THREE.Vector3(2.7, 0.1, -0.6)
const GONE = new THREE.Vector3(2.7, -6.4, 1.6)
const STOP_GAP = 1.62

export default function TimelineBeam({ reduced = false }) {
  const group = useRef()
  const fill = useRef()
  const nodes = useRef([])
  const stops = useRef([])
  const reveal = useRef(0)
  const fillH = useRef(0)
  const scratch = useRef(new THREE.Vector3())

  const stopMats = useMemo(
    () =>
      STOPS.map((s) => {
        const m = makePlaqueMaterial(s.title, 40, s.sub)
        m.roughness = 0.3
        m.envMapIntensity = 2
        return m
      }),
    []
  )
  const nodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xb3a4ff,
        emissive: 0xb3a4ff,
        emissiveIntensity: 1.6,
        roughness: 0.3,
      }),
    []
  )

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.02, Math.min(dt, 0.05))
    reveal.current += (scrollState.targets.experience - reveal.current) * damp * 1.2
    const r = reveal.current
    if (!group.current) return
    group.current.visible = r > 0.015

    scratch.current.lerpVectors(GONE, HOME, smooth(r))
    group.current.position.copy(scratch.current)
    const t = state.clock.elapsedTime
    group.current.rotation.y = -0.26 + Math.sin(t * 0.12) * 0.018 + scrollState.mx * 0.04
    group.current.rotation.x = 0.03 - scrollState.my * 0.02
    group.current.scale.setScalar(0.94 + 0.06 * smooth(r))

    // the beam fill scrubs with the DOM timeline's own progress
    const targetFill = typeof scrollState.timeline === 'number' ? scrollState.timeline : r
    fillH.current += (targetFill * smooth(r) - fillH.current) * damp * 1.8
    if (fill.current) {
      fill.current.scale.y = Math.max(0.001, fillH.current)
      fill.current.position.y = -3.2 + (fill.current.scale.y * 7.4) / 2
    }

    STOPS.forEach((_, i) => {
      const n = nodes.current[i]
      const g = stops.current[i]
      // each node lights as the fill passes its height
      const lit = typeof scrollState.timeline === 'number' ? fillH.current : 0.4 + i * 0.3
      const on = Math.max(0, Math.min(1, (lit - (0.18 + i * 0.26)) * 6))
      if (n) {
        n.material = nodeMat
        n.scale.setScalar(0.9 + 0.5 * on + Math.sin(t * 0.9 + i) * 0.03 * on)
      }
      if (g) {
        const arrive = reduced ? 1 : smooth(Math.max(0, Math.min(1, r * 1.6 - i * 0.22)))
        g.visible = arrive > 0.01
        g.position.z = Math.sin(t * 0.25 + i * 1.4) * 0.05
        g.position.y += 0 // base set below via group layout only
      }
      const m = stopMats[i]
      m.emissiveIntensity = 0.06 + on * 0.5
      const dim = 1 - 0.7 * (scrollState.transit || 0)
      m.envMapIntensity = 2 * dim
      m.color.setScalar(0.55 + 0.45 * dim)
    })
  })

  const totalH = (STOPS.length - 1) * STOP_GAP

  return (
    <group ref={group} position={GONE} visible={false}>
      {/* rail: dark glass spine + the glowing fill inside it */}
      <mesh position={[0, -3.2 + 3.7, -0.3]} material={materials.strut}>
        <cylinderGeometry args={[0.022, 0.022, 7.4, 8]} />
      </mesh>
      <mesh ref={fill} position={[0, -3.2, -0.3]}>
        <cylinderGeometry args={[0.034, 0.034, 7.4, 8]} />
        <meshStandardMaterial color="#b3a4ff" emissive="#b3a4ff" emissiveIntensity={2.4} transparent opacity={0.85} />
      </mesh>

      {STOPS.map((s, i) => {
        const y = totalH / 2 - i * STOP_GAP
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh ref={(el) => (nodes.current[i] = el)} position={[-0.02, 0, -0.3]}>
              <sphereGeometry args={[0.11, 20, 20]} />
            </mesh>
            <group ref={(el) => (stops.current[i] = el)} position={[0.95, 0, 0]}>
              <RoundedBox args={[3.4, 1.12, 0.09]} radius={0.05} smoothness={3} material={materials.steel} castShadow />
              <mesh position={[0, 0, 0.052]} material={stopMats[i]} castShadow>
                <planeGeometry args={[3.26, 0.98]} />
              </mesh>
            </group>
            {/* thin connector from node to plaque */}
            <mesh position={[0.44, 0, -0.1]} rotation={[0, 0, Math.PI / 2]} material={materials.strut}>
              <cylinderGeometry args={[0.012, 0.012, 0.85, 6]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
