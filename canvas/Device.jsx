'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { createPhoneScreen, createWatchScreen } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)
const HOME = new THREE.Vector3(3.1, 0.2, 1.5)
const FIN = new THREE.Vector3(-0.6, 0.4, 3.2)

export default function Device() {
  const group = useRef()
  const reveal = useRef(0)
  const screenIndex = useRef(-1)

  const phone = useMemo(() => createPhoneScreen(), [])
  const watch = useMemo(() => createWatchScreen(), [])

  const phoneScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: phone.texture,
        emissive: 0xffffff,
        emissiveMap: phone.texture,
        emissiveIntensity: 0.62,
        roughness: 0.28,
        metalness: 0,
      }),
    [phone]
  )
  const coverMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.03,
        metalness: 0,
        transparent: true,
        opacity: 0.08,
        clearcoat: 1,
      }),
    []
  )
  const watchScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: watch.texture,
        emissive: 0xffffff,
        emissiveMap: watch.texture,
        emissiveIntensity: 0.6,
        roughness: 0.25,
      }),
    [watch]
  )

  useEffect(() => {
    phone.draw(0)
    watch.draw()
  }, [phone, watch])

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    reveal.current += (Math.max(scrollState.targets.phone, scrollState.finale * 0.9) - reveal.current) * damp * 1.2
    if (!group.current) return
    group.current.visible = reveal.current > 0.015

    const w = scrollState.work
    const idx = w < 0.42 ? 0 : w < 0.68 ? 1 : 2
    if (idx !== screenIndex.current) {
      screenIndex.current = idx
      phone.draw(idx)
    }

    const f = smooth(scrollState.finale)
    group.current.position.lerpVectors(HOME, FIN, f)

    group.current.rotation.y = 0.75 - w * 1.5 + scrollState.mx * 0.08 + f * 0.35
    group.current.rotation.x = -0.12 + (0.5 - w) * 0.28
    group.current.rotation.z = 0.04 - w * 0.06

    const t = state.clock.elapsedTime
    const watchGroup = group.current.getObjectByName('watch')
    if (watchGroup) watchGroup.rotation.y = 0.5 + Math.sin(t * 0.9) * 0.08
  })

  return (
    <group ref={group} position={HOME}>
      <RoundedBox args={[3.5, 7.2, 0.38]} radius={0.3} smoothness={6} material={materials.dark} castShadow receiveShadow />
      <RoundedBox args={[3.62, 7.32, 0.3]} radius={0.32} smoothness={6} material={materials.steel} />
      <mesh position={[0, 0, 0.2]} material={phoneScreenMat}>
        <planeGeometry args={[3.16, 6.8]} />
      </mesh>
      <mesh position={[0, 0, 0.215]} material={coverMat}>
        <planeGeometry args={[3.3, 6.95]} />
      </mesh>

      <group name="watch" position={[-2.9, -1.9, 0.6]} rotation={[0.1, 0.5, -0.12]}>
        <RoundedBox args={[1.5, 1.8, 0.4]} radius={0.3} smoothness={5} material={materials.steel} castShadow />
        <mesh position={[0, 0, 0.21]} material={watchScreenMat}>
          <planeGeometry args={[1.24, 1.5]} />
        </mesh>
      </group>
    </group>
  )
}
