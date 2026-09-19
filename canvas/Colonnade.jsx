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
 * Act 1 (hero) + Act 2 (about/journey) live in one component because the
 * journey is literally the hero's columns repositioning into a corridor —
 * not a new set swapped in. `scrollState.targets.journey` is the 0..1 blend.
 */
export default function Colonnade() {
  const group = useRef()
  const archReveal = useRef(0.3)
  const journeyReveal = useRef(0)

  const columns = useMemo(() => {
    const list = []
    for (let i = 0; i < 14; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const row = Math.floor(i / 2)
      const home = new THREE.Vector3(side * 8.2, 6.4, 10 - row * 9.5)
      const path = new THREE.Vector3(side * (3.4 + row * 0.55), 3.2 - row * 0.5, 4 - row * 13)
      list.push({ home, path })
    }
    return list
  }, [])

  const refs = useRef([])

  const milestonePlaques = useMemo(
    () => [
      { label: '2021', side: -1, z: -14 },
      { label: '2023', side: 1, z: -36 },
      { label: 'today', side: -1, z: -58 },
    ],
    []
  )
  const plaqueMats = useMemo(() => milestonePlaques.map((m) => makePlaqueMaterial(m.label, 30)), [milestonePlaques])

  useFrame((_, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    archReveal.current += (Math.max(scrollState.targets.arch, 0.3) - archReveal.current) * damp
    journeyReveal.current += (scrollState.targets.journey - journeyReveal.current) * damp * 1.2

    const j = smooth(journeyReveal.current)
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const c = columns[i]
      mesh.position.lerpVectors(c.home, c.path, j)
      mesh.scale.y = 1 - j * 0.35
    })

    if (group.current) {
      group.current.visible = archReveal.current > 0.015 || journeyReveal.current > 0.015
    }
  })

  return (
    <group ref={group}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} material={materials.floor} receiveShadow>
        <planeGeometry args={[320, 320]} />
      </mesh>

      {/* columns */}
      {columns.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={c.home}
          material={materials.concrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.15, 26, 1.15]} />
        </mesh>
      ))}

      {/* overhead ceiling + beams */}
      <mesh position={[0, 19.4, -50]} material={materials.stone} castShadow>
        <boxGeometry args={[26, 0.9, 150]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 18.4, 8 - i * 9.5]} material={materials.stone} castShadow>
          <boxGeometry args={[23, 0.55, 0.8]} />
        </mesh>
      ))}

      {/* glass curtain wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[12.5, 6, -50]} material={materials.glass}>
        <planeGeometry args={[150, 24]} />
      </mesh>

      {/* journey walkway + milestone plinths (only meaningfully visible once journeyReveal rises) */}
      <mesh position={[0, -5.6, -55]} material={materials.stone} receiveShadow>
        <boxGeometry args={[4.6, 0.35, 150]} />
      </mesh>
      {milestonePlaques.map((m, i) => (
        <group key={m.label} position={[m.side * 3.6, -4.9, m.z]}>
          <RoundedBox args={[2.6, 1.1, 2.6]} radius={0.07} smoothness={2} material={materials.dark} castShadow receiveShadow />
          <mesh position={[0, 1.9, 0]} material={materials.steel} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 4.2, 12]} />
          </mesh>
          <RoundedBox
            args={[2.4, 0.9, 0.09]}
            radius={0.04}
            smoothness={2}
            position={[0, 4.0, 0]}
            material={plaqueMats[i]}
            castShadow
          />
        </group>
      ))}
    </group>
  )
}
