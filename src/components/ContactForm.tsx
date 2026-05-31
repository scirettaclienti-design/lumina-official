import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLuminaStore, SECTOR_GLOW } from '../store/useLuminaStore'

const PARTICIPANTS_LABELS: Record<string, string> = {
  '<20': 'Meno di 20',
  '20-50': 'Da 20 a 50',
  '50-100': 'Da 50 a 100',
  '>100': 'Oltre 100'
}

export default function ContactForm() {
  const activeClusters = useLuminaStore((s) => s.activeClusters)
  const hasResults = useLuminaStore((s) => s.hasResults)
  const generatedBlueprint = useLuminaStore((s) => s.generatedBlueprint)
  const selectedPackage = useLuminaStore((s) => s.selectedPackage)
  const detectedSector = useLuminaStore((s) => s.detectedSector)
  const selectedCourses = useLuminaStore((s) => s.selectedCourses)
  const toggleCourse = useLuminaStore((s) => s.toggleCourse)
  const sectorGlow = SECTOR_GLOW[detectedSector] || SECTOR_GLOW.default

  const [pDropdownOpen, setPDropdownOpen] = useState(false)
  const pDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pDropdownRef.current && !pDropdownRef.current.contains(event.target as Node)) {
        setPDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    participants: '20-50',
    objective: '',
    customizations: [] as string[]
  })
  
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [projectId, setProjectId] = useState('')

  // Auto-tick customizations based on active clusters when search has results
  useEffect(() => {
    if (hasResults) {
      const activeIds = activeClusters.filter((c) => c.active).map((c) => c.id)
      const autoTags: string[] = []
      
      if (activeIds.includes('PLAY')) {
        autoTags.push('Engagement & Team Building')
      }
      if (activeIds.includes('SENSE')) {
        autoTags.push('Nutrizione & Posturologia')
        autoTags.push('Presenza & Cammineria')
        autoTags.push('Olfatto & Laboratorio Profumi')
      }
      if (activeIds.includes('LEARN')) {
        autoTags.push('Formazione AI Operativa')
        autoTags.push('Scrittura & Storytelling')
      }
      if (activeIds.includes('IMMERSIVE')) {
        autoTags.push('Eventi Sportivi & Legends')
        autoTags.push('Fiducia & Coesione')
      }
      
      setFormData((prev) => ({
        ...prev,
        customizations: Array.from(new Set([...prev.customizations, ...autoTags]))
      }))
    }
  }, [hasResults, activeClusters])

  // Prefill fields when a package is selected
  useEffect(() => {
    if (selectedPackage) {
      let objective = ''
      let customizations: string[] = []
      let participants = '20-50'

      if (selectedPackage === 'ignite') {
        objective = "Richiesta informazioni e attivazione per pacchetto: TIER 01 • IGNITE (Lumina Starter).\nObiettivo: Primo ingresso strutturato nell'AI per il nostro team di circa 10-30 dipendenti."
        customizations = ['Formazione AI Operativa', 'Engagement & Team Building']
        participants = '<20'
      } else if (selectedPackage === 'adaptive') {
        objective = "Richiesta informazioni e attivazione per pacchetto: TIER 02 • ADAPTIVE (Lumina Core).\nObiettivo: Trasformazione aziendale completa e integrazione flussi operativi per il nostro team."
        customizations = ['Formazione AI Operativa', 'Fiducia & Coesione', 'Engagement & Team Building']
        participants = '20-50'
      } else if (selectedPackage === 'sovereign') {
        objective = "Richiesta informazioni e attivazione per pacchetto: TIER 03 • SOVEREIGN (Lumina Elite).\nObiettivo: Integrazione totale AI, governance, policy e workflow personalizzati per la nostra azienda di grandi dimensioni."
        customizations = ['Formazione AI Operativa', 'Fiducia & Coesione', 'Engagement & Team Building', 'Eventi Sportivi & Legends']
        participants = '>100'
      }

      setFormData((prev) => ({
        ...prev,
        objective,
        customizations,
        participants
      }))
    }
  }, [selectedPackage])

  const handleCustomizationToggle = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.customizations.includes(tag)
      return {
        ...prev,
        customizations: exists 
          ? prev.customizations.filter((t) => t !== tag)
          : [...prev.customizations, tag]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Generate random Project ID
    const randomId = `LXP-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setProjectId(randomId)

    // Simulate sending B2B lead to backend
    setTimeout(() => {
      setIsSending(false)
      setSuccess(true)
    }, 1800)
  }

  const checklistItems = [
    'Engagement & Team Building',
    'Fiducia & Coesione',
    'Formazione AI Operativa',
    'Nutrizione & Posturologia',
    'Presenza & Cammineria',
    'Olfatto & Laboratorio Profumi',
    'Eventi Sportivi & Legends',
    'Scrittura & Storytelling'
  ]

  return (
    <section id="contact-form-section" className="relative z-10 scroll-mt-6 section-glow-divider">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-dark-navy/80 to-[#080c18] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 py-32 md:py-40 flex flex-col md:flex-row gap-16 items-stretch relative z-10">
        
        {/* Contact Info Column */}
        <div className="w-full md:w-2/5 flex flex-col justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 1.0 }}
          >
            <motion.p
              className="text-gold/40 text-[10px] font-medium uppercase mb-3"
              initial={{ letterSpacing: '1.4em', opacity: 0 }}
              whileInView={{ letterSpacing: '0.15em', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.7, delay: 0.1 }}
            >
              Progetta Ora
            </motion.p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight leading-[1.05]">
              Inizia la tua<br /><span className="text-gold-metallic font-light">Esperienza</span>
            </h2>
            <p className="text-white/35 text-sm md:text-base mt-4 font-light leading-relaxed">
              Ogni soluzione Lumina XP viene completamente personalizzata. Compila il modulo per definire lo scopo, il numero di partecipanti ed il risultato desiderato.
            </p>
          </motion.div>

          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/8 p-6 rounded-2xl">
            <h4 className="text-xs text-gold/60 tracking-widest uppercase mb-4">
              Riferimenti Diretti
            </h4>
            <div className="space-y-3.5 text-xs font-light text-white/50">
              <div className="flex items-center gap-3">
                <span className="text-gold text-sm">✉</span>
                <a href="mailto:lumina.xpevents@gmail.com" className="hover:text-gold transition-colors">
                  lumina.xpevents@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold text-sm">🛈</span>
                <span>Milano / Roma / Tutta Italia</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold text-sm">📞</span>
                <a href="https://wa.me/393476498357" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  +39 347 649 8357
                </a>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-gold text-sm">in</span>
                <a href="https://www.linkedin.com/company/lumina-xp" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors ml-1">
                  Linkedin: Lumina XP Official
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="w-full md:w-3/5 backdrop-blur-xl bg-white/[0.03] border border-white/8 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-center">
          
          {/* Tech mirini for form card */}
          <span className="absolute top-3.5 left-3.5 text-[6.5px] font-mono text-white/10 group-hover:text-gold/30">[+]</span>
          <span className="absolute top-3.5 right-3.5 text-[6.5px] font-mono text-white/10 group-hover:text-gold/30">LXP_CONSOLE</span>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                className="space-y-5"
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Preconfigured Blueprint Summary Indicator */}
                {hasResults && generatedBlueprint && (
                  <div className="bg-gradient-to-br from-[#1d2745]/30 to-[#0e1425]/50 border border-gold/35 p-5 rounded-2xl shadow-[0_8px_30px_rgba(212,175,55,0.06)] space-y-3 mb-2 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-gold bg-gold/15 border border-gold/25 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                        Preconfigurato AI Sincronizzato
                      </span>
                      <span className="text-[9.5px] font-mono text-white/30">STATUS: MATCHED</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-wide font-heading">
                      {generatedBlueprint.title}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed font-light">
                      L'invio del modulo pre-imposterà i 3 giorni di attività con i relativi esperti per velocizzare l'elaborazione del preventivo formale.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Nome Cognome</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-b-2 px-1 py-3 text-sm text-white font-light outline-none transition-all duration-500 rounded-none"
                      style={{ borderBottomColor: undefined }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = sectorGlow.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = '' }}
                      placeholder="Ivano Sciretta"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Nome Azienda</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-b-2 px-1 py-3 text-sm text-white font-light outline-none transition-all duration-500 rounded-none"
                      style={{ borderBottomColor: undefined }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = sectorGlow.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = '' }}
                      placeholder="Lumina srl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Email Aziendale</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-b-2 px-1 py-3 text-sm text-white font-light outline-none transition-all duration-500 rounded-none"
                      style={{ borderBottomColor: undefined }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = sectorGlow.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = '' }}
                      placeholder="nome@azienda.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Telefono</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-b-2 px-1 py-3 text-sm text-white font-light outline-none transition-all duration-500 rounded-none"
                      style={{ borderBottomColor: undefined }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = sectorGlow.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = '' }}
                      placeholder="+39 333 1234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Partecipanti</label>
                    {/* Custom Dropdown React */}
                    <div ref={pDropdownRef} className="relative w-full z-30">
                      <button
                        type="button"
                        onClick={() => setPDropdownOpen(!pDropdownOpen)}
                        className="w-full bg-gradient-to-b from-[#090d19]/80 to-[#060911]/95 border border-white/10 hover:border-gold/30 focus:border-gold focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] rounded-xl px-4 py-3.5 text-xs text-white/80 font-light flex items-center justify-between outline-none cursor-pointer transition-all duration-300 text-left"
                      >
                        <span>{PARTICIPANTS_LABELS[formData.participants] || 'Seleziona...'}</span>
                        <svg
                          className={`w-3.5 h-3.5 text-gold/60 transition-transform duration-300 ${pDropdownOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {pDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#0a0f1e]/95 backdrop-blur-md border border-gold/20 rounded-xl shadow-2xl z-40 no-scrollbar"
                          >
                            {Object.entries(PARTICIPANTS_LABELS).map(([val, label]) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, participants: val })
                                  setPDropdownOpen(false)
                                }}
                                className={`w-full text-left px-4 py-3 text-xs font-light transition-colors hover:bg-gold/10 hover:text-gold block truncate cursor-pointer ${
                                  formData.participants === val ? 'text-gold bg-gold/5 font-semibold' : 'text-white/70'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Checklist — organized grid */}
                  <div className="sm:col-span-2 space-y-3">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Seleziona le aree di interesse</label>
                    <div className="grid grid-cols-2 gap-2">
                      {checklistItems.map((tag) => {
                        const isChipSelected = formData.customizations.includes(tag)
                        return (
                          <motion.button
                            key={tag}
                            type="button"
                            onClick={() => handleCustomizationToggle(tag)}
                            whileTap={{ scale: 0.95 }}
                            className={`text-left px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                              isChipSelected
                                ? 'border-gold/40 bg-gold/10 text-white/90'
                                : 'border-white/6 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/60'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                              isChipSelected ? 'bg-gold border-gold' : 'border-white/20'
                            }`}>
                              {isChipSelected && (
                                <svg className="w-2.5 h-2.5 text-dark-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              )}
                            </div>
                            <span className="text-xs font-light">{tag}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Selected courses summary */}
                {selectedCourses.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Percorsi selezionati ({selectedCourses.length})</label>
                    <div className="space-y-1.5">
                      {selectedCourses.map((sc, idx) => (
                        <div key={sc.courseTitle + idx} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gold/5 border border-gold/15">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-white/70 block truncate">{sc.courseTitle}</span>
                            <span className="text-[10px] text-white/30">{sc.expertName}{sc.duration ? ` · ${sc.duration}` : ''}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCourse(sc)}
                            className="text-white/25 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
                            aria-label="Rimuovi"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-gold/60 tracking-widest uppercase font-mono block">Obiettivo dell'evento / Messaggio</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.objective}
                    onChange={(e) => setFormData({...formData, objective: e.target.value})}
                    className="w-full bg-transparent border-0 border-b border-white/10 hover:border-white/20 focus:border-b-2 px-1 py-3 text-sm text-white font-light outline-none transition-all duration-500 resize-none rounded-none"
                    style={{ borderBottomColor: undefined }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = sectorGlow.primary }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = '' }}
                    placeholder="Descrivi cosa desideri ottenere o le criticità del team da affrontare..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-gold hover:bg-gold-light text-dark-navy font-bold uppercase tracking-[0.2em] text-[10px] py-4.5 rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.18)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)] hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? 'Invio in corso...' : 'Invia Richiesta di Progetto'}
                </button>
              </motion.form>
            ) : (
              /* Success Panel */
              <motion.div
                key="success-panel"
                className="text-center py-6 px-4 space-y-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(212,175,55,0.25)]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.1 }}
                >
                  <motion.svg
                    className="w-10 h-10 text-gold"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <motion.path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </motion.svg>
                </motion.div>
                <div>
                  <h3 className="text-xl md:text-2xl font-light text-white tracking-wide font-heading">
                    Richiesta inviata
                  </h3>
                  <span className="text-[10px] font-mono text-gold bg-gold/5 border border-gold/20 px-3 py-1 rounded-full inline-block mt-2">
                    ID PROGETTO: {projectId}
                  </span>
                </div>
                <p className="text-xs text-white/55 font-light max-w-sm mx-auto leading-relaxed">
                  I dettagli del tuo <strong>Lumina Custom Blueprint</strong> sono stati preconfigurati e inviati con successo al dipartimento commerciale. Un account manager ti contatterà nelle prossime 24 ore.
                </p>

                {/* Mock PDF download */}
                {hasResults && generatedBlueprint && (
                  <div className="bg-[#121829] border border-white/5 p-4 rounded-xl max-w-sm mx-auto space-y-3">
                    <p className="text-[10px] text-white/45 font-light leading-relaxed">
                      Scarica il pre-modello di proposta commerciale da condividere con il tuo team.
                    </p>
                    <button
                      onClick={() => {
                        // Generate mock PDF as a download text file with styled layout
                        const text = `================================================
          LUMINA XP - EXPERIENCE PLATFORM
          RICEVUTA BLUEPRINT PRECONFIGURATO
================================================
ID PROGETTO: ${projectId}
DATA EMISSIONE: ${new Date().toLocaleDateString('it-IT')}
SFIDA AZIENDALE: "${formData.objective}"
AZIENDA: ${formData.company}
REFERENTE: ${formData.name}
E-MAIL: ${formData.email}
PARTECIPANTI: ${formData.participants}
AREE DI INTERESSE: ${formData.customizations.join(', ')}
${selectedCourses.length > 0 ? `\nPERCORSI SELEZIONATI:\n${selectedCourses.map(sc => `- ${sc.courseTitle} (${sc.expertName}${sc.duration ? `, ${sc.duration}` : ''})`).join('\n')}` : ''}

------------------------------------------------
PROGRAMMA SUGGERITO (3 FASI)
------------------------------------------------
${generatedBlueprint.days.map(day => `
${day.theme}
Focus: ${day.focus}
Attività:
${day.activities.map(act => `- [${act.time}] ${act.title} (${act.expert}): ${act.description}`).join('\n')}
`).join('\n')}

================================================
I nostri commerciali elaboreranno i dettagli economici
e contrattuali entro 24 ore.
Grazie per aver scelto Lumina XP.
================================================`;
                        const blob = new Blob([text], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `Lumina_XP_Blueprint_${projectId}.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="w-full py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      📄 Scarica Riepilogo Proposta (.txt)
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-gold underline hover:text-gold-light transition-colors pt-2 cursor-pointer font-light block mx-auto"
                >
                  Invia un altro messaggio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
