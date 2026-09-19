import * as THREE from 'three'

function getAccent() {
  if (typeof window === 'undefined') return '#9aa7ff'
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#9aa7ff'
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Brushed-steel plaque with an etched title (and optional subtitle). */
export function makePlaqueMaterial(title, size, sub) {
  const c = document.createElement('canvas')
  c.width = 768
  c.height = 208
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 0, 208)
  g.addColorStop(0, '#3b3744')
  g.addColorStop(0.5, '#2b2833')
  g.addColorStop(1, '#1e1c25')
  x.fillStyle = g
  x.fillRect(0, 0, 768, 208)
  for (let i = 0; i < 420; i++) {
    x.strokeStyle = `rgba(255,255,255,${Math.random() * 0.035})`
    x.beginPath()
    const y = Math.random() * 208
    x.moveTo(0, y)
    x.lineTo(768, y)
    x.stroke()
  }
  x.fillStyle = '#efe9e2'
  x.font = `600 ${size * 1.55}px "Bricolage Grotesque", system-ui, sans-serif`
  x.textBaseline = 'middle'
  x.fillText(title, 40, sub ? 78 : 104)
  if (sub) {
    x.fillStyle = 'rgba(239,233,226,0.55)'
    x.font = '400 40px "Instrument Sans", system-ui, sans-serif'
    x.fillText(sub, 40, 140)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.42, metalness: 0.82, envMapIntensity: 1.2 })
}

/** Builds the live canvas + texture the phone screen mesh uses, plus a draw(index) fn. */
export function createPhoneScreen() {
  const canvas = document.createElement('canvas')
  canvas.width = 720
  canvas.height = 1480
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  function draw(i) {
    const x = ctx
    const W = 720
    const H = 1480
    const A = getAccent()
    const g = x.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#191327')
    g.addColorStop(1, '#2e1f2b')
    x.fillStyle = g
    x.fillRect(0, 0, W, H)

    x.fillStyle = 'rgba(243,238,231,0.5)'
    x.font = '500 30px "Instrument Sans", sans-serif'
    x.fillText('9:41', 48, 74)
    x.fillText('ABHA linked', 470, 74)

    x.fillStyle = '#f3eee7'
    x.font = '600 58px "Bricolage Grotesque", sans-serif'
    x.fillText('Aayush', 48, 180)

    if (i === 0) {
      x.fillStyle = 'rgba(243,238,231,0.55)'
      x.font = '400 32px "Instrument Sans", sans-serif'
      x.fillText('Upcoming appointments', 48, 236)
      const docs = [
        ['Dr. Anita Rao', 'Cardiology · Today 10:30'],
        ['Dr. S. Menon', 'General · Fri 09:00'],
        ['Dr. K. Iyer', 'Dermatology · 24 Sep'],
      ]
      docs.forEach((d, n) => {
        const y = 300 + n * 200
        x.fillStyle = 'rgba(243,238,231,0.06)'
        roundRect(x, 48, y, 624, 168, 34)
        x.fill()
        x.strokeStyle = 'rgba(243,238,231,0.12)'
        x.stroke()
        x.fillStyle = A
        roundRect(x, 82, y + 44, 80, 80, 40)
        x.fill()
        x.fillStyle = '#f3eee7'
        x.font = '600 38px "Instrument Sans", sans-serif'
        x.fillText(d[0], 196, y + 72)
        x.fillStyle = 'rgba(243,238,231,0.55)'
        x.font = '400 30px "Instrument Sans", sans-serif'
        x.fillText(d[1], 196, y + 118)
      })
      x.fillStyle = A
      roundRect(x, 48, 940, 624, 108, 54)
      x.fill()
      x.fillStyle = '#16121c'
      x.font = '600 36px "Instrument Sans", sans-serif'
      x.fillText('Book an appointment', 150, 1002)
    }

    if (i === 1) {
      x.fillStyle = 'rgba(243,238,231,0.55)'
      x.font = '400 32px "Instrument Sans", sans-serif'
      x.fillText('Appointment pass', 48, 236)
      x.fillStyle = '#f3eee7'
      roundRect(x, 96, 300, 528, 528, 40)
      x.fill()
      let seed = 7
      for (let a = 0; a < 21; a++) {
        for (let b = 0; b < 21; b++) {
          seed = (seed * 1103515245 + 12345) % 2147483648
          if ((seed >> 7) % 3 === 0) {
            x.fillStyle = '#16121c'
            x.fillRect(136 + a * 22, 340 + b * 22, 20, 20)
          }
        }
      }
      x.fillStyle = '#16121c'
      x.fillRect(300, 528, 120, 72)
      x.fillStyle = '#f3eee7'
      x.font = '600 42px "Bricolage Grotesque", sans-serif'
      x.fillText('Dr. Anita Rao', 96, 920)
      x.fillStyle = 'rgba(243,238,231,0.55)'
      x.font = '400 32px "Instrument Sans", sans-serif'
      x.fillText('Today · 10:30 · Block C, Room 214', 96, 976)
      x.fillStyle = A
      roundRect(x, 96, 1030, 300, 78, 39)
      x.fill()
      x.fillStyle = '#16121c'
      x.font = '600 32px "Instrument Sans", sans-serif'
      x.fillText('Send to watch', 132, 1078)
    }

    if (i === 2) {
      x.fillStyle = 'rgba(243,238,231,0.55)'
      x.font = '400 32px "Instrument Sans", sans-serif'
      x.fillText('Medicine reminders', 48, 236)
      const meds = [
        ['Metformin', '500 mg · 08:00', true],
        ['Atorvastatin', '10 mg · 14:00', true],
        ['Vitamin D3', 'weekly · 20:00', false],
      ]
      meds.forEach((m, n) => {
        const y = 300 + n * 180
        x.fillStyle = 'rgba(243,238,231,0.06)'
        roundRect(x, 48, y, 624, 148, 32)
        x.fill()
        x.strokeStyle = 'rgba(243,238,231,0.12)'
        x.stroke()
        x.beginPath()
        x.arc(118, y + 74, 30, 0, Math.PI * 2)
        if (m[2]) {
          x.fillStyle = A
          x.fill()
        } else {
          x.strokeStyle = 'rgba(243,238,231,0.35)'
          x.lineWidth = 3
          x.stroke()
        }
        x.fillStyle = '#f3eee7'
        x.font = '600 36px "Instrument Sans", sans-serif'
        x.fillText(m[0], 176, y + 62)
        x.fillStyle = 'rgba(243,238,231,0.55)'
        x.font = '400 28px "Instrument Sans", sans-serif'
        x.fillText(m[1], 176, y + 106)
      })
      x.fillStyle = 'rgba(243,238,231,0.06)'
      roundRect(x, 48, 880, 624, 200, 34)
      x.fill()
      x.fillStyle = '#f3eee7'
      x.font = '600 36px "Instrument Sans", sans-serif'
      x.fillText('Upload report', 90, 950)
      x.fillStyle = 'rgba(243,238,231,0.5)'
      x.font = '400 28px "Instrument Sans", sans-serif'
      x.fillText('Scans and prescriptions, stored', 90, 1000)
      x.fillText('against your ABHA record.', 90, 1040)
    }

    texture.needsUpdate = true
  }

  return { canvas, texture, draw }
}

/** Builds the live canvas + texture the watch face mesh uses, plus a draw() fn. */
export function createWatchScreen() {
  const canvas = document.createElement('canvas')
  canvas.width = 360
  canvas.height = 420
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  function draw() {
    const x = ctx
    const A = getAccent()
    x.fillStyle = '#16121c'
    x.fillRect(0, 0, 360, 420)
    x.fillStyle = 'rgba(243,238,231,0.5)'
    x.font = '400 22px "Instrument Sans", sans-serif'
    x.fillText('Next', 30, 60)
    x.fillStyle = '#f3eee7'
    x.font = '600 44px "Bricolage Grotesque", sans-serif'
    x.fillText('10:30', 30, 120)
    x.font = '400 24px "Instrument Sans", sans-serif'
    x.fillStyle = 'rgba(243,238,231,0.7)'
    x.fillText('Dr. Anita Rao', 30, 166)
    x.fillStyle = '#f3eee7'
    roundRect(x, 30, 200, 300, 180, 24)
    x.fill()
    let s = 11
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 7; b++) {
        s = (s * 1103515245 + 12345) % 2147483648
        if ((s >> 9) % 3 === 0) {
          x.fillStyle = '#16121c'
          x.fillRect(48 + a * 22, 218 + b * 22, 18, 18)
        }
      }
    }
    x.fillStyle = A
    x.fillRect(30, 392, 90, 6)
    texture.needsUpdate = true
  }

  return { canvas, texture, draw }
}
