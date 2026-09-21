import * as THREE from 'three'

/*
 * Canvas faces for the ProjectFan glass cards — the five shipped projects,
 * drawn in the site's palette (Fraunces display for the mark/name, Manrope
 * for tags and stack pills) so the 3D cards and the DOM rail read as one
 * system. Static: drawn once at mount, zero per-frame cost.
 */

const DISPLAY = '"Fraunces", Georgia, serif'
const SANS = '"Manrope", system-ui, sans-serif'

function getAccent() {
  if (typeof window === 'undefined') return '#b3a4ff'
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b3a4ff'
}

export function makeCardMaterial({ mark, name, tag, sub }) {
  const canvas = document.createElement('canvas')
  canvas.width = 620
  canvas.height = 404
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  function draw() {
    const x = ctx
    const W = 620
    const H = 404
    const A = getAccent()
    x.clearRect(0, 0, W, H)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, W, H, 34)
    x.clip()

    // deep glass gradient
    const g = x.createLinearGradient(0, 0, W * 0.7, H)
    g.addColorStop(0, '#171226')
    g.addColorStop(0.6, '#100d1e')
    g.addColorStop(1, '#1b1430')
    x.fillStyle = g
    x.fillRect(0, 0, W, H)

    // accent glow pool, echoing .proj__glow in globals.css
    const gl = x.createRadialGradient(W * 0.24, H * 0.2, 10, W * 0.24, H * 0.2, W * 0.62)
    gl.addColorStop(0, 'rgba(179,164,255,0.28)')
    gl.addColorStop(1, 'rgba(179,164,255,0)')
    x.fillStyle = gl
    x.fillRect(0, 0, W, H)

    // preview area: the serif mark on a hairline panel, like .proj__shot
    x.strokeStyle = 'rgba(255,255,255,0.1)'
    x.lineWidth = 2
    x.beginPath()
    x.roundRect(28, 26, W - 56, 218, 22)
    x.stroke()
    x.fillStyle = 'rgba(255,255,255,0.035)'
    x.fill()

    x.fillStyle = '#f2eff8'
    x.font = `400 108px ${DISPLAY}`
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    x.fillText(mark, W / 2, 140)
    x.textBaseline = 'alphabetic'
    x.textAlign = 'start'

    // tag chip
    x.fillStyle = 'rgba(10,8,18,0.55)'
    x.beginPath()
    x.roundRect(28, 262, tag.length * 17 + 34, 42, 21)
    x.fill()
    x.strokeStyle = 'rgba(255,255,255,0.14)'
    x.lineWidth = 2
    x.stroke()
    x.fillStyle = 'rgba(238,234,246,0.8)'
    x.font = `600 21px ${SANS}`
    x.fillText(tag.toUpperCase(), 46, 290)

    // name + meta
    x.fillStyle = '#f2eff8'
    x.font = `400 58px ${DISPLAY}`
    x.fillText(name, 28, 372)
    x.fillStyle = 'rgba(238,234,246,0.5)'
    x.font = `500 24px ${SANS}`
    x.textAlign = 'right'
    x.fillText(sub, W - 28, 372)
    x.textAlign = 'start'

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissive: 0xffffff,
    emissiveMap: texture,
    emissiveIntensity: 0.62,
    roughness: 0.3,
    metalness: 0,
    transparent: true,
    alphaTest: 0.5,
  })
}
