/**
 * Native scroll stand-in for Lenis.
 *
 * Hard rule from the brief: the page must always scroll with the browser's
 * own wheel/touch handling — no library may intercept, smooth-lock or
 * re-drive the page scroll. This module keeps the call surface the site
 * used with Lenis (constructor, raf, on/off, scrollTo, destroy and the
 * common read-only properties) so nothing else has to change, but every
 * method is a thin passive wrapper over the native window scroll. Nothing
 * here calls preventDefault and nothing writes to scrollTop uninvoked.
 */
export default class NativeScroll {
  constructor() {
    this.__y = typeof window !== 'undefined' ? window.scrollY : 0
    this.__v = 0
    this.__d = 0
    this.__lastT = typeof performance !== 'undefined' ? performance.now() : 0
    this.__cbs = { scroll: [] }
    this.__bound = false
    this.__bind()
  }

  __bind() {
    if (this.__bound || typeof window === 'undefined') return
    this.__bound = true
    this.__listener = () => {
      const now = performance.now()
      const dt = Math.max(now - this.__lastT, 1) / 1000
      const y = window.scrollY
      const dy = y - this.__y
      this.__v = dy / dt
      this.__d = Math.abs(dy) < 0.1 ? 0 : Math.sign(dy)
      this.__y = y
      this.__lastT = now
      const e = this.__event()
      this.__cbs.scroll.forEach((cb) => cb(e))
    }
    window.addEventListener('scroll', this.__listener, { passive: true })
  }

  __limit() {
    if (typeof document === 'undefined') return 1
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  }

  __event() {
    return {
      scroll: this.__y,
      targetScroll: this.__y,
      actualScroll: this.__y,
      velocity: this.__v,
      direction: this.__d,
      progress: Math.min(Math.max(this.__y / this.__limit(), 0), 1),
      limit: this.__limit(),
    }
  }

  get scroll() { return typeof window === 'undefined' ? 0 : window.scrollY }
  get targetScroll() { return this.scroll }
  get actualScroll() { return this.scroll }
  get velocity() { return this.__v }
  get direction() { return this.__d }
  get progress() { return this.__event().progress }
  get limit() { return this.__limit() }
  get smoothWheel() { return false }

  on(event, cb) {
    if (this.__cbs[event]) this.__cbs[event].push(cb)
    return this
  }
  off(event, cb) {
    if (this.__cbs[event]) this.__cbs[event] = this.__cbs[event].filter((f) => f !== cb)
    return this
  }
  raf() { /* native scrolling drives itself — nothing to animate per frame */ }
  resize() {}
  stop() { /* never block scrolling */ }
  start() {}
  scrollTo(target, opts = {}) {
    if (typeof window === 'undefined') return
    const top = typeof target === 'number' ? target : 0
    window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' })
  }
  scrollToTop(opts) { this.scrollTo(0, opts) }
  destroy() {
    if (this.__bound && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.__listener)
      this.__bound = false
    }
  }
}

export { NativeScroll as Lenis, NativeScroll as lenis }
