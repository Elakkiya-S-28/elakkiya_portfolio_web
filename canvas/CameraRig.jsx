'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollState'

const smooth = (v) => v * v * (3 - 2 * v)

// One shot per section, matched by index to .band elements in DOM order:
// hero, approach, work, toolkit, experience, contact.
const SHOTS = [
  { pos: [7.4, 1.2, 19], look: [1.5, 2.4, -6] },
  { pos: [1.4, 1.6, 9.5], look: [0, 0.4, -26] },
  { pos: [2.9, 0.4, 9.2], look: [3.0, 0.2, 0] },
  { pos: [2.4, 0.8, 11.5], look: [2.6, 0.6, 0] },
  { pos: [3.2, 1.4, 12.5], look: [2.2, 0.2, 0] },
  { pos: [0.6, 1.4, 21], look: [0.8, 0.2, -1] },
]
const SECTION_IDS = ['hero', 'approach', 'work', 'toolkit', 'experience', 'contact']

export default function CameraRig({ reduced }) {
  const { camera } = useThree()
  const marks = useRef([0, 0.2, 0.4, 0.6, 0.8, 1])
  const camPos = useRef(new THREE.Vector3(...SHOTS[0].pos))
  const camLook = useRef(new THREE.Vector3(...SHOTS[0].look))
  const tmpPos = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  useEffect(() => {
    function measure() {
      const range = Math.max(1, document.body.scrollHeight - window.innerHeight)
      marks.current = SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return 0
        return Math.max(0, Math.min(1, (el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2) / range))
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  function sampleShot(p) {
    let i = 0
    const m = marks.current
    while (i < m.length - 2 && p > m[i + 1]) i++
    const a = SHOTS[i]
    const b = SHOTS[i + 1]
    const span = Math.max(0.0001, m[i + 1] - m[i])
    const k = smooth(Math.max(0, Math.min(1, (p - m[i]) / span)))
    tmpPos.current.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * k,
      a.pos[1] + (b.pos[1] - a.pos[1]) * k,
      a.pos[2] + (b.pos[2] - a.pos[2]) * k
    )
    tmpLook.current.set(
      a.look[0] + (b.look[0] - a.look[0]) * k,
      a.look[1] + (b.look[1] - a.look[1]) * k,
      a.look[2] + (b.look[2] - a.look[2]) * k
    )
  }

  useFrame((_, dt) => {
    const damp = reduced ? 1 : 1 - Math.pow(0.001, Math.min(dt, 0.05))
    sampleShot(scrollState.p)
    tmpPos.current.x += scrollState.mx * 0.6
    tmpPos.current.y += -scrollState.my * 0.35
    camPos.current.lerp(tmpPos.current, damp)
    camLook.current.lerp(tmpLook.current, damp)
    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)
  })

  return null
}
