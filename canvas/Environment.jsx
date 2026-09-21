'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'
import { scrollState } from '@/lib/scrollState'

// One shared buffer for the whole particle field: a single draw call, no
// per-point meshes — cheap enough to keep on mobile.
const PARTICLES = 260

/**
 * Environment body for the redesigned scene — the physical set every act
 * sits in:
 *
 *  1. a dark reflective liquid floor (drei's MeshReflectorMaterial) with a
 *     slightly-raised transparent surface carrying the moving ripple, so the
 *     mirror stays soft while the surface still reads as liquid;
 *  2. a low-poly rocky island under the hero cluster;
 *  3. three large black/violet ribbons sweeping the background — the flowing
 *     fabric shapes of the reference art;
 *  4. the glowing dust field.
 *
 * Nothing here belongs to a single act; the act components layer on top.
 */
export default function Environment({ narrow = false }) {
  const rock = useRef()
  const ribbons = useRef([])
  const points = useRef()
  const depth = useRef(0)

  // low-poly rock: an icosahedron whose vertices are pushed around by a
  // cheap hash so no two faces read the same, then squashed into a slab.
  const rockGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(4.6, 3)
    const pos = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const n = Math.sin(v.x * 0.9) * Math.cos(v.z * 0.7) * Math.sin(v.y * 1.3)
      v.multiplyScalar(1 + n * 0.18)
      v.y *= 0.24
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  }, [])

  const rockMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x14121c, roughness: 0.86, metalness: 0.16, flatShading: true }),
    []
  )

  // Ribbons: a wide, subdivided plane whose vertices are displaced by a
  // travelling wave each frame. Double-sided and physically dark, so only
  // the purple rim light picks them out of the fog.
  const ribbonGeo = useMemo(() => new THREE.PlaneGeometry(120, 26, 90, 26), [])
  const ribbonMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x120d1e,
        roughness: 0.55,
        metalness: 0.3,
        side: THREE.DoubleSide,
        clearcoat: 0.6,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.5,
      }),
    []
  )
  const ribbonBase = useMemo(() => Float32Array.from(ribbonGeo.attributes.position.array), [ribbonGeo])

  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const arr = new Float32Array(PARTICLES * 3)
    for (let i = 0; i < PARTICLES; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 34
      arr[i * 3 + 1] = Math.random() * 18 - 3
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 2
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])
  const dustMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xc7bcff,
        size: 0.075,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )


  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mx = scrollState.mx
    const my = scrollState.my

    // camera dolly with scroll depth — the set recedes as the story moves
    depth.current += (scrollState.p - depth.current) * 0.03

    if (rock.current) {
      rock.current.position.z = -0.6 - depth.current * 6
      rock.current.rotation.y = t * 0.008
    }

    if (points.current) {
      points.current.rotation.y = t * 0.006 + mx * 0.03
      points.current.position.y = Math.sin(t * 0.1) * 0.3 - my * 0.3
      points.current.position.z = depth.current * 9
    }

    const pos = ribbonGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = ribbonBase[i * 3]
      const y = ribbonBase[i * 3 + 1]
      // travelling wave + a slow diagonal fold; amplitude tapers to the
      // plane edges so the ribbon silhouette never shows a hard seam.
      // Slow frequencies and a low amplitude = calm fabric, not choppy waves.
      const falloff = 1 - Math.min(1, Math.abs(y) / 13)
      const wave = Math.sin(x * 0.075 + t * 0.16) * 1.55 + Math.cos(x * 0.031 - t * 0.1 + y * 0.05) * 0.9
      pos.setZ(i, wave * falloff + Math.sin(y * 0.12 + t * 0.11) * 0.55)
    }
    pos.needsUpdate = true

    ribbons.current.forEach((r, i) => {
      if (!r) return
      r.rotation.z = -0.16 + i * 0.1 + Math.sin(t * 0.06 + i) * 0.02
      r.position.x = Math.sin(t * 0.04 + i * 2.1) * 1.0 + mx * (0.25 + i * 0.18)
      r.position.y = -1.4 + i * 2.6 + Math.sin(t * 0.09 + i) * 0.25 - my * 0.28
    })
  })

  return (
    <group>
      {/* refractive liquid floor — a damped reflector, so the reflection
          stays soft and cinematic rather than a hard mirror. The reflection
          render pass is the single most expensive thing in the scene, so
          narrow viewports keep the ripple surface but drop the mirror. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.65, -14]}>
        <planeGeometry args={[260, 260]} />
        {narrow ? (
          <meshStandardMaterial color="#0a0a12" metalness={0.7} roughness={0.5} envMapIntensity={1.3} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            mixBlur={5}
            mixStrength={22}
            mirror={0.34}
            roughness={0.92}
            depthScale={1.1}
            minDepthThreshold={0.5}
            maxDepthThreshold={1.6}
            color="#0a0a12"
            metalness={0.72}
            blur={[420, 110]}
          />
        )}
      </mesh>

      {/* ripple surface: a transparent overlay that adds the moving liquid
          normal so the floor reads as water, not as polished stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, -14]}>
        <planeGeometry args={[260, 260, 60, 60]} />
        <RippleSurface />
      </mesh>

      {/* rocky island under the hero cluster */}
      <mesh ref={rock} geometry={rockGeo} material={rockMat} position={[4.2, -2.1, -1]} receiveShadow castShadow />

      {/* background ribbons */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => (ribbons.current[i] = el)}
          geometry={ribbonGeo}
          material={ribbonMat}
          position={[i * 2 - 2, i * 2.6 - 1.4, -22 - i * 7]}
          rotation={[0, 0, -0.16 + i * 0.1]}
        />
      ))}

      {/* glowing dust */}
      <points ref={points} geometry={dustGeo} material={dustMat} />
    </group>
  )
}

// A hair-fine animated ripple, injected through onBeforeCompile so it costs
// one sin() in the vertex shader instead of a second texture upload. The
// uniform is parked on the material's userData for the frame loop to drive.
function RippleSurface() {
  const mat = useRef()

  useFrame((state) => {
    const u = mat.current && mat.current.userData.uTime
    if (u) u.value = state.clock.elapsedTime
  })

  return (
    <meshStandardMaterial
      ref={mat}
      color="#0d0b18"
      transparent
      opacity={0.5}
      roughness={0.06}
      metalness={0.9}
      envMapIntensity={1.6}
      onBeforeCompile={(shader) => {
        shader.uniforms.uTime = { value: 0 }
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
             transformed.z += sin((position.x + position.y) * 0.35 + uTime * 0.6) * 0.07;`
          )
        if (mat.current) mat.current.userData.uTime = shader.uniforms.uTime
      }}
    />
  )
}
