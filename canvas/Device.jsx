'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { materials } from './materials'
import { createPhoneScreen, createWatchScreen } from './textures'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// iPhone (lead device) + Apple Watch companion play the Work act — text rail
// left, product cluster right in the zigzag. HOME is the anchor the rig
// clamps to the right half; the finale retreat still exits down the colonnade
// into the fog, clear of the Contact rail.
const HOME = new THREE.Vector3(3.9, 0.35, 1.5)
const FIN = new THREE.Vector3(2.4, 0.6, -30)
// Entrance start pose: the whole cluster waits far below the frustum bottom
// (clear of the frame at every fov the rig uses), pushed slightly toward the
// camera and tipped. The rise → settle is scrubbed by the Work scroll ramp,
// so the devices glide in with the page instead of popping on a visibility
// flip — at enter=0 nothing is on screen at all.
const START = new THREE.Vector3(4.5, -7.8, 4.6)

// Flat-edge slab with a rounded-rect silhouette (extrude + bevel): this is
// what gives the iPhone/Watch cases their real cushion form — RoundedBox
// can't exceed half the depth in radius, which would flatten the corners.
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

export default function Device() {
  const group = useRef()
  const enter = useRef(0)
  const screenIndex = useRef(-1)
  const swapDip = useRef(0)
  const scratch = useRef(new THREE.Vector3())

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
        transparent: true,
        alphaTest: 0.5,
      }),
    [phone]
  )
  // Glass cover over the screen. Tinted dark with a soft clearcoat streak and
  // a heavily damped env reflection — a raw white near-mirror picks up the
  // HDR apartment environment and blows out to solid white exactly where the
  // phone overlaps the text band (the screen's own emissive dim can't touch
  // this reflection).
  const coverMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0d0a15,
        roughness: 0.14,
        metalness: 0,
        transparent: true,
        opacity: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0.3,
      }),
    []
  )
  // Titanium frame shared by both devices: a calmer roughness and a damped
  // env reflection so the mirrored edge can't wash out edge-parked text on
  // narrow viewports (shared materials.steel keeps its full shine for the
  // struts and plaques elsewhere in the scene).
  const frameMat = useMemo(() => {
    const m = materials.steel.clone()
    m.color.set(0xb7b0a4)
    m.roughness = 0.3
    m.envMapIntensity = 0.7
    return m
  }, [])
  // Matte back glass (deep graphite-blue), watch band, camera lenses and the
  // black border around the screen — all low-reflectance by design.
  const backMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x232b3a,
        roughness: 0.38,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.45,
      }),
    []
  )
  const bandMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x201b26, roughness: 0.85, metalness: 0.05 }),
    []
  )
  const lensMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0a0a10,
        roughness: 0.08,
        metalness: 0.4,
        clearcoat: 1,
        envMapIntensity: 0.4,
      }),
    []
  )
  const innerBezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x050408, roughness: 0.5, metalness: 0.2 }),
    []
  )
  // alphaTest + the squircle-masked canvas let the face's corners read as
  // part of the rounded case instead of a card pasted on it.
  const watchScreenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: watch.texture,
        emissive: 0xffffff,
        emissiveMap: watch.texture,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        transparent: true,
        alphaTest: 0.5,
      }),
    [watch]
  )

  const phoneGeo = useMemo(() => roundedSlab(3.4, 7.08, 0.32, 0.26, 0.07), [])
  const islandGeo = useMemo(() => roundedSlab(1.42, 1.42, 0.44, 0.12, 0.03), [])
  const watchGeo = useMemo(() => roundedSlab(1.68, 2.0, 0.5, 0.3, 0.1), [])

  useEffect(() => {
    phone.draw(0)
    watch.draw()
    return () => {
      for (const m of [frameMat, backMat, bandMat, lensMat, innerBezelMat]) m.dispose()
    }
  }, [phone, watch, frameMat, backMat, bandMat, lensMat, innerBezelMat])

  useFrame((state, dt) => {
    const damp = 1 - Math.pow(0.001, Math.min(dt, 0.05))
    const t = state.clock.elapsedTime
    const w = scrollState.work
    const transit = scrollState.transit || 0
    const f = smooth(scrollState.finale)

    // Scroll-scrubbed entrance. targets.phone is the Work band's eased ramp;
    // remap it so the visible arrival occupies its first ~40%, then let a
    // light damp take the wheel-jitter edge off. The cluster starts far below
    // the frustum, so there is no visibility flip anywhere in the motion —
    // the devices simply rise, settle and untwist into the parked pose.
    const target = clamp01((scrollState.targets.phone - 0.04) / 0.42)
    enter.current += (target - enter.current) * damp * 1.7
    const e = smooth(enter.current)

    if (!group.current) return
    group.current.visible = e > 0.003

    // screen swap with a soft emissive dip so content changes never strobe
    const idx = w < 0.42 ? 0 : w < 0.68 ? 1 : 2
    if (idx !== screenIndex.current) {
      screenIndex.current = idx
      phone.draw(idx)
      swapDip.current = 1
    }
    swapDip.current = Math.max(0, swapDip.current - dt * 2.2)

    // position: rise START → HOME by e, then retreat HOME → FIN by f
    scratch.current.lerpVectors(START, HOME, e)
    group.current.position.lerpVectors(scratch.current, FIN, f)
    group.current.position.y += Math.sin(t * 0.8) * 0.06 * (1 - transit)
    group.current.scale.setScalar((0.8 + 0.2 * e) * (1 - 0.18 * f))

    // pose: parked front-on to the act lens — the screen stays readable at
    // every scroll depth (yaw drifts only ~13° across the whole Work act,
    // never turning the content away), untwisting a slight tilt on the rise
    group.current.rotation.y = -0.42 - w * 0.22 + scrollState.mx * 0.05 + f * 0.3 - (1 - e) * 0.55
    group.current.rotation.x = -0.02 - w * 0.12 + (1 - e) * 0.35
    group.current.rotation.z = 0.015 - w * 0.04

    // Mid-flight between acts on narrow viewports the screens would glare
    // through the full-width text column: ease emissive + env reflections
    // down while travelling, restore once parked. swapDip adds the content-
    // change softening on top. On narrow viewports the parked cluster sits
    // beside the full-width text, so the screens idle at ~3/4 glow — still a
    // bright showcase, but the rows passing over them keep their contrast.
    // The titanium frame is mirror-polished: damp its env reflection in
    // flight too, or it streaks across the text band while the screens sleep.
    const dim = (1 - 0.88 * transit) * (1 - 0.55 * swapDip.current) * (scrollState.narrow ? 0.82 : 1)
    frameMat.envMapIntensity = 0.7 * (1 - 0.85 * transit)
    phoneScreenMat.emissiveIntensity = 0.68 * dim
    watchScreenMat.emissiveIntensity = 0.66 * dim
    coverMat.envMapIntensity = 0.3 * (1 - 0.85 * transit)
    backMat.envMapIntensity = 0.45 * (1 - 0.85 * transit)

    const watchGroup = group.current.getObjectByName('watch')
    if (watchGroup) {
      // parked fully BELOW the phone (clear of the case at every pose) — the
      // phone stays the unobstructed centerpiece
      watchGroup.rotation.y = 0.42 + Math.sin(t * 0.9) * 0.05
      watchGroup.position.y = -4.35 + Math.sin(t * 1.15 + 1.3) * 0.05
    }
  })

  return (
    <group ref={group} position={START}>
      {/* ---- iPhone (lead device) ---- */}
      <mesh geometry={phoneGeo} material={frameMat} castShadow receiveShadow />
      <mesh position={[0, 0, 0.201]} material={innerBezelMat}>
        <planeGeometry args={[3.24, 6.94]} />
      </mesh>
      <mesh position={[0, 0, 0.206]} material={phoneScreenMat}>
        <planeGeometry args={[3.2, 6.88]} />
      </mesh>
      <mesh position={[0, 0, 0.215]} material={coverMat}>
        <planeGeometry args={[3.28, 6.98]} />
      </mesh>
      {/* earpiece slit in the top bezel */}
      <RoundedBox args={[0.54, 0.08, 0.03]} radius={0.035} smoothness={3} position={[0, 3.49, 0.209]} material={innerBezelMat} />
      <mesh position={[0, 0, -0.201]} rotation={[0, Math.PI, 0]} material={backMat}>
        <planeGeometry args={[3.28, 6.98]} />
      </mesh>

      {/* camera island: world +x reads LEFT from behind the phone, matching
          the real top-left placement; two lenses + one + flash */}
      <group position={[0.72, 2.4, -0.27]}>
        <mesh geometry={islandGeo} material={frameMat} castShadow />
        {[
          [0.31, 0.31],
          [0.31, -0.31],
          [-0.31, 0],
        ].map(([lx, ly], i) => (
          <group key={i} position={[lx, ly, -0.12]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={lensMat}>
              <cylinderGeometry args={[0.26, 0.26, 0.1, 32]} />
            </mesh>
            <mesh position={[0, 0, -0.055]} rotation={[Math.PI / 2, 0, 0]} material={innerBezelMat}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.33, 0.33, -0.1]} rotation={[Math.PI / 2, 0, 0]} material={lensMat}>
          <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
        </mesh>
      </group>

      {/* side buttons: action + volumes left, power right */}
      <RoundedBox args={[0.07, 0.32, 0.12]} radius={0.03} smoothness={4} position={[-1.78, 2.5, 0]} material={frameMat} />
      <RoundedBox args={[0.07, 0.6, 0.12]} radius={0.03} smoothness={4} position={[-1.78, 1.62, 0]} material={frameMat} />
      <RoundedBox args={[0.07, 0.6, 0.12]} radius={0.03} smoothness={4} position={[-1.78, 0.82, 0]} material={frameMat} />
      <RoundedBox args={[0.07, 0.92, 0.12]} radius={0.03} smoothness={4} position={[1.78, 1.72, 0]} material={frameMat} />

      {/* ---- Apple Watch companion ---- */}
      <group name="watch" position={[-1.8, -1.75, 1.15]} rotation={[0.12, 0.5, -0.08]}>
        <RoundedBox args={[1.04, 1.6, 0.11]} radius={0.05} smoothness={4} position={[0, 1.62, -0.14]} rotation={[-0.42, 0, 0]} material={bandMat} castShadow />
        <RoundedBox args={[1.04, 1.8, 0.11]} radius={0.05} smoothness={4} position={[0, -1.72, -0.16]} rotation={[0.4, 0, 0]} material={bandMat} castShadow />
        <mesh geometry={watchGeo} material={frameMat} castShadow />
        <mesh position={[0, 0, 0.252]} material={watchScreenMat}>
          <planeGeometry args={[1.5, 1.82]} />
        </mesh>
        {/* digital crown + side button on the right edge */}
        <mesh position={[0.92, 0.5, 0.02]} rotation={[0, 0, Math.PI / 2]} material={frameMat}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
        </mesh>
        <RoundedBox args={[0.09, 0.34, 0.1]} radius={0.03} smoothness={4} position={[0.91, -0.12, 0]} material={frameMat} />
      </group>
    </group>
  )
}
