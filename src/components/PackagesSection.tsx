import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLuminaStore } from '../store/useLuminaStore'

interface Activity {
  time: string
  title: string
  desc: string
  expert?: string
}

interface DeployPhase {
  phase: string
  label: string
  title: string
  bgImage: string
  activities: Activity[]
}

const DEPLOY_PHASES: DeployPhase[] = [
  {
    phase: '01',
    label: 'Decompressione',
    title: 'Fase 01: Decompressione Sensoriale',
    bgImage: '/assets/olfactory_studio.png',
    activities: [
      { time: '15:00', title: 'Check-in & Welcome Circle', desc: 'Sistemazione nella location di prestigio e prima introduzione all\'Experience System.' },
      { time: '17:00', title: 'Laboratorio Olfattivo (SENSE)', desc: 'Sessione di creazione profumo personalizzato con il Maestro Mauro Lorenzi per allineare la memoria emotiva di team.', expert: 'Mauro Lorenzi' },
      { time: '20:30', title: 'Cena Emozionale Multisensoriale', desc: 'Cena guidata con focus su nutrizione clinica e biologia del benessere.', expert: 'Paola Meo' }
    ]
  },
  {
    phase: '02',
    label: 'Integrazione',
    title: 'Fase 02: Integrazione e Sincronia',
    bgImage: '/assets/sport_canoeing.png',
    activities: [
      { time: '09:30', title: 'Team Building in Canoa (PLAY)', desc: 'Attività in barca sull\'acqua con la campionessa olimpica per coordinare ritmo e fiducia.', expert: 'Valentina Rodini' },
      { time: '15:00', title: 'AI Adaptive Workshop (LEARN)', desc: 'Mappatura dei flussi organizzativi e installazione di workflow n8n reali per il team.', expert: 'Ivano Sciretta' },
      { time: '20:30', title: 'Storytelling & Metafora Musicale', desc: 'Laboratorio di scrittura creativa di gruppo per comporre il racconto condiviso del brand.', expert: 'Roberto Casalino' }
    ]
  },
  {
    phase: '03',
    label: 'Struttura del Dopo',
    title: 'Fase 03: Struttura del Dopo e Rilascio',
    bgImage: '/assets/lumina_retreat_villa.png',
    activities: [
      { time: '09:30', title: 'Cammineria® & Stile (SENSE)', desc: 'Sessione di portamento, presenza e comunicazione non verbale per potenziare l\'autorevolezza.', expert: 'Sonia Perrone' },
      { time: '14:30', title: 'Coaching Strategico & You Lead', desc: 'Definizione dei KPI di adozione, sblocco del potenziale strategico del management e debriefing.', expert: 'Luigi Gallo' },
      { time: '16:30', title: 'Closing Circle & Rilascio Report', desc: 'Saluti finali e consegna dei deliverables operativi del retreat.' }
    ]
  }
]

export default function PackagesSection() {
  const [activeTab, setActiveTab] = useState<'retreats' | 'training'>('retreats')
  const [activePhase, setActivePhase] = useState<string>('01')
  const selectedPackage = useLuminaStore((s) => s.selectedPackage)
  const setSelectedPackage = useLuminaStore((s) => s.setSelectedPackage)

  const trainingTiers = [
    {
      id: 'ignite' as const,
      tag: 'TIER 01 • IGNITE',
      title: 'Lumina Starter',
      subtitle: 'Primo ingresso strutturato nell\'AI',
      target: 'Per PMI 10–30 dipendenti',
      features: [
        'Audit operativo (2 settimane)',
        '3 use-case prioritari',
        '2 workflow n8n attivi',
        '4 sessioni training su misura',
        'Prompt-library base',
        'Follow-up 30 giorni'
      ],
      popular: false
    },
    {
      id: 'adaptive' as const,
      tag: 'TIER 02 • ADAPTIVE',
      title: 'Lumina Core',
      subtitle: 'Il programma completo per la trasformazione',
      target: 'Per aziende che vogliono cambiare davvero',
      features: [
        'Audit + AI-Map completa',
        '6–8 use-case operativi',
        '5–8 workflow n8n attivi',
        'Training per ogni reparto',
        'Prompt-library proprietaria',
        'Knowledge base addestrata',
        'AI-Champion interno formato',
        'Follow-up trimestrale 6 mesi'
      ],
      popular: true
    },
    {
      id: 'sovereign' as const,
      tag: 'TIER 03 • SOVEREIGN',
      title: 'Lumina Elite',
      subtitle: 'Integrazione totale per realtà strutturate',
      target: 'Per mid-market 100–250 dipendenti',
      features: [
        'Audit multi-reparto / multi-sede',
        '10–14 use-case verticali',
        'Workflow custom illimitati',
        'Assistenti AI dedicati per ruolo',
        'Integrazioni stack esistente',
        'Governance & policy AI',
        'Champion team (2–4 persone)',
        'Follow-up 12 mesi continuativo'
      ],
      popular: false
    }
  ]

  const currentPhaseData = DEPLOY_PHASES.find(p => p.phase === activePhase)

  return (
    <section id="packages-section" className="relative z-10 scroll-mt-6 section-glow-divider">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-[#0a1020]/60 to-[#080c18] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-gold/[0.02] rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-32 md:py-40 flex flex-col gap-20 relative z-10">

        {/* Header — left-aligned, dramatic */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-gold/50 text-[10px] font-medium uppercase mb-5"
            initial={{ letterSpacing: '1.4em', opacity: 0 }}
            whileInView={{ letterSpacing: '0.15em', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.7, delay: 0.1 }}
          >
            Soluzioni e Percorsi
          </motion.p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extralight text-white tracking-tight leading-[1.05]">
            Formazione<br /><span className="text-gold-metallic font-light">su misura</span>
          </h2>
          <p className="text-white/30 text-sm md:text-base mt-5 font-light max-w-lg leading-relaxed">
            Architetture flessibili e percorsi ad alto impatto calibrati sulla dimensione e sugli obiettivi della vostra organizzazione.
          </p>
        </motion.div>

        {/* Tabs Control */}
        <div className="flex justify-center border-b border-white/5 pb-px w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('retreats')}
            className={`flex-1 pb-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 relative cursor-pointer ${
              activeTab === 'retreats' ? 'text-gold' : 'text-white/30 hover:text-white/60'
            }`}
          >
            Retreat Aziendali
            {activeTab === 'retreats' && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-px bg-gold"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex-1 pb-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 relative cursor-pointer ${
              activeTab === 'training' ? 'text-gold' : 'text-white/30 hover:text-white/60'
            }`}
          >
            AI Training Tiers
            {activeTab === 'training' && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-px bg-gold"
              />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[460px]">
          {activeTab === 'retreats' ? (
            /* Retreats Layout */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
            >
              {/* Left Column: Specs */}
              <div className="space-y-8 flex flex-col justify-between">
                <div className="space-y-5">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-wide leading-[1.15]">
                    Un weekend che cambia<br />il modo di <span className="text-gold-metallic font-light">collaborare.</span>
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed max-w-md">
                    Tre fasi strutturate in location esclusive. Decompressione sensoriale, sincronia operativa e rilascio strategico. Vitto, logistica e coordinamento inclusi.
                  </p>
                </div>

                {/* Specs — big numbers */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '200', unit: 'persone max', icon: '👥' },
                    { value: '3', unit: 'giorni', icon: '📅' },
                    { value: '100%', unit: 'incluso', icon: '✦' },
                  ].map((stat) => (
                    <div key={stat.unit} className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/6 rounded-2xl py-5 px-2">
                      <p className="text-2xl md:text-3xl font-light text-gold font-mono">{stat.value}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1.5">{stat.unit}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-white/25 font-light">
                  Esplora le tre fasi selezionando i pulsanti a destra.
                </p>
              </div>

              {/* Right Column: Immersive Phase Explorer */}
              <div className="space-y-4">
                {/* Phase selector — large tabs */}
                <div className="flex gap-2">
                  {DEPLOY_PHASES.map((phaseData) => (
                    <motion.button
                      key={phaseData.phase}
                      onClick={() => setActivePhase(phaseData.phase)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 py-4 rounded-2xl text-center transition-all cursor-pointer backdrop-blur-xl border ${
                        activePhase === phaseData.phase
                          ? 'bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                          : 'bg-white/[0.02] border-white/6 hover:border-white/15'
                      }`}
                    >
                      <span className={`text-2xl font-extralight font-mono block ${activePhase === phaseData.phase ? 'text-gold' : 'text-white/20'}`}>
                        {phaseData.phase}
                      </span>
                      <span className={`text-[9px] uppercase tracking-widest mt-1 block ${activePhase === phaseData.phase ? 'text-gold/70' : 'text-white/20'}`}>
                        {phaseData.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Phase content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="backdrop-blur-xl bg-white/[0.02] border border-white/8 rounded-[2rem] p-6 md:p-8 relative overflow-hidden"
                  >
                    {/* Background image — subtle */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-[0.06] z-0"
                      style={{ backgroundImage: `url(${currentPhaseData?.bgImage})` }}
                    />

                    <div className="relative z-10">
                      <h4 className="text-sm md:text-base font-medium text-white mb-6 font-heading">
                        {currentPhaseData?.title}
                      </h4>

                      <div className="space-y-3">
                        {currentPhaseData?.activities.map((act, aIdx) => (
                          <motion.div
                            key={act.title + aIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: aIdx * 0.08, duration: 0.3 }}
                            className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-all group"
                          >
                            <div className="flex-shrink-0 text-center">
                              <span className="text-xs font-mono text-gold block">{act.time}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-white/90 group-hover:text-gold transition-colors">{act.title}</h5>
                              <p className="text-xs text-white/40 font-light mt-1 leading-relaxed">{act.desc}</p>
                              {act.expert && (
                                <span className="text-[10px] font-mono text-gold/40 mt-2 block">{act.expert}</span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Training Layout */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start"
            >
              {trainingTiers.map((tier, idx) => {
                const isSelected = selectedPackage === tier.id
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPackage(tier.id)}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
                      const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2
                      e.currentTarget.style.transform = `perspective(800px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateZ(0)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
                      e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
                    }}
                    className={`relative rounded-3xl p-6 md:p-8 flex flex-col gap-6 transition-all duration-500 border cursor-pointer select-none group/tier backdrop-blur-xl ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#1c294a]/95 via-[#131b31]/95 to-[#0b1020]/98 border-gold shadow-[0_20px_60px_rgba(212,175,55,0.25)] z-10'
                        : tier.popular
                          ? 'bg-gradient-to-b from-[#16213c]/60 via-[#0f1629]/75 to-[#080c18]/90 border-gold/45 shadow-[0_15px_45px_rgba(0,0,0,0.4)] hover:border-gold/60 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)]'
                          : 'bg-gradient-to-b from-[#11192e]/40 via-[#0b1020]/55 to-[#060a14]/80 border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.3)] hover:border-gold/30'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      willChange: 'transform, border-color, box-shadow',
                      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease',
                    }}
                  >
                    {/* Scale central card 5% larger */}
                    {tier.popular && !isSelected && (
                      <style>{`[data-tier-popular="true"] { transform: perspective(800px) scale(1.05) !important; }`}</style>
                    )}
                    {tier.popular && (
                      <div className="absolute -top-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                    )}
                    {tier.popular && (
                      <span className="absolute -top-3 right-6 bg-[#0a0f1e] border border-gold/40 text-gold text-[8px] font-mono font-semibold tracking-[0.25em] uppercase px-3 py-1 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                        Consigliato
                      </span>
                    )}

                    <div>
                      {/* Decorative number */}
                      <span className="text-5xl font-extralight text-gold/[0.06] font-mono leading-none block mb-2 select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-xl md:text-2xl font-light text-white tracking-wide font-heading">
                        {tier.title}
                      </h3>
                      <p className="text-xs text-white/40 font-light mt-2 leading-relaxed">
                        {tier.subtitle}
                      </p>
                    </div>

                    <p className="text-[11px] text-gold/50 font-mono uppercase tracking-wider border-b border-white/5 pb-4">
                      {tier.target}
                    </p>

                    <ul className="space-y-3.5 my-2">
                      {tier.features.map((feature, fIdx) => (
                        <motion.li
                          key={fIdx}
                          className="flex items-start gap-3 text-xs font-light text-white/60"
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: fIdx * 0.04, duration: 0.4, ease: 'easeOut' }}
                        >
                          <span className="w-4 h-4 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-2.5 h-2.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                      <div className="text-[10px] text-white/30 font-light">
                        * Moduli integrativi e workshop dedicati disponibili su richiesta.
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPackage(tier.id)
                          document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className={`magnetic-target w-full py-3.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                          isSelected
                            ? 'bg-gold text-dark-navy shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                            : 'bg-white/[0.04] hover:bg-gold/10 text-white/60 hover:text-gold border border-white/8 hover:border-gold/30'
                        }`}
                      >
                        {isSelected ? '✓ Selezionato' : 'Seleziona Pacchetto'}
                      </motion.button>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  )
}
