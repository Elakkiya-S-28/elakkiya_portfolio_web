import * as THREE from 'three'

/* ------------------------------------------------------------------------
 * Real project UI, drawn to CanvasTextures for the 3D devices.
 *
 * Every screen below is the actual interface of the project it belongs to —
 * Aayush's appointment home, Offline e₹'s payment home, the Aayush watch
 * screen and Finguard AI's dashboard — using the site's own palette
 * (Fraunces display, Manrope UI, --accent). Drawn once at mount at 2–3×
 * display size so text stays sharp at any camera distance.
 * ---------------------------------------------------------------------- */

const DISPLAY = '"Fraunces", Georgia, serif'
const SANS = '"Manrope", system-ui, sans-serif'

function accent() {
  if (typeof window === 'undefined') return '#b3a4ff'
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b3a4ff'
}

function surface(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { ctx, texture, w, h }
}

function appBackground(x, w, h) {
  const g = x.createLinearGradient(0, 0, w * 0.4, h)
  g.addColorStop(0, '#171226')
  g.addColorStop(0.55, '#100d1d')
  g.addColorStop(1, '#1d1530')
  x.fillStyle = g
  x.fillRect(0, 0, w, h)
}

function card(x, px, py, w, h, r) {
  x.beginPath()
  x.roundRect(px, py, w, h, r)
  x.fillStyle = 'rgba(255,255,255,0.055)'
  x.fill()
  x.strokeStyle = 'rgba(255,255,255,0.11)'
  x.lineWidth = 2
  x.stroke()
}

function statusBar(x, w) {
  x.fillStyle = 'rgba(238,234,246,0.62)'
  x.font = `600 32px ${SANS}`
  x.fillText('9:41', 48, 76)
  x.fillStyle = '#050409'
  x.beginPath()
  x.roundRect(w / 2 - 96, 24, 192, 52, 26)
  x.fill()
  x.strokeStyle = 'rgba(238,234,246,0.55)'
  x.lineWidth = 3
  x.beginPath()
  x.roundRect(w - 116, 40, 54, 26, 8)
  x.stroke()
  x.fillStyle = 'rgba(238,234,246,0.72)'
  x.fillRect(w - 112, 45, 36, 16)
}

function tabBar(x, w, h, items, active) {
  x.fillStyle = 'rgba(255,255,255,0.05)'
  x.beginPath()
  x.roundRect(40, h - 218, w - 80, 176, 38)
  x.fill()
  items.forEach((t, i) => {
    const cx = 96 + i * ((w - 130) / items.length)
    x.fillStyle = i === active ? accent() : 'rgba(238,234,246,0.4)'
    x.beginPath()
    x.arc(cx + 34, h - 158, 14, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = i === active ? '#f2eff8' : 'rgba(238,234,246,0.45)'
    x.font = `500 25px ${SANS}`
    x.fillText(t, cx - 12, h - 104)
  })
  x.fillStyle = 'rgba(238,234,246,0.5)'
  x.beginPath()
  x.roundRect(w / 2 - 88, h - 62, 176, 8, 4)
  x.fill()
}

function qrBlock(x, px, py, size) {
  x.fillStyle = '#f2eff8'
  x.beginPath()
  x.roundRect(px, py, size, size, 18)
  x.fill()
  x.fillStyle = '#0c0a16'
  const cell = size / 11
  const grid = [
    '11111010111110111011',
    '10001011100010100011',
    '11101110001110111011',
    '11000101111000100101',
    '10111010000111010011',
    '00001110110100011010',
    '11101001011010101101',
    '10010110001101010010',
    '01101011100110110100',
    '11000100011001001101',
    '10111010101110110011',
  ]
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === '1') x.fillRect(px + 10 + c * cell, py + 10 + r * cell, cell - 2, cell - 2)
    }
  }
}

/* ---- Aayush — appointment home ---------------------------------------- */
function drawAayush() {
  const { ctx, texture, w, h } = surface(720, 1548)
  const x = ctx
  const A = accent()
  x.save()
  x.beginPath()
  x.roundRect(0, 0, w, h, 62)
  x.clip()
  appBackground(x, w, h)
  statusBar(x, w)

  x.fillStyle = '#f2eff8'
  x.font = `400 64px ${DISPLAY}`
  x.fillText('Aayush', 48, 218)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `500 28px ${SANS}`
  x.fillText('Good morning, Aravind', 48, 268)

  card(x, 44, 320, w - 88, 300, 34)
  x.fillStyle = A
  x.beginPath()
  x.roundRect(44, 346, 8, 248, 4)
  x.fill()
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 24px ${SANS}`
  x.fillText('UPCOMING APPOINTMENT', 92, 380)
  x.fillStyle = '#f2eff8'
  x.font = `500 44px ${SANS}`
  x.fillText('Dr. Priya Nair', 92, 438)
  x.fillStyle = 'rgba(238,234,246,0.6)'
  x.font = `400 30px ${SANS}`
  x.fillText('Cardiology · Apollo Clinic', 92, 484)
  x.fillStyle = A
  x.font = `600 34px ${SANS}`
  x.fillText('Tomorrow, 10:30 AM', 92, 546)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `500 26px ${SANS}`
  x.fillText('Room 304 · Bring ABHA card', 92, 590)

  card(x, 44, 656, 300, 330, 30)
  qrBlock(x, 84, 700, 220)
  x.fillStyle = 'rgba(238,234,246,0.6)'
  x.font = `500 24px ${SANS}`
  x.fillText('Check-in code', 94, 962)
  card(x, 368, 656, 308, 330, 30)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('MEDICINES', 404, 700)
  const meds = [
    ['Metformin 500mg', '8:00 AM · taken', true],
    ['Telmisartan 40mg', '9:00 PM · taken', true],
    ['Vitamin D3', '1:00 PM · due', false],
  ]
  meds.forEach((m, i) => {
    const my = 748 + i * 82
    x.fillStyle = m[2] ? A : 'rgba(238,234,246,0.25)'
    x.beginPath()
    x.arc(420, my, 13, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#f2eff8'
    x.font = `500 25px ${SANS}`
    x.fillText(m[0], 448, my + 2)
    x.fillStyle = 'rgba(238,234,246,0.5)'
    x.font = `400 21px ${SANS}`
    x.fillText(m[1], 448, my + 30)
  })

  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('REPORTS', 48, 1080)
  card(x, 44, 1102, w - 88, 96, 24)
  x.fillStyle = '#f2eff8'
  x.font = `500 27px ${SANS}`
  x.fillText('Blood panel — Mar 12', 84, 1160)
  x.fillStyle = 'rgba(238,234,246,0.5)'
  x.font = `400 24px ${SANS}`
  x.fillText('PDF · 2.1 MB', 540, 1160)

  tabBar(x, w, h, ['Home', 'Visits', 'Reports', 'Profile'], 0)
  x.restore()
  texture.needsUpdate = true
  return texture
}

/* ---- Offline e₹ — payment home ---------------------------------------- */
function drawErupee() {
  const { ctx, texture, w, h } = surface(720, 1548)
  const x = ctx
  const A = accent()
  x.save()
  x.beginPath()
  x.roundRect(0, 0, w, h, 62)
  x.clip()
  appBackground(x, w, h)
  statusBar(x, w)

  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 24px ${SANS}`
  x.fillText('DIGITAL RUPEE WALLET', 48, 210)
  x.fillStyle = '#f2eff8'
  x.font = `400 104px ${DISPLAY}`
  x.fillText('₹2,450.00', 48, 330)
  x.fillStyle = 'rgba(179,164,255,0.16)'
  x.beginPath()
  x.roundRect(48, 366, 430, 62, 31)
  x.fill()
  x.fillStyle = A
  x.beginPath()
  x.arc(84, 397, 12, 0, Math.PI * 2)
  x.fill()
  x.fillStyle = '#f2eff8'
  x.font = `500 27px ${SANS}`
  x.fillText('Offline payments ready', 110, 406)

  const actions = ['Pay', 'Request', 'Scan']
  actions.forEach((a, i) => {
    const ax = 48 + i * 214
    if (i === 0) {
      x.fillStyle = A
      x.beginPath()
      x.roundRect(ax, 470, 190, 84, 26)
      x.fill()
      x.fillStyle = '#0c0a16'
    } else {
      card(x, ax, 470, 190, 84, 26)
      x.fillStyle = 'rgba(238,234,246,0.8)'
    }
    x.font = `600 29px ${SANS}`
    x.fillText(a, ax + 56, 522)
  })

  card(x, 44, 596, w - 88, 128, 28)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `400 26px ${SANS}`
  x.fillText('Made and settled without the internet —', 84, 648)
  x.fillText('secure end-to-end, usable where the network is not.', 84, 688)

  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('RECENT', 48, 792)
  const tx = [
    ['Auto fare', '−₹42', 'offline · settled', true],
    ['Tea stall', '−₹15', 'offline · settled', true],
    ['Recharge', '+₹199', 'online · just now', false],
    ['Grocery', '−₹384', 'online · yesterday', false],
  ]
  tx.forEach((t, i) => {
    const ty = 828 + i * 128
    card(x, 44, ty, w - 88, 108, 24)
    x.fillStyle = '#f2eff8'
    x.font = `500 29px ${SANS}`
    x.fillText(t[0], 84, ty + 48)
    x.fillStyle = 'rgba(238,234,246,0.5)'
    x.font = `400 22px ${SANS}`
    x.fillText(t[2], 84, ty + 80)
    x.textAlign = 'right'
    x.fillStyle = t[3] ? 'rgba(238,234,246,0.85)' : A
    x.font = `600 30px ${SANS}`
    x.fillText(t[1], w - 84, ty + 50)
    if (t[3]) {
      x.fillStyle = A
      x.font = `600 20px ${SANS}`
      x.fillText('OFFLINE', w - 84, ty + 82)
    }
    x.textAlign = 'start'
  })

  tabBar(x, w, h, ['Home', 'Pay', 'History', 'Profile'], 0)
  x.restore()
  texture.needsUpdate = true
  return texture
}

/* ---- Aayush watch — appointments + QR on the wrist --------------------- */
function drawAayushWatch() {
  const { ctx, texture, w, h } = surface(460, 540)
  const x = ctx
  const A = accent()
  x.save()
  x.beginPath()
  x.roundRect(0, 0, w, h, 96)
  x.clip()
  const g = x.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#141020')
  g.addColorStop(1, '#0c0a16')
  x.fillStyle = g
  x.fillRect(0, 0, w, h)

  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('9:41', 40, 64)
  x.textAlign = 'right'
  x.fillText('SUN 21', w - 40, 64)
  x.textAlign = 'start'

  x.fillStyle = A
  x.font = `600 20px ${SANS}`
  x.fillText('NEXT APPOINTMENT', 40, 124)
  x.fillStyle = '#f2eff8'
  x.font = `500 34px ${SANS}`
  x.fillText('Dr. Priya Nair', 40, 168)
  x.fillStyle = 'rgba(238,234,246,0.6)'
  x.font = `400 24px ${SANS}`
  x.fillText('Cardiology · Apollo', 40, 202)
  x.fillStyle = A
  x.font = `600 28px ${SANS}`
  x.fillText('Tomorrow · 10:30 AM', 40, 240)

  x.fillStyle = '#f2eff8'
  x.beginPath()
  x.roundRect(96, 268, 268, 236, 22)
  x.fill()
  qrBlock(x, 132, 296, 196)

  x.fillStyle = 'rgba(238,234,246,0.6)'
  x.font = `500 22px ${SANS}`
  x.fillText('Room 304 · ABHA linked', 40, h - 34)
  x.restore()
  texture.needsUpdate = true
  return texture
}

/* ---- Finguard AI — expenses dashboard ---------------------------------- */
function drawFinguard() {
  const { ctx, texture, w, h } = surface(1280, 800)
  const x = ctx
  const A = accent()
  x.save()
  x.beginPath()
  x.roundRect(0, 0, w, h, 26)
  x.clip()
  appBackground(x, w, h)

  x.fillStyle = 'rgba(255,255,255,0.045)'
  x.fillRect(0, 0, 210, h)
  x.fillStyle = '#f2eff8'
  x.font = `400 34px ${DISPLAY}`
  x.fillText('Finguard', 32, 78)
  const nav = ['Overview', 'Transactions', 'Budgets', 'Reports', 'Settings']
  nav.forEach((n, i) => {
    x.fillStyle = i === 0 ? A : 'rgba(238,234,246,0.45)'
    x.font = `500 22px ${SANS}`
    x.fillText(n, 32, 170 + i * 52)
  })

  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `500 22px ${SANS}`
  x.fillText('Overview · March', 260, 64)
  x.fillStyle = '#f2eff8'
  x.font = `400 52px ${DISPLAY}`
  x.fillText('₹48,220 spent this month', 256, 122)

  const chips = [
    ['Budget left', '₹11,780', A],
    ['Top category', 'Food · 34%', '#f2eff8'],
    ['Safe to spend', '₹1,120 / day', '#f2eff8'],
  ]
  chips.forEach((c, i) => {
    const cx = 256 + i * 330
    card(x, cx, 156, 300, 96, 20)
    x.fillStyle = 'rgba(238,234,246,0.5)'
    x.font = `500 20px ${SANS}`
    x.fillText(c[0].toUpperCase(), cx + 24, 194)
    x.fillStyle = c[2]
    x.font = `600 30px ${SANS}`
    x.fillText(c[1], cx + 24, 232)
  })

  card(x, 256, 286, 620, 330, 24)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('DAILY SPENDING', 288, 330)
  const bars = [62, 40, 74, 30, 88, 52, 44, 96, 58, 36, 70, 48, 84, 66]
  const bw = (620 - 64) / bars.length
  bars.forEach((b, i) => {
    const bh = (b / 100) * 200
    x.fillStyle = i === 7 ? A : 'rgba(179,164,255,0.28)'
    x.beginPath()
    x.roundRect(288 + i * bw, 560 - bh, bw - 10, bh, 6)
    x.fill()
  })
  x.fillStyle = 'rgba(238,234,246,0.4)'
  x.font = `500 18px ${SANS}`
  ;['W1', 'W2', 'W3', 'W4'].forEach((t, i) => x.fillText(t, 300 + i * 148, 596))

  card(x, 908, 286, 344, 330, 24)
  x.fillStyle = 'rgba(238,234,246,0.55)'
  x.font = `600 22px ${SANS}`
  x.fillText('BUDGETS', 940, 330)
  const budgets = [
    ['Food', 0.34],
    ['Travel', 0.58],
    ['Bills', 0.22],
    ['Shopping', 0.76],
  ]
  budgets.forEach((b, i) => {
    const by = 372 + i * 60
    x.fillStyle = '#f2eff8'
    x.font = `500 24px ${SANS}`
    x.fillText(b[0], 940, by)
    x.fillStyle = 'rgba(255,255,255,0.1)'
    x.beginPath()
    x.roundRect(940, by + 10, 240, 10, 5)
    x.fill()
    x.fillStyle = b[1] > 0.7 ? '#ffb4a8' : A
    x.beginPath()
    x.roundRect(940, by + 10, 240 * b[1], 10, 5)
    x.fill()
  })

  x.restore()
  texture.needsUpdate = true
  return texture
}

/* ---- materials + registry ----------------------------------------------- */
export function makeScreenMaterial(texture) {
  return new THREE.MeshStandardMaterial({
    map: texture || null,
    emissive: 0xffffff,
    emissiveMap: texture || null,
    emissiveIntensity: 0.85,
    roughness: 0.22,
    metalness: 0,
  })
}

let screenCache = null
export function getScreen(name) {
  if (typeof window === 'undefined') return null
  if (!screenCache) {
    screenCache = {
      aayush: drawAayush(),
      erupee: drawErupee(),
      aayushWatch: drawAayushWatch(),
      finguard: drawFinguard(),
    }
  }
  return screenCache[name] || null
}

export const SCREENS = typeof Proxy !== 'undefined'
  ? new Proxy({}, { get: (_, prop) => getScreen(prop) })
  : {}
