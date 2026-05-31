# LUMINA XP — Stato Completo del Progetto

> Adaptive Experience Platform B2B — Estetica premium, cinematica, Dark Navy + Gold
> Ultimo aggiornamento: 22 maggio 2026

---

## 1. PANORAMICA GENERALE

**Lumina XP** è una piattaforma web che permette a un utente B2B di descrivere la sfida del proprio team e ricevere un "Blueprint" esperienziale generato da un motore AI. Il sistema mappa l'input su 4 cluster esperienziali (PLAY, SENSE, LEARN, IMMERSIVE) e attiva i moduli esperti più rilevanti.

**Stack tecnologico:**
- **Framework**: React 19.2.6 + TypeScript 6.0.2
- **Bundler**: Vite 8.0.12
- **Styling**: Tailwind CSS 4.3.0 (via plugin Vite `@tailwindcss/vite`)
- **State Management**: Zustand 5.0.13
- **Animazioni**: Framer Motion 12.38.0
- **Linting**: ESLint 10.3.0 con plugin react-hooks e react-refresh

---

## 2. STRUTTURA FILE COMPLETA

```
lumina-xp/
├── index.html                    # Entry point HTML
├── package.json                  # Dipendenze e script
├── vite.config.ts                # Config Vite con plugin React + Tailwind
├── tsconfig.json                 # Config TS root (references)
├── tsconfig.app.json             # Config TS app (target es2023, jsx react-jsx)
├── tsconfig.node.json            # Config TS per Node
├── eslint.config.js              # ESLint config
├── LUMINA-XP-STATO-PROGETTO.md   # Questo file
├── LUMINA-XP-PROMPT-SESSIONE.txt # Prompt per nuove sessioni
│
├── public/
│   ├── assets/
│   │   ├── logo.png              # Logo ufficiale Lumina XP (~1.4 MB)
│   │   └── mp_.mp4               # Video background Hero (~3 MB)
│   ├── favicon.svg               # Favicon
│   └── icons.svg                 # Icone SVG (residuo template Vite, non usato)
│
├── src/
│   ├── main.tsx                  # Entry point React (StrictMode + createRoot)
│   ├── App.tsx                   # Layout root: Hero + BlueprintEngine
│   ├── index.css                 # Tailwind + tema custom + scrollbar
│   │
│   ├── store/
│   │   └── useLuminaStore.ts     # Zustand store (Blueprint Engine)
│   │
│   ├── components/
│   │   ├── Hero.tsx              # Hero section con video + logo + input
│   │   └── BlueprintEngine.tsx   # Visualizzazione risultati cluster
│   │
│   └── assets/                   # Asset residui template Vite (non usati)
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
```

---

## 3. DETTAGLIO FILE PER FILE

### 3.1 `index.html`
- Entry point HTML standard Vite
- Titolo: "lumina-xp"
- Carica `src/main.tsx` come module
- Favicon: `/favicon.svg`

### 3.2 `vite.config.ts`
```ts
plugins: [react(), tailwindcss()]
```
- Plugin `@vitejs/plugin-react` per Fast Refresh
- Plugin `@tailwindcss/vite` per Tailwind CSS 4

### 3.3 `package.json` — Dipendenze installate
**Runtime:**
- `react` ^19.2.6
- `react-dom` ^19.2.6
- `zustand` ^5.0.13
- `framer-motion` ^12.38.0
- `tailwindcss` ^4.3.0
- `@tailwindcss/vite` ^4.3.0

**Dev:**
- `typescript` ~6.0.2
- `vite` ^8.0.12
- `@vitejs/plugin-react` ^6.0.1
- `eslint` ^10.3.0 + plugin react-hooks/react-refresh
- `@types/react` ^19.2.14, `@types/react-dom` ^19.2.3, `@types/node` ^24.12.3

**Script:**
- `npm run dev` → `vite` (dev server con HMR)
- `npm run build` → `tsc -b && vite build`
- `npm run lint` → `eslint .`
- `npm run preview` → `vite preview`

### 3.4 `src/index.css` — Tema e stili globali
**Tema Tailwind (@theme):**
- `--color-dark-navy`: `#0A0F1E` (sfondo principale)
- `--color-gold`: `#D4AF37` (accento primario)
- `--color-gold-light`: `#e6c65c`
- `--color-gold-dim`: `#b8962e`
- `--font-sans`: `'Inter', system-ui, -apple-system, sans-serif`

**Stili globali:**
- `body`: bg-dark-navy, text-white, antialiased
- `html`: scroll-behavior smooth
- Scrollbar custom: 4px, thumb gold-dim, track trasparente

**NON ci sono animazioni CSS** — tutte le animazioni sono gestite da Framer Motion nei componenti.

### 3.5 `src/main.tsx`
- StrictMode attivo
- `createRoot` su `#root`
- Importa `index.css` e `App.tsx`

### 3.6 `src/App.tsx`
```tsx
<main className="relative bg-dark-navy min-h-screen">
  <Hero />
  <BlueprintEngine />
</main>
```
- Layout minimale: Hero fullscreen + BlueprintEngine sotto (appare solo dopo generazione)
- File CSS `App.css` è stato ELIMINATO (era il template Vite)

---

## 4. ZUSTAND STORE — `src/store/useLuminaStore.ts`

### 4.1 Interfacce TypeScript

```ts
ExpertModule { name: string, role: string, active: boolean }

Cluster {
  id: 'PLAY' | 'SENSE' | 'LEARN' | 'IMMERSIVE'
  label: string
  active: boolean
  intensity: number      // 0-1, calcolato dal keyword matching
  experts: ExpertModule[]
}

LuminaState {
  challengeInput: string
  activeClusters: Cluster[]
  isGenerating: boolean
  hasResults: boolean
  setChallengeInput(input): void
  analyzeChallenge(input): void
  reset(): void
}
```

### 4.2 I 4 Cluster e i loro Esperti

| Cluster | Label | Esperto 1 | Ruolo 1 | Esperto 2 | Ruolo 2 |
|---------|-------|-----------|---------|-----------|---------|
| PLAY | Play Experience | Luigi Gallo | Play Strategy Director | Sonia Perrone | Gamification Architect |
| SENSE | Sensory Experience | Mauro Lorenzi | Sensory Design Lead | Paola Meo | Emotional Intelligence Expert |
| LEARN | Learning Experience | Ivano Sciretta | Learning Architect | Sonia Perrone | Adaptive Curriculum Designer |
| IMMERSIVE | Immersive Experience | Mauro Lorenzi | Immersive Tech Director | Luigi Gallo | XR Experience Designer |

### 4.3 Keywords per Cluster (usate da `scoreCluster`)

- **PLAY**: gioco, game, play, engagement, motivazione, gamification, sfida, competizione, team building, dinamiche, divertimento, reward, punti, classifica
- **SENSE**: sensi, emozione, sense, sensory, esperienza, feeling, empatia, percezione, atmosfera, ambiente, suono, luce, tatto, vista, multisensoriale
- **LEARN**: formazione, learn, apprendimento, competenze, skill, training, crescita, sviluppo, onboarding, knowledge, corso, educazione, mentoring, coaching
- **IMMERSIVE**: immersivo, immersive, realtà virtuale, VR, AR, metaverso, simulazione, 3D, digitale, tecnologia, ologramma, mixed reality, spatial, interattivo

### 4.4 Logica `analyzeChallenge(input)`

1. Setta `isGenerating: true`, `hasResults: false`, salva `challengeInput`
2. Dopo **2800ms** (simulazione AI):
   - Per ogni cluster, chiama `scoreCluster(input, clusterId)`
   - `scoreCluster`: conta quante keyword del cluster appaiono nell'input (case-insensitive), divide per 3, tetto a 1.0
   - Un cluster è `active` se ha score > 0 OPPURE se l'input è lungo > 20 caratteri
   - L'`intensity` minima per un cluster attivo è 0.3
   - Tutti gli esperti di un cluster attivo vengono attivati
3. Setta `isGenerating: false`, `hasResults: true`

### 4.5 Funzione `reset()`
Riporta tutto allo stato iniziale: input vuoto, cluster disattivati, isGenerating false, hasResults false.

---

## 5. COMPONENTE HERO — `src/components/Hero.tsx`

### 5.1 Struttura visiva
- **Sezione fullscreen** (`min-h-screen`, flex center)
- **Video background**: `<video>` da `/assets/mp_.mp4`, autoPlay, loop, muted, playsInline, object-cover
- **Overlay scuro**: `bg-black/60` (opacity 0.6), si intensifica a 0.75 al submit
- **Logo**: `/assets/logo.png`, centrato, h-20 (md:h-28), mb-16
- **Input**: rounded-full, bg-dark-navy/40, backdrop-blur-sm, border-gold/25, px-8 py-5, max-w-2xl
  - Placeholder: "Descrivi la sfida o l'obiettivo attuale del tuo team..."
  - Focus: border-gold/50, shadow gold leggera
- **Bottone "Genera"**: posizionato inside l'input (absolute right-2), rounded-full, bg-gold/10, border-gold/30, text-gold, uppercase, tracking 0.15em
  - Si nasconde (opacity-0) quando l'input è vuoto

### 5.2 Animazioni Framer Motion
- **Logo**: fade-in + slide-up (y: 20→0), duration 1s, delay 0.2s, easing [0.22, 1, 0.36, 1]
- **Form**: fade-in + slide-up, duration 1s, delay 0.5s
- **Video al submit**: scala da 1.0 a 1.08 (duration 2.5s, easing cinematico)
- **Overlay al submit**: opacity da 0.6 a 0.75
- **Exit (quando hasResults=true)**: opacity→0, y→-30, duration 0.6s
- **Stato "Generating"**: 3 cerchi concentrici pulsanti (border-gold/20) + pallino centrale gold, con testo "Blueprint Engine" / "Analisi dei cluster esperienziali"

### 5.3 Stati del componente
- **Stato iniziale**: Logo + input visibili
- **isGenerating=true**: Logo e input scompaiono (AnimatePresence exit), appare animazione pulsante
- **hasResults=true**: Hero renderizza null nel content area, i risultati sono nel BlueprintEngine sotto

### 5.4 Logica
- State locale `input` (useState) per il campo di testo
- `useRef` per il video element (predisposto per controlli futuri)
- `handleSubmit`: previene default, controlla input non vuoto e non già in generazione, chiama `analyzeChallenge`
- Variabile `submitted = isGenerating || hasResults` per controllare le transizioni video/overlay

---

## 6. COMPONENTE BLUEPRINT ENGINE — `src/components/BlueprintEngine.tsx`

### 6.1 Struttura visiva
- Appare SOLO quando `hasResults === true`
- **Titolo**: "Blueprint generato" (gold/40, 10px, tracking 0.4em) + "Experience System" (3xl/4xl, font-extralight)
- **Griglia 2x2** (md:grid-cols-2) di card cluster, max-w-4xl
- **Card cluster**: bg-white/[0.03], backdrop-blur-sm, border-gold/20, rounded-2xl, p-6
  - Header: label (text-sm, white/80) + badge ID (10px, font-mono, gold/40, bg-gold/5, rounded-full)
  - Barra intensità: h-px, bg-white/5, fill bg-gold/50 animata
  - Lista esperti: pallino gold + nome (white/60, xs) + ruolo (white/20, 10px, ml-auto)
- Cluster non attivi: opacity 0.15

### 6.2 Animazioni Framer Motion
- **Titolo**: fade-in + slide-up (y: 20→0), duration 0.8s
- **Card**: fade-in + slide-up + scale (0.95→1), staggered delay `i * 0.12s`
- **Barra intensità**: width animata da 0 a `intensity * 100%`, duration 1.2s, delay staggered
- **Esperti**: fade-in + slide-left (x: -10→0), duration 0.5s, delay staggered

### 6.3 Palette colori cluster
Tutti i cluster usano lo stesso bordo `border-gold/20` — palette unificata, nessun colore extra.

---

## 7. COSA FUNZIONA (STATO ATTUALE)

1. **Video di sfondo**: si riproduce in loop, muted, fullscreen con object-cover
2. **Logo**: appare con animazione fade-in al caricamento
3. **Input di ricerca**: accetta testo, mostra/nasconde bottone "Genera"
4. **Submit**: innesca l'animazione di generazione (pulsante gold per 2.8s)
5. **Analisi keyword**: il testo viene analizzato e mappato ai 4 cluster
6. **Transizione video**: al submit il video scala leggermente (zoom cinematico)
7. **Risultati**: griglia 2x2 con cluster attivi, barre intensità animate, esperti con ruoli
8. **TypeScript**: zero errori (verificato con `npx tsc --noEmit`)
9. **Dev server**: funzionante con HMR su Vite

---

## 8. COSA NON È STATO ANCORA FATTO

- Nessun backend/API reale — l'analisi è locale con keyword matching
- Nessun routing (single page)
- Nessuna persistenza dati
- Nessun test (unit/e2e)
- Nessuna ottimizzazione immagini/video
- Nessuna sezione oltre Hero + BlueprintEngine
- I file in `src/assets/` (hero.png, react.svg, vite.svg) sono residui del template Vite e NON sono usati
- Il file `public/icons.svg` è un residuo del template Vite e NON è usato
- Non c'è git inizializzato nel progetto

---

## 9. DECISIONI ARCHITETTURALI

| Decisione | Motivazione |
|-----------|-------------|
| Tailwind CSS 4 via plugin Vite | Zero config file separato, integrazione nativa |
| Zustand (non Redux/Context) | API minimale, zero boilerplate, perfetto per store singolo |
| Framer Motion (non CSS animations) | Controllo fine su AnimatePresence, stagger, easing cinematici |
| Video in `public/assets/` | Servito staticamente da Vite, nessun processing webpack |
| Logo in `public/assets/` | Stesso motivo — percorso diretto `/assets/logo.png` |
| `hasResults` separato da `!isGenerating` | Permette 3 stati: idle → generating → results |
| Intensity minima 0.3 | Evita che cluster attivi sembrino spenti |
| Fallback input.length > 20 | Input generici attivano tutti i cluster con intensità base |

---

## 10. PALETTE COLORI DEFINITIVA

| Token | Hex | Uso |
|-------|-----|-----|
| `dark-navy` | `#0A0F1E` | Background principale, input bg |
| `gold` | `#D4AF37` | Accento primario, bordi, testi accent |
| `gold-light` | `#e6c65c` | Variante chiara (disponibile, non ancora usata) |
| `gold-dim` | `#b8962e` | Scrollbar thumb |
| `black/60` | — | Overlay video |
| `white/[0.03-0.90]` | — | Testi e sfondi a varie opacità |

---

## 11. COMANDI UTILI

```bash
npm run dev      # Avvia dev server (Vite HMR)
npm run build    # Build produzione (tsc + vite build)
npm run lint     # Linting ESLint
npm run preview  # Preview build di produzione
npx tsc --noEmit # Type-check senza emissione
```
