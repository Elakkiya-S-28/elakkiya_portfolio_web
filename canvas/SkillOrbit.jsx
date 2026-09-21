'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'
import useDragSpin, { stepDrag } from './useDragSpin'

const smooth = (v) => v * v * (3 - 2 * v)

/**
 * Act 4 (Skills): a glowing central sphere — the TECH STACK core — with the
 * twelve technologies orbiting it as small steel plaques strung together by
 * thin glowing lines: the interactive 3D skill visualization. 360° drag
 * rotation over the act's empty half; the DOM side (Toolkit.jsx) carries the
 * readable grouped list.
 *
 * Parked in the LEFT half (skills copy owns the right rail). Sinks away
 * once the Projects fan takes the stage.
 */
const TECH = [
  'React / RN',
  'TypeScript',
  'Next.js',
  'Swift / Kotlin',
  'REST / Axios',
  'Redux / RTK',
  'SQLite',
  'PostgreSQL',
  'NestJS / Express',
  'Git / Jest',
  'JavaScript',
  'SQL / Firebase',
]
const HOME = new THREE.Vector3(-2.5, 0.35, -0.4)
const GONE = new THREE.Vector3(-2.5, -6.4, 1.2)
const CORE = 0.92

export default function SkillOrbit({ reduced = false }) {
  const group = useRef()
  const core = useRef()
  const items = useRef([])
  const lines = useRef()
  const reveal = useRef(0)
  const orbit = useRef(0)
  const drag = useDragSpin({ side: -1, isLive: () => reveal.current > 0.35 })
  const scratch = useRef(new THREE.Vector3())

  const itemMats = useMemo(
    () =>
      TECH.map((label) => {
        const m = makePlaqueMaterial(label, 46)
        m.roughness = 0.34
        m.envMapIntensity = 2
        return m
      }),
    []
  )

  // One fat line geometry: 12 spokes from the core to each satellite's orbit
  // slot, rewritten per frame from the real positions — a single draw call.
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TECH.length * 6), 3))
    g.setDrawRange(0, TECH.length * 2)
    return g
  }, [])

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.02, Math.min(dt, 0.05))
    reveal.current += (scrollState.targets.skills - reveal.current) * damp * 1.2
    const r = reveal.current
    if (!group.current) return
    group.current.visible = r > 0.015

    stepDrag(drag, dt, r > 0.35)

    scratch.current.lerpVectors(GONE, HOME, smooth(r))
    group.current.position.copy(scratch.current)
    const t = state.clock.elapsedTime
    const transit = scrollState.transit || 0
    orbit.current += reduced ? 0 : dt * 0.09
    group.current.rotation.y = drag.yaw.current + scrollState.mx * 0.035
    group.current.rotation.x = drag.pitch.current - scrollState.my * 0.02
    group.current.scale.setScalar(0.9 + 0.1 * smooth(r))

    if (core.current) {
      core.current.scale.setScalar((1 + Math.sin(t * 0.5) * 0.02) * (0.92 + 0.08 * smooth(r)))
      const cm = core.current.material
      cm.emissiveIntensity = (0.55 + Math.sin(t * 0.7) * 0.1) * (1 - 0.7 * transit)
      cm.opacity = 0.85 * smooth(r) * (1 - 0.7 * transit)
    }

    const v = lineGeo.attributes.position.array
    TECH.forEach((_, i) => {
      const g = items.current[i]
      if (!g) return
      const arrive = reduced ? 1 : smooth(Math.max(0, Math.min(1, r * 1.5 - i * 0.12)))
      g.visible = arrive > 0.01
      // staggered shell radii + alternating latitudes keep the constellation
      // volumetric rather than a flat ring; plaques face the group, and the
      // group's yaw drag is what the user spins
      const shell = 2.1 + (i % 3) * 0.42
      const lat = ((i % 4) - 1.5) * 0.5
      const a = orbit.current + (i / TECH.length) * Math.PI * 2
      const x = Math.cos(a) * shell
      const z = Math.sin(a) * shell
      const y = lat + Math.sin(t * 0.4 + i) * 0.05
      g.position.set(x * arrive, y, z * arrive)
      g.scale.setScalar((0.62 + 0.06 * Math.sin(t + i)) * arrive)
      v[i * 6] = 0
      v[i * 6 + 1] = 0
      v[i * 6 + 2] = 0
      v[i * 6 + 3] = x * arrive
      v[i * 6 + 4] = y
      v[i * 6 + 5] = z * arrive
      const m = itemMats[i]
      m.envMapIntensity = 2 * (1 - 0.8 * transit)
      m.color.setScalar(1 - 0.66 * transit)
    })
    lineGeo.attributes.position.needsUpdate = true

    if (lines.current) {
      lines.current.visible = r > 0.1
      lines.current.material.opacity = 0.4 * smooth(r) * (1 - 0.75 * transit)
    }
  })

  return (
    <group ref={group} position={GONE} visible={false}>
      {/* the TECH STACK core */}
      <mesh ref={core}>
        <sphereGeometry args={[CORE, 40, 40]} />
        <meshPhysicalMaterial
          color="#2a2140"
          emissive="#b3a4ff"
          emissiveIntensity={0.6}
          roughness={0.16}
          metalness={0.1}
          clearcoat={1}
          transparent
          opacity={0.85}
        />
      </mesh>
      <group rotation={[Math.PI / 2.6, 0, 0.2]}>
        <mesh material={materials.strut}>
          <torusGeometry args={[CORE + 0.24, 0.008, 6, 90]} />
        </mesh>
      </group>
      <group rotation={[Math.PI / 1.8, 0.3, -0.3]}>
        <mesh material={materials.strut}>
          <torusGeometry args={[CORE + 0.36, 0.006, 6, 90]} />
        </mesh>
      </group>

      {/* glowing spokes core → satellite */}
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial color="#b3a4ff" transparent opacity={0.4} depthWrite={false} />
      </lineSegments>

      {TECH.map((label, i) => (
        <group key={label} ref={(el) => (items.current[i] = el)} visible={false}>
          <RoundedBox args={[1.62, 0.5, 0.07]} radius={0.05} smoothness={3} material={materials.dark} castShadow />
          <mesh position={[0, 0, 0.045]} material={itemMats[i]}>
            <planeGeometry args={[1.54, 0.42]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
