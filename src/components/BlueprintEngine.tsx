import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLuminaStore, EXPERTS_DATA, getExpertMatchScore, SECTOR_GLOW } from '../store/useLuminaStore'
import { generateBlueprintPdf } from '../utils/generatePdf'

const LOADING_STEPS = [
  'Analizzo il vostro settore e contesto...',
  'Identifico le criticita\' organizzative...',
  'Seleziono i professionisti piu\' coerenti...',
  'Costruisco il percorso su misura...',
]

function AnimatedScore({ target, color, shadow }: { target: number; color: string; shadow: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let frame = 0
    const totalFrames = 45
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.round(eased * target))
      if (frame >= totalFrames) clearInterval(timer)
    }, 33)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span className="text-4xl sm:text-5xl font-light font-mono" style={{ color, textShadow: `0 0 20px ${shadow}` }}>
      {count}%
    </span>
  )
}

function NarrativeLoading() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % LOADING_STEPS.length)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto text-center py-16"
    >
      <div className="w-16 h-16 rounded-full border-2 border-gold/20 border-t-gold animate-spin mx-auto mb-8" />
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="text-sm text-white/50 font-light"
      >
        {LOADING_STEPS[step]}
      </motion.p>
      <div className="flex justify-center gap-1.5 mt-6">
        {LOADING_STEPS.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-gold' : 'bg-white/10'}`} />
        ))}
      </div>
    </motion.div>
  )
}

export default function BlueprintEngine() {
  const hasResults = useLuminaStore((s) => s.hasResults)
  const isGenerating = useLuminaStore((s) => s.isGenerating)
  const generatedBlueprint = useLuminaStore((s) => s.generatedBlueprint)
  const challengeInput = useLuminaStore((s) => s.challengeInput)
  const detectedSector = useLuminaStore((s) => s.detectedSector)
  const glow = SECTOR_GLOW[detectedSector] || SECTOR_GLOW.default

  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const handleScrollToForm = () => {
    const contactSec = document.getElementById('contact-form-section')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="blueprint-results" className="py-32 md:py-40 px-6 relative z-10 scroll-mt-6 section-glow-divider overflow-hidden">

      {/* ─── Parallax Background Layer ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Floating gold orbs with parallax */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-[180px]"
          style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], [0, -80]) }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[8%] w-[300px] h-[300px] bg-gold/[0.03] rounded-full blur-[150px]"
          style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], [0, 60]) }}
        />
        <motion.div
          className="absolute top-[50%] left-[55%] w-[250px] h-[250px] bg-purple-500/[0.02] rounded-full blur-[120px]"
          style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], [0, -40]) }}
        />

        {/* Floating cluster names — depth layering */}
        {['PLAY', 'SENSE', 'LEARN', 'IMMERSIVE'].map((name, i) => (
          <motion.span
            key={name}
            className="absolute font-heading text-white/[0.03] text-7xl md:text-9xl font-extralight tracking-widest select-none"
            style={{
              top: `${20 + i * 20}%`,
              left: `${5 + i * 22}%`,
              y: useTransform(useScroll().scrollYProgress, [0, 1], [0, -30 + i * 20]),
            }}
          >
            {name}
          </motion.span>
        ))}
      </div>

      {/* ─── Section Content ─── */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Asymmetric Split Title — only shown when no results */}
        {!hasResults && !isGenerating && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[480px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Left Column — Typography Block (span 5) */}
            <div className="lg:col-span-5 space-y-6">
              <motion.p
                className="text-gold/50 text-[10px] font-medium uppercase"
                initial={{ letterSpacing: '1.4em', opacity: 0 }}
                whileInView={{ letterSpacing: '0.15em', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.7, delay: 0.1 }}
              >
                Experience Platform
              </motion.p>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-wide leading-[1.08]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ease: [0.22, 1, 0.36, 1] as [number, number, number, number], duration: 0.8, delay: 0.15 }}
              >
                Lumina<br />
                <span className="text-gold-metallic font-light">Experience</span><br />
                <span className="text-gold-metallic font-light">System</span>
              </motion.h2>

              <motion.p
                className="text-white/30 text-sm md:text-base font-light leading-relaxed max-w-sm"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Il motore algoritmico che mappa la tua sfida su 4 cluster esperienziali — Play, Sense, Learn, Immersive — attivando i professionisti piu' coerenti con il tuo contesto.
              </motion.p>

              {/* Cluster micro-tags */}
              <motion.div
                className="flex flex-wrap gap-2 pt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {['PLAY', 'SENSE', 'LEARN', 'IMMERSIVE'].map((c) => (
                  <span key={c} className="text-[9px] font-mono text-gold/40 border border-gold/15 bg-gold/[0.03] rounded-full px-3 py-1 tracking-widest">
                    {c}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right Column — Activate Card (span 7) */}
            <motion.div
              className="lg:col-span-7 flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.2 }}
            >
              <div
                className="relative w-full max-w-lg backdrop-blur-2xl bg-[#0a0f1e]/60 border border-white/10 rounded-[2rem] p-10 md:p-12 overflow-hidden group"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  e.currentTarget.style.setProperty('--mx', `${x}%`)
                  e.currentTarget.style.setProperty('--my', `${y}%`)
                }}
              >
                {/* Mouse-reactive border glow */}
                <div
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(212,175,55,0.15), transparent 60%)',
                  }}
                />
                {/* Inner border gradient */}
                <div className="absolute inset-[0.5px] rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(212,175,55,0.4), transparent 60%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '1px',
                }} />

                {/* Orbital Element — 3D spinning rings */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  {/* Outer ring — slow spin */}
                  <motion.div
                    className="absolute inset-0 border border-gold/20 rounded-full"
                    animate={{ rotateX: 75, rotateZ: 360 }}
                    transition={{ rotateZ: { repeat: Infinity, duration: 12, ease: 'linear' }, rotateX: { duration: 0 } }}
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  {/* Inner ring — opposite direction, different axis */}
                  <motion.div
                    className="absolute inset-3 border border-gold/30 rounded-full"
                    animate={{ rotateY: 70, rotateZ: -360 }}
                    transition={{ rotateZ: { repeat: Infinity, duration: 8, ease: 'linear' }, rotateY: { duration: 0 } }}
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  {/* Center pulse light */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5),0_0_60px_rgba(212,175,55,0.15)] animate-pulse" />
                  </div>
                </div>

                <h4 className="text-lg md:text-xl font-light text-white tracking-wide text-center mb-3 font-heading">
                  Attiva il Motore Esperienziale
                </h4>
                <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed text-center mb-8 max-w-sm mx-auto">
                  Inserisci la sfida del tuo team nel campo di ricerca. Il sistema eseguira' una pre-analisi istantanea e generera' un blueprint sartoriale calibrato sui tuoi obiettivi.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const heroInput = document.querySelector('textarea, input[type="text"]') as HTMLElement
                    if (heroInput) {
                      heroInput.focus()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="magnetic-target w-full py-4 bg-gold/10 hover:bg-gold/20 border border-gold/25 hover:border-gold/50 text-gold rounded-2xl text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_rgba(212,175,55,0.12)] active:scale-[0.98]"
                >
                  Inizia la Pre-Analisi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* When generating or has results — show centered content */}
        {(isGenerating || hasResults) && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-gold/40 text-[10px] font-medium uppercase mb-4"
              initial={{ letterSpacing: '1.4em', opacity: 0 }}
              animate={{ letterSpacing: '0.15em', opacity: 1 }}
              transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.7 }}
            >
              Experience Platform
            </motion.p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight leading-[1.1]">
              Lumina <span className="text-gold-metallic font-light">Experience System</span>
            </h2>
          </motion.div>
        )}

      {/* ── Loading Skeleton ── */}
      {isGenerating && <NarrativeLoading />}

      {hasResults && !isGenerating && generatedBlueprint ? (
        <div className="w-full max-w-5xl mx-auto space-y-12">

          {/* ═══ SEZIONE 1: Abbiamo capito il problema ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/8 rounded-[2rem] p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm">1</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white font-heading">Vi abbiamo ascoltato. Ecco cosa vediamo.</h3>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-white/70 font-light leading-relaxed mb-8">
              {generatedBlueprint.diagnosticInsight.narrative}
            </p>

            {/* Match score */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 p-5 rounded-2xl bg-black/20 border border-white/5">
              <div className="text-center flex-shrink-0">
                <AnimatedScore target={generatedBlueprint.matchScore} color={glow.primary} shadow={glow.shadow} />
                <span className="block text-[10px] text-white/30 mt-1 uppercase tracking-wider">compatibilita'</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/8" />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-sm text-white/50 font-light leading-relaxed">Conosciamo bene sfide come la vostra. Questo percorso e' stato costruito attorno al vostro contesto specifico.</span>
              </div>
            </div>
          </motion.div>

          {/* ═══ SEZIONE 2: Chi vi seguira' ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm">2</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white font-heading">Chi si occupera' di voi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(() => {
                const expertNames = new Set<string>()
                generatedBlueprint.days.forEach(d => d.activities.forEach(a => {
                  if (a.expert !== 'Team Lumina') expertNames.add(a.expert)
                }))
                return Array.from(expertNames).slice(0, 3).map((name, idx) => {
                  const expert = EXPERTS_DATA.find(e => e.name === name)
                  if (!expert) return null
                  const matchScore = getExpertMatchScore(challengeInput, expert)
                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                      onClick={() => useLuminaStore.getState().setSelectedExpert(expert)}
                      className="magnetic-target backdrop-blur-xl bg-white/[0.03] border border-white/8 hover:border-gold/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)] group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {expert.avatar.startsWith('/') ? (
                          <img src={expert.avatar} alt={expert.name} className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:border-gold/30 transition-colors" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center text-lg font-light font-mono text-gold">
                            {expert.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{expert.name}</h4>
                          <p className="text-[10px] text-white/30 font-light">{expert.category}</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/45 font-light leading-relaxed mb-4">
                        {expert.bio.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono" style={{ color: glow.primary }}>{matchScore}% match</span>
                        <span className="text-[10px] text-white/25 group-hover:text-gold/60 transition-colors">Vedi profilo →</span>
                      </div>
                    </motion.div>
                  )
                })
              })()}
            </div>
          </motion.div>

          {/* ═══ SEZIONE 3: Cosa succede dopo ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/8 rounded-[2rem] p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm">3</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white font-heading">I prossimi passi, insieme</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span className="text-xs font-medium text-gold uppercase tracking-wider">Entro 48 ore</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Un consulente Lumina vi contatta per validare l'analisi e personalizzare il percorso sulla vostra realta' concreta.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold/60" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Entro 2 settimane</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Ricevete la proposta esecutiva completa con date, location, esperti confermati e preventivo dettagliato.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Il percorso</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  {generatedBlueprint.days.length} giorni di intervento diretto + follow-up a 30 e 60 giorni con survey di impatto.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ═══ CTA Semplificata ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch gap-4"
          >
            <motion.button
              type="button"
              onClick={handleScrollToForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="magnetic-target flex-1 py-5 bg-gold hover:bg-gold-light text-dark-navy font-bold uppercase tracking-[0.15em] text-sm rounded-2xl cta-glow transition-all cursor-pointer"
            >
              Parliamone — Contattaci
            </motion.button>

            <motion.button
              type="button"
              disabled={isPdfLoading}
              onClick={async () => {
                if (generatedBlueprint && !isPdfLoading) {
                  setIsPdfLoading(true)
                  try { await generateBlueprintPdf(generatedBlueprint, challengeInput) } finally { setIsPdfLoading(false) }
                }
              }}
              whileHover={isPdfLoading ? {} : { scale: 1.02 }}
              whileTap={isPdfLoading ? {} : { scale: 0.98 }}
              className="magnetic-target flex-1 py-5 backdrop-blur-xl bg-white/[0.04] border border-white/10 hover:border-gold/30 text-white/70 hover:text-gold font-medium uppercase tracking-[0.15em] text-sm rounded-2xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isPdfLoading ? 'Generazione...' : 'Scarica PDF'}
            </motion.button>

            <motion.a
              href={(() => {
                const phone = '393476498357'
                const sectorLabel = SECTOR_GLOW[generatedBlueprint.detectedSector]?.label || 'Enterprise'
                const excerpt = generatedBlueprint.diagnosticInsight.narrative.substring(0, 100)
                return `https://wa.me/${phone}?text=${encodeURIComponent(`Buongiorno, ho generato un Blueprint per il settore ${sectorLabel}. Criticita': "${excerpt}...". Vorrei pianificare un audit.`)}`
              })()}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="magnetic-target flex-1 py-5 bg-[#25D366]/10 border border-[#25D366]/25 hover:border-[#25D366]/50 text-white/70 hover:text-[#25D366] font-medium uppercase tracking-[0.15em] text-sm rounded-2xl transition-all cursor-pointer text-center"
            >
              WhatsApp
            </motion.a>
          </motion.div>

          {/* Bottom actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6"
          >
            <button
              type="button"
              onClick={() => {
                // Share: serialize blueprint state to URL hash
                try {
                  const shareData = {
                    c: challengeInput,
                    s: generatedBlueprint.matchScore,
                    d: generatedBlueprint.detectedSector,
                    t: generatedBlueprint.title,
                  }
                  const hash = btoa(JSON.stringify(shareData))
                  const url = `${window.location.origin}${window.location.pathname}#bp=${hash}`
                  navigator.clipboard.writeText(url)
                  // Brief visual feedback
                  const el = document.getElementById('share-feedback')
                  if (el) { el.textContent = 'Link copiato!'; setTimeout(() => { el.textContent = 'Condividi link' }, 2000) }
                } catch {}
              }}
              className="text-[11px] text-white/25 hover:text-gold/60 font-light tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
              <span id="share-feedback">Condividi link</span>
            </button>
            <button
              type="button"
              onClick={() => {
                useLuminaStore.getState().reset()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[11px] text-white/25 hover:text-white/50 font-light tracking-wider uppercase transition-colors cursor-pointer"
            >
              Nuova analisi
            </button>
          </motion.div>

        </div>
      ) : null}
      </div>
    </section>
  )
}
