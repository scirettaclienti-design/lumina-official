import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLuminaStore, MAIN_AUDIO_SRC } from '../store/useLuminaStore'

// ─── New Manifesto Transcript synced to lumina_manifesto.mp3 (Aurora voice) ───
const MAIN_TRANSCRIPT = [
  { text: "Benvenuti in Lumina. Se siete stanchi dei soliti corsi aziendali tutti uguali, fatti di slide noiose e teorie difficili da applicare, siete nel posto giusto.", start: 0, end: 9 },
  { text: "Lumina capovolge completamente questo approccio, offrendo un'esperienza che si adatta alle vostre reali necessità.", start: 9, end: 15 },
  { text: "Il processo è semplice e immediato: la nostra tecnologia interviene come un supporto strategico avanzato, eseguendo una pre-analisi istantanea delle dinamiche e delle criticità della vostra organizzazione.", start: 15, end: 25 },
  { text: "Questa mappatura velocizza i tempi di comprensione e permette ai nostri esperti di andare a colpo sicuro.", start: 25, end: 30 },
  { text: "Saranno infatti i nostri professionisti a prendere in mano i dati e a sviluppare la proposta migliore, cucendo un percorso d'eccellenza su misura per i vostri obiettivi e per il vostro team.", start: 30, end: 42 },
  { text: "Uniamo la rapidità dell'algoritmo con l'esperienza sul campo di campioni olimpici, neuroscienziati e specialisti dei processi.", start: 42, end: 49 },
  { text: "Entrate, avviate la pre-analisi e guardate la vostra soluzione prendere vita.", start: 49, end: 56 },
]

// speechSynthesis fallback
function speakFallback(text: string, onEnd: () => void) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'it-IT'
  utterance.rate = 0.9
  const voices = window.speechSynthesis.getVoices()
  const itVoice = voices.find(v => v.lang.startsWith('it') && (v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Alice'))) || voices.find(v => v.lang.startsWith('it'))
  if (itVoice) utterance.voice = itVoice
  utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

function cancelFallback() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export default function AiPresentation() {
  const playingAudio = useLuminaStore((s) => s.playingAudio)
  const setPlayingAudio = useLuminaStore((s) => s.setPlayingAudio)
  const setAudioProgress = useLuminaStore((s) => s.setAudioProgress)
  const currentTranscriptLine = useLuminaStore((s) => s.currentTranscriptLine)
  const setCurrentTranscriptLine = useLuminaStore((s) => s.setCurrentTranscriptLine)
  const videoBackgroundActive = useLuminaStore((s) => s.videoBackgroundActive)
  const toggleVideoBackground = useLuminaStore((s) => s.toggleVideoBackground)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [audioProgress, setLocalProgress] = useState(0)
  const [totalDuration, setTotalDuration] = useState(56)
  const [usingFile, setUsingFile] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fallbackActiveRef = useRef(false)
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fallbackStartRef = useRef(0)

  // Video scrubbing: 3 segments synced to audio timestamps
  const VIDEO_SEGMENTS = [
    { src: '/assets/video/lumina_manifesto_part1.mp4', from: 0, to: 15 },
    { src: '/assets/video/lumina_manifesto_part2.mp4', from: 15, to: 30 },
    { src: '/assets/video/lumina_manifesto_part3.mp4', from: 30, to: 999 },
  ]
  const [activeVideoIdx, setActiveVideoIdx] = useState(0)

  // Sync video segment to elapsed time
  useEffect(() => {
    const segIdx = VIDEO_SEGMENTS.findIndex(s => elapsedTime >= s.from && elapsedTime < s.to)
    if (segIdx !== -1 && segIdx !== activeVideoIdx) {
      setActiveVideoIdx(segIdx)
    }
  }, [elapsedTime, activeVideoIdx])

  // Initialize HTMLAudioElement
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = MAIN_AUDIO_SRC
    audioRef.current = audio
    const handleCanPlay = () => setUsingFile(true)
    const handleError = () => setUsingFile(false)
    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const syncTranscriptFromTime = useCallback((time: number) => {
    const lineIndex = MAIN_TRANSCRIPT.findIndex(
      (line) => time >= line.start && time < line.end
    )
    if (lineIndex !== -1 && lineIndex !== currentTranscriptLine) {
      setCurrentTranscriptLine(lineIndex)
    }
    // If past the last phrase end, keep highlighting the last phrase
    if (time >= MAIN_TRANSCRIPT[MAIN_TRANSCRIPT.length - 1].end && currentTranscriptLine !== MAIN_TRANSCRIPT.length - 1) {
      setCurrentTranscriptLine(MAIN_TRANSCRIPT.length - 1)
    }
  }, [currentTranscriptLine, setCurrentTranscriptLine])

  // ─── Main playback effect ───
  useEffect(() => {
    const audio = audioRef.current
    const isPlaying = playingAudio === 'main'

    if (isPlaying) {
      // Kill any previous audio engine to prevent double-voice
      cancelFallback()
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)


      if (usingFile && audio) {
        fallbackActiveRef.current = false

        const onTimeUpdate = () => {
          const t = audio.currentTime
          const dur = audio.duration || totalDuration
          setElapsedTime(t)
          const pct = (t / dur) * 100
          setLocalProgress(pct)
          setAudioProgress(pct)
          syncTranscriptFromTime(t)
        }

        const onLoadedMetadata = () => {
          if (audio.duration && isFinite(audio.duration)) {
            setTotalDuration(audio.duration)
          }
        }

        const onEnded = () => setPlayingAudio(null)

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('ended', onEnded)
        audio.play().catch(() => {})

        return () => {
          audio.removeEventListener('timeupdate', onTimeUpdate)
          audio.removeEventListener('loadedmetadata', onLoadedMetadata)
          audio.removeEventListener('ended', onEnded)
        }
      } else {
        fallbackActiveRef.current = true
        const fullText = MAIN_TRANSCRIPT.map(t => t.text).join(' ')
        speakFallback(fullText, () => setPlayingAudio(null))

        fallbackStartRef.current = Date.now() - elapsedTime * 1000
        fallbackTimerRef.current = setInterval(() => {
          const delta = (Date.now() - fallbackStartRef.current) / 1000
          if (delta >= totalDuration) {
            setPlayingAudio(null)
          } else {
            setElapsedTime(delta)
            const pct = (delta / totalDuration) * 100
            setLocalProgress(pct)
            setAudioProgress(pct)
            syncTranscriptFromTime(delta)
          }
        }, 80)

        return () => {
          if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
        }
      }
    } else {
      if (audio && !audio.paused) audio.pause()
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
      cancelFallback()
      fallbackActiveRef.current = false
    }

    return () => {
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current)
      cancelFallback()
    }
  }, [playingAudio, usingFile])

  const handlePlayPause = () => {
    if (playingAudio === 'main') {
      setPlayingAudio(null)
    } else {
      setPlayingAudio('main')
    }
  }

  const handleStop = () => {
    setPlayingAudio(null)
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
    cancelFallback()
    setElapsedTime(0)
    setLocalProgress(0)
    setAudioProgress(0)
    setCurrentTranscriptLine(0)
  }

  const handleSeekToLine = (lineIdx: number) => {
    const line = MAIN_TRANSCRIPT[lineIdx]
    if (!line) return
    const audio = audioRef.current
    if (usingFile && audio) {
      audio.currentTime = line.start
    } else if (fallbackActiveRef.current) {
      fallbackStartRef.current = Date.now() - line.start * 1000
    }
    setElapsedTime(line.start)
    setLocalProgress((line.start / totalDuration) * 100)
    setAudioProgress((line.start / totalDuration) * 100)
    setCurrentTranscriptLine(lineIdx)
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const isPlaying = playingAudio === 'main'

  return (
    <section id="ai-narration" className="relative overflow-hidden section-glow-divider">

      {/* ─── Rich Ambient Background ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a14] via-[#0a0f1e] to-[#060a14] pointer-events-none" />
      <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] bg-gold/[0.05] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[60%] left-[60%] w-[350px] h-[350px] bg-purple-500/[0.025] rounded-full blur-[150px] pointer-events-none" />

      {/* Decorative vertical line — left accent */}
      <div className="absolute left-[8%] md:left-[12%] top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-gold/15 to-transparent pointer-events-none" />

      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Videos are optional — gracefully hidden when files are missing */}
        {VIDEO_SEGMENTS.map((seg, idx) => (
          <motion.video
            key={seg.src} src={seg.src} autoPlay loop muted playsInline preload="none"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying && idx === activeVideoIdx ? 0.1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/95 via-[#0a0f1e]/80 to-[#060a14]/95" />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-36 md:py-48">

        {/* Two-column header: left title + right play button */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-20"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:col-span-8">
            <motion.p
              className="text-gold/50 text-[10px] font-medium uppercase mb-5"
              initial={{ letterSpacing: '1.4em', opacity: 0 }}
              whileInView={{ letterSpacing: '0.15em', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.7, delay: 0.1 }}
            >
              Il Manifesto
            </motion.p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight text-white/90 tracking-tight leading-[1.05] font-heading">
              Perche' siamo<br />
              <span className="text-gold-metallic font-light">differenti</span>
            </h2>
            <p className="text-white/30 text-base mt-6 font-light max-w-lg leading-relaxed">
              Premi play e ascolta la nostra visione. Ogni frase si illumina in sincronia con la voce.
            </p>
          </div>

          {/* Play button — large, centered, with rings */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative">
              {/* Pulsing rings behind button */}
              {!isPlaying && (
                <>
                  <div className="absolute inset-0 w-28 h-28 -m-[14px] rounded-full border border-gold/10 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 w-24 h-24 -m-[6px] rounded-full border border-gold/5 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
                </>
              )}
              <motion.button
                type="button"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Metti in pausa il manifesto' : 'Ascolta il manifesto'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className={`magnetic-target relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer z-10 ${
                  isPlaying
                    ? 'bg-gold/20 border-2 border-gold shadow-[0_0_50px_rgba(212,175,55,0.3)]'
                    : 'bg-white/[0.05] border-2 border-white/15 hover:border-gold/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]'
                }`}
              >
                {isPlaying ? (
                  <svg className="w-7 h-7 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg className="w-8 h-8 text-gold/80 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── IMMERSIVE SLIDE EXPERIENCE ─── */}
        {/* Each phrase is a full card — only one visible at a time */}
        <div className="relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px] mb-16">
          <AnimatePresence mode="wait">
            {MAIN_TRANSCRIPT.map((line, idx) => {
              // Show: active line when playing, or first line when idle
              const showIdx = isPlaying ? currentTranscriptLine : 0
              if (idx !== showIdx) return null

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  {/* Phrase number — large decorative */}
                  <span className="text-6xl sm:text-7xl md:text-8xl font-extralight text-gold/[0.07] font-mono leading-none mb-4 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* The phrase — giant, cinematic */}
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-[1.4] md:leading-[1.35] tracking-wide text-white/90 max-w-3xl">
                    {line.text}
                  </p>

                  {/* Progress dots */}
                  <div className="flex items-center gap-2 mt-8">
                    {MAIN_TRANSCRIPT.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => {
                          if (!isPlaying) setPlayingAudio('main')
                          handleSeekToLine(dotIdx)
                        }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          dotIdx === idx
                            ? 'w-8 h-2 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                            : dotIdx < idx
                              ? 'w-2 h-2 bg-gold/30'
                              : 'w-2 h-2 bg-white/10 hover:bg-white/20'
                        }`}
                        aria-label={`Frase ${dotIdx + 1}`}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-white/20 ml-3">
                      {idx + 1}/{MAIN_TRANSCRIPT.length}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Click to navigate when not playing */}
          {!isPlaying && (
            <div className="absolute bottom-0 right-0 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlayingAudio('main')
                }}
                className="text-[11px] text-gold/50 hover:text-gold font-mono uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Ascolta tutto
              </button>
            </div>
          )}
        </div>

        {/* ─── Bottom bar: timeline + controls ─── */}
        <div className="flex items-center gap-5">
          <span className="text-[10px] font-mono text-white/25 select-none w-10">{formatTime(elapsedTime)}</span>

          {/* Scrubbing timeline */}
          <div
            className="magnetic-target flex-1 h-10 relative cursor-pointer group flex items-center"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = ((e.clientX - rect.left) / rect.width) * 100
              const targetTime = (pct / 100) * totalDuration
              const lineIdx = MAIN_TRANSCRIPT.findIndex(l => targetTime >= l.start && targetTime < l.end)
              if (lineIdx !== -1) {
                if (!isPlaying) setPlayingAudio('main')
                handleSeekToLine(lineIdx)
              }
            }}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/8" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)] rounded-full transition-all duration-150" style={{ width: `${audioProgress}%` }} />
            {/* Phrase markers */}
            {MAIN_TRANSCRIPT.map((line, i) => (
              <div key={i} className={`absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full transition-all duration-300 border ${
                i <= (currentTranscriptLine ?? -1)
                  ? 'bg-gold border-gold shadow-[0_0_6px_rgba(212,175,55,0.5)]'
                  : 'bg-transparent border-white/15 group-hover:border-white/30'
              }`} style={{ left: `${(line.start / totalDuration) * 100}%` }} />
            ))}
            {/* Playhead */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:w-4 group-hover:h-4 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition-all duration-200 z-10"
              style={{ left: `calc(${audioProgress}% - 6px)` }}
            />
          </div>

          <span className="text-[10px] font-mono text-white/25 select-none w-10 text-right">{formatTime(totalDuration)}</span>

          {isPlaying && (
            <button type="button" onClick={handleStop} className="magnetic-target w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 text-white/30 hover:text-gold flex items-center justify-center cursor-pointer transition-all">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
            </button>
          )}

          {/* BG_STREAM toggle */}
          <button
            type="button"
            onClick={toggleVideoBackground}
            className={`magnetic-target text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer px-2 py-1 rounded border ${
              videoBackgroundActive
                ? 'text-gold/50 border-gold/15 hover:text-gold hover:border-gold/30'
                : 'text-white/20 border-white/5 hover:text-white/40'
            }`}
          >
            BG {videoBackgroundActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </section>
  )
}
