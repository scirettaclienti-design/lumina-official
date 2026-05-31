import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollY } = useScroll()

  // Track scroll for contracted state
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 60)
  })

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Track which section is currently in view
  useEffect(() => {
    const sectionIds = ['ai-narration', 'experts-section', 'blueprint-results', 'packages-section', 'contact-form-section']
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection('#' + entry.target.id)
      })
    }, { threshold: 0.3 })
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Smooth padding contraction based on scroll
  const navPadX = useTransform(scrollY, [0, 200], [24, 12])
  const navPadY = useTransform(scrollY, [0, 200], [16, 8])
  const navRadius = useTransform(scrollY, [0, 200], [24, 50])

  const navItems = [
    { label: 'Audio Manifesto', href: '#ai-narration' },
    { label: 'Esperti', href: '#experts-section' },
    { label: 'Experience System', href: '#blueprint-results' },
    { label: 'Pacchetti', href: '#packages-section' },
    { label: 'Contatti', href: '#contact-form-section' }
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleConfiguratorScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      const searchInput = document.querySelector('textarea, input[type="text"]') as HTMLElement
      if (searchInput) searchInput.focus()
    }, 600)
  }

  return (
    <>
      {/* Floating Island Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl"
      >
        <motion.div
          className={`flex items-center justify-between transition-all duration-500 backdrop-blur-2xl border ${
            scrolled
              ? 'bg-[#0a0f1e]/90 border-gold/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_1px_rgba(212,175,55,0.15)]'
              : 'bg-[#0a0f1e]/40 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
          }`}
          style={{
            paddingLeft: navPadX,
            paddingRight: navPadX,
            paddingTop: navPadY,
            paddingBottom: navPadY,
            borderRadius: navRadius,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/assets/logo.png" alt="Lumina XP" className="h-7 md:h-8 w-auto object-contain" />
            <span className="hidden sm:inline-block w-[1px] h-4 bg-white/10" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
              </span>
              <span className="text-[8px] font-mono tracking-widest text-gold/70 uppercase">Active</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`text-[11px] font-light hover:text-gold transition-colors tracking-wide uppercase magnetic-target ${activeSection === item.href ? 'text-gold' : 'text-white/40'}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <button
              onClick={handleConfiguratorScroll}
              className="px-4 py-2 border border-gold/30 hover:border-gold bg-gold/5 hover:bg-gold/15 text-gold rounded-full text-[10px] font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer magnetic-target hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              Crea Blueprint
            </button>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/60 hover:text-white flex items-center justify-center p-2.5 border border-white/5 bg-white/[0.02] rounded-lg cursor-pointer"
            aria-label="Menu di navigazione"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              )}
            </svg>
          </button>
        </motion.div>
      </motion.nav>

      {/* Full-Screen Immersive Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden backdrop-blur-3xl bg-[#050a1a]/95 flex flex-col"
          >
            {/* Close button — large touch target */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full border border-white/15 text-white/50 hover:text-gold flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Chiudi menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Nav links — centered, large, editorial */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className={`flex items-center gap-4 py-3 transition-colors ${
                    activeSection === item.href ? 'text-gold' : 'text-white/60'
                  }`}
                >
                  <span className="text-[10px] font-mono text-gold/40 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-3xl sm:text-4xl font-extralight tracking-wide font-heading">{item.label}</span>
                </motion.a>
              ))}
            </nav>

            {/* Bottom CTA — sticky */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="p-6 pb-10"
            >
              <button
                onClick={() => { setMobileMenuOpen(false); handleConfiguratorScroll() }}
                className="w-full py-5 bg-gold text-dark-navy font-bold text-sm rounded-2xl tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(212,175,55,0.25)] active:scale-95 transition-all cursor-pointer"
              >
                Crea Blueprint
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
