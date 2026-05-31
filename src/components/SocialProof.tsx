import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const STATS = [
  { value: 200, suffix: '+', label: 'Automazioni deployate' },
  { value: 9, suffix: '', label: 'Esperti d\'eccellenza' },
  { value: 2000, suffix: '+', label: 'Manager formati' },
  { value: 28, suffix: '%', label: 'Engagement medio in piu\'' },
]

function AnimatedCounter({ target, suffix, duration = 2 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, (duration * 1000) / steps)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count.toLocaleString('it-IT')}{suffix}</span>
}

export default function SocialProof() {
  return (
    <section className="relative z-10 py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-extralight text-gold font-mono block">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-[11px] text-white/30 font-light mt-2 block leading-snug">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
