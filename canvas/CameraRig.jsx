'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)

// One authored shot per section, in DOM order. Every pose frames the act's
// key graphic into the half the text rail does NOT own (see the zigzag
// layout in globals.css) and keeps the subject CLOSE to the lens so its
// textures stay sharp at desktop viewing distance. Depth lives behind the
// subject — the information is never pushed into the background.
//
//   hero       — phone composition owns the RIGHT ~58% (copy is left)
//   about      — board orbit drifts right, About copy holds the left rail
//   experience — timeline beam right, timeline copy left
//   skills     — tech orbit LEFT, skills copy right
//   projects   — card fan right, projects copy left
//   approach   — quiet, no centrepiece: the camera simply pulls back
//   contact    — the closing orb, centred behind the form
const ACTS = [
  { pos: [0.1, 0.95, 12.6], look: [1.7, 0.35, 0.4] },   // hero
  { pos: [0.9, 1.15, 14.4], look: [2.1, 0.6, -1.6] },   // about
  { pos: [0.2, 0.85, 13.0], look: [2.0, 0.3, -1.4] },   // experience
  { pos: [1.5, 1.1, 13.4], look: [-2.2, 0.5, -0.6] },   // skills
  { pos: [-0.6, 0.9, 12.0], look: [2.0, 0.2, 1.2] },    // projects
  { pos: [0.2, 1.3, 15.5], look: [-0.4, 0.7, -2.5] },   // approach
  { pos: [0.2, 1.0, 13.6], look: [-0.6, 0.4, -1.0] },   // contact
]
// +1 = the act's visual lives in the right screen half, −1 = the left half.
const SIDES = [1, -1, 1, -1, 1, -1, 1]

export default function CameraRig({ reduced = false }) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(...ACTS[0].look))
  const posT = useMemo(() => new THREE.Vector3(), [])
  const lookT = useMemo(() => new THREE.Vector3(), [])
  const a = useMemo(() => new THREE.Vector3(), [])
  const b = useMemo(() => new THREE.Vector3(), [])
  const lastAct = useRef(0)
  const pulse = useRef(0)
  const transitEased = useRef(0)
  const breatheT = useRef(0)

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    // Cinematic dolly damping. The residual gap shrinks by `base`^seconds, so
    // base 0.15 ≈ 0.55s time constant — the camera settles over ~1.5s with a
    // long, graceful tail instead of snapping into pose.
    const damp = 1 - Math.pow(reduced ? 0.00005 : 0.15, d)

    const act = Math.min(Math.max(scrollState.act || 0, 0), ACTS.length - 1.001)
    const i = Math.floor(act)
    const frac = act - i
    const s = smooth(frac)

    // damped follow: fast scrolls and nav jumps both ease instead of cutting
    a.set(...ACTS[i].pos)
    b.set(...ACTS[Math.min(i + 1, ACTS.length - 1)].pos)
    posT.lerpVectors(a, b, s)
    a.set(...ACTS[i].look)
    b.set(...ACTS[Math.min(i + 1, ACTS.length - 1)].look)
    lookT.lerpVectors(a, b, s)

    const narrow = scrollState.narrow
    const side = SIDES[i]
    if (narrow) {
      // stacked layout: dolly out and truck toward the act's visual side so
      // the graphic breathes in its reserved stage below the text column
      posT.x = posT.x * 0.5 + side * 1.4
      posT.z += 3.6
      posT.y += 0.35
      lookT.x *= 0.55
    }

    // Barely-there breathing micro-animation when parked in an act — a slow
    // ±0.03 sine that keeps the frame alive without ever calling attention
    if (!reduced) {
      breatheT.current += d * 0.22
      const breathe = Math.sin(breatheT.current) * 0.03 * (1 - Math.abs(frac * 2 - 1))
      posT.y += breathe
    }

    // Gentle pointer parallax: a few degrees of depth, not a camera move.
    // Reduced from the earlier values so text reading is never disturbed.
    const par = narrow || reduced ? 0 : 1
    posT.x += scrollState.mx * 0.24 * par
    posT.y += -scrollState.my * 0.14 * par

    camera.position.lerp(posT, damp)
    look.current.lerp(lookT, damp)
    camera.lookAt(look.current)

    // transit: 0 parked in an act → 1 mid-flight. Nav jumps add a short
    // pulse so skipped acts still get the dimming contract.
    if (i !== lastAct.current) {
      pulse.current = 1
      lastAct.current = i
    }
    pulse.current = Math.max(0, pulse.current - d * 0.8)
    const bump = 4 * frac * (1 - frac)
    transitEased.current += (Math.max(bump, pulse.current) - transitEased.current) * damp
    scrollState.transit = transitEased.current
  })

  return null
}
