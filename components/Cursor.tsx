'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    if (!cursor) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const updateMousePosition = (x: number, y: number) => {
      mouseX = x
      mouseY = y
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const onMouseMove = (e: MouseEvent) => updateMousePosition(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => updateMousePosition(e.touches[0].clientX, e.touches[0].clientY)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })

    const interactives = document.querySelectorAll('.interactive, a, button')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'))
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'))
    })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <div id="cursor" />
}
