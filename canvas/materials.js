import * as THREE from 'three'

// One material set, reused across every act — real roughness/metalness pairs,
// no flat unlit colors, nothing emissive-neon.
export const materials = {
  concrete: new THREE.MeshStandardMaterial({ color: 0x191520, roughness: 0.88, metalness: 0.04 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x241d2c, roughness: 0.7, metalness: 0.08 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x0d0b13, roughness: 0.22, metalness: 0.55, envMapIntensity: 1.5 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8e8a99, roughness: 0.34, metalness: 1, envMapIntensity: 1.3 }),
  strut: new THREE.MeshStandardMaterial({ color: 0x5f5c6b, roughness: 0.34, metalness: 1, envMapIntensity: 1.3 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x1b1720, roughness: 0.45, metalness: 0.9, envMapIntensity: 1.1 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xbcd0ff,
    roughness: 0.06,
    metalness: 0,
    transparent: true,
    opacity: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  }),
}
