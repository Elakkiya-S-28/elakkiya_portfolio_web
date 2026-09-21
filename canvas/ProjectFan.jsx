'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makeCardMaterial } from './cardTextures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)

/**
 * Act 5 (Projects): a floating fan of five glass cards behind the DOM rail.
 * The DOM rail is the interactive surface (snap gallery, hover expansions,
 * CTAs); the 3D fan is its cinematic twin — cards part and recede as the
 * user scrolls through the section's own progress (scrollState.pfan) and
 * lean toward the pointer. Parked in the RIGHT half.
 */
const HOME = new THREE.Vector3(2.5, 0.15, 0.2)
const GONE = new THREE.Vector3(2.5, -6.2, 1.8)
const CARD = [2.5, 1.62]

export default function ProjectFan({ reduced = false }) {
  const group = useRef()
  const cards = useRef([])
  const reveal = useRef(0)
  const pfan = useRef(0)
  const scratch = useRef(new THREE.Vector3())
  const scratch2 = useRef(new THREE.Vector3())

  const cardMats = useMemo(
    () =>
      [
        { mark: 'A', name: 'Aayush', tag: 'Healthcare', sub: 'React Native · in production' },
        { mark: 'e₹', name: 'Offline e₹', tag: 'Payments', sub: 'React Native · offline' },
        { mark: 'F', name: 'Finguard AI', tag: 'Finance', sub: 'Next.js · NestJS' },
        { mark: 'N', name: 'Note App', tag: 'Personal', sub: 'React Native · OSS' },
        { mark: 'L', name: 'Lucky Pick', tag: 'Personal', sub: 'React Native · OSS' },
        { mark: 'X', name: 'Tic Tac Toe', tag: 'Personal', sub: 'React Native · OSS' },
      ].map((p) => {
        const m = makeCardMaterial(p)
        m.roughness = 0.38
        m.envMapIntensity = 1.8
        return m
      }),
    []
  )

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.02, Math.min(dt, 0.05))
    reveal.current += (scrollState.targets.projects - reveal.current) * damp * 1.2
    const r = reveal.current
    if (!group.current) return
    group.current.visible = r > 0.015

    pfan.current += ((scrollState.pfan || 0) - pfan.current) * damp
    const spread = 0.35 + 0.65 * pfan.current

    scratch.current.lerpVectors(GONE, HOME, smooth(r))
    group.current.position.copy(scratch.current)
    const t = state.clock.elapsedTime
    const mx = scrollState.mx
    const my = scrollState.my
    const transit = scrollState.transit || 0
    group.current.rotation.y = 0.3 + mx * 0.05
    group.current.rotation.x = 0.02 - my * 0.03
    group.current.scale.setScalar(0.92 + 0.08 * smooth(r))

    cardMats.forEach((m) => {
      m.envMapIntensity = 1.8 * (1 - 0.8 * transit)
      m.color.setScalar(1 - 0.7 * transit)
    })

    for (let i = 0; i < cardMats.length; i++) {
      const g = cards.current[i]
      if (!g) continue
      const arrive = reduced ? 1 : smooth(Math.max(0, Math.min(1, r * 1.45 - i * 0.1)))
      g.visible = arrive > 0.01
      // fan: middle card closest, edges swept back; pfan pushes the two
      // halves apart and recedes the fan as the rail scrolls
      const off = i - (cardMats.length - 1) / 2
      const s = Math.sign(off) * spread * (1.15 + Math.abs(off) * 0.25)
      const z = -Math.abs(off) * (0.42 + 0.5 * spread) - pfan.current * 0.8
      const y = Math.abs(off) * 0.16 + Math.sin(t * 0.3 + i) * 0.03
      scratch2.current.set(off * 0.06 + s, y, z)
      g.position.lerp(scratch2.current, damp * 2)
      g.rotation.set(
        -my * 0.03 + Math.sin(t * 0.2 + i) * 0.008,
        off * 0.16 + s * 0.14 + mx * 0.03,
        off * 0.03
      )
      g.scale.setScalar((0.9 + 0.1 * arrive) * (0.96 + 0.04 * Math.sin(t * 0.25 + i)))
    }
  })

  return (
    <group ref={group} position={GONE} visible={false}>
      {cardMats.map((m, i) => (
        <group key={i} ref={(el) => (cards.current[i] = el)} visible={false}>
          <RoundedBox args={[CARD[0], CARD[1], 0.09]} radius={0.07} smoothness={4} material={materials.glass} />
          <mesh position={[0, 0, 0.055]} material={m}>
            <planeGeometry args={[CARD[0] - 0.08, CARD[1] - 0.08]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
