import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimations() {
  useEffect(() => {
    // ── Lenis smooth scroll ───────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    // Wire Lenis into GSAP's ticker so ScrollTrigger gets the right position
    lenis.on('scroll', ScrollTrigger.update)
    const gsapTicker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(gsapTicker)
    gsap.ticker.lagSmoothing(0)

    // ── Hero intro — fromTo so re-mounts in StrictMode are idempotent ─────
    gsap.fromTo(
      '.hero-fade',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo(
      '.hero-text',
      { y: '115%' },
      { y: '0%', duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
    )

    // ── Scroll-triggered fly-ins ──────────────────────────────────────────
    const flyTriggers: ScrollTrigger[] = []

    gsap.utils.toArray<HTMLElement>('.scroll-fly').forEach((el) => {
      const wrap = el.closest('.fly-wrap') as HTMLElement | null
      if (!wrap) return

      // Reset to hidden before registering so trigger is reliable
      gsap.set(el, { y: '115%' })

      const st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(el, { y: '0%', duration: 1, ease: 'power4.out' })
        },
      })
      flyTriggers.push(st)
    })

    // ── Hold-short divider ────────────────────────────────────────────────
    gsap.set('.hs-solid, .hs-dashed', { width: '0%' })
    const hsST = ScrollTrigger.create({
      trigger: '#hold-short-divider',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.hs-solid, .hs-dashed', {
          width: '100%',
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.out',
        })
      },
    })

    // ── Service cards ─────────────────────────────────────────────────────
    gsap.set('.service-card', { y: 50, opacity: 0 })
    const svcST = ScrollTrigger.create({
      trigger: '#services',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.service-card', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        })
      },
    })

    // ── Case study panel ──────────────────────────────────────────────────
    gsap.set('.cs-ui', { y: 8, opacity: 0 })
    const csST = ScrollTrigger.create({
      trigger: '#projects',
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.to('.cs-ui', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
      },
    })

    ScrollTrigger.refresh()

    return () => {
      // Kill only the triggers this component created, not CaseStudy's
      ;[hsST, svcST, csST, ...flyTriggers].forEach((t) => t.kill())
      gsap.ticker.remove(gsapTicker)
      lenis.destroy()
    }
  }, [])

  return null
}
