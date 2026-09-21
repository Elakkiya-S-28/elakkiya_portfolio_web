import * as THREE from 'three'

function getAccent() {
  if (typeof window === 'undefined') return '#9aa7ff'
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#9aa7ff'
}

/*
 * Static canvas face for the Contact act's composer — same palette, fonts
 * and masking approach as the phone/watch screens in textures.js. Drawn
 * once at mount; the blinking caret is a separate emissive mesh, not a
 * texture redraw, so the idle animation costs nothing.
 */

/** Contact act: floating message composer face (caret is a separate mesh). */
export function createComposerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 460
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  function draw() {
    const x = ctx
    const W = 768
    const H = 460
    const A = getAccent()
    x.clearRect(0, 0, W, H)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, W, H, 30)
    x.clip()

    const g = x.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#1a1428')
    g.addColorStop(1, '#241a2b')
    x.fillStyle = g
    x.fillRect(0, 0, W, H)

    x.fillStyle = 'rgba(243,238,231,0.5)'
    x.font = '500 22px "Instrument Sans", sans-serif'
    x.fillText('NEW MESSAGE', 44, 60)
    x.strokeStyle = 'rgba(243,238,231,0.12)'
    x.lineWidth = 2
    x.beginPath()
    x.moveTo(44, 92)
    x.lineTo(W - 44, 92)
    x.stroke()

    // To / Subject rows — the portfolio's own contact details
    x.fillStyle = 'rgba(243,238,231,0.42)'
    x.font = '400 25px "Instrument Sans", sans-serif'
    x.fillText('To', 44, 148)
    x.fillText('Subject', 44, 202)
    x.fillStyle = 'rgba(243,238,231,0.88)'
    x.font = '500 26px "Instrument Sans", sans-serif'
    x.fillText('selvarajanelakkiya@gmail.com', 122, 148)
    x.fillText('Mobile & web work', 122, 202)

    x.beginPath()
    x.moveTo(44, 238)
    x.lineTo(W - 44, 238)
    x.stroke()

    x.fillStyle = '#f3eee7'
    x.font = '500 30px "Bricolage Grotesque", sans-serif'
    x.fillText('Hello Elakkiya,', 44, 300)
    x.fillStyle = 'rgba(243,238,231,0.72)'
    x.font = '400 27px "Instrument Sans", sans-serif'
    x.fillText('Your next app could start here.', 44, 346)

    x.fillStyle = 'rgba(243,238,231,0.3)'
    x.font = '400 20px "Instrument Sans", sans-serif'
    x.fillText('Draft · autosaved', 44, 428)

    // accent underline under the compose line — ties the panel to the theme
    x.strokeStyle = A
    x.lineWidth = 3
    x.beginPath()
    x.moveTo(44, 372)
    x.lineTo(150, 372)
    x.stroke()

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { canvas, texture, draw }
}
