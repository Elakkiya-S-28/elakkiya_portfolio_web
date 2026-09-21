'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import {
  createHeroPhoneScreen,
  createCodePanel,
  createHeroWatchScreen,
  createHeroMacBookScreen,
} from './heroTextures'
import { scrollState } from '@/lib/scrollState'
import useDragSpin, { stepDrag } from './useDragSpin'

const smooth = (v) => v * v * (3 - 2 * v)
const clamp01 = (v) => Math.max(0, Math.min(1, v))

/**
 * Act 1: Hero Composition — restrained, art-directed still life.
 *
 * One focal object, two supporting devices, one quiet background card:
 * - Foreground centerpiece: titanium iPhone, real portfolio UI on screen.
 * - Midground, grounded left: open laptop showing a live project dashboard.
 * - Foreground right, smaller and closer to camera: Apple Watch.
 * - Background, dimmed and set behind the laptop: a single code panel —
 *   just enough to say "engineering" without turning into a mood board.
 *
 * Deliberately NOT included: grids of floating tech-icon tiles, stacked
 * glass cards, hologram graphs, particles. Depth comes from three real
 * focal planes (phone / laptop+watch / background card), not from adding
 * more objects — the empty space around the phone is intentional.
 * Gentle bounded drag rotation (mouse) and soft pointer parallax only.
 */

function roundedSlab(w, h, r, depth, bevel) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 5,
    curveSegments: 22,
  })
  geo.center()
  return geo
}

const PHONE_HOME = new THREE.Vector3(1.85, 0.2, 0.6)
const PHONE_START = new THREE.Vector3(2.6, -8.4, 2.4)

export default function HeroCluster() {
  const group = useRef()
  const phone = useRef()
  const laptop = useRef()
  const watch = useRef()
  const panel = useRef()
  const reveal = useRef(0)
  const scratch = useRef(new THREE.Vector3())

  // Gentle bounded drag rotation (mouse only; touch never touches this)
  const drag = useDragSpin({ side: 1, isLive: () => reveal.current > 0.3 })

  const screen = useMemo(() => createHeroPhoneScreen(), [])
  const code = useMemo(() => createCodePanel(), [])
  const watchScreen = useMemo(() => createHeroWatchScreen(), [])
  const macBookScreen = useMemo(() => createHeroMacBookScreen(), [])

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: screen.texture,
        emissive: 0xffffff,
        emissiveMap: screen.texture,
        emissiveIntensity: 0.82,
        roughness: 0.24,
        metalness: 0,
        transparent: true,
        alphaTest: 0.5,
      }),
    [screen]
  )

  const coverMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0e0e12,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        envMapIntensity: 0.4,
      }),
    []
  )

  const shellMat = useMemo(() => {
    const m = materials.steel.clone()
    m.color.set(0xb8b4c8)
    m.roughness = 0.28
    m.metalness = 0.88
    m.envMapIntensity = 1.1
    return m
  }, [])

  const darkMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181622,
        roughness: 0.35,
        metalness: 0.82,
      }),
    []
  )

  const bezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x06060a, roughness: 0.5, metalness: 0.2 }),
    []
  )

  const backMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x161420,
        roughness: 0.32,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.26,
        envMapIntensity: 0.6,
      }),
    []
  )

  const lensMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x080810,
        roughness: 0.06,
        metalness: 0.4,
        clearcoat: 1,
        envMapIntensity: 0.5,
      }),
    []
  )

  const faceMaterial = (texture, intensity) =>
    new THREE.MeshStandardMaterial({
      map: texture,
      emissive: 0xffffff,
      emissiveMap: texture,
      emissiveIntensity: intensity,
      roughness: 0.28,
      metalness: 0,
      transparent: true,
      alphaTest: 0.5,
    })

  // A single quiet background card — dimmer than the devices, so it reads
  // as atmosphere/depth rather than a second thing competing for attention.
  const panelMat = useMemo(() => faceMaterial(code.texture, 0.46), [code])

  const watchMat = useMemo(() => faceMaterial(watchScreen.texture, 0.85), [watchScreen])
  const macBookMat = useMemo(() => faceMaterial(macBookScreen.texture, 0.8), [macBookScreen])

  const phoneGeo = useMemo(() => roundedSlab(3.3, 6.9, 0.32, 0.26, 0.07), [])
  const islandGeo = useMemo(() => roundedSlab(1.38, 1.38, 0.44, 0.12, 0.03), [])

  // Set back and above the laptop, in the empty upper-left — background
  // plane only, never overlapping the phone or fighting for focus.
  const panelSlot = useMemo(
    () => ({ home: new THREE.Vector3(-3.1, 1.55, -1.15), yaw: 0.26, size: [2.75, 1.9] }),
    []
  )

  useEffect(() => {
    return () => {
      for (const m of [
        screenMat,
        coverMat,
        shellMat,
        darkMetal,
        bezelMat,
        backMat,
        lensMat,
        watchMat,
        macBookMat,
        panelMat,
      ])
        m.dispose()
    }
  }, [
    screenMat,
    coverMat,
    shellMat,
    darkMetal,
    bezelMat,
    backMat,
    lensMat,
    watchMat,
    macBookMat,
    panelMat,
  ])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    // slow cinematic settle (~0.5s time constant) — the cluster glides into
    // place and every scroll-linked value eases rather than snapping
    const damp = 1 - Math.pow(0.02, d)
    const t = state.clock.elapsedTime
    const mx = scrollState.mx
    const my = scrollState.my
    const transit = scrollState.transit || 0
    const narrow = scrollState.narrow

    const target = clamp01((scrollState.targets.phone - 0.02) / 0.5)
    reveal.current += (target - reveal.current) * damp * 1.6
    const r = smooth(reveal.current)

    stepDrag(drag, dt, r > 0.3)

    if (!group.current) return
    group.current.visible = r > 0.004

    // ---- Center Phone ----
    if (phone.current) {
      scratch.current.lerpVectors(PHONE_START, PHONE_HOME, r)
      const p = phone.current
      const dragY = drag.yaw.current
      const dragP = drag.pitch.current
      // calm pose: slow sway (±0.02), soft pointer tilt, entrance swing kept
      p.rotation.y = -0.32 + Math.sin(t * 0.14) * 0.02 + mx * 0.05 + (1 - r) * 0.7 + dragY
      p.rotation.x = 0.02 + Math.sin(t * 0.18) * 0.012 - my * 0.03 + (1 - r) * 0.28 + dragP
      p.rotation.z = -0.03
      p.position.copy(scratch.current)
      p.position.y += Math.sin(t * 0.4) * 0.028 * r
      p.position.x += mx * 0.05 * r
      p.scale.setScalar(0.88 + 0.12 * r)
    }

    // ---- Laptop on Rock Pedestal ----
    if (laptop.current) {
      const arriveL = smooth(clamp01((r - 0.15) / 0.7))
      laptop.current.visible = arriveL > 0.02
      laptop.current.position.set(-1.85 + mx * 0.04, -1.95 + Math.sin(t * 0.22) * 0.012, 0.8 + (1 - arriveL) * 2.5)
      laptop.current.rotation.set(-0.06 - my * 0.015, 0.42 + mx * 0.03, 0.02)
      laptop.current.scale.setScalar(0.9 + 0.1 * arriveL)
    }

    // ---- Apple Watch on Rock Pedestal ----
    if (watch.current) {
      const arriveW = smooth(clamp01((r - 0.2) / 0.65))
      watch.current.visible = arriveW > 0.02
      watch.current.position.set(3.9 + mx * 0.06, -1.9 + Math.sin(t * 0.26) * 0.016, 1.4 + (1 - arriveW) * 2.5)
      watch.current.rotation.set(0.1 - my * 0.02, -0.4 + mx * 0.025, 0.04)
      watch.current.scale.setScalar(0.92 + 0.08 * arriveW)
    }

    // ---- Background code panel (quiet, single) ----
    if (panel.current) {
      const s = panelSlot
      const arriveP = smooth(clamp01((r - 0.08) / 0.65))
      panel.current.visible = arriveP > 0.015 && !(narrow && r < 0.5)
      if (panel.current.visible) {
        panel.current.position.set(
          s.home.x + mx * 0.08,
          s.home.y - my * 0.06 + Math.sin(t * 0.18) * 0.01,
          s.home.z + (1 - arriveP) * 3.2
        )
        panel.current.rotation.set(-my * 0.02, s.yaw + mx * 0.03 + (1 - arriveP) * 0.35, 0)
        panel.current.scale.setScalar(0.9 + 0.1 * arriveP)
      }
    }

    // Transit dim
    const dim = (1 - 0.8 * transit) * (narrow ? 0.88 : 1)
    screenMat.emissiveIntensity = 0.82 * dim
    watchMat.emissiveIntensity = 0.85 * dim
    macBookMat.emissiveIntensity = 0.8 * dim
    coverMat.envMapIntensity = 0.4 * (1 - 0.85 * transit)
    shellMat.envMapIntensity = 1.1 * (1 - 0.8 * transit)
    panelMat.emissiveIntensity = 0.46 * dim
  })

  return (
    <group ref={group} position={PHONE_START}>
      {/* ================= 1. Centerpiece Smartphone ================= */}
      <group ref={phone} position={PHONE_START} rotation={[0.28, 0.34, -0.035]}>
        <mesh geometry={phoneGeo} material={shellMat} castShadow receiveShadow />
        <mesh position={[0, 0, 0.201]} material={bezelMat}>
          <planeGeometry args={[3.16, 6.74]} />
        </mesh>
        <mesh position={[0, 0, 0.206]} material={screenMat}>
          <planeGeometry args={[3.1, 6.66]} />
        </mesh>
        <mesh position={[0, 0, 0.214]} material={coverMat}>
          <planeGeometry args={[3.2, 6.78]} />
        </mesh>
        <mesh position={[0, 0, -0.201]} rotation={[0, Math.PI, 0]} material={backMat}>
          <planeGeometry args={[3.2, 6.78]} />
        </mesh>

        {/* Dynamic Island on front screen */}
        <mesh position={[0, 2.92, 0.21]} material={bezelMat}>
          <planeGeometry args={[0.9, 0.28]} />
        </mesh>

        {/* Camera island on back */}
        <group position={[0.68, 2.34, -0.26]}>
          <mesh geometry={islandGeo} material={shellMat} castShadow />
          {[
            [0.3, 0.3],
            [0.3, -0.3],
            [-0.3, 0],
          ].map(([lx, ly], i) => (
            <group key={i} position={[lx, ly, -0.11]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={lensMat}>
                <cylinderGeometry args={[0.25, 0.25, 0.1, 28]} />
              </mesh>
              <mesh position={[0, 0, -0.055]} rotation={[Math.PI / 2, 0, 0]} material={bezelMat}>
                <cylinderGeometry args={[0.17, 0.17, 0.02, 28]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Side Buttons */}
        <RoundedBox args={[0.07, 0.3, 0.12]} radius={0.03} smoothness={4} position={[-1.73, 2.4, 0]} material={shellMat} />
        <RoundedBox args={[0.07, 0.58, 0.12]} radius={0.03} smoothness={4} position={[-1.73, 1.55, 0]} material={shellMat} />
        <RoundedBox args={[0.07, 0.88, 0.12]} radius={0.03} smoothness={4} position={[1.73, 1.65, 0]} material={shellMat} />
      </group>

      {/* ================= 2. Open MacBook Pro on Rock Pedestal ================= */}
      <group ref={laptop} position={[-1.85, -1.95, 0.8]} rotation={[-0.06, 0.42, 0.02]}>
        {/* Base keyboard deck */}
        <RoundedBox args={[2.5, 0.09, 1.7]} radius={0.04} smoothness={4} material={darkMetal} castShadow receiveShadow />
        {/* Keyboard recess */}
        <mesh position={[0, 0.048, -0.18]} material={bezelMat}>
          <boxGeometry args={[2.05, 0.01, 0.85]} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.048, 0.5]} material={shellMat}>
          <boxGeometry args={[0.82, 0.01, 0.52]} />
        </mesh>
        {/* Open Display Lid */}
        <group position={[0, 0.045, -0.84]} rotation={[-0.32, 0, 0]}>
          <RoundedBox args={[2.5, 1.6, 0.06]} radius={0.03} smoothness={4} material={darkMetal} position={[0, 0.8, 0]} castShadow />
          <mesh position={[0, 0.8, 0.035]} material={macBookMat}>
            <planeGeometry args={[2.36, 1.48]} />
          </mesh>
        </group>
      </group>

      {/* ================= 3. Apple Watch on Rock Pedestal ================= */}
      <group ref={watch} position={[3.9, -1.9, 1.4]} rotation={[0.1, -0.4, 0.04]}>
        {/* Curved Watch Case */}
        <RoundedBox args={[0.9, 1.06, 0.26]} radius={0.24} smoothness={5} material={shellMat} castShadow />
        {/* Digital crown + side button */}
        <mesh position={[0.49, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} material={shellMat}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
        </mesh>
        <mesh position={[0.48, -0.1, 0]} material={shellMat}>
          <boxGeometry args={[0.04, 0.22, 0.05]} />
        </mesh>
        {/* Watch Screen with "Build Something Great" */}
        <mesh position={[0, 0, 0.134]} material={watchMat}>
          <planeGeometry args={[0.74, 0.9]} />
        </mesh>
        {/* Silicone band stubs */}
        <mesh position={[0, 0.65, -0.02]} material={bezelMat}>
          <boxGeometry args={[0.62, 0.35, 0.14]} />
        </mesh>
        <mesh position={[0, -0.65, -0.02]} material={bezelMat}>
          <boxGeometry args={[0.62, 0.35, 0.14]} />
        </mesh>
      </group>

      {/* ================= 4. Background Code Panel (one, quiet) ================= */}
      <group ref={panel} position={panelSlot.home} rotation={[0, panelSlot.yaw, 0]}>
        <RoundedBox
          args={[panelSlot.size[0], panelSlot.size[1], 0.07]}
          radius={0.05}
          smoothness={3}
          material={materials.glass}
        />
        <mesh position={[0, 0, 0.05]} material={panelMat}>
          <planeGeometry args={[panelSlot.size[0] - 0.05, panelSlot.size[1] - 0.05]} />
        </mesh>
      </group>
    </group>
  )
}