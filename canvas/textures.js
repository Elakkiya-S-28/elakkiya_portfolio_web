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
  g.addColorStop(0, '#34303d')
  g.addColorStop(0.5, '#242129')
  g.addColorStop(1, '#181620')
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
  x.fillStyle = '#f7f2ea'
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
  canvas.height = 1552
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  function draw(i) {
    const x = ctx
    const W = 720
    const H = 1552
    const A = getAccent()
    x.clearRect(0, 0, W, H)
    // rounded-corner mask: the screen's corners follow the body silhouette
    x.save()
    x.beginPath()
    x.roundRect(0, 0, W, H, 60)
    x.clip()
    const g = x.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#191327')
    g.addColorStop(1, '#2e1f2b')
    x.fillStyle = g
    x.fillRect(0, 0, W, H)

    // status row: time left, Dynamic Island centre, signal + battery right
    x.fillStyle = 'rgba(243,238,231,0.6)'
    x.font = '500 38px "Instrument Sans", sans-serif'
    x.fillText('9:41', 44, 82)
    x.fillStyle = '#06050a'
    roundRect(x, 252, 22, 216, 60, 30)
    x.fill()
    x.fillStyle = 'rgba(243,238,231,0.75)'
    x.fillRect(560, 50, 7, 18)
    x.fillRect(572, 42, 7, 26)
    x.strokeStyle = 'rgba(243,238,231,0.6)'
    x.lineWidth = 3
    roundRect(x, 600, 40, 58, 30, 9)
    x.stroke()
    x.fillRect(605, 45, 40, 20)

    x.fillStyle = '#f3eee7'
    x.font = '600 76px "Bricolage Grotesque", sans-serif'
    x.fillText('Aayush', 44, 198)

    if (i === 0) {
      x.fillStyle = 'rgba(243,238,231,0.6)'
      x.font = '500 42px "Instrument Sans", sans-serif'
      x.fillText('Upcoming appointments', 48, 268)
      const docs = [
        ['Dr. Anita Rao', 'Cardiology · Today 10:30'],
        ['Dr. S. Menon', 'General · Fri 09:00'],
        ['Dr. K. Iyer', 'Dermatology · 24 Sep'],
      ]
      docs.forEach((d, n) => {
        const y = 330 + n * 220
        x.fillStyle = 'rgba(243,238,231,0.06)'
        roundRect(x, 44, y, 632, 192, 38)
        x.fill()
        x.strokeStyle = 'rgba(243,238,231,0.12)'
        x.stroke()
        x.fillStyle = A
        roundRect(x, 78, y + 51, 90, 90, 45)
        x.fill()
        x.fillStyle = '#f3eee7'
        x.font = '600 50px "Instrument Sans", sans-serif'
        x.fillText(d[0], 200, y + 86)
        x.fillStyle = 'rgba(243,238,231,0.6)'
        x.font = '400 40px "Instrument Sans", sans-serif'
        x.fillText(d[1], 200, y + 142)
      })
      x.fillStyle = A
      roundRect(x, 44, 1030, 632, 124, 62)
      x.fill()
      x.fillStyle = '#16121c'
      x.font = '600 48px "Instrument Sans", sans-serif'
      x.fillText('Book an appointment', 132, 1104)
    }

    if (i === 1) {
      x.fillStyle = 'rgba(243,238,231,0.6)'
      x.font = '500 42px "Instrument Sans", sans-serif'
      x.fillText('Appointment pass', 48, 262)
      x.fillStyle = '#f3eee7'
      roundRect(x, 76, 300, 568, 568, 44)
      x.fill()
      let seed = 7
      for (let a = 0; a < 21; a++) {
        for (let b = 0; b < 21; b++) {
          seed = (seed * 1103515245 + 12345) % 2147483648
          if ((seed >> 7) % 3 === 0) {
            x.fillStyle = '#16121c'
            x.fillRect(116 + a * 24, 340 + b * 24, 22, 22)
          }
        }
      }
      x.fillStyle = '#16121c'
      x.fillRect(295, 546, 130, 76)
      x.fillStyle = '#f3eee7'
      x.font = '600 56px "Bricolage Grotesque", sans-serif'
      x.fillText('Dr. Anita Rao', 96, 948)
      x.fillStyle = 'rgba(243,238,231,0.6)'
      x.font = '400 42px "Instrument Sans", sans-serif'
      x.fillText('Today · 10:30 · Room 214', 96, 1014)
      x.fillStyle = A
      roundRect(x, 96, 1056, 360, 96, 48)
      x.fill()
      x.fillStyle = '#16121c'
      x.font = '600 44px "Instrument Sans", sans-serif'
      x.fillText('Send to watch', 148, 1116)
    }

    if (i === 2) {
      x.fillStyle = 'rgba(243,238,231,0.6)'
      x.font = '500 42px "Instrument Sans", sans-serif'
      x.fillText('Medicine reminders', 48, 262)
      const meds = [
        ['Metformin', '500 mg · 08:00', true],
        ['Atorvastatin', '10 mg · 14:00', true],
        ['Vitamin D3', 'weekly · 20:00', false],
      ]
      meds.forEach((m, n) => {
        const y = 320 + n * 200
        x.fillStyle = 'rgba(243,238,231,0.06)'
        roundRect(x, 44, y, 632, 168, 36)
        x.fill()
        x.strokeStyle = 'rgba(243,238,231,0.12)'
        x.stroke()
        x.beginPath()
        x.arc(118, y + 84, 36, 0, Math.PI * 2)
        if (m[2]) {
          x.fillStyle = A
          x.fill()
        } else {
          x.strokeStyle = 'rgba(243,238,231,0.35)'
          x.lineWidth = 4
          x.stroke()
        }
        x.fillStyle = '#f3eee7'
        x.font = '600 48px "Instrument Sans", sans-serif'
        x.fillText(m[0], 192, y + 74)
        x.fillStyle = 'rgba(243,238,231,0.6)'
        x.font = '400 38px "Instrument Sans", sans-serif'
        x.fillText(m[1], 192, y + 126)
      })
      x.fillStyle = 'rgba(243,238,231,0.06)'
      roundRect(x, 44, 960, 632, 230, 38)
      x.fill()
      x.fillStyle = '#f3eee7'
      x.font = '600 48px "Instrument Sans", sans-serif'
      x.fillText('Upload report', 88, 1036)
      x.fillStyle = 'rgba(243,238,231,0.6)'
      x.font = '400 38px "Instrument Sans", sans-serif'
      x.fillText('Scans and prescriptions, stored', 88, 1098)
      x.fillText('against your ABHA record.', 88, 1150)
    }

    x.restore()
    texture.needsUpdate = true
  }

  return { canvas, texture, draw }
}

/** Builds the live canvas + texture the watch face mesh uses, plus a draw() fn. */
export function createWatchScreen() {
  const canvas = document.createElement('canvas')
  canvas.width = 360
  canvas.height = 440
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  function draw() {
    const x = ctx
    const A = getAccent()
    x.clearRect(0, 0, 360, 440)
    // squircle mask: the face's corners stay transparent so the plane reads
    // as part of the rounded case instead of a card pasted on it
    x.save()
    x.beginPath()
    x.roundRect(0, 0, 360, 440, 96)
    x.clip()

    const g = x.createLinearGradient(0, 0, 0, 440)
    g.addColorStop(0, '#181322')
    g.addColorStop(1, '#0d0a13')
    x.fillStyle = g
    x.fillRect(0, 0, 360, 440)

    // date + the classic 10:09
    x.fillStyle = A
    x.font = '600 22px "Instrument Sans", sans-serif'
    x.fillText('TUE 24', 30, 56)
    x.fillStyle = '#f3eee7'
    x.font = '600 84px "Bricolage Grotesque", sans-serif'
    x.fillText('10:09', 26, 148)

    // activity rings
    const cx = 250
    const cy = 296
    ;[
      ['#ff375f', 62, 0.86],
      ['#9ef01a', 44, 0.64],
      [A, 26, 0.45],
    ].forEach(([col, r, k]) => {
      x.lineWidth = 13
      x.strokeStyle = 'rgba(255,255,255,0.1)'
      x.lineCap = 'butt'
      x.beginPath()
      x.arc(cx, cy, r, 0, Math.PI * 2)
      x.stroke()
      x.strokeStyle = col
      x.lineCap = 'round'
      x.beginPath()
      x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k)
      x.stroke()
    })

    // next-appointment complication
    x.fillStyle = 'rgba(243,238,231,0.08)'
    roundRect(x, 26, 368, 236, 48, 24)
    x.fill()
    x.fillStyle = '#f3eee7'
    x.font = '600 24px "Instrument Sans", sans-serif'
    x.fillText('10:30', 46, 400)
    x.fillStyle = 'rgba(243,238,231,0.6)'
    x.font = '400 20px "Instrument Sans", sans-serif'
    x.fillText('Dr. Rao · Cardio', 116, 400)

    x.restore()
    texture.needsUpdate = true
  }

  return { canvas, texture, draw }
}
