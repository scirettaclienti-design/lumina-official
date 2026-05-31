import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLuminaStore, detectIntentExperts, EXPERTS_DATA } from '../store/useLuminaStore'
import { analytics } from '../utils/analytics'

// Challenge categories — the user picks one first
// SVG icons for each category — elegant line art
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  team: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
  leadership: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>,
  burnout: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
  innovation: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>,
  reward: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
  event: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2"><path strokeLinecap="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
}

const CHALLENGE_CATEGORIES = [
  { id: 'team', label: 'Il team non funziona', desc: 'Tensioni, silos, mancanza di fiducia o coesione tra le persone' },
  { id: 'leadership', label: 'La leadership e\' debole', desc: 'Manager reattivi, assenza di visione, comunicazione inefficace' },
  { id: 'burnout', label: 'Stress e burnout', desc: 'Team esausto, turnover alto, energia bassa, produttivita\' in calo' },
  { id: 'reward', label: 'Premiare il team', desc: 'Regalare un\'esperienza speciale come premio, incentivo o celebrazione' },
  { id: 'innovation', label: 'Serve innovazione', desc: 'Processi lenti, resistenza al cambiamento, AI non adottata' },
  { id: 'event', label: 'Evento memorabile', desc: 'Retreat, convention o team building che lasci un segno reale e duraturo' },
]

// Follow-up questions per category with REAL answer options
// SECTOR question is ALWAYS asked first — keyword-rich answers for better matching
const SECTOR_QUESTION = {
  question: 'In che settore opera la vostra azienda?',
  options: [
    'Tech / Software / Digital / Startup',
    'Finance / Banca / Assicurazioni',
    'Retail / Lusso / Moda / Vendita',
    'Industria / Produzione / Manifattura',
    'Healthcare / Farmaceutico / Sanita\'',
    'Servizi / Consulenza / Altro',
  ],
}

const CATEGORY_QUESTIONS: Record<string, Array<{ question: string; options: string[] }>> = {
  team: [
    SECTOR_QUESTION,
    { question: 'Qual e\' la causa principale della tensione?', options: [
      'Conflitti tra reparti e comunicazione a silos',
      'Lavoro remoto e team disconnesso e distante',
      'Post-fusione o acquisizione con culture diverse',
      'Mancanza di fiducia e coesione nel gruppo',
    ]},
    { question: 'Quante persone coinvolte nel problema?', options: ['Meno di 15 dipendenti', '15–50 dipendenti', '50–100 dipendenti', 'Oltre 100 dipendenti'] },
  ],
  leadership: [
    SECTOR_QUESTION,
    { question: 'Chi ha bisogno di crescere?', options: [
      'Top management e direzione aziendale',
      'Middle management e quadri intermedi',
      'Nuovi manager appena promossi',
      'Tutto il livello dirigenziale e manageriale',
    ]},
    { question: 'Quale competenza manca?', options: [
      'Gestione delle persone e intelligenza emotiva',
      'Decision making strategico e problem solving',
      'Public speaking e comunicazione efficace',
      'Gestione del tempo e produttivita\' personale',
    ]},
  ],
  burnout: [
    SECTOR_QUESTION,
    { question: 'Quale reparto soffre di piu\' di stress e burnout?', options: [
      'Reparto sviluppo, tech e IT con deadline continue',
      'Commerciale, vendite e marketing sotto pressione target',
      'Operations, produzione e logistica',
      'Tutta l\'azienda e\' sotto stress cronico',
    ]},
    { question: 'Il turnover e l\'assenteismo sono un problema?', options: [
      'Si, il turnover e\' critico, perdiamo talenti',
      'Si, l\'assenteismo e\' in crescita',
      'Non ancora ma il clima e\' pessimo e peggiorera\'',
      'Non lo monitoriamo ma sentiamo la tensione',
    ]},
  ],
  innovation: [
    SECTOR_QUESTION,
    { question: 'Quale area volete innovare e trasformare?', options: [
      'Processi interni, automazione e workflow operativi',
      'Customer experience e comunicazione esterna',
      'Prodotto, servizio e modello di business',
      'Cultura aziendale, valori e modo di lavorare',
    ]},
    { question: 'Che rapporto ha il team con l\'intelligenza artificiale?', options: [
      'Non usa nessuno strumento di automazione o AI',
      'Qualcuno usa ChatGPT ma senza formazione strutturata',
      'Vogliamo formare tutti con AI e automazione operativa',
      'Abbiamo gia\' strumenti ma servono workflow avanzati',
    ]},
  ],
  reward: [
    SECTOR_QUESTION,
    { question: 'Che tipo di esperienza volete regalare al team?', options: [
      'Esperienza sensoriale unica: profumi, gusto, benessere',
      'Attivita\' sportiva con campioni e team building fisico',
      'Laboratorio creativo: storytelling, scrittura, musica',
      'Retreat immersivo in location esclusiva con esperti',
    ]},
    { question: 'Quante persone partecipano?', options: ['10–20 persone', '20–50 persone', '50–100 persone', 'Oltre 100 persone'] },
  ],
  event: [
    SECTOR_QUESTION,
    { question: 'Che tipo di evento trasformativo cercate?', options: [
      'Retreat immersivo 2–3 giorni in location esclusiva',
      'Convention aziendale di una giornata motivazionale',
      'Team building sportivo con campioni e attivita\' fisiche',
      'Esperienza sensoriale con laboratori olfattivi e creativi',
    ]},
    { question: 'Quanti partecipanti devono essere coinvolti?', options: ['10–20 persone', '20–50 persone', '50–100 persone', 'Oltre 100 persone'] },
  ],
  // Fallback — used if category ID doesn't match (shouldn't happen with 6 fixed categories)
  other: [
    SECTOR_QUESTION,
    { question: 'Quante persone sono coinvolte?', options: ['Meno di 20 dipendenti', '20–50 dipendenti', '50–100 dipendenti', 'Oltre 100 dipendenti'] },
    { question: 'Qual e\' la priorita\' principale?', options: [
      'Persone, relazioni e fiducia nel team',
      'Processi, efficienza e automazione operativa',
      'Cultura aziendale, valori e identita\' condivisa',
      'Performance, risultati e crescita del fatturato',
    ]},
  ],
}

export default function Hero() {
  const [input, setInput] = useState('')
  const analyzeChallenge = useLuminaStore((s) => s.analyzeChallenge)
  const isGenerating = useLuminaStore((s) => s.isGenerating)
  const hasResults = useLuminaStore((s) => s.hasResults)
  const setPreMatchedExperts = useLuminaStore((s) => s.setPreMatchedExperts)


  const submitted = isGenerating || hasResults

  // Guided flow state
  const [step, setStep] = useState<'category' | 'details' | 'questions'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  // Live intent detection
  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    if (value.trim().length >= 4) {
      setPreMatchedExperts(detectIntentExperts(value))
    } else {
      setPreMatchedExperts([])
    }
  }, [setPreMatchedExperts])

  // Category selection → move to details
  const handleCategorySelect = (catId: string) => {
    analytics.categorySelected(catId)
    setSelectedCategory(catId)
    setStep('details')
    setAnswers([])
    setQuestionIdx(0)
  }

  // Submit details → move to guided questions
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setStep('questions')
    setQuestionIdx(0)
    setAnswers([])
  }

  // Answer a question
  const handleAnswer = (answer: string) => {
    const updated = [...answers, answer]
    setAnswers(updated)

    const questions = CATEGORY_QUESTIONS[selectedCategory || 'other']
    if (updated.length >= questions.length) {
      // Build enriched prompt and launch
      const cat = CHALLENGE_CATEGORIES.find(c => c.id === selectedCategory)
      // Build keyword-rich prompt: category label + desc + user text + all answers
      const enrichedQuery = [
        cat?.label || '',
        cat?.desc || '',
        input.trim(),
        ...updated,
      ].filter(Boolean).join('. ') + '.'
      analyzeChallenge(enrichedQuery)
    } else {
      setQuestionIdx(updated.length)
    }
  }

  // Scroll to results
  useEffect(() => {
    if (hasResults && !isGenerating) {
      setTimeout(() => {
        document.getElementById('blueprint-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 300)
    }
  }, [hasResults, isGenerating])

  const handleScrollDown = () => {
    document.getElementById('ai-narration')?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentQuestions = CATEGORY_QUESTIONS[selectedCategory || 'other'] || []

  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-transparent transition-all duration-700 ${hasResults ? 'hidden' : isGenerating ? 'min-h-0 py-24' : 'min-h-screen'}`}>
      {/* Ambient orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-gold/8 rounded-full blur-[160px] md:blur-[220px]"
          animate={{ scale: isGenerating ? [1, 1.2, 1] : [1, 1.06, 1], opacity: isGenerating ? [0.3, 0.7, 0.3] : [0.3, 0.45, 0.3] }}
          transition={{ duration: isGenerating ? 1.2 : 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-500/4 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-5xl">

        {/* Logo */}
        <img
          src="/assets/logo.png" alt="Lumina XP"
          className="w-[160px] md:w-[200px] h-auto mb-6 object-contain gold-logo-glow mx-auto"
        />

        {/* Title — only when NOT generating */}
        {!isGenerating && (
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light md:font-extralight text-white/90 tracking-tight font-heading leading-[1.05] mb-3">
              Esperienze che<br />
              <span className="text-gold-metallic font-light">si adattano.</span>
            </h1>
            <p className="text-white/30 text-sm md:text-base font-light max-w-md mx-auto mt-4">
              {step === 'category' && 'Seleziona il tipo di sfida del tuo team per iniziare.'}
              {step === 'details' && 'Descrivi brevemente la situazione.'}
              {step === 'questions' && `Domanda ${questionIdx + 1} di ${currentQuestions.length} — aiutaci a calibrare.`}
            </p>
          </div>
        )}

        {/* ─── GUIDED FLOW ─── */}
        <AnimatePresence mode="wait">
          {!submitted && step === 'category' && (
            <motion.div
              key="step-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {CHALLENGE_CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(212,175,55,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="magnetic-target text-left p-5 md:p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-white/30 group-hover:text-gold/70 transition-colors mb-3">{CATEGORY_ICONS[cat.id]}</div>
                    <span className="text-sm font-medium text-white/80 block mb-1 group-hover:text-gold transition-colors">{cat.label}</span>
                    <span className="text-[11px] text-white/30 font-light leading-snug block">{cat.desc}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {!submitted && step === 'details' && (
            <motion.form
              key="step-details"
              onSubmit={handleDetailsSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              {/* Selected category badge */}
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setStep('category')} className="text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <span className="text-[11px] font-mono text-gold/60 bg-gold/5 border border-gold/15 rounded-full px-3 py-1 uppercase tracking-widest">
                  {CHALLENGE_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </span>
              </div>

              <div className="relative group mb-6">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[1px]" />
                <div className="relative bg-[#0c1120]/80 backdrop-blur-xl border border-white/10 group-focus-within:border-gold/50 rounded-2xl px-6 py-5 transition-all duration-500">
                  <textarea
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Racconta in poche righe cosa sta succedendo nel tuo team..."
                    rows={3}
                    className="w-full bg-transparent text-base md:text-lg text-white/90 font-light tracking-wide placeholder:text-white/20 outline-none border-none resize-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Live expert preview */}
              {input.trim().length >= 4 && (() => {
                const matched = detectIntentExperts(input)
                if (matched.length === 0) return null
                const experts = matched.slice(0, 3).map(name => EXPERTS_DATA.find(e => e.name === name)).filter(Boolean)
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/6"
                  >
                    <div className="flex -space-x-2">
                      {experts.map((exp) => exp && (
                        exp.avatar.startsWith('/') ? (
                          <img key={exp.name} src={exp.avatar} alt={exp.name} className="w-8 h-8 rounded-full border-2 border-dark-navy object-cover" />
                        ) : (
                          <div key={exp.name} className="w-8 h-8 rounded-full border-2 border-dark-navy bg-gold/10 flex items-center justify-center text-[10px] font-mono text-gold">
                            {exp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )
                      ))}
                    </div>
                    <span className="text-[11px] text-white/40 font-light">
                      {experts.map(e => e?.name.split(' ')[0]).join(', ')} — esperti coerenti con la tua sfida
                    </span>
                  </motion.div>
                )
              })()}

              <button
                type="submit"
                disabled={!input.trim()}
                className="magnetic-target w-full py-4 bg-gold hover:bg-gold-light text-dark-navy rounded-2xl text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer cta-glow active:scale-[0.98]"
              >
                Continua
              </button>
            </motion.form>
          )}

          {!submitted && step === 'questions' && (
            <motion.div
              key="step-questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              {/* Progress bar */}
              <div className="flex gap-2 mb-8">
                {currentQuestions.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    i < questionIdx ? 'bg-gold' : i === questionIdx ? 'bg-gold/50' : 'bg-white/8'
                  }`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={questionIdx}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-light text-white/90 mb-8 leading-relaxed">
                    {currentQuestions[questionIdx]?.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestions[questionIdx]?.options.map((opt, oIdx) => (
                      <motion.button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswer(opt)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: oIdx * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.02, borderColor: 'rgba(212,175,55,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        className="magnetic-target text-left px-5 py-4 rounded-xl backdrop-blur-xl bg-white/[0.03] border border-white/8 hover:bg-gold/5 text-sm text-white/70 hover:text-gold font-light transition-all duration-300 cursor-pointer"
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Loading state */}
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gold/20 border-t-gold animate-spin mx-auto mb-6" />
              <p className="text-white/40 text-sm font-light">Analisi in corso...</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Scroll indicator */}
      {!submitted && step === 'category' && (
        <motion.div
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer text-white/20 hover:text-white/50 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase font-light">Scopri di piu'</span>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
        </motion.div>
      )}
    </section>
  )
}
