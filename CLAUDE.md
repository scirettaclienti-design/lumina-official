# Lumina XP — Project Context for Claude Code

## Project Overview

**Lumina XP** is a production B2B Adaptive Experience Platform at `/Users/mac2023ivanosciretta/lumina-xp/`.
It maps corporate team challenges to personalized 3-day experiential journeys powered by **Lumina AI**, a client-side semantic analysis engine.

- **Repo:** `scirettaclienti-design/lumina-official` on GitHub
- **Live URL:** https://www.lumina-xp.com
- **Owner:** Ivano Sciretta
- **Branch:** `main` (direct push)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19.2 + TypeScript 6 + Vite 8 |
| Styling | Tailwind CSS 4 (theme in `src/index.css` @theme block) |
| Animations | Framer Motion 12 (parallax, transitions, springs) |
| State | Zustand 5 with sessionStorage persistence |
| PDF | jsPDF (3-page executive report) |
| Audio | Web Audio API (ambient drone), HTML5 Audio (expert narrations) |
| Canvas | Particle Network (gold particles with connections) |
| Fonts | Cinzel (headings), Plus Jakarta Sans (body) |
| Colors | Dark Navy `#0E1424`, Gold `#D4AF37`, Gold Light `#e6c65c` |

## Architecture

```
src/
├── App.tsx              — Top-level: video BG, parallax, particles, cursor, layout
├── main.tsx             — Vite entry
├── index.css            — Design system: @theme, all custom animations, effects
├── components/
│   ├── Navbar.tsx        — Floating island navbar, mobile fullscreen menu
│   ├── Hero.tsx          — Challenge input: category → details → 3 questions → analyze
│   ├── BlueprintEngine.tsx — Results display: diagnostic, experts, timeline, CTAs
│   ├── ExpertDrawer.tsx  — Slide-out expert profile with audio + waveform + courses
│   ├── AiPresentation.tsx — 7-phrase manifesto with synced audio + progress dots
│   ├── ExpertsCarousel.tsx — Horizontal scroll, 3D hover, spotlight, waveform SVGs
│   ├── PackagesSection.tsx — Tabs: Retreat (3-day) + AI Training (3 tiers)
│   ├── ContactForm.tsx   — Lead form, auto-populated from blueprint results
│   ├── ParticleNetwork.tsx — Canvas particle system (45 particles, gold)
│   ├── MagneticCursor.tsx — Custom cursor dot + ring (desktop only)
│   ├── SocialProof.tsx   — 4 stats: 200+ automations, 9 experts, 2000+ trained, 28% boost
│   └── Footer.tsx        — Logo, nav, socials, contact info, copyright
├── store/
│   └── useLuminaStore.ts — Zustand store: state, EXPERTS_DATA, INTENT_MAP, analyzeChallenge
└── utils/
    ├── generatePdf.ts    — jsPDF 3-page report with sector colors
    ├── analytics.ts      — Event tracking (console in dev)
    └── audioSynth.ts     — Web Audio ambient drone (C2 + G2 triangle waves)
```

## The 4 Experience Clusters

| Cluster | Color | Focus | Experts |
|---------|-------|-------|---------|
| PLAY | Blue `#4a90e2` | Team sports, bonding, sync | Valentina Rodini, TMAX Sport |
| SENSE | Gold `#D4AF37` | Wellness, nutrition, posture, olfactory | Sonia Perrone, Mauro Lorenzi, Paola Meo, Ermanno Scattaretico |
| LEARN | Purple `#8e63ce` | AI, leadership, storytelling | Ivano Sciretta, Luigi Gallo, Roberto Casalino |
| IMMERSIVE | Coral `#ff7537` | Retreats, events, celebrations | Valentina Rodini, TMAX Sport |

## Lumina AI Engine (in useLuminaStore.ts)

- **Input:** category + free text + 3 guided answers (sector always first)
- **4 matching algorithms:** Token (1.0x), Intent stems (2.5x, 500+ stems), Phrase (3.0x, 19 phrases), Category boost (2.0x)
- **Output:** Match score 35-98%, top 3 experts, cluster intensities, 3-day itinerary, diagnostic narrative, ROI impacts, strategic pillars
- **Sector detection:** tech, luxury, finance, health, manufacturing → each with custom language, KPIs, accent colors

## 10 Experts (EXPERTS_DATA)

1. Sonia Perrone — SENSE — Body language, portamento
2. Mauro Lorenzi — SENSE — Sensory/olfactory design
3. Ivano Sciretta — LEARN — AI, n8n, automation
4. Luigi Gallo — LEARN — Leadership coaching
5. Paola Meo — SENSE — Nutrition, wellness
6. Ermanno Scattaretico — SENSE — Posturology, fitness
7. Valentina Rodini — PLAY/IMMERSIVE — Olympic gold, rowing, team building
8. Roberto Casalino — LEARN — Storytelling, communication
9. TMAX Sport — PLAY/IMMERSIVE — Sports events, team building

## Adding a New Expert

Add to `EXPERTS_DATA` array in `src/store/useLuminaStore.ts`. Required fields:
```ts
{ name, role, category: ClusterId, avatar: string, bio, valueAdd, courses: [{title, description}], audioUrl?, voiceProfile?: {gender, pitch} }
```
Then add keyword stems to `INTENT_MAP` mapping to the expert's name. The expert will automatically appear in carousel, matching, drawer, and PDF.

## SEO & AI Indexing (as of 2026-06-01)

- **Meta tags:** Full OG, Twitter Cards, description, keywords, canonical
- **JSON-LD:** Organization, 4x Service, FAQPage (5 Q&A), WebApplication
- **Favicon:** PNG 16/32 + apple-touch-icon 180 from logo
- **OG Image:** 1200x630 at `/public/assets/og-image.jpg`
- **llms.txt + llms-full.txt:** AI system discovery files
- **manifest.json:** PWA support
- **robots.txt:** Allows all major AI crawlers explicitly
- **sitemap.xml:** Homepage + llms files

## Mobile Optimizations

- Video background: lightweight version (scroll-fade only, no parallax/blur/scale)
- Particles: disabled on mobile
- Magnetic cursor: disabled on touch devices
- Backdrop blur: reduced on <768px
- Hero: `pt-24` to clear floating navbar
- Gold gradient: brighter yellow stops for Samsung AMOLED vivid mode

## Key Design Patterns

- All user-facing text says "Lumina AI" (NOT "Blueprint")
- Internal code still uses `blueprint` in variable names (safe to keep)
- Section IDs: `ai-narration`, `experts-section`, `blueprint-results`, `packages-section`, `contact-form-section`
- Custom CSS classes: `text-gold-metallic`, `gold-logo-glow`, `cta-glow`, `conic-border`, `section-glow-divider`
- PDF filename: `Lumina_AI_Report_[timestamp].pdf`

## Pending / Future Work

- **Video integration:** Sync video with manifesto audio and expert narrations (waiting for video files)
- **New experts:** Structure ready, just add to EXPERTS_DATA + INTENT_MAP
- **Analytics:** GA4 not yet installed (analytics.ts logs to console in dev)
- **Image optimization:** No lazy loading or WebP yet on below-fold images

## Important Notes

- Never hardcode API keys — use environment variables
- Push directly to `main` branch
- The site is fully client-side, no backend
- Contact form sends data to WhatsApp/email, no database
- Audio files are in `/public/assets/audio/`
- Expert photos are in `/public/assets/expert_*.png`
