import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollAnimations() {
  useEffect(() => {
    const initAnimations = () => {
      gsap.registerPlugin(ScrollTrigger)

      // Hero Intro Animation
      gsap.to('.hero-fade', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.1,
      })
      gsap.to('.hero-text', {
        y: '0%',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2,
      })

      // Scroll Fly-in Texts
      gsap.utils.toArray<HTMLElement>('.scroll-fly').forEach((text) => {
        gsap.to(text, {
          scrollTrigger: {
            trigger: text.closest('.fly-wrap'),
            start: 'top 90%',
          },
          y: '0%',
          duration: 1,
          ease: 'power4.out',
        })
      })

      // Hold Short Line Animation
      gsap.to('.hs-solid, .hs-dashed', {
        scrollTrigger: {
          trigger: '#hold-short-divider',
          start: 'top 85%',
        },
        width: '100%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
      })

      // Services Cards Fade
      gsap.fromTo(
        '.service-card',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#services',
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      )

      // Case Study UI Reveal
      gsap.to('.cs-ui', {
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 60%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    initAnimations()
    return () => ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill())
  }, [])

  return null
}
