import { useEffect, useRef } from 'react'

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only activate on devices with fine pointer (desktop)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`

      // Check if hovering a magnetic target
      const target = (e.target as HTMLElement).closest('.magnetic-target, button, a')
      if (target) {
        dot.classList.add('attracted')
        ring.classList.add('attracted')
      } else {
        dot.classList.remove('attracted')
        ring.classList.remove('attracted')
      }
    }

    // Ring follows with spring-like lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
      requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', handleMouseMove)
    const rafId = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null
  }

  return (
    <>
      <div ref={dotRef} className="magnetic-cursor-dot hidden md:block" />
      <div ref={ringRef} className="magnetic-cursor-ring hidden md:block" />
    </>
  )
}
