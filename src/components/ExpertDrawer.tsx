import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLuminaStore } from '../store/useLuminaStore'
import { analytics } from '../utils/analytics'

// speechSynthesis fallback for when .mp3 files are not yet available
function speakFallback(text: string, onEnd: () => void) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'it-IT'
  utterance.rate = 0.82
  utterance.pitch = 0.95
  const voices = window.speechSynthesis.getVoices()
  const itVoice = voices.find(v => v.lang.startsWith('it') && (v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Alice'))) || voices.find(v => v.lang.startsWith('it'))
  if (itVoice) utterance.voice = itVoice
  utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

function cancelFallback() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export default function ExpertDrawer() {
  const selectedExpert = useLuminaStore((s) => s.selectedExpert)
  const setSelectedExpert = useLuminaStore((s) => s.setSelectedExpert)
  const playingAudio = useLuminaStore((s) => s.playingAudio)
  const setPlayingAudio = useLuminaStore((s) => s.setPlayingAudio)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [audioProgress, setAudioProgress] = useState(0)
  const [totalDuration, setTotalDuration] = useState(10)
  const [usingFile, setUsingFile] = useState(false)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  // HTMLAudioElement ref
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Fallback timer
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fallbackStartRef = useRef(0)
  const fallbackActiveRef = useRef(false)

  const pitchLength = selectedExpert?.audioPitch?.split(' ').length ?? 0
  const estimatedDuration = Math.max(Math.round(pitchLength / 2.5), 10)

  // Initialize/swap audio element when expert changes
  useEffect(() => {
    if (!selectedExpert) return

    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    if (selectedExpert.audioSrc) {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = selectedExpert.audioSrc
      audioRef.current = audio

      const handleCanPlay = () => setUsingFile(true)
      const handleError = () => setUsingFile(false)
      audio.addEventListener('canplaythrough', handleCanPlay)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay)
        audio.removeEventListener('error', handleError)
      }
    } else {
      audioRef.current = null
      setUsingFile(false)
    }
  }, [selectedExpert])

  // Auto-play when drawer opens + reset expanded course
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (selectedExpert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedExpert])

  useEffect(() => {
    if (selectedExpert) {
      setExpandedCourse(null)
      setElapsedTime(0)
      setAudioProgress(0)
      setTotalDuration(estimatedDuration)
      const t = setTimeout(() => setPlayingAudio(selectedExpert.name), 400)
      return () => {
        clearTimeout(t)
        setPlayingAudio(null)
      }
    }
  }, [selectedExpert, setPlayingAudio, estimatedDuration])

  const handleStopAudio = useCallback(() => {
    setPlayingAudio(null)
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    cancelFallback()
    if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
    setElapsedTime(0)
    setAudioProgress(0)
  }, [setPlayingAudio])

  // ─── Main playback effect ───
  useEffect(() => {
    const isPlaying = selectedExpert && playingAudio === selectedExpert.name
    const audio = audioRef.current

    if (isPlaying) {
      // CRITICAL: Always kill the other engine first to prevent double-voice
      cancelFallback()
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)


      if (usingFile && audio) {
        // ── HTMLAudioElement path ──
        fallbackActiveRef.current = false

        const onTimeUpdate = () => {
          const t = audio.currentTime
          const dur = audio.duration || totalDuration
          setElapsedTime(t)
          setAudioProgress((t / dur) * 100)
        }

        const onLoadedMetadata = () => {
          if (audio.duration && isFinite(audio.duration)) {
            setTotalDuration(audio.duration)
          }
        }

        const onEnded = () => handleStopAudio()

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('ended', onEnded)
        audio.play().catch(() => {})

        return () => {
          audio.removeEventListener('timeupdate', onTimeUpdate)
          audio.removeEventListener('loadedmetadata', onLoadedMetadata)
          audio.removeEventListener('ended', onEnded)
        }
      } else if (selectedExpert?.audioPitch) {
        // ── speechSynthesis fallback ──
        fallbackActiveRef.current = true
        speakFallback(selectedExpert.audioPitch, () => handleStopAudio())

        fallbackStartRef.current = Date.now() - elapsedTime * 1000
        fallbackTimerRef.current = setInterval(() => {
          const delta = (Date.now() - fallbackStartRef.current) / 1000
          if (delta >= estimatedDuration) {
            handleStopAudio()
          } else {
            setElapsedTime(delta)
            setAudioProgress((delta / estimatedDuration) * 100)
          }
        }, 80)

        return () => {
          if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
        }
      }
    } else {
      // ── Stop everything ──
      if (audio && !audio.paused) audio.pause()
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
      cancelFallback()
      fallbackActiveRef.current = false
    }

    return () => {
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
      cancelFallback()
    }
  }, [playingAudio, selectedExpert, usingFile, handleStopAudio])

  if (!selectedExpert) return null

  const initials = selectedExpert.name.split(' ').map(n => n[0]).join('')
  const isAudioPlaying = playingAudio === selectedExpert.name

  const handlePlayPauseAudio = () => {
    if (isAudioPlaying) {
      setPlayingAudio(null)
      const audio = audioRef.current
      if (audio) audio.pause()
      cancelFallback()
    } else {
      setPlayingAudio(selectedExpert.name)
    }
  }

  const handleSeek = (percent: number) => {
    const audio = audioRef.current
    const targetTime = (percent / 100) * totalDuration
    setElapsedTime(targetTime)
    setAudioProgress(percent)

    if (usingFile && audio) {
      audio.currentTime = targetTime
    } else if (fallbackActiveRef.current) {
      fallbackStartRef.current = Date.now() - targetTime * 1000
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Gender-differentiated waveform: female voices have tighter, higher-frequency shapes
  // Male voices have wider, deeper amplitude swings
  const isFemale = selectedExpert.gender === 'female'
  const waveformHeights = isFemale
    ? [35, 55, 70, 45, 60, 80, 55, 70, 85, 50, 40, 60, 75, 80, 55, 45, 35, 55, 75, 60, 50, 40, 55, 70, 45, 35, 25, 15]
    : [20, 35, 55, 25, 40, 70, 45, 60, 95, 35, 25, 45, 65, 90, 55, 35, 20, 40, 85, 70, 45, 30, 55, 80, 35, 25, 15, 8]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label={`Profilo di ${selectedExpert.name}`}>
        {/* Overlay */}
        <motion.div
          onClick={() => { handleStopAudio(); setSelectedExpert(null) }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <motion.div
            className="w-screen md:max-w-lg bg-[#090d1a] overflow-y-auto no-scrollbar relative"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 100) {
                handleStopAudio()
                setSelectedExpert(null)
              }
            }}
          >
            {/* ─── Hero Image Area ─── */}
            <div className="relative h-[320px] overflow-hidden">
              {selectedExpert.avatar.startsWith('/') ? (
                <img src={selectedExpert.avatar} alt={selectedExpert.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center text-7xl font-extralight font-mono text-gold/40">
                  {initials}
                </div>
              )}
              {/* Gradient fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-[#090d1a]/40 to-transparent" />
              {/* Category badge */}
              <span className="absolute top-5 left-5 text-[9px] font-mono px-3 py-1.5 rounded-full border backdrop-blur-xl bg-black/40 border-white/15 text-white/70 uppercase tracking-widest">
                {selectedExpert.category}
              </span>
              {/* Close button — large touch target for mobile */}
              <button
                onClick={() => { handleStopAudio(); setSelectedExpert(null) }}
                className="absolute top-4 right-4 w-12 h-12 rounded-full backdrop-blur-xl bg-black/50 border border-white/20 hover:border-gold/40 text-white/80 hover:text-gold flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Chiudi profilo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
              {/* Swipe hint — mobile only */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30 md:hidden" />
            </div>

            {/* ─── Content ─── */}
            <div className="px-7 pb-10 -mt-8 relative z-10 space-y-8">

              {/* Name + Role */}
              <div>
                <h3 className="text-2xl md:text-3xl font-light text-white tracking-wide font-heading">{selectedExpert.name}</h3>
                <p className="text-sm text-white/40 font-light mt-1">{selectedExpert.role}</p>
              </div>

              {/* ─── Audio Player — minimal elegant ─── */}
              {selectedExpert.audioPitch && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={handlePlayPauseAudio}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      className={`magnetic-target w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                        isAudioPlaying
                          ? 'bg-gold/20 border-2 border-gold shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                          : 'bg-white/5 border border-white/15 hover:border-gold/40'
                      }`}
                    >
                      {isAudioPlaying ? (
                        <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-gold/70 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </motion.button>

                    {/* Waveform */}
                    <div className="flex items-center gap-[2px] h-8 flex-1">
                      {waveformHeights.map((h, bIdx) => {
                        const barPercent = (bIdx / waveformHeights.length) * 100
                        const isPlayed = audioProgress >= barPercent
                        return (
                          <div
                            key={bIdx}
                            onClick={() => handleSeek(barPercent)}
                            className={`flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                              isPlayed ? 'bg-gold' : 'bg-white/8 hover:bg-white/15'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        )
                      })}
                    </div>

                    <span className="text-[10px] font-mono text-white/25 w-8 text-right">{formatTime(elapsedTime)}</span>
                  </div>

                  {/* Transcript text — clean, no quotes */}
                  <p className="text-sm text-white/40 font-light leading-relaxed italic">
                    {selectedExpert.audioPitch}
                  </p>
                </div>
              )}

              {/* ─── Bio ─── */}
              <div>
                <h4 className="text-xs text-gold/60 uppercase tracking-widest mb-3">Chi e'</h4>
                <p className="text-[15px] text-white/65 font-light leading-relaxed">{selectedExpert.bio}</p>
              </div>

              {/* ─── Value — highlighted card ─── */}
              <div className="backdrop-blur-xl bg-gold/[0.04] border border-gold/15 rounded-2xl p-6">
                <h4 className="text-xs text-gold/80 uppercase tracking-widest mb-3">Cosa porta alla vostra azienda</h4>
                <p className="text-sm text-white/70 font-light leading-relaxed">{selectedExpert.valueAdd}</p>
              </div>

              {/* ─── Courses — Expandable Deep Dive ─── */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs text-gold/60 uppercase tracking-widest">Percorsi disponibili</h4>
                  <span className="text-[10px] text-white/20 font-mono">{selectedExpert.courses.length} moduli</span>
                </div>
                <div className="space-y-3">
                  {selectedExpert.courses.map((course, idx) => {
                    const isExpanded = expandedCourse === idx
                    // Parse description for structured display
                    const desc = course.description
                    const hasOutput = desc.toLowerCase().includes('output:')
                    const hasROI = desc.toLowerCase().includes('roi')
                    const outputMatch = desc.match(/[Oo]utput[:\s]+(.+?)(?:\.|$)/)
                    const roiMatch = desc.match(/ROI[^:]*:\s*(.+?)(?:\.|$)/)

                    return (
                      <motion.div
                        key={course.title + idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.4 }}
                        className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                          isExpanded
                            ? 'bg-white/[0.04] border-gold/25 shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
                            : 'bg-white/[0.02] border-white/6 hover:border-white/15'
                        }`}
                      >
                        {/* Course header — always visible, clickable */}
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedCourse(isExpanded ? null : idx)
                            if (!isExpanded) analytics.courseExpanded(course.title, selectedExpert.name)
                          }}
                          className="w-full text-left p-5 flex items-start justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex-1">
                            <h5 className={`text-sm font-medium tracking-wide font-heading transition-colors ${
                              isExpanded ? 'text-gold' : 'text-white/90 group-hover:text-gold/80'
                            }`}>{course.title}</h5>
                            {!isExpanded && (
                              <p className="text-[11px] text-white/35 font-light mt-1.5 line-clamp-2 leading-relaxed">
                                {desc.substring(0, 90)}...
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                            {course.duration && (
                              <span className="text-[9px] font-mono text-white/25 bg-white/5 px-2 py-0.5 rounded">{course.duration}</span>
                            )}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-white/25 group-hover:text-gold/60 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                            </motion.div>
                          </div>
                        </button>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-6 space-y-5">
                                {/* Full description */}
                                <p className="text-sm text-white/55 font-light leading-relaxed">
                                  {desc}
                                </p>

                                {/* Structured tags */}
                                <div className="flex flex-wrap gap-2">
                                  {course.duration && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-white/40 bg-white/[0.04] border border-white/8 rounded-lg px-3 py-1.5">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                      {course.duration}
                                    </span>
                                  )}
                                  {hasOutput && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gold/50 bg-gold/[0.05] border border-gold/15 rounded-lg px-3 py-1.5">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                      Deliverable incluso
                                    </span>
                                  )}
                                  {hasROI && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/50 bg-emerald-400/[0.05] border border-emerald-400/15 rounded-lg px-3 py-1.5">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                                      ROI misurabile
                                    </span>
                                  )}
                                </div>

                                {/* Output highlight — if present */}
                                {outputMatch && (
                                  <div className="bg-gold/[0.03] border border-gold/10 rounded-xl p-4">
                                    <span className="text-[9px] text-gold/60 uppercase tracking-widest block mb-2">Output rilasciato</span>
                                    <p className="text-xs text-white/60 font-light leading-relaxed">{outputMatch[1].trim()}</p>
                                  </div>
                                )}

                                {/* ROI highlight — if present */}
                                {roiMatch && (
                                  <div className="bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl p-4">
                                    <span className="text-[9px] text-emerald-400/60 uppercase tracking-widest block mb-2">Ritorno atteso</span>
                                    <p className="text-xs text-white/60 font-light leading-relaxed">{roiMatch[1].trim()}</p>
                                  </div>
                                )}

                                {/* CTA */}
                                {(() => {
                                  const courseItem = { expertName: selectedExpert.name, courseTitle: course.title, duration: course.duration }
                                  const isInCart = useLuminaStore.getState().selectedCourses.some(
                                    c => c.expertName === selectedExpert.name && c.courseTitle === course.title
                                  )
                                  return (
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => useLuminaStore.getState().toggleCourse(courseItem)}
                                      className={`magnetic-target w-full py-3 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                                        isInCart
                                          ? 'bg-gold/15 border border-gold/40 text-gold'
                                          : 'bg-white/[0.04] hover:bg-gold/10 border border-white/8 hover:border-gold/30 text-white/60 hover:text-gold'
                                      }`}
                                    >
                                      {isInCart ? (
                                        <>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                          Aggiunto al riepilogo
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                          Aggiungi al riepilogo
                                        </>
                                      )}
                                    </motion.button>
                                  )
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* ─── Contact ─── */}
              {(selectedExpert.contact?.email || selectedExpert.contact?.phone || selectedExpert.contact?.web) && (
                <div>
                  <h4 className="text-xs text-gold/60 uppercase tracking-widest mb-4">Contatti</h4>
                  <div className="space-y-2">
                    {selectedExpert.contact.email && (
                      <a href={`mailto:${selectedExpert.contact.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-gold transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                        </div>
                        <span className="text-sm text-white/50 group-hover:text-gold transition-colors">{selectedExpert.contact.email}</span>
                      </a>
                    )}
                    {selectedExpert.contact.phone && (
                      <a href={`tel:${selectedExpert.contact.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-gold transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                        </div>
                        <span className="text-sm text-white/50 group-hover:text-gold transition-colors">{selectedExpert.contact.phone}</span>
                      </a>
                    )}
                    {selectedExpert.contact.web && (
                      <a href={`https://${selectedExpert.contact.web}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-gold transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                        </div>
                        <span className="text-sm text-white/50 group-hover:text-gold transition-colors">{selectedExpert.contact.web}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* ─── Floating Cart Bar ─── */}
            {/* Sticky close button — always visible on mobile */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#090d1a] via-[#090d1a]/95 to-transparent md:hidden z-40">
              <button
                onClick={() => { handleStopAudio(); setSelectedExpert(null) }}
                className="w-full py-4 rounded-2xl bg-white/[0.06] border border-white/15 text-white/70 text-sm font-medium tracking-wider uppercase active:scale-95 transition-all"
              >
                Chiudi
              </button>
            </div>

            {(() => {
              const cartCount = useLuminaStore.getState().selectedCourses.length
              if (cartCount === 0) return null
              return (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="sticky bottom-0 left-0 right-0 bg-[#090d1a]/95 backdrop-blur-xl border-t border-gold/20 p-4 flex items-center justify-between gap-4 z-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-[11px] font-semibold">{cartCount}</span>
                    <span className="text-xs text-white/50 font-light">
                      {cartCount === 1 ? 'percorso selezionato' : 'percorsi selezionati'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExpert(null)
                      handleStopAudio()
                      setTimeout(() => {
                        document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' })
                      }, 300)
                    }}
                    className="magnetic-target px-5 py-2.5 bg-gold hover:bg-gold-light text-dark-navy rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                  >
                    Vai al riepilogo
                  </button>
                </motion.div>
              )
            })()}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
