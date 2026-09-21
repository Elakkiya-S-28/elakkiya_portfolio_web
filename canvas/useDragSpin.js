'use client'

import { useEffect, useMemo } from 'react'
import { scrollState } from '@/lib/scrollState'

// Shared 360° drag-rotation for the act centerpieces. Mouse-only — touch
// must keep scrolling the page — and only over the act's EMPTY visual half,
// so the text rails keep selection and links. The hook owns the angular
// state; each component applies it inside its own useFrame together with
// its base pose, the inertia and the ease-home.
//
//   yaw / pitch  current user rotation (pitch clamped ±0.5 rad)
//   vyaw         release velocity for inertia (rad/s)
//   dragging     true while the pointer is held
export default function useDragSpin({ side, isLive }) {
  const state = useMemo(
    () => ({
      yaw: { current: 0 },
      pitch: { current: 0 },
      vyaw: { current: 0 },
      dragging: { current: false },
    }),
    []
  )

  useEffect(() => {
    let lastX = 0
    let lastY = 0
    let lastT = 0

    const overVisualHalf = (e) => {
      if (window.innerWidth < 900) {
        // stacked layout: the reserved visual stage sits below the text
        return e.clientY > window.innerHeight * 0.62
      }
      const xf = e.clientX / window.innerWidth
      return side > 0 ? xf > 0.54 : xf < 0.46
    }

    const down = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,[contenteditable]')) return
      if (!overVisualHalf(e)) return
      if (isLive && !isLive()) return
      state.dragging.current = true
      state.vyaw.current = 0
      lastX = e.clientX
      lastY = e.clientY
      lastT = performance.now()
    }
    const move = (e) => {
      if (!state.dragging.current) return
      const now = performance.now()
      const dtms = Math.max(8, now - lastT)
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      // Gentle, bounded drag: a slight turn of the object rather than a
      // free 360° spin. Yaw clamps to ±0.45rad, pitch to ±0.2rad, so the
      // composition always returns to a readable front-facing pose.
      state.yaw.current = Math.max(-0.45, Math.min(0.45, state.yaw.current + dx * 0.0028))
      state.pitch.current = Math.max(-0.2, Math.min(0.2, state.pitch.current + dy * 0.0016))
      state.vyaw.current = (dx * 0.0028) / (dtms / 1000)
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
    }
    const up = () => {
      state.dragging.current = false
    }

    window.addEventListener('pointerdown', down, true)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('blur', up)
    return () => {
      window.removeEventListener('pointerdown', down, true)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('blur', up)
    }
  }, [side, isLive, state])

  return state
}

// Per-frame inertia + ease-home, shared by every act. Call once per frame:
// while dragging the hook is already updating; otherwise inertia coasts the
// yaw out smoothly, and once the act is no longer live the pose eases back
// to front-facing so the next arrival always starts readable.
export function stepDrag(drag, dt, live) {
  if (drag.dragging.current) return
  const d = Math.min(dt, 0.05)
  if (!live) {
    const damp = 1 - Math.pow(0.0001, d)
    drag.yaw.current += (0 - drag.yaw.current) * damp * 2.4
    drag.pitch.current += (0 - drag.pitch.current) * damp * 2.4
    drag.vyaw.current = 0
    return
  }
  drag.yaw.current += drag.vyaw.current * d
  drag.vyaw.current *= Math.exp(-3.4 * d)
  if (Math.abs(drag.vyaw.current) < 0.02) drag.vyaw.current = 0
}
