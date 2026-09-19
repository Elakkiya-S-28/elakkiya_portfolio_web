'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)
const HOME = new THREE.Vector3(2.6, 0.6, 0)
const FIN = new THREE.Vector3(3.4, 2.4, -6)

const TECH = ['React Native', 'React', 'TypeScript', 'JavaScript', 'Next.js', 'NestJS', 'Swift', 'SQL', 'Firebase', 'Git', 'C++', 'Figma']

export default function Lattice() {
  const group = useRef()
  const reveal = useRef(0)

  const nodes = useMemo(() => {
    const r = 3.4
    return TECH.map((_, i) => {
      const t = (i + 0.5) / TECH.length
      const phi = Math.acos(1 - 2 * t)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      return new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.75, r * Math.sin(phi) * Math.sin(theta))
    })
  }, [])

  const plaqueMats = useMemo(() => TECH.map((name) => makePlaqueMaterial(name, 44)), [])

  const struts = useMemo(() => {
    const pairs = []
    for (let i = 0; i < nodes.length; i++) {
      pairs.push([i, (i + 1) % nodes.length])
      pairs.push([i, (i + 5) % nodes.length])
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
    group.current.scale.setScalar(1 - f * 0.28)

    group.current.rotation.y += dt * 0.11
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })

  return (
    <group ref={group} position={HOME}>
      {nodes.map((p, i) => (
        <group key={TECH[i]} position={p}>
          <mesh material={plaqueMats[i]} castShadow>
            <boxGeometry args={[1.9, 0.52, 0.1]} />
          </mesh>
          <mesh position={[0, 0, -0.12]} material={materials.steel}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
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
