'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { makePlaqueMaterial } from './textures'
import { createComposerTexture } from './uiTextures'
import { scrollState } from '@/lib/scrollState'
import useDragSpin, { stepDrag } from './useDragSpin'

const smooth = (v) => v * v * (3 - 2 * v)
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// Contact act centerpiece: a floating message composer — the section says
// "Start a conversation", so the closer IS a conversation being typed. It
// parks front-on to the act lens in the contact act's visual half (the text
// rail owns the right), close enough that every line reads at a glance.
// The caret is a separate emissive mesh, so the blink costs nothing; the
// panel takes 360° drag rotation and sinks when the page ends.
const HOME = new THREE.Vector3(-4.0, 0.6, 4.4)
const START = new THREE.Vector3(-3.6, -5.6, 6.0)
const CARET = [-1.7, -0.86]

export default function Composer({ reduced = false }) {
  const group = useRef()
  const caret = useRef()
  const enter = useRef(0)
  const scratch = useRef(new THREE.Vector3())
  const drag = useDragSpin({ side: -1, isLive: () => enter.current > 0.5 })

  const face = useMemo(() => createComposerTexture(), [])
  const send = useMemo(() => makePlaqueMaterial('Send', 46), [])

  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: face.texture,
        emissive: 0xffffff,
        emissiveMap: face.texture,
        emissiveIntensity: 0.62,
        roughness: 0.3,
        metalness: 0,
        transparent: true,
        alphaTest: 0.5,
      }),
    [face]
  )
  const slabMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x16121d,
        roughness: 0.42,
        metalness: 0.2,
        clearcoat: 0.7,
        clearcoatRoughness: 0.28,
        envMapIntensity: 0.5,
      }),
    []
  )
  const caretMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x9aa7ff, emissive: 0x9aa7ff, emissiveIntensity: 1.6, roughness: 0.4 }),
    []
  )

  useEffect(() => {
    face.draw()
    return () => {
      for (const m of [faceMat, slabMat, caretMat, send]) m.dispose()
    }
  }, [face, faceMat, slabMat, caretMat, send])

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    const t = state.clock.elapsedTime
    const transit = scrollState.transit || 0

    enter.current += (clamp01((scrollState.finale - 0.04) / 0.5) - enter.current) * damp * 1.6
    const e = smooth(enter.current)
    if (!group.current) return
    group.current.visible = e > 0.004

    stepDrag(drag, dt, e > 0.5)

    scratch.current.lerpVectors(START, HOME, e)
    group.current.position.copy(scratch.current)

    const drift = reduced || drag.dragging.current ? 0 : 1
    group.current.rotation.y = 0.3 + Math.sin(t * 0.3) * 0.018 * drift + drag.yaw.current
    group.current.rotation.x = -0.02 + (1 - e) * 0.3 + Math.sin(t * 0.44 + 1.2) * 0.014 * drift + drag.pitch.current
    group.current.scale.setScalar(0.92 + 0.08 * e)

    if (caret.current) caret.current.scale.y = reduced || Math.sin(t * 2.3) > -0.25 ? 1 : 0.02

    // mid-flight dim, same contract as the other acts
    const dim = 1 - 0.78 * transit
    faceMat.emissiveIntensity = 0.62 * dim * (scrollState.narrow ? 0.82 : 1)
    slabMat.envMapIntensity = 0.5 * (1 - 0.8 * transit)
    caretMat.emissiveIntensity = 1.6 * dim
    send.color.setScalar(1 - 0.72 * transit)
    send.envMapIntensity = 1.2 * (1 - 0.85 * transit)
  })

  return (
    <group ref={group} position={START}>
      <RoundedBox args={[4.82, 3.0, 0.1]} radius={0.045} smoothness={3} material={materials.steel} castShadow />
      <RoundedBox args={[4.72, 2.9, 0.16]} radius={0.07} smoothness={4} material={slabMat} castShadow receiveShadow />
      <mesh position={[0, 0, 0.085]} material={faceMat}>
        <planeGeometry args={[4.5, 2.7]} />
      </mesh>
      <mesh ref={caret} position={[CARET[0], CARET[1], 0.104]} material={caretMat}>
        <planeGeometry args={[0.05, 0.21]} />
      </mesh>
      <group position={[1.5, -1.78, 0.55]} rotation={[0, -0.26, 0.03]}>
        <mesh material={send} castShadow>
          <boxGeometry args={[1.42, 0.44, 0.1]} />
        </mesh>
        <mesh position={[0, 0, -0.16]} material={materials.steel}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
        </mesh>
      </group>
    </group>
  )
}
