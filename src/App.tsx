import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { useLuminaStore } from './store/useLuminaStore'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AiPresentation from './components/AiPresentation'
import ExpertsCarousel from './components/ExpertsCarousel'
import BlueprintEngine from './components/BlueprintEngine'
import PackagesSection from './components/PackagesSection'
import ContactForm from './components/ContactForm'
import ExpertDrawer from './components/ExpertDrawer'
import ParticleNetwork from './components/ParticleNetwork'
import MagneticCursor from './components/MagneticCursor'
import Footer from './components/Footer'
import SocialProof from './components/SocialProof'


function App() {
  const isGenerating = useLuminaStore((s) => s.isGenerating)
  const hasResults = useLuminaStore((s) => s.hasResults)
  const videoBackgroundActive = useLuminaStore((s) => s.videoBackgroundActive)

  const submitted = isGenerating || hasResults
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Mouse coordinate values for the 3D parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Ultra-soft spring config
  const springConfig = { stiffness: 50, damping: 20 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Map mouse positions to transform translations in opposite direction
  const windowW = typeof window !== 'undefined' ? window.innerWidth : 1920
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 1080
  const transformX = useTransform(x, [0, windowW], [30, -30])
  const transformY = useTransform(y, [0, windowH], [30, -30])

  // Scroll and scrollYProgress hook
  const { scrollY, scrollYProgress } = useScroll()

  // Scroll parallax for the background video: cinematic depth shift
  const scrollVideoY = useTransform(scrollY, [0, 2000], [0, -450])

  // Combine mouse spring Y and scroll parallax Y
  const combinedY = useTransform(
    [transformY, scrollVideoY],
    ([mouseVal, scrollVal]) => (mouseVal as number) + (scrollVal as number)
  )

  // Animate a sub value and combine it for scale
  const submitAnimScale = useMotionValue(1.0)
  
  useEffect(() => {
    submitAnimScale.set(submitted ? 1.2 : 1.0)
  }, [submitted, submitAnimScale])
  
  const springSubmittedScale = useSpring(submitAnimScale, springConfig)
  
  // Combine springSubmittedScale and scrollYProgress scale offset!
  const scrollScaleOffset = useTransform(scrollYProgress, [0, 1], [0, 0.12])
  
  const combinedScale = useTransform(
    [springSubmittedScale, scrollScaleOffset],
    ([subScale, scrollOffset]) => (subScale as number) + (scrollOffset as number)
  )

  // Scroll-driven opacity: fades slightly as they scroll deeper to focus on text readability
  const combinedOpacity = useTransform(scrollYProgress, [0, 0.6], [0.25, 0.12])

  // Animate a motion value for submitted blur
  const submitAnimBlur = useMotionValue(0)
  
  useEffect(() => {
    submitAnimBlur.set(submitted ? 16 : 0)
  }, [submitted, submitAnimBlur])
  
  const springSubmittedBlur = useSpring(submitAnimBlur, springConfig)
  
  const scrollBlurOffset = useTransform(scrollYProgress, [0, 0.6], [0, 8])
  
  const combinedBlur = useTransform(
    [springSubmittedBlur, scrollBlurOffset],
    ([subBlur, scrollOffset]) => `blur(${(subBlur as number) + (scrollOffset as number)}px)`
  )

  // Spotlight position transforms — hoisted outside JSX to avoid re-creation on render
  const spotlightTransformX = useTransform(x, [0, windowW], [-150, windowW - 450])
  const spotlightTransformY = useTransform(y, [0, windowH], [-150, windowH - 450])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <>
      <main className="relative bg-dark-navy min-h-screen overflow-x-hidden selection:bg-gold/30 selection:text-white">
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-30 origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Back to Top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:border-gold/30 text-white/30 hover:text-gold flex items-center justify-center transition-all cursor-pointer"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 1], [0, 1, 1]) }}
          aria-label="Torna in cima"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
        </motion.button>

        {/* Magnetic Cursor */}
        <MagneticCursor />

        {/* Floating Island Navbar */}
        <Navbar />

        {/* Golden Particle Network Backdrop — disabled on mobile for performance */}
        {!isMobile && <ParticleNetwork />}

        {/* Delicate Blueprint Grid Overlay */}
        {/* Global geometric grid — finissimo, coerente su tutto il sito */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* 3D Scroll-Parallax Video Backdrop — disabled on mobile for performance */}
        {!isMobile && (
          <motion.div
            className="fixed inset-0 z-0 pointer-events-none w-[106vw] h-[106vh] -left-[3vw] -top-[3vh]"
            animate={{ opacity: videoBackgroundActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              x: transformX,
              y: combinedY,
              scale: combinedScale,
              opacity: combinedOpacity,
              filter: combinedBlur,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity, filter',
              transform: 'translateZ(0)'
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero_background.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* Dynamic stage spotlight — desktop only */}
        {!isMobile && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none rounded-full w-[600px] h-[600px] bg-gold/[0.04] blur-[150px] z-0"
            style={{
              x: spotlightTransformX,
              y: spotlightTransformY,
            }}
          />
        )}

        {/* Fullscreen Laser Sweep Transition when generating */}
        {isGenerating && (
          <div className="fixed left-0 right-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none z-50 animate-fullscreen-laser shadow-[0_0_20px_rgba(212,175,55,0.8)]" />
        )}
        
        {/* Scrollable Layout Content */}
        <div className="relative z-10">
          {/* Cinematic Hero Header */}
          <Hero />
          {/* AI Voice Guide & Manifesto */}
          <div id="ai-narration">
            <AiPresentation />
          </div>

          {/* Blueprint Generator Engine */}
          <BlueprintEngine />
          
          {/* Experts Slider */}
          <SocialProof />
          <ExpertsCarousel />

          {/* Packages / Offers */}
          <PackagesSection />

          {/* Intake Contact Form */}
          <ContactForm />

          {/* Floating details Drawer */}
          <Footer />
          <ExpertDrawer />
        </div>
      </main>
    </>
  )
}

export default App
