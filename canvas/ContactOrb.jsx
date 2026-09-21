'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { createComposerTexture } from './uiTextures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)

/**
 * Act 7 (Contact): the closing scene. A glowing metallic sphere — brushed
 * dark steel with a violet fresnel rim and an emissive core breathing under
 * its surface — sits behind the contact form, wrapped in two thin orbit
 * rings with small travelling moons. The floating message composer panel
 * (uiTextures.js) docks beside it on a steel easel. Everything rises out of
 * the floor as scrollState.finale ramps, and the core brightens as the
 * visitor actually reaches the end.
 *
 * Parked centred-left behind the right-hand form rail.
 */
const HOME = new THREE.Vector3(-0.9, 0.2, -0.8)
const GONE = new THREE.Vector3(-0.9, -6.6, 1.4)
const R = 1.55

export default function ContactOrb({ reduced = false }) {
  const group = useRef()
  const orb = useRef()
  const moons = useRef([])
  const panel = useRef()
  const reveal = useRef(0)
  const scratch = useRef(new THREE.Vector3())

  const composer = useMemo(() => createComposerTexture(), [])
  const composerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: composer.texture,
        emissive: 0xffffff,
        emissiveMap: composer.texture,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0,
        transparent: true,
        alphaTest: 0.5,
      }),
    [composer]
  )

  const shellMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x211c30,
        roughness: 0.18,
        metalness: 0.85,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.4,
        emissive: 0xb3a4ff,
        emissiveIntensity: 0.12,
      }),
    []
  )
  const coreMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xb3a4ff,
        emissive: 0xb3a4ff,
        emissiveIntensity: 1.4,
        transparent: true,
        opacity: 0.9,
        roughness: 0.4,
      }),
    []
  )
  const moonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xcfc4ff,
        emissive: 0xb3a4ff,
        emissiveIntensity: 0.8,
        roughness: 0.35,
        metalness: 0.6,
      }),
    []
  )

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.02, Math.min(dt, 0.05))
    reveal.current += (scrollState.finale - reveal.current) * damp * 1.1
    const r = reveal.current
    if (!group.current) return
    group.current.visible = r > 0.015

    scratch.current.lerpVectors(GONE, HOME, smooth(r))
    group.current.position.copy(scratch.current)
    const t = state.clock.elapsedTime
    const mx = scrollState.mx
    const my = scrollState.my
    const transit = scrollState.transit || 0
    group.current.rotation.y = 0.16 + mx * 0.045
    group.current.rotation.x = 0.02 - my * 0.022
    group.current.scale.setScalar(0.9 + 0.1 * smooth(r))

    if (orb.current) {
      orb.current.rotation.y += dt * 0.05
      const breathe = 1 + Math.sin(t * 0.45) * 0.012
      orb.current.scale.setScalar(breathe * (0.94 + 0.06 * smooth(r)))
      shellMat.emissiveIntensity = (0.1 + 0.22 * smooth(r)) * (1 - 0.6 * transit)
      coreMat.emissiveIntensity = (1.1 + Math.sin(t * 0.6) * 0.16) * smooth(r) * (1 - 0.7 * transit)
    }

    moons.current.forEach((m, i) => {
      if (!m) return
      const a = t * (0.18 + i * 0.05) + i * 2.4
      const ring = R + 0.75 + i * 0.5
      m.position.set(Math.cos(a) * ring, Math.sin(a * 0.9 + i) * 0.3, Math.sin(a) * ring)
      m.scale.setScalar((0.5 + 0.5 * Math.sin(t * 0.45 + i)) * 0.14 + 0.12)
    })

    if (panel.current) {
      const arrive = smooth(Math.max(0, Math.min(1, r * 1.4 - 0.25)))
      panel.current.visible = arrive > 0.01
      panel.current.position.set(3.15, -0.35 + Math.sin(t * 0.28) * 0.03, 2.3 + (1 - arrive) * 3)
      panel.current.rotation.set(-my * 0.045, -0.38 + mx * 0.045 + (1 - arrive) * 0.5, Math.sin(t * 0.18) * 0.006)
      panel.current.scale.setScalar(0.92 + 0.08 * arrive)
      composerMat.emissiveIntensity = 0.7 * (1 - 0.7 * transit)
    }
  })

  return (
    <group ref={group} position={GONE} visible={false}>
      {/* the orb: dark brushed shell over a glowing core */}
      <mesh ref={orb} material={shellMat} castShadow>
        <sphereGeometry args={[R, 48, 48]} />
      </mesh>
      <mesh material={coreMat}>
        <sphereGeometry args={[R * 0.62, 28, 28]} />
      </mesh>

      {/* thin orbit rings + travelling moons */}
      <group rotation={[Math.PI / 2.5, 0.2, 0.1]}>
        <mesh material={materials.strut}>
          <torusGeometry args={[R + 0.75, 0.01, 6, 110]} />
        </mesh>
      </group>
      <group rotation={[Math.PI / 1.75, -0.25, -0.2]}>
        <mesh material={materials.strut}>
          <torusGeometry args={[R + 1.25, 0.008, 6, 110]} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (moons.current[i] = el)} material={moonMat}>
          <sphereGeometry args={[0.1, 14, 14]} />
        </mesh>
      ))}

      {/* the floating message composer on its easel */}
      <group ref={panel} visible={false}>
        <RoundedBox args={[3.15, 1.95, 0.08]} radius={0.06} smoothness={3} material={materials.glass} />
        <mesh position={[0, 0, 0.052]} material={composerMat}>
          <planeGeometry args={[3.05, 1.85]} />
        </mesh>
      </group>
    </group>
  )
}
