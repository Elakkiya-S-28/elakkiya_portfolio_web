import * as THREE from 'three'

/* ------------------------------------------------------------------------
 * Canvas-drawn faces for the redesigned hero 3D composition.
 *
 * Everything the phone shows and every floating tile in the orbit is drawn
 * here once at mount and handed to three.js as a CanvasTexture. Drawing the
 * UI in 2D keeps the polygon count of the scene tiny (planes, not modelled
 * controls) while staying pixel-sharp at any dolly distance.
 *
 * Palette, type and corner radii intentionally mirror the DOM: Fraunces for
 * display numerals, Manrope for everything else, and the same glass greys
 * used by `--panel` / `--chalk` in globals.css.
 * --------------------------------------------------------------------- */

const DISPLAY = '"Fraunces", Georgia, serif'
const SANS = '"Manrope", system-ui, sans-serif'

function getAccent() {
  if (typeof window === 'undefined') return '#b3a4ff'
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b3a4ff'
}

function canvasTexture(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { canvas, ctx, texture }
}

function glassPanel(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = 'rgba(255,255,255,0.055)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function accentPanel(ctx, x, y, w, h, r, color) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, colorWithAlpha(color, 0.22))
  g.addColorStop(1, colorWithAlpha(color, 0.06))
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = colorWithAlpha(color, 0.4)
  ctx.lineWidth = 1.5
  ctx.stroke()
}

/**
 * Premium hero phone screen — cinematic portfolio app UI.
 * Deep purple/violet dark theme, editorial typography, rich data.
 */
export function createHeroPhoneScreen() {
  const { ctx, texture } = canvasTexture(720, 1548)

  function draw() {
    const x = ctx
    const W = 720
    const H = 1548
    x.clearRect(0, 0, W, H)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, W, H, 60)
    x.clip()

    // Premium deep gradient background
    const bg = x.createLinearGradient(0, 0, W * 0.5, H)
    bg.addColorStop(0, '#0f0c1e')
    bg.addColorStop(0.4, '#0d0b1a')
    bg.addColorStop(1, '#130f22')
    x.fillStyle = bg
    x.fillRect(0, 0, W, H)

    // Subtle radial glow top-left
    const glowTL = x.createRadialGradient(120, 200, 10, 120, 200, 380)
    glowTL.addColorStop(0, 'rgba(179,164,255,0.12)')
    glowTL.addColorStop(1, 'transparent')
    x.fillStyle = glowTL
    x.fillRect(0, 0, W, H)

    // Subtle radial glow bottom-right
    const glowBR = x.createRadialGradient(W - 100, H - 300, 10, W - 100, H - 300, 320)
    glowBR.addColorStop(0, 'rgba(216,213,229,0.07)')
    glowBR.addColorStop(1, 'transparent')
    x.fillStyle = glowBR
    x.fillRect(0, 0, W, H)

    // ── Status Bar ──
    x.fillStyle = 'rgba(238,234,246,0.58)'
    x.font = `600 30px ${SANS}`
    x.fillText('9:41', 48, 76)

    // Dynamic Island
    x.fillStyle = '#060409'
    x.beginPath()
    x.roundRect(252, 22, 216, 52, 26)
    x.fill()

    // Battery + signal
    x.fillStyle = 'rgba(238,234,246,0.55)'
    x.fillRect(572, 47, 5, 14)
    x.fillRect(582, 41, 5, 20)
    x.strokeStyle = 'rgba(238,234,246,0.45)'
    x.lineWidth = 2.5
    x.beginPath()
    x.roundRect(598, 40, 52, 26, 8)
    x.stroke()
    x.fillStyle = 'rgba(238,234,246,0.65)'
    x.fillRect(602, 44, 36, 18)

    // ── Profile greeting ──
    x.fillStyle = 'rgba(216,213,229,0.5)'
    x.font = `500 28px ${SANS}`
    x.fillText('PORTFOLIO', 48, 156)

    x.fillStyle = '#f2eff8'
    x.font = `300 72px ${DISPLAY}`
    x.fillText('Elakkiya', 48, 240)
    x.fillStyle = '#b3a4ff'
    x.font = `300 72px ${DISPLAY}`
    x.fillText('Selvarajan', 48, 322)

    x.fillStyle = 'rgba(216,213,229,0.6)'
    x.font = `400 30px ${SANS}`
    x.fillText('Frontend Developer & React Native', 48, 376)

    // ── Separator line ──
    const sep = x.createLinearGradient(48, 0, W - 48, 0)
    sep.addColorStop(0, 'rgba(179,164,255,0.5)')
    sep.addColorStop(1, 'rgba(216,213,229,0.05)')
    x.fillStyle = sep
    x.fillRect(48, 408, W - 96, 1.5)

    // ── Three capability cards ──
    const cards = [
      {
        icon: '📱',
        title: 'Mobile Engineering',
        sub: 'React Native · Swift · Kotlin',
        tag: 'iOS & Android',
        accent: '#b3a4ff',
      },
      {
        icon: '🌐',
        title: 'Web Applications',
        sub: 'React · Next.js · TypeScript',
        tag: 'Production Ready',
        accent: '#a8d4ff',
      },
      {
        icon: '⚙️',
        title: 'Backend & APIs',
        sub: 'NestJS · Express · PostgreSQL',
        tag: 'Full-Stack',
        accent: '#7ee787',
      },
    ]

    cards.forEach((c, i) => {
      const cy = 444 + i * 196
      const cardH = 170

      // Card glass background
      const cg = x.createLinearGradient(48, cy, W - 48, cy + cardH)
      cg.addColorStop(0, 'rgba(255,255,255,0.06)')
      cg.addColorStop(1, 'rgba(255,255,255,0.02)')
      x.fillStyle = cg
      x.beginPath()
      x.roundRect(48, cy, W - 96, cardH, 28)
      x.fill()

      x.strokeStyle = 'rgba(255,255,255,0.1)'
      x.lineWidth = 1.5
      x.stroke()

      // Accent left bar
      const barGrad = x.createLinearGradient(48, cy, 48, cy + cardH)
      barGrad.addColorStop(0, c.accent)
      barGrad.addColorStop(1, colorWithAlpha(c.accent, 0.2))
      x.fillStyle = barGrad
      x.beginPath()
      x.roundRect(48, cy + 18, 5, cardH - 36, 3)
      x.fill()

      // Icon circle
      const iconR = x.createRadialGradient(120, cy + 58, 0, 120, cy + 58, 42)
      iconR.addColorStop(0, colorWithAlpha(c.accent, 0.3))
      iconR.addColorStop(1, colorWithAlpha(c.accent, 0.06))
      x.fillStyle = iconR
      x.beginPath()
      x.arc(120, cy + 58, 36, 0, Math.PI * 2)
      x.fill()
      x.font = `500 36px ${SANS}`
      x.fillStyle = '#f2eff8'
      x.textAlign = 'center'
      x.fillText(c.icon, 120, cy + 72)
      x.textAlign = 'left'

      // Title
      x.fillStyle = '#f2eff8'
      x.font = `600 36px ${SANS}`
      x.fillText(c.title, 176, cy + 50)

      // Sub text
      x.fillStyle = 'rgba(216,213,229,0.65)'
      x.font = `400 26px ${SANS}`
      x.fillText(c.sub, 176, cy + 90)

      // Tag pill
      x.fillStyle = colorWithAlpha(c.accent, 0.15)
      x.beginPath()
      x.roundRect(176, cy + 112, measureText(x, c.tag, `600 22px ${SANS}`) + 32, 36, 18)
      x.fill()
      x.strokeStyle = colorWithAlpha(c.accent, 0.35)
      x.lineWidth = 1
      x.stroke()
      x.fillStyle = c.accent
      x.font = `600 22px ${SANS}`
      x.fillText(c.tag, 192, cy + 136)
    })

    // ── Stats row ──
    const statsY = 1076
    const stats = [
      { n: '3+', label: 'Years' },
      { n: '6', label: 'Projects' },
      { n: '2', label: 'App Stores' },
    ]
    // Stats background
    glassPanel(x, 48, statsY, W - 96, 100, 24)

    stats.forEach((s, i) => {
      const cx = 48 + i * ((W - 96) / 3) + (W - 96) / 6
      x.fillStyle = '#b3a4ff'
      x.font = `700 42px ${DISPLAY}`
      x.textAlign = 'center'
      x.fillText(s.n, cx, statsY + 52)
      x.fillStyle = 'rgba(216,213,229,0.58)'
      x.font = `500 24px ${SANS}`
      x.fillText(s.label, cx, statsY + 84)
    })
    x.textAlign = 'left'

    // Dividers between stats
    x.fillStyle = 'rgba(255,255,255,0.1)'
    x.fillRect(48 + (W - 96) / 3, statsY + 14, 1.5, 72)
    x.fillRect(48 + (2 * (W - 96)) / 3, statsY + 14, 1.5, 72)

    // ── Current role chip ──
    const chipY = 1210
    accentPanel(x, 48, chipY, W - 96, 86, 22, '#b3a4ff')
    x.fillStyle = '#7ee787'
    x.beginPath()
    x.arc(86, chipY + 43, 8, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#f2eff8'
    x.font = `600 30px ${SANS}`
    x.fillText('Plenome Technologies · Active', 108, chipY + 32)
    x.fillStyle = 'rgba(216,213,229,0.6)'
    x.font = `400 26px ${SANS}`
    x.fillText('Frontend Developer, React Native · Aug 2023', 108, chipY + 64)

    // ── Tab bar ──
    const tabY = 1340
    const tabBg = x.createLinearGradient(0, tabY, 0, H)
    tabBg.addColorStop(0, 'rgba(15,12,30,0.96)')
    tabBg.addColorStop(1, 'rgba(10,8,22,1)')
    x.fillStyle = tabBg
    x.fillRect(0, tabY, W, H - tabY)

    // Tab separator
    x.fillStyle = 'rgba(255,255,255,0.08)'
    x.fillRect(0, tabY, W, 1)

    const tabs = [
      { icon: '⬤', label: 'Home', active: true },
      { icon: '◈', label: 'Work' },
      { icon: '◎', label: 'Skills' },
      { icon: '◇', label: 'Contact' },
    ]
    tabs.forEach((t, i) => {
      const tx = 90 + i * 168
      const ty = tabY + 54

      if (t.active) {
        x.fillStyle = 'rgba(179,164,255,0.18)'
        x.beginPath()
        x.roundRect(tx - 34, ty - 34, 68, 68, 20)
        x.fill()
      }

      x.fillStyle = t.active ? '#b3a4ff' : 'rgba(238,234,246,0.32)'
      x.font = `600 26px ${SANS}`
      x.textAlign = 'center'
      x.fillText(t.icon, tx, ty - 2)
      x.font = `500 23px ${SANS}`
      x.fillText(t.label, tx, ty + 28)
    })
    x.textAlign = 'left'

    // Home indicator
    x.fillStyle = 'rgba(238,234,246,0.45)'
    x.beginPath()
    x.roundRect(W / 2 - 80, H - 48, 160, 6, 3)
    x.fill()

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

function measureText(ctx, text, font) {
  ctx.save()
  ctx.font = font
  const w = ctx.measureText(text).width
  ctx.restore()
  return w
}

/** Floating code editor panel — premium VS Code dark theme aesthetic */
export function createCodePanel() {
  const { ctx, texture } = canvasTexture(760, 520)

  function draw() {
    const x = ctx
    const A = getAccent()
    x.clearRect(0, 0, 760, 520)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, 760, 520, 32)
    x.clip()

    // Background
    const g = x.createLinearGradient(0, 0, 0, 520)
    g.addColorStop(0, '#161228')
    g.addColorStop(1, '#0c0a1a')
    x.fillStyle = g
    x.fillRect(0, 0, 760, 520)

    // Glass border
    x.strokeStyle = 'rgba(255,255,255,0.1)'
    x.lineWidth = 1.5
    x.strokeRect(0.75, 0.75, 758.5, 518.5)

    // Title bar
    x.fillStyle = 'rgba(255,255,255,0.04)'
    x.fillRect(0, 0, 760, 52)

    ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      x.fillStyle = c
      x.beginPath()
      x.arc(22 + i * 28, 26, 8, 0, Math.PI * 2)
      x.fill()
    })

    // Tab
    x.fillStyle = 'rgba(255,255,255,0.06)'
    x.beginPath()
    x.roundRect(88, 10, 200, 32, [6, 6, 0, 0])
    x.fill()
    x.fillStyle = A
    x.fillRect(88, 10, 3, 32)
    x.fillStyle = 'rgba(238,234,246,0.7)'
    x.font = `500 20px ${SANS}`
    x.fillText('api.service.ts', 100, 31)

    // Line numbers background
    x.fillStyle = 'rgba(0,0,0,0.25)'
    x.fillRect(0, 52, 68, 468)

    // Code lines with proper syntax highlighting
    const lines = [
      { n: '1', tokens: [] },
      { n: '2', tokens: [{ t: 'import ', c: '#cfc4ff' }, { t: '{ Injectable }', c: '#f2eff8' }, { t: ' from ', c: '#cfc4ff' }, { t: "'@nestjs/common'", c: '#98d898' }] },
      { n: '3', tokens: [] },
      { n: '4', tokens: [{ t: '@Injectable()', c: A }] },
      { n: '5', tokens: [{ t: 'export class ', c: '#cfc4ff' }, { t: 'ApiService', c: '#7dd3fc' }, { t: ' {', c: '#f2eff8' }] },
      { n: '6', tokens: [{ t: '  private ', c: '#cfc4ff' }, { t: 'readonly ', c: '#cfc4ff' }, { t: 'endpoint', c: '#f2eff8' }, { t: ': ', c: '#cfc4ff' }, { t: 'string', c: '#7dd3fc' }] },
      { n: '7', tokens: [] },
      { n: '8', tokens: [{ t: '  async ', c: '#cfc4ff' }, { t: 'fetchPortfolio', c: '#7dd3fc' }, { t: '()', c: '#f2eff8' }, { t: ': Promise<', c: '#cfc4ff' }, { t: 'Portfolio', c: '#7dd3fc' }, { t: '>', c: '#cfc4ff' }, { t: ' {', c: '#f2eff8' }] },
      { n: '9', tokens: [{ t: '    const ', c: '#cfc4ff' }, { t: 'res', c: '#f2eff8' }, { t: ' = await ', c: '#cfc4ff' }, { t: 'fetch', c: '#7dd3fc' }, { t: '(', c: '#f2eff8' }] },
      { n: '10', tokens: [{ t: '      ', c: '' }, { t: '`${this.endpoint}', c: '#98d898' }, { t: '/v1/portfolio`', c: '#98d898' }] },
      { n: '11', tokens: [{ t: '    )', c: '#f2eff8' }] },
      { n: '12', tokens: [{ t: '    return ', c: '#cfc4ff' }, { t: 'res', c: '#f2eff8' }, { t: '.json()', c: '#7dd3fc' }] },
    ]

    lines.forEach(({ n, tokens }, i) => {
      const ly = 82 + i * 36
      x.fillStyle = 'rgba(238,234,246,0.22)'
      x.font = `400 19px ${SANS}`
      x.fillText(n, 22, ly)

      let tx = 82
      tokens.forEach(({ t, c }) => {
        if (!c) { tx += x.measureText(t).width; return }
        x.fillStyle = c
        x.font = `400 20px ${SANS}`
        x.fillText(t, tx, ly)
        tx += x.measureText(t).width
      })
    })

    // Cursor blink
    x.fillStyle = A
    x.fillRect(82, 512 - 36 + 5, 2, 22)

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

/** API Architecture diagram — clean, premium node graph */
export function createApiDiagram() {
  const { ctx, texture } = canvasTexture(760, 560)

  function draw() {
    const x = ctx
    const A = getAccent()
    x.clearRect(0, 0, 760, 560)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, 760, 560, 34)
    x.clip()

    // Background
    const g = x.createLinearGradient(0, 0, 760, 560)
    g.addColorStop(0, 'rgba(14,12,28,0.96)')
    g.addColorStop(1, 'rgba(10,8,22,0.96)')
    x.fillStyle = g
    x.fillRect(0, 0, 760, 560)

    x.strokeStyle = 'rgba(255,255,255,0.1)'
    x.lineWidth = 1.5
    x.strokeRect(0.75, 0.75, 758.5, 558.5)

    // Label
    x.fillStyle = 'rgba(216,213,229,0.45)'
    x.font = `700 20px ${SANS}`
    x.fillText('SYSTEM ARCHITECTURE', 36, 46)

    // Connection lines
    const drawConn = (x1, y1, x2, y2) => {
      x.strokeStyle = 'rgba(179,164,255,0.3)'
      x.lineWidth = 2
      x.setLineDash([6, 4])
      x.beginPath()
      x.moveTo(x1, y1)
      x.lineTo(x2, y2)
      x.stroke()
      x.setLineDash([])
      // Arrow dot
      x.fillStyle = 'rgba(179,164,255,0.5)'
      x.beginPath()
      x.arc(x2, y2, 5, 0, Math.PI * 2)
      x.fill()
    }

    // Central API hub (center, slightly above middle)
    const hubX = 380, hubY = 192
    const hubR = 58
    const hubGrad = x.createRadialGradient(hubX, hubY, 0, hubX, hubY, hubR)
    hubGrad.addColorStop(0, 'rgba(179,164,255,0.35)')
    hubGrad.addColorStop(1, 'rgba(179,164,255,0.08)')
    x.fillStyle = hubGrad
    x.beginPath()
    x.arc(hubX, hubY, hubR, 0, Math.PI * 2)
    x.fill()
    x.strokeStyle = A
    x.lineWidth = 2.5
    x.stroke()
    x.fillStyle = '#f2eff8'
    x.font = `700 34px ${SANS}`
    x.textAlign = 'center'
    x.fillText('API', hubX, hubY - 6)
    x.fillStyle = 'rgba(216,213,229,0.55)'
    x.font = `400 20px ${SANS}`
    x.fillText('gateway', hubX, hubY + 22)
    x.textAlign = 'left'

    // Three service nodes
    const nodes = [
      { x: 130, y: 420, label: 'Frontend', sub: 'React · Next.js', c: '#7dd3fc' },
      { x: 380, y: 440, label: 'Backend', sub: 'NestJS · Node', c: '#98d898' },
      { x: 628, y: 420, label: 'Database', sub: 'PostgreSQL', c: A },
    ]

    nodes.forEach((n) => {
      drawConn(hubX, hubY + hubR, n.x, n.y - 36)

      const ng = x.createLinearGradient(n.x - 96, n.y - 36, n.x + 96, n.y + 56)
      ng.addColorStop(0, 'rgba(255,255,255,0.07)')
      ng.addColorStop(1, 'rgba(255,255,255,0.03)')
      x.fillStyle = ng
      x.beginPath()
      x.roundRect(n.x - 96, n.y - 36, 192, 88, 20)
      x.fill()
      x.strokeStyle = colorWithAlpha(n.c, 0.35)
      x.lineWidth = 1.5
      x.stroke()

      x.fillStyle = n.c
      x.font = `700 28px ${SANS}`
      x.textAlign = 'center'
      x.fillText(n.label, n.x, n.y + 4)
      x.fillStyle = 'rgba(216,213,229,0.55)'
      x.font = `400 20px ${SANS}`
      x.fillText(n.sub, n.x, n.y + 34)
    })
    x.textAlign = 'start'

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

/**
 * Realtime analytics hologram — live glowing line graph + database visual.
 * `tick()` is called from the frame loop with a phase value so the trace moves.
 */
export function createAnalyticsPanel() {
  const { ctx, texture } = canvasTexture(760, 500)
  const SERIES = 28
  const values = Array.from({ length: SERIES }, (_, i) => 0.4 + Math.sin(i * 0.7) * 0.18)

  function draw(phase = 0) {
    const x = ctx
    const A = getAccent()
    x.clearRect(0, 0, 760, 500)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, 760, 500, 34)
    x.clip()

    const bg = x.createLinearGradient(0, 0, 760, 500)
    bg.addColorStop(0, 'rgba(14,12,28,0.92)')
    bg.addColorStop(1, 'rgba(10,8,20,0.92)')
    x.fillStyle = bg
    x.fillRect(0, 0, 760, 500)

    x.strokeStyle = 'rgba(255,255,255,0.09)'
    x.lineWidth = 1.5
    x.strokeRect(0.75, 0.75, 758.5, 498.5)

    // Live badge
    x.fillStyle = '#7ee787'
    x.beginPath()
    x.arc(46, 48, 8, 0, Math.PI * 2)
    x.fill()
    // Pulsing halo
    x.strokeStyle = 'rgba(126,231,135,0.3)'
    x.lineWidth = 4
    x.beginPath()
    x.arc(46, 48, 14 + Math.sin(phase) * 3, 0, Math.PI * 2)
    x.stroke()

    x.fillStyle = '#f2eff8'
    x.font = `600 26px ${SANS}`
    x.fillText('LIVE', 68, 58)
    x.fillStyle = 'rgba(216,213,229,0.5)'
    x.font = `400 24px ${SANS}`
    x.fillText(' · Realtime API Monitor', 104, 58)

    // Metric pills top-right
    const metrics = [
      { v: '98.2%', l: 'uptime', c: '#7ee787' },
      { v: '24ms', l: 'p99', c: A },
    ]
    let mx = 580
    metrics.forEach(m => {
      x.fillStyle = colorWithAlpha(m.c, 0.15)
      x.beginPath()
      x.roundRect(mx, 28, 100, 40, 20)
      x.fill()
      x.strokeStyle = colorWithAlpha(m.c, 0.4)
      x.lineWidth = 1
      x.stroke()
      x.fillStyle = m.c
      x.font = `700 20px ${SANS}`
      x.textAlign = 'center'
      x.fillText(m.v, mx + 50, 48)
      x.fillStyle = 'rgba(216,213,229,0.5)'
      x.font = `400 17px ${SANS}`
      x.fillText(m.l, mx + 50, 63)
      mx += 112
    })
    x.textAlign = 'left'

    // Grid lines
    x.strokeStyle = 'rgba(255,255,255,0.06)'
    x.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const gy = 120 + i * 66
      x.beginPath()
      x.moveTo(48, gy)
      x.lineTo(640, gy)
      x.stroke()
    }

    // Filled area under curve
    x.beginPath()
    x.moveTo(48, 450)
    for (let i = 0; i < SERIES; i++) {
      const px = 48 + (i / (SERIES - 1)) * 592
      const py = 430 - values[i] * 280
      if (i === 0) x.moveTo(px, py)
      else x.lineTo(px, py)
    }
    x.lineTo(640, 450)
    x.closePath()
    const areaGrad = x.createLinearGradient(0, 120, 0, 450)
    areaGrad.addColorStop(0, 'rgba(179,164,255,0.3)')
    areaGrad.addColorStop(1, 'rgba(179,164,255,0.0)')
    x.fillStyle = areaGrad
    x.fill()

    // Rolling trace line
    x.lineWidth = 3
    x.lineCap = 'round'
    x.lineJoin = 'round'
    for (let i = 0; i < SERIES - 1; i++) {
      const x1 = 48 + (i / (SERIES - 1)) * 592
      const x2 = 48 + ((i + 1) / (SERIES - 1)) * 592
      const y1 = 430 - values[i] * 280
      const y2 = 430 - values[i + 1] * 280
      const alpha = 0.4 + (i / SERIES) * 0.6
      x.strokeStyle = `rgba(179,164,255,${alpha})`
      x.beginPath()
      x.moveTo(x1, y1)
      x.lineTo(x2, y2)
      x.stroke()
    }

    // Leading glow dot
    const lx = 640
    const ly = 430 - values[SERIES - 1] * 280 + Math.sin(phase * 2) * 3
    const dotGlow = x.createRadialGradient(lx, ly, 0, lx, ly, 20)
    dotGlow.addColorStop(0, 'rgba(179,164,255,0.6)')
    dotGlow.addColorStop(1, 'transparent')
    x.fillStyle = dotGlow
    x.fillRect(lx - 20, ly - 20, 40, 40)
    x.fillStyle = A
    x.beginPath()
    x.arc(lx, ly, 7, 0, Math.PI * 2)
    x.fill()
    x.strokeStyle = 'rgba(255,255,255,0.6)'
    x.lineWidth = 2
    x.stroke()

    // Database cylinders (right side)
    const dbX = 700, dbY = 200
    ;[0, 1, 2].forEach((i) => {
      const cy = dbY + i * 30
      x.fillStyle = i === 0 ? 'rgba(179,164,255,0.55)' : `rgba(179,164,255,${0.25 - i * 0.04})`
      x.beginPath()
      x.ellipse(dbX, cy, 48, 15, 0, 0, Math.PI * 2)
      x.fill()
      x.fillStyle = `rgba(179,164,255,${0.1 - i * 0.02})`
      x.fillRect(dbX - 48, cy, 96, 30)
      x.fillStyle = i === 0 ? 'rgba(179,164,255,0.55)' : `rgba(179,164,255,${0.25 - i * 0.04})`
      x.beginPath()
      x.ellipse(dbX, cy + 30, 48, 15, 0, Math.PI, Math.PI * 2)
      x.fill()
    })
    x.fillStyle = 'rgba(216,213,229,0.55)'
    x.font = `600 22px ${SANS}`
    x.textAlign = 'center'
    x.fillText('events', dbX, 310)
    x.textAlign = 'left'

    x.restore()
    texture.needsUpdate = true
  }

  function tick(phase) {
    values.shift()
    values.push(Math.max(0.15, Math.min(0.9, 0.42 + Math.sin(phase * 1.7) * 0.22 + (Math.random() - 0.5) * 0.22)))
    draw(phase)
  }

  draw(0)
  return { texture, tick }
}

/** Small square technology tile shown in the orbit (React, TS, JS, …). */
export function createTechTile(label, tint) {
  const { ctx, texture } = canvasTexture(256, 256)

  function draw() {
    const x = ctx
    x.clearRect(0, 0, 256, 256)
    x.save()
    x.beginPath()
    x.roundRect(8, 8, 240, 240, 48)
    x.clip()

    // Gradient background
    const g = x.createLinearGradient(0, 0, 256, 256)
    g.addColorStop(0, 'rgba(30,26,48,0.9)')
    g.addColorStop(1, 'rgba(14,12,24,0.97)')
    x.fillStyle = g
    x.fillRect(0, 0, 256, 256)

    // Inner radial glow from tint
    const glow = x.createRadialGradient(128, 100, 5, 128, 110, 90)
    glow.addColorStop(0, colorWithAlpha(tint, 0.28))
    glow.addColorStop(1, 'transparent')
    x.fillStyle = glow
    x.fillRect(0, 0, 256, 256)

    x.restore()

    // Border with subtle glow
    x.strokeStyle = colorWithAlpha(tint, 0.38)
    x.lineWidth = 2.5
    x.beginPath()
    x.roundRect(8, 8, 240, 240, 48)
    x.stroke()

    // Inner top-left highlight
    x.strokeStyle = 'rgba(255,255,255,0.1)'
    x.lineWidth = 1
    x.beginPath()
    x.roundRect(10, 10, 238, 238, 46)
    x.stroke()

    x.save()
    x.translate(128, 120)

    if (label === 'React') {
      x.fillStyle = tint
      x.beginPath()
      x.arc(0, 0, 12, 0, Math.PI * 2)
      x.fill()
      x.strokeStyle = tint
      x.lineWidth = 5.5
      for (let i = 0; i < 3; i++) {
        x.save()
        x.rotate((i * Math.PI) / 3)
        x.beginPath()
        x.ellipse(0, 0, 62, 22, 0, 0, Math.PI * 2)
        x.stroke()
        x.restore()
      }
    } else if (label === 'DB') {
      x.strokeStyle = tint
      x.fillStyle = colorWithAlpha(tint, 0.28)
      x.lineWidth = 4.5
      ;[-34, 0, 34].forEach((dy) => {
        x.beginPath()
        x.ellipse(0, dy, 48, 16, 0, 0, Math.PI * 2)
        x.fill()
        x.stroke()
      })
      x.beginPath()
      x.moveTo(-48, -34)
      x.lineTo(-48, 50)
      x.moveTo(48, -34)
      x.lineTo(48, 50)
      x.stroke()
    } else if (label === 'Swift') {
      x.fillStyle = tint
      x.beginPath()
      x.moveTo(36, -40)
      x.bezierCurveTo(8, -18, -26, 10, -42, 40)
      x.bezierCurveTo(-12, 28, 22, 12, 44, -10)
      x.bezierCurveTo(22, 0, -8, 18, -30, 28)
      x.bezierCurveTo(-8, -2, 18, -28, 36, -40)
      x.fill()
    } else if (label === 'K') {
      x.fillStyle = tint
      x.font = `700 110px ${SANS}`
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      x.fillText('K', 0, 6)
    } else {
      x.fillStyle = tint
      x.font = `700 86px ${SANS}`
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      x.fillText(label, 0, 4)
    }

    x.restore()

    // Label at bottom
    x.fillStyle = 'rgba(216,213,229,0.65)'
    x.font = `600 22px ${SANS}`
    x.textAlign = 'center'
    x.fillText(label, 128, 222)
    x.textAlign = 'left'

    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

function colorWithAlpha(hex, a) {
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  return hex
}

/** Watch screen on the hero rock pedestal — premium Apple Watch UI */
export function createHeroWatchScreen() {
  const { ctx, texture } = canvasTexture(360, 440)

  function draw() {
    const x = ctx
    x.clearRect(0, 0, 360, 440)
    x.save()
    x.beginPath()
    x.roundRect(0, 0, 360, 440, 60)
    x.clip()

    // Rich dark background
    const bg = x.createLinearGradient(0, 0, 360, 440)
    bg.addColorStop(0, '#0f0c1e')
    bg.addColorStop(1, '#0c0a18')
    x.fillStyle = bg
    x.fillRect(0, 0, 360, 440)

    // Subtle glow
    const glow = x.createRadialGradient(180, 180, 10, 180, 180, 200)
    glow.addColorStop(0, 'rgba(179,164,255,0.1)')
    glow.addColorStop(1, 'transparent')
    x.fillStyle = glow
    x.fillRect(0, 0, 360, 440)

    // Activity ring (partial arc)
    x.strokeStyle = 'rgba(168,164,196,0.2)'
    x.lineWidth = 10
    x.beginPath()
    x.arc(296, 68, 32, 0, Math.PI * 2)
    x.stroke()

    x.strokeStyle = '#b3a4ff'
    x.lineWidth = 10
    x.lineCap = 'round'
    x.beginPath()
    x.arc(296, 68, 32, -Math.PI / 2, Math.PI)
    x.stroke()

    // Inner ring
    x.strokeStyle = '#7ee787'
    x.lineWidth = 7
    x.beginPath()
    x.arc(296, 68, 20, -Math.PI / 2, Math.PI * 0.7)
    x.stroke()

    // Time
    x.fillStyle = '#f2eff8'
    x.font = `700 56px ${DISPLAY}`
    x.fillText('9:41', 36, 88)

    // Date
    x.fillStyle = 'rgba(216,213,229,0.55)'
    x.font = `500 24px ${SANS}`
    x.fillText('SUN 21 SEP', 36, 122)

    // Separator
    const sep = x.createLinearGradient(36, 0, 310, 0)
    sep.addColorStop(0, 'rgba(179,164,255,0.5)')
    sep.addColorStop(1, 'rgba(216,213,229,0.05)')
    x.fillStyle = sep
    x.fillRect(36, 148, 280, 1.5)

    // Main message
    x.fillStyle = '#f2eff8'
    x.font = `400 34px ${DISPLAY}`
    x.fillText('Build', 36, 210)
    x.fillStyle = '#b3a4ff'
    x.fillText('Something', 36, 258)
    x.fillStyle = '#f2eff8'
    x.fillText('Great', 36, 306)

    // Status pill
    x.fillStyle = 'rgba(126,231,135,0.15)'
    x.beginPath()
    x.roundRect(36, 336, 170, 46, 23)
    x.fill()
    x.strokeStyle = 'rgba(126,231,135,0.4)'
    x.lineWidth = 1.5
    x.stroke()

    x.fillStyle = '#7ee787'
    x.beginPath()
    x.arc(60, 359, 7, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#7ee787'
    x.font = `600 22px ${SANS}`
    x.fillText('ACTIVE', 76, 365)

    // App icons row
    const apps = ['📱', '📊', '⚙️']
    apps.forEach((icon, i) => {
      x.fillStyle = 'rgba(255,255,255,0.06)'
      x.beginPath()
      x.roundRect(36 + i * 64, 400, 52, 28, 10)
      x.fill()
      x.font = `500 18px ${SANS}`
      x.fillText(icon, 50 + i * 64, 420)
    })

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

/** Open MacBook screen — premium fullstack dashboard */
export function createHeroMacBookScreen() {
  const { ctx, texture } = canvasTexture(640, 400)

  function draw() {
    const x = ctx
    x.clearRect(0, 0, 640, 400)
    x.save()

    // Background
    const bg = x.createLinearGradient(0, 0, 640, 400)
    bg.addColorStop(0, '#100e1c')
    bg.addColorStop(1, '#0d0b18')
    x.fillStyle = bg
    x.fillRect(0, 0, 640, 400)

    // Sidebar
    x.fillStyle = 'rgba(255,255,255,0.03)'
    x.fillRect(0, 0, 168, 400)
    x.fillStyle = 'rgba(255,255,255,0.06)'
    x.fillRect(168, 0, 1.5, 400)

    // Sidebar items
    const sideItems = ['Dashboard', 'Portfolio', 'Analytics', 'Settings']
    sideItems.forEach((item, i) => {
      if (i === 0) {
        x.fillStyle = 'rgba(179,164,255,0.2)'
        x.beginPath()
        x.roundRect(12, 58 + i * 52, 144, 38, 10)
        x.fill()
      }
      x.fillStyle = i === 0 ? '#b3a4ff' : 'rgba(216,213,229,0.45)'
      x.font = `${i === 0 ? '600' : '400'} 17px ${SANS}`
      x.fillText(item, 28, 82 + i * 52)
    })

    // Window title bar
    x.fillStyle = '#161424'
    x.fillRect(0, 0, 640, 40)
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      x.fillStyle = c
      x.beginPath()
      x.arc(22 + i * 22, 20, 6, 0, Math.PI * 2)
      x.fill()
    })
    x.fillStyle = 'rgba(216,213,229,0.45)'
    x.font = `500 14px ${SANS}`
    x.textAlign = 'center'
    x.fillText('elakkiya.dev — Portfolio Dashboard', 400, 26)
    x.textAlign = 'left'

    // Main content area (right of sidebar)
    const cX = 184

    // Page title
    x.fillStyle = '#f2eff8'
    x.font = `600 22px ${SANS}`
    x.fillText('Live Dashboard', cX, 75)
    x.fillStyle = 'rgba(216,213,229,0.5)'
    x.font = `400 15px ${SANS}`
    x.fillText('Real-time metrics from production', cX, 96)

    // KPI cards
    const cards = [
      { title: 'Requests', val: '1.4M', unit: '/month', c: '#7dd3fc' },
      { title: 'Latency', val: '24ms', unit: 'p99', c: '#7ee787' },
      { title: 'Uptime', val: '99.98%', unit: 'SLA', c: '#b3a4ff' },
    ]
    cards.forEach(({ title, val, unit, c }, i) => {
      const cx = cX + i * 147
      x.fillStyle = 'rgba(255,255,255,0.05)'
      x.beginPath()
      x.roundRect(cx, 114, 136, 88, 12)
      x.fill()
      x.strokeStyle = colorWithAlpha(c, 0.25)
      x.lineWidth = 1
      x.stroke()

      // Top accent bar
      x.fillStyle = c
      x.fillRect(cx, 114, 136, 3)

      x.fillStyle = 'rgba(216,213,229,0.55)'
      x.font = `500 13px ${SANS}`
      x.fillText(title, cx + 12, 136)

      x.fillStyle = c
      x.font = `700 24px ${DISPLAY}`
      x.fillText(val, cx + 12, 168)

      x.fillStyle = 'rgba(216,213,229,0.4)'
      x.font = `400 13px ${SANS}`
      x.fillText(unit, cx + 12, 188)
    })

    // Chart area
    x.fillStyle = 'rgba(255,255,255,0.04)'
    x.beginPath()
    x.roundRect(cX, 218, 430, 112, 10)
    x.fill()
    x.strokeStyle = 'rgba(255,255,255,0.08)'
    x.lineWidth = 1
    x.stroke()

    x.fillStyle = 'rgba(216,213,229,0.4)'
    x.font = `600 13px ${SANS}`
    x.fillText('API Response Time (7 days)', cX + 12, 238)

    // Chart line
    const pts = [0.6, 0.45, 0.7, 0.38, 0.55, 0.42, 0.35]
    x.strokeStyle = '#b3a4ff'
    x.lineWidth = 2.5
    x.lineCap = 'round'
    x.lineJoin = 'round'
    x.beginPath()
    pts.forEach((v, i) => {
      const px = cX + 16 + i * 60
      const py = 310 - v * 72
      if (i === 0) x.moveTo(px, py)
      else x.lineTo(px, py)
    })
    x.stroke()

    // Dots on chart
    pts.forEach((v, i) => {
      const px = cX + 16 + i * 60
      const py = 310 - v * 72
      x.fillStyle = i === pts.length - 1 ? '#7ee787' : '#b3a4ff'
      x.beginPath()
      x.arc(px, py, 4, 0, Math.PI * 2)
      x.fill()
    })

    // Stack chips at bottom
    const chips = ['React', 'NestJS', 'PostgreSQL', 'TypeScript']
    let chipX = cX
    chips.forEach(chip => {
      x.fillStyle = 'rgba(179,164,255,0.12)'
      x.beginPath()
      const cw = measureText2(x, chip, `500 13px ${SANS}`) + 24
      x.roundRect(chipX, 348, cw, 30, 15)
      x.fill()
      x.strokeStyle = 'rgba(179,164,255,0.3)'
      x.lineWidth = 1
      x.stroke()
      x.fillStyle = '#b3a4ff'
      x.font = `500 13px ${SANS}`
      x.fillText(chip, chipX + 12, 368)
      chipX += cw + 8
    })

    x.restore()
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

function measureText2(ctx, text, font) {
  ctx.save()
  ctx.font = font
  const w = ctx.measureText(text).width
  ctx.restore()
  return w
}
