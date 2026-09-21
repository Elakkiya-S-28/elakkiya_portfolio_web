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
const ACTS = [
  { pos: [0.2, 1.0, 13.2], look: [0.55, 0.55, -2.0] },  // hero       — device right
  { pos: [-0.4, 1.15, 11.5], look: [0.1, 0.9, -2.4] },  // approach   — board left
  { pos: [0.2, 0.95, 13.4], look: [0.6, 0.55, -2.0] },  // work       — device right
  { pos: [1.6, 1.25, 22.5], look: [-0.6, 1.0, 2.0] },   // toolkit    — lattice left
  { pos: [0.2, 1.0, 9.8], look: [-1.6, 0.4, -2.0] },    // experience — rail right
  { pos: [0.2, 1.1, 15.2], look: [-1.6, 0.65, 1.2] },   // contact    — composer left
]
// +1 = the act's visual lives in the right screen half, −1 = the left half.
const SIDES = [1, -1, 1, -1, 1, -1]

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

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    const damp = 1 - Math.pow(reduced ? 0.00005 : 0.0002, d)

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

    const par = narrow || reduced ? 0 : 1
    posT.x += scrollState.mx * 0.4 * par
    posT.y += -scrollState.my * 0.26 * par

    camera.position.lerp(posT, damp)
    look.current.lerp(lookT, damp)
    camera.lookAt(look.current)

    // transit: 0 parked in an act → 1 mid-flight. Nav jumps add a short
    // pulse so skipped acts still get the dimming contract.
    if (i !== lastAct.current) {
      pulse.current = 1
      lastAct.current = i
    }
    pulse.current = Math.max(0, pulse.current - d * 1.5)
    const bump = 4 * frac * (1 - frac)
    transitEased.current += (Math.max(bump, pulse.current) - transitEased.current) * damp
    scrollState.transit = transitEased.current
  })

  return null
}
