import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useLuminaStore, EXPERTS_DATA } from '../store/useLuminaStore'
import type { DetailedExpert } from '../store/useLuminaStore'

interface ExpertCardProps {
  expert: DetailedExpert
  setSelectedExpert: (expert: DetailedExpert) => void
  hoveredExpert: string | null
  setHoveredExpert: (name: string | null) => void
}

function ExpertCard({ expert, setSelectedExpert, hoveredExpert, setHoveredExpert }: ExpertCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const isFocusedByAI = useLuminaStore((s) =>
    s.hasResults && s.activeClusters.some(
      c => c.active && c.experts.some(e => e.name === expert.name)
    )
  )

  // Live intent pre-match — pulses before user presses Enter
  const isPreMatched = useLuminaStore((s) =>
    !s.hasResults && s.preMatchedExperts.includes(expert.name)
  )

  const hasResults = useLuminaStore((s) => s.hasResults)

  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)
  const spotlightOpacity = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = (x - rect.width / 2) / (rect.width / 2)
    const dy = (y - rect.height / 2) / (rect.height / 2)
    card.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateZ(0) scale(1.03)`
    spotlightX.set(x)
    spotlightY.set(y)
    spotlightOpacity.set(1)
    setHoveredExpert(expert.name)
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (card) {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)'
    }
    spotlightOpacity.set(0)
    setHoveredExpert(null)
  }

  const initials = expert.name.split(' ').map(n => n[0]).join('')
  const isAnyHovered = hoveredExpert !== null
  const isThisHovered = hoveredExpert === expert.name

  const spotlightBg = useTransform(
    [spotlightX, spotlightY, spotlightOpacity],
    ([xVal, yVal, opVal]) => `radial-gradient(250px circle at ${xVal}px ${yVal}px, rgba(212, 175, 55, ${(opVal as number) * 0.12}), transparent 70%)`
  )

  const spotlightBorder = useTransform(
    [spotlightX, spotlightY, spotlightOpacity],
    ([xVal, yVal, opVal]) => `radial-gradient(200px circle at ${xVal}px ${yVal}px, rgba(212, 175, 55, ${(opVal as number) * 0.6}), transparent 70%)`
  )

  return (
    <motion.div
      onClick={() => {
        setSelectedExpert(expert)
        if ('speechSynthesis' in window) {
          const s = new SpeechSynthesisUtterance('')
          window.speechSynthesis.speak(s)
        }
        useLuminaStore.getState().setPlayingAudio(expert.name)
      }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 snap-start py-3"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-[280px] sm:w-[320px] md:w-[360px] cursor-pointer select-none overflow-hidden transition-all duration-600 ${
          isAnyHovered && !isThisHovered
            ? 'opacity-15 blur-[1.5px] scale-[0.95]'
            : isFocusedByAI || isPreMatched
              ? 'opacity-100 scale-100'
              : hasResults
                ? 'opacity-30 scale-[0.97] blur-[0.5px] hover:opacity-90 hover:scale-100 hover:blur-0'
                : 'opacity-100 scale-100'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)',
          willChange: 'transform',
          transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease',
          borderRadius: '2rem',
        }}
      >
        {/* Pulsating glow behind card when pre-matched or focused */}
        {(isFocusedByAI || isPreMatched) && (
          <div className="absolute -inset-3 rounded-[2.5rem] bg-gold/[0.06] blur-2xl animate-pulse pointer-events-none" />
        )}

        {/* Glass background */}
        <div className="absolute inset-0 rounded-[2rem] backdrop-blur-2xl bg-gradient-to-b from-white/[0.05] via-[#0e1424]/85 to-[#080c16]/95" />

        {/* Border */}
        <div className={`absolute inset-0 rounded-[2rem] border transition-all duration-500 ${
          isFocusedByAI ? 'border-gold/40' : isPreMatched ? 'border-gold/30' : isThisHovered ? 'border-gold/25' : 'border-white/[0.06]'
        }`} />

        {/* Spotlight follow */}
        <motion.div className="absolute inset-0 pointer-events-none z-10 rounded-[2rem]" style={{ background: spotlightBg }} />

        {/* Spotlight border glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[2rem] z-20"
          style={{
            padding: '1px',
            background: spotlightBorder,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content */}
        <div className="relative z-30 flex flex-col h-[420px] sm:h-[450px] md:h-[480px]" style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}>

          {/* Asymmetric image frame — top half */}
          <div className="relative h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-tl-[2rem] sm:rounded-tl-[3rem] rounded-tr-[1rem] rounded-br-[2rem] sm:rounded-br-[3rem] rounded-bl-[1rem] mx-3 mt-3 mb-4">
            {expert.avatar.startsWith('/') ? (
              <motion.img
                src={expert.avatar}
                alt={expert.name}
                className="w-full h-full object-cover object-top"
                animate={{ scale: isThisHovered || isFocusedByAI || isPreMatched ? 1.06 : 1 }}
                transition={{ duration: 4, ease: 'easeOut' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center text-5xl font-extralight font-mono text-gold/60">
                {initials}
              </div>
            )}
            {/* Gradient fade at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080c16] to-transparent" />

            {/* Category badge overlaid on image */}
            <span className={`absolute top-3 left-3 text-[8px] font-mono px-2.5 py-1 rounded-full border backdrop-blur-md tracking-widest uppercase ${
              isFocusedByAI ? 'text-gold bg-gold/20 border-gold/30' : 'text-white/60 bg-black/40 border-white/10'
            }`}>
              {expert.category}
            </span>

            {isFocusedByAI && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 border border-gold/25">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                <span className="text-[7px] font-mono text-gold uppercase tracking-wider">Match</span>
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="px-6 flex flex-col flex-1">
            <h3 className="text-lg font-light text-white tracking-wide font-heading mb-1">
              {expert.name}
            </h3>
            <p className="text-[10px] text-white/30 font-light leading-snug mb-3">
              {expert.role}
            </p>

            <p className="text-[11px] text-white/40 leading-relaxed font-light flex-1">
              {expert.bio.length > 110 ? `${expert.bio.substring(0, 105)}...` : expert.bio}
            </p>

            {/* Waveform micro-bars — animated when pre-matched */}
            <div className="flex items-end gap-[2px] h-4 my-3 opacity-60">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full bg-gold/30"
                  animate={{
                    height: (isFocusedByAI || isPreMatched || isThisHovered)
                      ? `${20 + Math.sin(i * 0.8) * 60 + Math.random() * 20}%`
                      : '15%'
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15, delay: i * 0.015 }}
                />
              ))}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">
                {expert.courses.length} moduli
              </span>
              <span className={`text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors ${
                isThisHovered || isFocusedByAI ? 'text-gold' : 'text-white/20'
              }`}>
                Scopri
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExpertsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const setSelectedExpert = useLuminaStore((s) => s.setSelectedExpert)
  const [hoveredExpert, setHoveredExpert] = useState<string | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -380 : 380,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="experts-section" className="relative z-10 overflow-hidden section-glow-divider">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-dark-navy/60 to-[#080c18] pointer-events-none" />
      <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] bg-gold/[0.025] rounded-full blur-[200px] pointer-events-none" />

      <div className="relative z-10 py-32 md:py-40">
        {/* Header — full width with dramatic typography */}
        <motion.div
          className="max-w-6xl mx-auto px-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-end justify-between">
            <div>
              <motion.p
                className="text-gold/50 text-[10px] font-medium uppercase mb-5"
                initial={{ letterSpacing: '1.4em', opacity: 0 }}
                whileInView={{ letterSpacing: '0.15em', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.7, delay: 0.1 }}
              >
                I Professionisti
              </motion.p>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extralight text-white tracking-tight leading-[1.05]">
                Chi cuce il<br /><span className="text-gold-metallic font-light">vostro percorso</span>
              </h2>
              <p className="text-white/30 text-sm md:text-base mt-5 font-light max-w-md leading-relaxed">
                Ogni esperto e' selezionato per la coerenza con la vostra sfida specifica. Nessun modulo preconfezionato.
              </p>
            </div>

            {/* Counter + Nav arrows */}
            <div className="hidden md:flex flex-col items-end gap-4">
              <span className="text-5xl font-extralight text-gold/20 font-mono">{EXPERTS_DATA.length}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="magnetic-target w-11 h-11 rounded-full border border-white/8 hover:border-gold/30 text-white/30 hover:text-gold flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  aria-label="Scorri a sinistra"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="magnetic-target w-11 h-11 rounded-full border border-white/8 hover:border-gold/30 text-white/30 hover:text-gold flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  aria-label="Scorri a destra"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel — full-bleed, extends past container */}
        <div
          ref={carouselRef}
          className="flex gap-7 overflow-x-auto pb-12 pl-6 md:pl-[calc((100vw-72rem)/2+1.5rem)] snap-x snap-mandatory no-scrollbar select-none cursor-grab active:cursor-grabbing"
        >
          {EXPERTS_DATA.map((expert, idx) => (
            <ExpertCard
              key={expert.name + idx}
              expert={expert}
              setSelectedExpert={setSelectedExpert}
              hoveredExpert={hoveredExpert}
              setHoveredExpert={setHoveredExpert}
            />
          ))}
          {/* End spacer for right padding */}
          <div className="flex-shrink-0 w-6 md:w-12" />
        </div>
      </div>
    </section>
  )
}
