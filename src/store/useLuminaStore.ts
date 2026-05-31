import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ExpertCourse {
  title: string
  description: string
  duration?: string
}

export interface DetailedExpert {
  name: string
  role: string
  category: 'PLAY' | 'SENSE' | 'LEARN' | 'IMMERSIVE' | 'ALL'
  avatar: string // fallback initials/icon color theme
  bio: string
  valueAdd: string
  courses: ExpertCourse[]
  contact?: {
    email?: string
    phone?: string
    web?: string
  }
  audioPitch?: string // text transcript for the pitch
  audioSrc?: string   // path to pre-recorded .mp3 file (overrides speechSynthesis)
  gender?: 'male' | 'female'
  voiceProfile?: {
    elevenlabsId?: string  // ElevenLabs voice clone ID for production
    pitch: number          // 0.8–1.2 (deep → bright)
    speed: number          // 0.7–1.1 (slow → fast)
    warmth: 'warm' | 'neutral' | 'authoritative'
  }
}

// Path to the main manifesto audio file (AiPresentation)
export const MAIN_AUDIO_SRC = '/assets/audio/lumina_manifesto.mp3'

export interface ExpertModule {
  name: string
  role: string
  active: boolean
}

export interface Cluster {
  id: 'PLAY' | 'SENSE' | 'LEARN' | 'IMMERSIVE'
  label: string
  active: boolean
  intensity: number
  experts: ExpertModule[]
}

export interface CustomActivity {
  time: string
  title: string
  expert: string
  description: string
}

export interface CustomDay {
  dayNumber: number
  theme: string
  focus: string
  activities: CustomActivity[]
}

export interface DiagnosticInsight {
  headline: string
  narrative: string
  clusterBreakdown: Array<{ id: string; label: string; percent: number }>
}

// Sector detection for Dynamic Glow System
export type DetectedSector = 'tech' | 'luxury' | 'finance' | 'health' | 'manufacturing' | 'default'

export const SECTOR_GLOW: Record<DetectedSector, { primary: string; shadow: string; label: string }> = {
  tech:          { primary: 'rgba(59, 130, 246, 0.6)',  shadow: 'rgba(59, 130, 246, 0.15)',  label: 'Tech & Digital' },
  luxury:        { primary: 'rgba(212, 175, 55, 0.6)',  shadow: 'rgba(212, 175, 55, 0.15)',  label: 'Luxury & Premium' },
  finance:       { primary: 'rgba(148, 163, 184, 0.6)', shadow: 'rgba(148, 163, 184, 0.15)', label: 'Finance & Banking' },
  health:        { primary: 'rgba(52, 211, 153, 0.6)',  shadow: 'rgba(52, 211, 153, 0.15)',  label: 'Healthcare & Pharma' },
  manufacturing: { primary: 'rgba(251, 146, 60, 0.6)',  shadow: 'rgba(251, 146, 60, 0.15)',  label: 'Industry & Manufacturing' },
  default:       { primary: 'rgba(212, 175, 55, 0.6)',  shadow: 'rgba(212, 175, 55, 0.15)',  label: 'Enterprise' },
}

// Three Strategic Pillars
export interface StrategicPillar {
  id: 'diagnosis' | 'impact' | 'tailoring'
  title: string
  subtitle: string
  body: string
}

export interface GeneratedBlueprint {
  title: string
  summary: string
  primaryFocus: string
  days: CustomDay[]
  matchScore: number
  roiImpact: string[]
  diagnosticInsight: DiagnosticInsight
  strategicPillars: StrategicPillar[]
  detectedSector: DetectedSector
}

export interface SelectedCourse {
  expertName: string
  courseTitle: string
  duration?: string
}

interface LuminaState {
  challengeInput: string
  activeClusters: Cluster[]
  detectedSector: DetectedSector
  isGenerating: boolean
  hasResults: boolean
  selectedExpert: DetailedExpert | null
  playingAudio: string | null
  audioProgress: number
  currentTranscriptLine: number
  generatedBlueprint: GeneratedBlueprint | null
  selectedPackage: 'ignite' | 'adaptive' | 'sovereign' | null
  preMatchedExperts: string[]
  videoBackgroundActive: boolean
  selectedCourses: SelectedCourse[]  // cart of selected courses
  setChallengeInput: (input: string) => void
  toggleCourse: (course: SelectedCourse) => void
  analyzeChallenge: (input: string) => void
  setSelectedExpert: (expert: DetailedExpert | null) => void
  setPlayingAudio: (track: string | null) => void
  setAudioProgress: (progress: number) => void
  setCurrentTranscriptLine: (line: number) => void
  setSelectedPackage: (pkg: 'ignite' | 'adaptive' | 'sovereign' | null) => void
  setPreMatchedExperts: (experts: string[]) => void
  toggleVideoBackground: () => void
  reset: () => void
}

export const EXPERTS_DATA: DetailedExpert[] = [
  {
    name: 'Sonia Perrone',
    role: 'Regista, Coreografa e Founder di Cammineria\u00AE',
    category: 'SENSE',
    avatar: '/assets/expert_sonia.png',
    bio: 'Regista e coreografa di sfilate internazionali di haute couture, art director e ideatrice del metodo brevettato Cammineria\u00AE. Ha diretto e coordinato eventi di altissimo profilo per maison come Balmain, Valentino e Dolce & Gabbana. Il suo approccio fonde biomeccanica, proxemics e psicologia della percezione in un sistema proprietario di comunicazione non verbale adottato da executive, diplomatici e figure pubbliche.',
    valueAdd: 'Risolve il deficit di presenza e autorevolezza che affligge manager promossi per competenza tecnica ma privi di consapevolezza corporea. Attraverso il metodo Cammineria\u00AE, i partecipanti acquisiscono il controllo intenzionale della propria postura, della gestualit\u00E0 e dell\'occupazione dello spazio interpersonale \u2014 tre variabili che, secondo gli studi di Mehrabian, determinano il 55% dell\'impatto comunicativo. Il risultato \u00E8 un innalzamento misurabile della percezione di leadership nelle interazioni ad alta esposizione: board meeting, negoziazioni, keynote e gestione dei conflitti.',
    courses: [
      { title: 'Aesthetic Walk', description: 'Analisi biomeccanica individuale della camminata basata sul metodo Cammineria\u00AE. Ogni partecipante riceve un assessment posturale e un protocollo di autocorrezione per proiettare sicurezza e autorevolezza in contesti ad alta visibilit\u00E0 (board meeting, pitch, eventi). Output: scheda personale di allineamento corporeo.' },
      { title: 'Walk for Productivity', description: 'Sessione di camminata sincronizzata di gruppo secondo i principi della proxemics (studio dello spazio interpersonale). Migliora la coesione non verbale del team, riducendo le micro-tensioni fisiche da open space. ROI atteso: +25% percezione di allineamento interno nelle survey post-retreat.' },
      { title: 'Catwalk Training', description: 'Masterclass avanzata di portamento scenico e comunicazione non verbale per figure apicali. Metodologia derivata dalla direzione coreografica di sfilate internazionali (Balmain, Haute Couture). Output: framework di body language per presentazioni C-Level e keynote aziendali.' }
    ],
    contact: { email: 'sonia.perrone@cammineria.it', phone: '+39 333 2209318' },
    audioSrc: '/assets/audio/sonia_perrone.mp3',
    gender: 'female',
    voiceProfile: { pitch: 1.05, speed: 0.85, warmth: 'warm' },
    audioPitch: 'Benvenuti in Lumina. Sono Sonia Perrone. Con Cammineria non vi insegno semplicemente a camminare, ma a prendere possesso del vostro spazio fisico e psicologico. In azienda, il linguaggio del corpo rappresenta l\'ottanta percento dell\'impatto comunicativo. Imparare a incedere con classe, allineare la propria presenza e decodificare i gesti del vostro interlocutore trasforma radicalmente la vostra leadership e l\'autostima del vostro team.'
  },
  {
    name: 'Mauro Lorenzi',
    role: 'Maestro Profumiere & Sensory Designer',
    category: 'SENSE',
    avatar: '/assets/expert_mauro.png',
    bio: 'Maestro profumiere di fama internazionale, fondatore dell\'atelier Mauro Lorenzi Profumi nel cuore di Roma. Riconosciuto come uno dei massimi esperti italiani di profumeria artistica, ha sviluppato fragranze su commissione per maison private, hotel di lusso e progetti culturali. Il suo lavoro integra la chimica delle essenze con le neuroscienze della memoria olfattiva, creando esperienze sensoriali che operano a livello sublimale sul sistema limbico \u2014 la sede biologica delle emozioni e dei ricordi.',
    valueAdd: 'Interviene sulla dimensione pi\u00F9 trascurata e potente del benessere organizzativo: la stimolazione sensoriale. In un contesto aziendale dominato da stimoli visivi e cognitivi, l\'olfatto \u00E8 il canale che aggira le difese razionali e accede direttamente alla memoria emotiva. Attraverso laboratori esperienziali, Mauro crea ancoraggi olfattivi condivisi che consolidano il legame emotivo tra i membri del team. La firma olfattiva del retreat diventa un artefatto fisico permanente: ogni volta che un partecipante utilizzer\u00E0 il profumo creato insieme, riattiver\u00E0 le emozioni e gli insight di quel percorso. Questa tecnica prolunga l\'effetto formativo del retreat per mesi, ben oltre la finestra dei 72 ore tipica degli eventi tradizionali.',
    courses: [
      { title: 'Laboratorio Olfattivo Teorico', description: 'Modulo fondato sulla neurobiologia del sistema limbico: come l\'olfatto aggira la corteccia razionale e accede direttamente alla memoria emotiva. I partecipanti esplorano le piramidi olfattive (note di testa, cuore, fondo) e comprendono come la stimolazione sensoriale crei ancoraggi emotivi duraturi. Output: mappa olfattiva individuale delle associazioni emotive del team.', duration: '1 ora' },
      { title: 'Creazione Scent Custom', description: 'Laboratorio pratico in cui ogni partecipante formula un profumo personalizzato da 30ml con oli essenziali primari. L\'atto creativo condiviso attiva la cooperazione non competitiva e produce un artefatto fisico che diventa ancora olfattiva del percorso. ROI: il profumo richiama le emozioni del retreat ad ogni utilizzo, prolungando l\'effetto formativo per mesi.', duration: '1.5 ore' }
    ],
    contact: { email: 'info@maurolorenziprofumi.com', phone: '+39 06 56547194', web: 'www.maurolorenziprofumi.com' },
    audioSrc: '/assets/audio/mauro_lorenzi.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.9, speed: 0.8, warmth: 'warm' },
    audioPitch: 'Sono Mauro Lorenzi. L\'olfatto \u00E8 il nostro senso pi\u00F9 ancestrale, collegato direttamente al sistema limbico, dove risiedono emozioni e memoria. Nei miei laboratori, porto i team aziendali a staccare dalla razionalit\u00E0 e ad esplorare la propria sensibilit\u00E0 olfattiva. Creando un profumo personalizzato, i collaboratori non solo imparano ad ascoltare le proprie emozioni, ma creano un\'ancora olfattiva comune che rimarr\u00E0 associata per sempre a questo percorso condiviso.'
  },
  {
    name: 'Ivano Sciretta',
    role: 'Founder Lumina \u2014 AI Adaptive Training',
    category: 'LEARN',
    avatar: '/assets/expert_ivano.png',
    bio: 'Tecnologo specializzato in AI applicata, workflow engineering e automazione dei processi aziendali. Founder di Lumina AI Adaptive Training, ha progettato e deployato oltre 200 automazioni operative per PMI e mid-market italiane, generando un risparmio documentato medio del 70% sui tempi di data-entry e preventivazione. Esperto certificato di piattaforme n8n, agenti AI conversazionali e architetture RAG (Retrieval-Augmented Generation) per knowledge base aziendali.',
    valueAdd: 'Risolve il problema pi\u00F9 costoso e silenzioso delle imprese italiane: la resistenza strutturale all\'adozione dell\'intelligenza artificiale. Mentre i corsi generici lasciano i team con slide e buone intenzioni, il metodo Adaptive Training parte da un audit chirurgico dei colli di bottiglia operativi reali (flussi documentali, preventivazione, CRM, HR) e si conclude con workflow attivi in produzione. L\'azienda non esce con appunti, ma con automazioni funzionanti, una prompt library proprietaria calibrata sui propri dati e un AI-Champion interno formato per mantenere e far evolvere il sistema in completa autonomia. Il ROI \u00E8 misurabile dal giorno zero.',
    courses: [
      { title: 'AI Adaptive Training', description: 'Audit operativo dei processi aziendali (documentali, commerciali, HR) con identificazione dei 3-5 colli di bottiglia a pi\u00F9 alto impatto. Sessioni pratiche hands-on in cui il team costruisce prompt chain e workflow AI direttamente sui propri dati reali. Output: report di audit + 3 automazioni attive al termine del modulo. ROI medio documentato: -70% tempi di data-entry.' },
      { title: 'Workflow & n8n Integration', description: 'Progettazione architetturale e deployment operativo da 3 a 12 automazioni su piattaforma n8n, integrate con lo stack esistente (CRM, ERP, Google Workspace, Slack). Ogni workflow viene testato in produzione durante il modulo. Output: repository di automazioni documentate con runbook di manutenzione per il team IT interno.' },
      { title: 'Internal AI-Champion Program', description: 'Percorso di certificazione intensiva per 1-2 risorse interne selezionate, formate per diventare autonome nella creazione, manutenzione ed evoluzione degli agenti AI e dei workflow aziendali. Metodologia: mentoring 1:1 + progetto finale su caso reale. Output: AI-Champion operativo indipendente, prompt library proprietaria e knowledge base addestrata sui processi aziendali.' }
    ],
    contact: { email: 'sciretta.clienti@gmail.com', web: 'ivanosciretta.tech' },
    audioSrc: '/assets/audio/ivano_sciretta.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.95, speed: 0.9, warmth: 'authoritative' },
    audioPitch: 'Ciao, sono Ivano Sciretta. In Lumina crediamo che i corsi di intelligenza artificiale generici non servano a nulla. Ogni azienda parla una lingua diversa e l\'AI deve modellarvisi. Il nostro metodo parte da un audit dei vostri colli di bottiglia operativi, e si conclude installando workflow concreti. Uscirete da questo percorso non con delle slide o degli appunti, ma con automazioni attive che lavorano al posto vostro, facendovi risparmiare fino al settanta percento del tempo.'
  },
  {
    name: 'Luigi Gallo',
    role: 'Business Coach, Trainer & Consulente Aziendale',
    category: 'LEARN',
    avatar: '/assets/expert_luigi.png',
    bio: 'Business coach certificato ICF, consulente direzionale e trainer con oltre 15 anni di esperienza nel Lean Management, nell\'ottimizzazione dei processi organizzativi e nell\'intelligenza emotiva applicata al C-Level. Autore del libro "RIPARTI DA TE", formatosi direttamente con il Prof. Giorgio Nardone (Centro Terapia Strategica di Arezzo) nel Problem Solving Strategico. Ha collaborato con direzioni HR di aziende industriali, finanziarie e tecnologiche, accompagnando oltre 2.000 manager in percorsi di sviluppo della leadership consapevole.',
    valueAdd: 'Interviene sulle tre patologie organizzative pi\u00F9 frequenti nelle imprese in crescita: leadership reattiva anzich\u00E9 strategica, gestione disfunzionale del tempo e incapacit\u00E0 di risolvere problemi complessi senza escalation. Attraverso modelli validati clinicamente (Nardone, Goleman, Bar-On), Luigi trasforma manager operativi in leader consapevoli, capaci di gestire le dinamiche relazionali del team con intelligenza emotiva, di recuperare 5-8 ore settimanali di produttivit\u00E0 personale e di risolvere criticit\u00E0 organizzative con framework strutturati e replicabili. I suoi programmi producono risultati misurabili nelle survey di engagement a 30, 60 e 90 giorni.',
    courses: [
      { title: 'YOU LEAD (Leadership)', description: 'Programma strutturato in 6 moduli basato sul modello delle competenze emotive di Goleman e sull\'approccio strategico di Giorgio Nardone. Ogni sessione include esercizi di auto-diagnosi, role-play situazionali e action plan individuale. Output: profilo di leadership personale, piano di sviluppo a 90 giorni e framework di gestione team "Leadership Canvas".', duration: '12 ore (6 webinar)' },
      { title: 'Time Management', description: 'Workshop intensivo basato sulla matrice di Eisenhower avanzata e sulla tecnica del time-blocking strategico. I partecipanti mappano la propria settimana tipo, identificano i "ladri di tempo" strutturali e costruiscono un protocollo operativo personalizzato. Output: template settimanale di produttivit\u00E0 calibrato sul ruolo. ROI atteso: recupero di 5-8 ore/settimana per manager.', duration: '3 ore (1 webinar)' },
      { title: 'Problem Solving Strategico', description: 'Applicazione rigorosa del modello originale del Prof. Giorgio Nardone (Brief Strategic Therapy) a sfide organizzative reali. I partecipanti apprendono le 7 fasi del Problem Solving Strategico e le applicano a un caso aziendale concreto durante la giornata. Output: framework di risoluzione strutturata replicabile autonomamente dal management.', duration: '8 ore (1 giornata)' },
      { title: 'Intelligenza Emotiva & Public Speaking', description: 'Doppio modulo che integra il modello di intelligenza emotiva di Bar-On con tecniche avanzate di oratoria (struttura TED, gestione del silenzio, storytelling persuasivo). Sessioni video-registrate con feedback individuale. Output: video-assessment personale commentato e toolkit di public speaking per board presentation e all-hands.', duration: '8 ore per modulo' }
    ],
    contact: { email: 'luigigallomentalcoach@gmail.com', phone: '+39 389 5342008', web: 'www.luigigallo.org' },
    audioSrc: '/assets/audio/luigi_gallo.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.88, speed: 0.82, warmth: 'authoritative' },
    audioPitch: 'Sono Luigi Gallo. Molte persone in azienda lavorano con il pilota automatico, vivendo il proprio ruolo come un dovere e non come un\'opportunit\u00E0. Con il programma You Lead, aiuto manager e dirigenti a ritrovare lo scopo strategico, affinando soft skills come l\'intelligenza emotiva e la gestione delle dinamiche di gruppo. La leadership e il tempo non sono elementi casuali, ma abilit\u00E0 rigorose che si possono e si devono allenare.'
  },
  {
    name: 'Paola Meo',
    role: 'Biologa Nutrizionista, Specialista in Patologia Clinica',
    category: 'SENSE',
    avatar: '/assets/expert_paola.png',
    bio: 'Biologa nutrizionista iscritta all\'ONB, specialista in Patologia Clinica con oltre quindici anni di pratica nella nutrizione clinica evidence-based e nei programmi di corporate wellness. Ha progettato percorsi nutrizionali per i dipendenti di Leonardo S.p.A., ELT Elettronica, Birra Peroni e altre realt\u00E0 industriali di primo piano. Ospite esperta ricorrente su Rai 1 ("Uno Mattina") e La7, dove divulga i principi della cronobiologia alimentare e della nutrigenomica applicata alla performance lavorativa.',
    valueAdd: 'Risolve il circolo vizioso pi\u00F9 diffuso e sottovalutato nelle organizzazioni ad alto stress: fame emotiva \u2192 alimentazione disfunzionale \u2192 crollo energetico post-prandiale \u2192 calo di produttivit\u00E0 \u2192 ulteriore stress. Attraverso protocolli fondati sulla cronobiologia e sulla biochimica dei macronutrienti, Paola insegna ai team come trasformare l\'alimentazione da fonte di disagio a leva strategica di performance. I suoi programmi documentano una riduzione media del 30% del calo cognitivo pomeridiano e un miglioramento significativo dei livelli di energia autoriportati nelle survey aziendali a 60 giorni. Il tutto senza diete restrittive, ma con strategie di meal-timing e composizione del pasto calibrate sulla tipologia lavorativa.',
    courses: [
      { title: 'Nutritraining Aziendale', description: 'Percorso integrato fondato sulla nutrizione clinica evidence-based: cronobiologia alimentare, indice glicemico e impatto dei macronutrienti sulla performance cognitiva. Include assessment alimentare di gruppo e piano nutrizionale personalizzato per tipologia lavorativa (sedentaria vs. commerciale). Output: protocollo alimentare aziendale "Brain Fuel" + checklist pranzo ad alta performance per la mensa/catering.', duration: '2 incontri da 120 minuti' },
      { title: 'Alimentazione & Performance', description: 'Modulo specialistico su come mantenere il focus cognitivo e livelli energetici stabili lungo l\'intera giornata lavorativa. Basato su studi peer-reviewed di nutrigenomica e cronobiologia. I partecipanti apprendono strategie di meal-timing, idratazione funzionale e gestione della fame emotiva. Output: "Performance Nutrition Card" individuale con raccomandazioni personalizzate. ROI atteso: riduzione del 30% del calo di produttivit\u00E0 post-prandiale.' }
    ],
    contact: { email: 'paola.meo73@gmail.com', phone: '+39 389 2711935' },
    audioSrc: '/assets/audio/paola_meo.mp3',
    gender: 'female',
    voiceProfile: { pitch: 1.0, speed: 0.85, warmth: 'warm' },
    audioPitch: 'Sono Paola Meo. Troppo spesso i lavoratori pranzano di fretta, mangiando cibi industriali o usando il cibo come sfogo per lo stress e la frustrazione. Questo causa stanchezza mentale e calo di produttivit\u00E0. Nel percorso di Nutritraining, aiuto i team a comprendere come semplici scelte alimentari consapevoli possano rigenerare le energie e creare uno stile di vita protettivo e performante.'
  },
  {
    name: 'Ermanno Scattaretico',
    role: 'ISEF Insegnante, Posturologo & Personal Trainer',
    category: 'SENSE',
    avatar: '/assets/expert_ermanno.png',
    bio: 'Docente ISEF, posturologo clinico certificato e personal trainer d\'élite con oltre trent\'anni di esperienza nella preparazione atletica di atleti di livello mondiale e nella salute motoria aziendale. Ha lavorato con campioni olimpici e nazionali in discipline di resistenza, sviluppando protocolli di riattivazione posturale oggi adottati in programmi di corporate wellness da aziende con oltre 500 dipendenti. Specializzato nel metodo Mézières e nelle tecniche di rieducazione funzionale della catena muscolare posteriore.',
    valueAdd: 'Interviene sulla causa primaria di assenteismo e presenteismo nelle organizzazioni knowledge-intensive: la sedentarietà prolungata e i suoi effetti cascata — cervicalgia, lombalgia, rigidità articolare, affaticamento cronico e calo dell\'attenzione. Attraverso assessment posturali individuali e protocolli di micro-movimento eseguibili alla scrivania, Ermanno installa nelle routine aziendali una cultura del movimento attivo che produce risultati misurabili: riduzione fino al 40% delle segnalazioni di dolore muscolo-scheletrico entro 90 giorni, diminuzione delle giornate di malattia e un incremento documentato del vigore fisico percepito nelle survey di clima aziendale.',
    courses: [
      { title: 'Posturologia & Benessere in Ufficio', description: 'Assessment posturale individuale con analisi delle catene muscolari secondo il metodo Mézières. Ogni partecipante riceve una valutazione dei propri vizi posturali da seduta e un protocollo di 8 esercizi correttivi eseguibili alla scrivania in 5 minuti. Output: "Posture Reset Card" personalizzata + video-guida degli esercizi. ROI atteso: riduzione del 40% delle segnalazioni di mal di schiena e cervicalgia entro 90 giorni.' },
      { title: 'Nutritraining Aziendale', description: 'Modulo motorio in sinergia con la Dott.ssa Paola Meo: integra l\'attivazione metabolica (circuiti di mobilità articolare, stretching dinamico, respirazione diaframmatica) con le strategie nutrizionali del modulo parallelo. L\'obiettivo è rompere il ciclo sedentarietà-fame emotiva-spossatezza. Output: routine "Active Break" di 10 minuti da implementare come policy aziendale nelle pause.', duration: '2 incontri da 120 minuti' }
    ],
    contact: { phone: '+39 334 9450577' },
    audioSrc: '/assets/audio/ermanno_scattaretico.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.85, speed: 0.88, warmth: 'authoritative' },
    audioPitch: 'Sono Ermanno Scattaretico. Il corpo umano è fatto per muoversi, non per stare seduto otto ore al giorno davanti a un monitor. La postura scorretta crea tensioni muscolari, mal di schiena e spossatezza. Con le mie sessioni di posturologia, insegno al vostro team piccoli movimenti correttivi ed esercizi di mobilità semplici ma incredibilmente efficaci, restituendo vitalità ed efficienza.'
  },
  {
    name: 'Valentina Rodini',
    role: 'Campionessa Olimpica di Canoa (Tokyo 2020)',
    category: 'IMMERSIVE',
    avatar: '/assets/expert_valentina.png',
    bio: 'Medaglia d\'oro olimpica ai Giochi di Tokyo 2020 nel doppio pesi leggeri femminile di canottaggio — una delle imprese più celebrate dello sport italiano contemporaneo. Atleta d\'élite della Nazionale Italiana con un decennio di competizioni internazionali ai massimi livelli (Campionati Mondiali, Europei, Coppa del Mondo). Oggi trasferisce il framework mentale e operativo dell\'alta performance sportiva nel contesto aziendale, specializzandosi in team building esperienziale sull\'acqua e keynote sulla psicologia della performance sotto pressione estrema.',
    valueAdd: 'Risolve il deficit di fiducia reciproca e sincronia operativa che paralizza i team aziendali sotto pressione. L\'esperienza in canoa o dragone non è un\'attività ludica: è un acceleratore neurocognitivo che costringe i partecipanti a fidarsi ciecamente del compagno, a comunicare senza parole e a sincronizzare il proprio ritmo con quello del gruppo — esattamente le competenze che separano i team funzionali da quelli disfunzionali. Il debrief strutturato post-esperienza traccia paralleli diretti con le dinamiche organizzative reali, producendo insight azionabili dal lunedì mattina. I team che hanno partecipato ai suoi programmi riportano un incremento medio del 35% nella percezione di fiducia interpersonale nelle survey a 30 giorni.',
    courses: [
      { title: 'Team Building in Canoa', description: 'Esperienza immersiva sull\'acqua guidata da una medaglia d\'oro olimpica. I partecipanti salgono su dragone o canoa e devono sincronizzare il ritmo di pagaiata sotto la direzione di Valentina. Lavora sulla fiducia cieca nel compagno di squadra, sulla comunicazione non verbale sotto stress e sulla leadership distribuita. Output: video dell\'esperienza + debrief strutturato con paralleli organizzativi applicabili al lunedì mattina in ufficio.' },
      { title: 'Mindset Olimpico', description: 'Keynote esperienziale in cui Valentina Rodini condivide il framework mentale che l\'ha portata all\'oro olimpico: gestione della pressione competitiva, visualizzazione del risultato, costruzione della routine pre-performance e resilienza dopo il fallimento. Sessione interattiva con esercizi di goal-setting strutturato. Output: "Olympic Mindset Canvas" — framework individuale di obiettivi e rituali di alta performance applicabili al ruolo aziendale.' }
    ],
    audioSrc: '/assets/audio/valentina_rodini.mp3',
    gender: 'female',
    voiceProfile: { pitch: 1.1, speed: 0.9, warmth: 'warm' },
    audioPitch: 'Sono Valentina Rodini. In barca, come in azienda, la sincronia è tutto. Se un canottiere rema fuori tempo, l\'intera barca rallenta, non importa quanta forza ci metta il singolo. Ai Giochi di Tokyo ho imparato che la medaglia d\'oro si vince fidandosi ciecamente della persona alle tue spalle. Nel mio team building, guido le vostre persone in acqua per far sperimentare loro cosa significhi muoversi come un unico organismo.'
  },
  {
    name: 'Roberto Casalino',
    role: 'Autore, Paroliere & Storyteller Creativo',
    category: 'LEARN',
    avatar: '/assets/expert_roberto.png',
    bio: 'Uno dei parolieri e cantautori più premiati della musica italiana contemporanea. Autore della canzone vincitrice del Festival di Sanremo "L\'Essenziale" (Marco Mengoni), con oltre 30 dischi di platino, collaborazioni con Alessandra Amoroso, Emma Marrone, Tiziano Ferro e decine di artisti internazionali. La sua capacità di distillare emozioni complesse in parole essenziali e memorabili lo rende un caso unico di trasferimento delle tecniche di songwriting professionale nel contesto del corporate storytelling e della comunicazione d\'impresa.',
    valueAdd: 'Risolve un problema che affligge la maggior parte delle organizzazioni: l\'incapacità di raccontarsi in modo autentico, memorabile e differenziante. Troppi team comunicano con un linguaggio asettico, generico e intercambiabile. Roberto utilizza le tecniche della scrittura di canzoni — metafora, ritmo, struttura emotiva a tre atti, vulnerabilità strategica — per far emergere la voce autentica dell\'organizzazione e delle sue persone. Il risultato è un allineamento profondo tra valori personali e identità aziendale, che si traduce in comunicazioni interne più efficaci, pitch più persuasivi e un senso di appartenenza radicalmente più forte. I team che hanno partecipato ai suoi laboratori producono artefatti creativi (manifesti, inni, narrative) che diventano patrimonio identitario utilizzabile in convention, onboarding e employer branding.',
    courses: [
      { title: 'Storytelling & Parole Aziendali', description: 'Workshop di narrative design applicato al business, guidato dall\'autore di "L\'Essenziale" (Sanremo). I partecipanti apprendono la struttura narrativa a tre atti (setup-confrontation-resolution) e la applicano al proprio brand storytelling. Esercizi pratici di riscrittura di pitch deck, about page e comunicati interni. Output: "Brand Narrative Framework" — documento strategico con il racconto fondativo dell\'azienda riscritto professionalmente.' },
      { title: 'Scrittura Creativa di Team', description: 'Laboratorio di co-creazione in cui il team compone una metafora musicale, un manifesto o un inno che rappresenti l\'identità collettiva del gruppo. Utilizza tecniche di songwriting professionale (brainstorming ritmico, associazioni libere, struttura strofa-ritornello) come strumento di allineamento valoriale. Output: artefatto creativo originale (testo/canzone) che diventa patrimonio identitario del team, utilizzabile in convention e onboarding.' },
      { title: 'Comunicazione Autentica', description: 'Percorso individuale e di gruppo per identificare e liberare la propria "voce autentica" professionale. Basato sulle tecniche di scrittura autobiografica e sul concetto di "vulnerabilità strategica" di Brené Brown applicato al contesto aziendale. Output: profilo comunicativo individuale + toolkit di espressione autentica per email, presentazioni e interazioni one-to-one ad alto impatto.' }
    ],
    audioSrc: '/assets/audio/roberto_casalino.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.95, speed: 0.85, warmth: 'warm' },
    audioPitch: 'Ciao a tutti, sono Roberto Casalino. Le parole che scegliamo definiscono il modo in cui ci descriviamo e in cui gli altri ci percepiscono. Nei miei workshop aziendali, utilizzo le tecniche della scrittura di canzoni e dello storytelling per aiutare le persone a connettersi con la propria parte più autentica. Creare un racconto condiviso permette al team di dare una voce reale e profonda ai valori che vi uniscono nel lavoro.'
  },
  {
    name: 'TMAX Sport',
    role: 'Branded Sports Events & Soccer Legends',
    category: 'IMMERSIVE',
    avatar: '/assets/expert_tmax.png',
    bio: 'Agenzia leader in Italia nella progettazione, gestione esecutiva e copertura media di eventi sportivi corporate di altissimo profilo. TMAX Sport ha organizzato oltre 150 eventi aziendali con la partecipazione attiva di leggende dello sport mondiale — Roberto Baggio, Francesco Totti, Javier Zanetti, Fabio Capello, Alessandro Del Piero e decine di campioni internazionali. Ogni evento è un\'operazione di produzione completa: regia professionale, telecronaca live, copertura fotografica e video-editing in 48 ore per contenuti corporate-ready.',
    valueAdd: 'Risolve il problema più complesso dell\'employer branding: creare esperienze talmente memorabili da diventare virali internamente e esternamente all\'organizzazione. Quando un dipendente scende in campo a fianco di Roberto Baggio o suda sotto la guida tattica di Fabio Capello, si genera un legame emotivo che nessun workshop tradizionale può replicare. L\'effetto è triplice: coesione interna straordinaria (i partecipanti condivideranno quell\'esperienza per anni), contenuti di employer branding ad altissimo engagement (5x rispetto ai contenuti corporate tradizionali), e un posizionamento dell\'azienda come datore di lavoro desiderabile che attrae talenti. TMAX gestisce tutta la logistica, la produzione media e il coordinamento con i campioni, consegnando un evento chiavi-in-mano di livello broadcast.',
    courses: [
      { title: 'Italo Stars Cup (Calcio a 7)', description: 'Torneo aziendale esclusivo in cui i dipendenti scendono in campo a fianco di leggende del calcio mondiale (Totti, Baggio, Zanetti, Capello). Format competitivo con arbitraggio professionale, telecronaca live e copertura media completa. L\'esperienza genera un impatto emotivo senza precedenti e contenuti di employer branding virali. Output: video highlights professionali + reportage fotografico per canali corporate e social.' },
      { title: 'Legends Coaching Session', description: 'Sessione di coaching sportivo e motivazionale guidata da un\'icona del calcio internazionale. Il campione condivide la propria metodologia di preparazione mentale, gestione della sconfitta e costruzione dello spirito di squadra, tracciando parallelismi diretti con le dinamiche aziendali. Format interattivo con Q&A. Output: video-intervista esclusiva al campione + framework motivazionale "Champions Mindset" per il management.' },
      { title: 'Footvolley & Beach Event', description: 'Format sportivo estivo ad alto tasso di spettacolarità che combina calcio e pallavolo su sabbia. Ideale per convention aziendali, kick-off estivi e celebrazioni di milestone. Include regia professionale, speaker e intrattenimento. ROI: employer branding amplificato — i contenuti generati da questo tipo di evento ottengono in media 5x l\'engagement rispetto a contenuti corporate tradizionali.' }
    ],
    contact: { email: 'info@tmaxsport.it', web: 'www.tmaxsport.net' },
    audioSrc: '/assets/audio/tmax_sport.mp3',
    gender: 'male',
    voiceProfile: { pitch: 0.92, speed: 0.95, warmth: 'neutral' },
    audioPitch: 'Siamo il team di TMAX Sport. Lo sport unisce le persone in un modo unico, superando qualsiasi barriera. Progettiamo percorsi sportivi in cui i vostri collaboratori possono scendere in campo e confrontarsi con leggende viventi del calcio. Quando si corre, si suda e si festeggia un gol insieme a campioni come Francesco Totti o Roberto Baggio, si creano legami d\'acciaio che lunedì mattina si traducono in fiducia reciproca in ufficio.'
  }
]

const INITIAL_CLUSTERS: Cluster[] = [
  {
    id: 'PLAY',
    label: 'Play Experience',
    active: false,
    intensity: 0,
    experts: [
      { name: 'Luigi Gallo', role: 'Play Strategy Director', active: false },
      { name: 'Sonia Perrone', role: 'Gamification Architect', active: false },
      { name: 'Valentina Rodini', role: 'Team Building Lead', active: false }
    ],
  },
  {
    id: 'SENSE',
    label: 'Sensory Experience',
    active: false,
    intensity: 0,
    experts: [
      { name: 'Mauro Lorenzi', role: 'Sensory Design Lead', active: false },
      { name: 'Paola Meo', role: 'Nutritionist Expert', active: false },
      { name: 'Ermanno Scattaretico', role: 'Posturologist', active: false }
    ],
  },
  {
    id: 'LEARN',
    label: 'Learning Experience',
    active: false,
    intensity: 0,
    experts: [
      { name: 'Ivano Sciretta', role: 'Learning Architect', active: false },
      { name: 'Sonia Perrone', role: 'Adaptive Curriculum Designer', active: false },
      { name: 'Roberto Casalino', role: 'Storytelling Specialist', active: false }
    ],
  },
  {
    id: 'IMMERSIVE',
    label: 'Immersive Experience',
    active: false,
    intensity: 0,
    experts: [
      { name: 'Mauro Lorenzi', role: 'Immersive Tech Director', active: false },
      { name: 'Luigi Gallo', role: 'XR Experience Designer', active: false },
      { name: 'TMAX Sport', role: 'Legends Tournament Coordinator', active: false }
    ],
  },
]

// ─── Intent / Synonym Semantic Map ───────────────────────────────────
// Stem-based: "demotivato", "demotivazione" both match "demotiv"
type ClusterId = 'PLAY' | 'SENSE' | 'LEARN' | 'IMMERSIVE'

const INTENT_MAP: Record<string, { clusters: ClusterId[]; experts: string[] }> = {
  // Motivation & Engagement
  demotiv:    { clusters: ['PLAY', 'SENSE'],      experts: ['Luigi Gallo', 'Valentina Rodini'] },
  motivaz:    { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  entusiasm:  { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  disengag:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  coinvolg:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  // Stress & Burnout
  stress:     { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  burnout:    { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  stanchezz:  { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  ansia:      { clusters: ['SENSE'],               experts: ['Paola Meo', 'Luigi Gallo'] },
  esaurim:    { clusters: ['SENSE'],               experts: ['Paola Meo'] },
  // Communication
  comunicaz:  { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Luigi Gallo', 'Sonia Perrone'] },
  comunica:   { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Luigi Gallo'] },
  conflitt:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  ascolto:    { clusters: ['SENSE', 'LEARN'],      experts: ['Mauro Lorenzi', 'Luigi Gallo'] },
  silo:       { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Roberto Casalino'] },
  // Leadership & Management
  leadership: { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
  leader:     { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  manager:    { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  dirigent:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  gestione:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  // Team & Cohesion
  squadra:    { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  coesion:    { clusters: ['PLAY'],                experts: ['Valentina Rodini'] },
  fiducia:    { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini'] },
  collaboraz: { clusters: ['PLAY'],                experts: ['Valentina Rodini', 'Luigi Gallo'] },
  sincroni:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini'] },
  // AI, Innovation & Productivity
  innovaz:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  automaz:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  digital:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  workflow:   { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  efficien:   { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Luigi Gallo'] },
  produttiv:  { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Luigi Gallo'] },
  intellig:   { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  // Creativity & Storytelling
  creativ:    { clusters: ['LEARN'],               experts: ['Roberto Casalino'] },
  storytell:  { clusters: ['LEARN'],               experts: ['Roberto Casalino'] },
  narrazion:  { clusters: ['LEARN'],               experts: ['Roberto Casalino'] },
  scrittur:   { clusters: ['LEARN'],               experts: ['Roberto Casalino'] },
  // Wellness & Health
  benesser:   { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  postura:    { clusters: ['SENSE'],               experts: ['Ermanno Scattaretico', 'Sonia Perrone'] },
  moviment:   { clusters: ['SENSE'],               experts: ['Ermanno Scattaretico'] },
  nutrizion:  { clusters: ['SENSE'],               experts: ['Paola Meo'] },
  alimentaz:  { clusters: ['SENSE'],               experts: ['Paola Meo'] },
  energi:     { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  sedentari:  { clusters: ['SENSE'],               experts: ['Ermanno Scattaretico'] },
  // Senses & Emotion
  olfatt:     { clusters: ['SENSE'],               experts: ['Mauro Lorenzi'] },
  profum:     { clusters: ['SENSE'],               experts: ['Mauro Lorenzi'] },
  emozion:    { clusters: ['SENSE', 'LEARN'],      experts: ['Mauro Lorenzi', 'Luigi Gallo'] },
  sensor:     { clusters: ['SENSE'],               experts: ['Mauro Lorenzi'] },
  // Presence & Body Language
  presenza:   { clusters: ['SENSE'],               experts: ['Sonia Perrone'] },
  portament:  { clusters: ['SENSE'],               experts: ['Sonia Perrone'] },
  camminat:   { clusters: ['SENSE'],               experts: ['Sonia Perrone'] },
  autostim:   { clusters: ['SENSE', 'LEARN'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  autorevol:  { clusters: ['SENSE'],               experts: ['Sonia Perrone'] },
  // Sports & Events
  sport:      { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport', 'Valentina Rodini'] },
  calcio:     { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport'] },
  torneo:     { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport'] },
  campion:    { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  canoa:      { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['Valentina Rodini'] },
  // Growth, Change & Problem-solving
  trasformaz: { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Luigi Gallo'] },
  crescit:    { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo'] },
  problem:    { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  strateg:    { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  decision:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  onboarding: { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  // Retention & Employer Branding
  retention:  { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  fidelizzaz: { clusters: ['IMMERSIVE', 'SENSE'],  experts: ['TMAX Sport', 'Mauro Lorenzi'] },
  appartenen: { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  // Scenario-specific — common HR/business Italian
  tension:    { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Luigi Gallo'] },
  ritardo:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Luigi Gallo'] },
  ostruzion:  { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Luigi Gallo'] },
  politic:    { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  fusione:    { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Luigi Gallo'] },
  acquisiz:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Luigi Gallo'] },
  negozi:     { clusters: ['SENSE'],               experts: ['Sonia Perrone', 'Mauro Lorenzi'] },
  fatturato:  { clusters: ['SENSE', 'LEARN'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  vendita:    { clusters: ['SENSE', 'LEARN'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  release:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  svilupp:    { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  straordinar:{ clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  parlano:    { clusters: ['LEARN', 'PLAY'],       experts: ['Roberto Casalino', 'Luigi Gallo'] },
  // Sales & Commercial
  commerc:   { clusters: ['LEARN', 'SENSE'],       experts: ['Luigi Gallo', 'Sonia Perrone'] },
  target:     { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  marketing:  { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Luigi Gallo'] },
  obiettiv:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  risultat:   { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  performan:  { clusters: ['LEARN', 'SENSE'],      experts: ['Luigi Gallo', 'Paola Meo'] },
  // Events & Retreat
  retreat:    { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  evento:     { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  convention: { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport', 'Roberto Casalino'] },
  location:   { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport'] },
  // HR & People
  turnover:   { clusters: ['PLAY', 'SENSE'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  assunti:    { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Roberto Casalino'] },
  integraz:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Luigi Gallo'] },
  clima:      { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Luigi Gallo'] },
  cultura:    { clusters: ['LEARN', 'PLAY'],       experts: ['Roberto Casalino', 'Luigi Gallo'] },
  valori:     { clusters: ['LEARN'],               experts: ['Roberto Casalino'] },
  talenti:    { clusters: ['LEARN', 'IMMERSIVE'],  experts: ['Luigi Gallo', 'TMAX Sport'] },
  selezion:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  dipendent:  { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Valentina Rodini'] },
  personale:  { clusters: ['SENSE', 'LEARN'],      experts: ['Luigi Gallo', 'Paola Meo'] },
  risorse:    { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  // IT & Digital workplace
  deadline:   { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Luigi Gallo'] },
  reparto:    { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  riunion:    { clusters: ['LEARN', 'SENSE'],      experts: ['Luigi Gallo', 'Sonia Perrone'] },
  // Motivation & Change
  motivare:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Luigi Gallo', 'Valentina Rodini'] },
  ristruttur: { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  cambiament: { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  // Conflict & Silos
  frammentat: { clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Luigi Gallo'] },
  isolament:  { clusters: ['PLAY'],                experts: ['Valentina Rodini', 'Roberto Casalino'] },
  distanza:   { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  disaccord:  { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  // Generic business
  azienda:    { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  impresa:    { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  direzione:  { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  organizzaz: { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  raggiunger: { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  lavorare:   { clusters: ['SENSE', 'LEARN'],      experts: ['Paola Meo', 'Luigi Gallo'] },
  lavora:     { clusters: ['SENSE', 'LEARN'],      experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  persone:    { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Luigi Gallo'] },
  // Additional coverage
  pessimo:    { clusters: ['SENSE', 'PLAY'],       experts: ['Luigi Gallo', 'Paola Meo'] },
  pessim:     { clusters: ['SENSE', 'PLAY'],       experts: ['Luigi Gallo', 'Paola Meo'] },
  veloce:     { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  perdendo:   { clusters: ['LEARN', 'PLAY'],       experts: ['Roberto Casalino', 'Luigi Gallo'] },
  crescendo:  { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  cresciam:   { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  integrare:  { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'Roberto Casalino'] },
  inseriment: { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Roberto Casalino'] },
  accogli:    { clusters: ['PLAY', 'SENSE'],       experts: ['Valentina Rodini', 'Mauro Lorenzi'] },
  obiettivi:  { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  sfida:      { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  // Deep stress test gaps
  pandemia:   { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Valentina Rodini'] },
  remoto:     { clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Roberto Casalino'] },
  disconness: { clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Roberto Casalino'] },
  dimesso:    { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  panico:     { clusters: ['SENSE', 'PLAY'],       experts: ['Luigi Gallo', 'Paola Meo'] },
  odiano:     { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  clienti:    { clusters: ['LEARN', 'SENSE'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  lanciar:    { clusters: ['LEARN', 'IMMERSIVE'],  experts: ['Ivano Sciretta', 'Roberto Casalino'] },
  prodotto:   { clusters: ['LEARN'],               experts: ['Ivano Sciretta', 'Roberto Casalino'] },
  allineament:{ clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Luigi Gallo'] },
  allineat:   { clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Luigi Gallo'] },
  vision:     { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Luigi Gallo'] },
  assunto:    { clusters: ['PLAY', 'LEARN'],       experts: ['Luigi Gallo', 'Roberto Casalino'] },
  assenteism: { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  formazione: { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Ivano Sciretta'] },
  morali:     { clusters: ['PLAY', 'SENSE'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  morale:     { clusters: ['PLAY', 'SENSE'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  vendono:    { clusters: ['LEARN', 'SENSE'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  // Flow test gaps
  gestire:    { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  quadri:     { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  lenti:      { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  vecchi:     { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  ospedale:   { clusters: ['SENSE', 'PLAY'],        experts: ['Paola Meo', 'Valentina Rodini', 'Luigi Gallo'] },
  immersiv:   { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Valentina Rodini', 'Mauro Lorenzi'] },
  organizzar: { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Luigi Gallo'] },
  debole:     { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  esausto:    { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  collabor:   { clusters: ['PLAY', 'LEARN'],       experts: ['Valentina Rodini', 'Luigi Gallo'] },
  teso:       { clusters: ['SENSE', 'PLAY'],       experts: ['Luigi Gallo', 'Paola Meo'] },
  promoss:    { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
  // Extreme stress test gaps
  developer:  { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  como:       { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport', 'Valentina Rodini'] },
  agenzia:    { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Ivano Sciretta'] },
  trasformat: { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  accoglier:  { clusters: ['SENSE'],               experts: ['Sonia Perrone', 'Mauro Lorenzi'] },
  staff:      { clusters: ['SENSE', 'LEARN'],      experts: ['Sonia Perrone', 'Luigi Gallo'] },
  mollando:   { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Luigi Gallo'] },
  mollare:    { clusters: ['SENSE', 'PLAY'],       experts: ['Paola Meo', 'Luigi Gallo'] },
  insegni:    { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
  insegnare:  { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
  rotto:      { clusters: ['PLAY'],                experts: ['Valentina Rodini', 'Luigi Gallo'] },
  unisca:     { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['Valentina Rodini', 'TMAX Sport'] },
  aperitivo:  { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport', 'Mauro Lorenzi'] },
  // Reward / Celebration
  premio:     { clusters: ['IMMERSIVE', 'SENSE'],  experts: ['Mauro Lorenzi', 'TMAX Sport', 'Sonia Perrone'] },
  premiare:   { clusters: ['IMMERSIVE', 'SENSE'],  experts: ['Mauro Lorenzi', 'TMAX Sport'] },
  regalare:   { clusters: ['IMMERSIVE', 'SENSE'],  experts: ['Mauro Lorenzi', 'Valentina Rodini'] },
  ricreativ:  { clusters: ['PLAY', 'IMMERSIVE'],   experts: ['TMAX Sport', 'Valentina Rodini'] },
  celebraz:   { clusters: ['IMMERSIVE'],           experts: ['TMAX Sport', 'Roberto Casalino'] },
  festeggi:   { clusters: ['IMMERSIVE', 'PLAY'],   experts: ['TMAX Sport', 'Mauro Lorenzi'] },
  benessere:  { clusters: ['SENSE'],               experts: ['Paola Meo', 'Ermanno Scattaretico'] },
  esperienza: { clusters: ['IMMERSIVE', 'SENSE'],  experts: ['Mauro Lorenzi', 'Valentina Rodini'] },
  speciale:   { clusters: ['IMMERSIVE'],           experts: ['Mauro Lorenzi', 'TMAX Sport'] },
  // Feedback, Delegation & Coaching
  feedback:   { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  delega:     { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Roberto Casalino'] },
  coaching:   { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
  mentor:     { clusters: ['LEARN'],               experts: ['Luigi Gallo'] },
  // Diversity & Inclusion
  diversit:   { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  inclus:     { clusters: ['LEARN', 'PLAY'],       experts: ['Luigi Gallo', 'Valentina Rodini'] },
  // Sustainability
  sostenibil: { clusters: ['LEARN'],               experts: ['Ivano Sciretta'] },
  // Meeting & Competence
  meeting:    { clusters: ['LEARN'],               experts: ['Roberto Casalino', 'Luigi Gallo'] },
  competen:   { clusters: ['LEARN'],               experts: ['Luigi Gallo', 'Sonia Perrone'] },
}

// ─── Diagnostic Narrative Templates ──────────────────────────────────
const CLUSTER_DIAGNOSTIC: Record<string, { headline: string; need: string }> = {
  PLAY: {
    headline: 'Il team ha bisogno di ritrovarsi',
    need: 'attivita\' concrete che facciano lavorare le persone insieme, ricostruendo la fiducia reciproca e il piacere di collaborare',
  },
  SENSE: {
    headline: 'Le persone sono sotto pressione',
    need: 'interventi sul benessere fisico e mentale del team: gestione dello stress, energia, alimentazione e consapevolezza corporea',
  },
  LEARN: {
    headline: 'Servono strumenti concreti',
    need: 'formazione pratica e applicabile subito: competenze di leadership, gestione del tempo, comunicazione efficace e strumenti operativi',
  },
  IMMERSIVE: {
    headline: 'Serve un\'esperienza che lasci il segno',
    need: 'un evento fuori dall\'ordinario che crei ricordi condivisi e rafforzi il senso di appartenenza al gruppo',
  },
}

const EXTENDED_STOPWORDS = new Set([
  'del', 'della', 'dei', 'delle', 'degli', 'all', 'alla', 'agli', 'alle',
  'nei', 'nella', 'negli', 'nelle', 'con', 'per', 'tra', 'fra', 'sul',
  'sulla', 'sotto', 'sopra', 'che', 'non', 'una', 'uno', 'come', 'sono', 'sui',
  'nostro', 'nostra', 'nostri', 'nostre', 'vostro', 'vostra', 'mio', 'suoi',
  'loro', 'questo', 'questa', 'questi', 'queste', 'quello', 'quella',
  'più', 'molto', 'poco', 'tutto', 'ogni', 'anche', 'ancora', 'già',
  'dove', 'quando', 'perché', 'vogliamo', 'abbiamo', 'bisogno', 'vorremmo',
  'migliorare', 'fare', 'essere', 'avere', 'potere', 'dovere',
])

export function getExpertMatchScore(input: string, expert: DetailedExpert): number {
  const lowerInput = input.toLowerCase()
  const inputTokens = lowerInput
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)

  if (inputTokens.length === 0) return 30

  const filteredTokens = inputTokens.filter(t => !EXTENDED_STOPWORDS.has(t))
  if (filteredTokens.length === 0) return 30

  // Build expert keyword bank from all textual fields
  const bankText = `${expert.name} ${expert.role} ${expert.category} ${expert.bio} ${expert.valueAdd} ${expert.courses.map(c => `${c.title} ${c.description}`).join(' ')}`.toLowerCase()

  let score = 0

  filteredTokens.forEach(token => {
    // 1. Direct literal match against expert's full text bank
    if (bankText.includes(token)) {
      score += 1
      expert.courses.forEach(c => {
        if (c.title.toLowerCase().includes(token)) score += 0.5
      })
    }

    // 2. Intent-based semantic matching via stem map
    for (const [stem, mapping] of Object.entries(INTENT_MAP)) {
      if (token.length >= 3 && (token.startsWith(stem) || stem.startsWith(token))) {
        if (mapping.experts.includes(expert.name)) {
          score += 2.5 // Strong signal: expert directly mapped to this intent
        } else if (expert.category === 'ALL' || mapping.clusters.includes(expert.category as ClusterId)) {
          score += 1.0 // Moderate signal: expert's category matches intent cluster
        }
        break
      }
    }
  })

  // 3. Multi-word phrase matching (bonus on top of token matching)
  const lowerFull = input.toLowerCase()
  for (const pm of PHRASE_MATCHES) {
    if (lowerFull.includes(pm.phrase)) {
      if (pm.experts.includes(expert.name)) {
        score += 3.0
      } else if (pm.clusters.includes(expert.category as ClusterId)) {
        score += 1.5
      }
    }
  }

  // 4. Category boost — if the user selected a category in the guided flow
  for (const [catKey, boostedExperts] of Object.entries(CATEGORY_EXPERT_BOOST)) {
    if (lowerFull.includes(catKey) && boostedExperts.includes(expert.name)) {
      score += 2.0
    }
  }

  const normalizedScore = Math.round((score / filteredTokens.length) * 100)
  return Math.min(Math.max(normalizedScore, 35), 98)
}

// Utility: extract filtered tokens from input for cluster boost calculation
function tokenizeInput(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !EXTENDED_STOPWORDS.has(t))
}

// Live intent detection — returns top 3 expert names matching the input while typing
export function detectIntentExperts(input: string): string[] {
  const tokens = tokenizeInput(input)
  if (tokens.length === 0) return []

  const scores: Record<string, number> = {}
  tokens.forEach(token => {
    for (const [stem, mapping] of Object.entries(INTENT_MAP)) {
      if (token.length >= 4 && (token.startsWith(stem) || stem.startsWith(token))) {
        mapping.experts.forEach(name => { scores[name] = (scores[name] || 0) + 1 })
        break
      }
    }
  })

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)
}

// Context Gate: follow-up questions based on detected clusters
const CONTEXT_QUESTIONS: Record<string, string[]> = {
  PLAY: [
    'Il team lavora in remoto, ibrido o in presenza?',
    'Quante persone dovrebbero essere coinvolte?',
    'Ci sono tensioni specifiche tra reparti?',
  ],
  SENSE: [
    'Il team manifesta sintomi di stress o burnout?',
    'Ci sono problemi di sedentarietà o postura in ufficio?',
    'Quanto è importante il benessere fisico per la direzione?',
  ],
  LEARN: [
    'Quali strumenti digitali usa il team oggi?',
    'Ci sono colli di bottiglia nei processi operativi?',
    'La leadership ha bisogno di coaching strategico?',
  ],
  IMMERSIVE: [
    'L\'azienda ha già organizzato eventi di team building?',
    'Il team è aperto ad esperienze fisiche outdoor?',
    'Quanto è importante l\'employer branding per voi?',
  ],
}

// Get 3 contextual questions based on input intent
export function getContextQuestions(input: string): string[] {
  const tokens = tokenizeInput(input)
  const clusterHits: Record<string, number> = { PLAY: 0, SENSE: 0, LEARN: 0, IMMERSIVE: 0 }

  tokens.forEach(token => {
    for (const [stem, mapping] of Object.entries(INTENT_MAP)) {
      if (token.length >= 4 && (token.startsWith(stem) || stem.startsWith(token))) {
        mapping.clusters.forEach(c => { clusterHits[c] += 1 })
        break
      }
    }
  })

  const sorted = Object.entries(clusterHits).sort((a, b) => b[1] - a[1])
  const topCluster = sorted[0]?.[0] || 'LEARN'
  const secondCluster = sorted[1]?.[0] || 'PLAY'

  // Pick 2 from top cluster, 1 from second
  const q = [
    ...CONTEXT_QUESTIONS[topCluster].slice(0, 2),
    CONTEXT_QUESTIONS[secondCluster][0],
  ]
  return q
}

// ─── Category → Expert Boost (used when user selects a category in Hero) ───
const CATEGORY_EXPERT_BOOST: Record<string, string[]> = {
  'team non funziona': ['Luigi Gallo', 'Valentina Rodini', 'Roberto Casalino'],
  'leadership': ['Luigi Gallo', 'Sonia Perrone', 'Roberto Casalino'],
  'stress': ['Paola Meo', 'Ermanno Scattaretico', 'Luigi Gallo'],
  'burnout': ['Paola Meo', 'Ermanno Scattaretico', 'Luigi Gallo'],
  'innovazione': ['Ivano Sciretta', 'Luigi Gallo', 'Roberto Casalino'],
  'evento': ['TMAX Sport', 'Valentina Rodini', 'Mauro Lorenzi'],
  'trasformativo': ['Valentina Rodini', 'TMAX Sport', 'Mauro Lorenzi'],
  'premiare': ['Mauro Lorenzi', 'TMAX Sport', 'Valentina Rodini'],
  'premio': ['Mauro Lorenzi', 'TMAX Sport', 'Sonia Perrone'],
  'regalare': ['Mauro Lorenzi', 'TMAX Sport', 'Valentina Rodini'],
}

// ─── Multi-word Phrase Matching ────────────────────────────────────
const PHRASE_MATCHES: Array<{ phrase: string; clusters: ClusterId[]; experts: string[] }> = [
  { phrase: 'team building', clusters: ['PLAY', 'IMMERSIVE'], experts: ['Valentina Rodini', 'TMAX Sport'] },
  { phrase: 'public speaking', clusters: ['LEARN'], experts: ['Luigi Gallo', 'Sonia Perrone'] },
  { phrase: 'intelligenza artificiale', clusters: ['LEARN'], experts: ['Ivano Sciretta'] },
  { phrase: 'intelligenza emotiva', clusters: ['LEARN'], experts: ['Luigi Gallo'] },
  { phrase: 'problem solving', clusters: ['LEARN'], experts: ['Luigi Gallo'] },
  { phrase: 'gestione del tempo', clusters: ['LEARN'], experts: ['Luigi Gallo'] },
  { phrase: 'comunicazione interna', clusters: ['LEARN'], experts: ['Roberto Casalino', 'Luigi Gallo'] },
  { phrase: 'lavoro di squadra', clusters: ['PLAY'], experts: ['Valentina Rodini'] },
  { phrase: 'risorse umane', clusters: ['LEARN'], experts: ['Luigi Gallo'] },
  { phrase: 'clima aziendale', clusters: ['SENSE', 'PLAY'], experts: ['Luigi Gallo', 'Paola Meo'] },
  { phrase: 'employer branding', clusters: ['IMMERSIVE'], experts: ['TMAX Sport'] },
  { phrase: 'post fusione', clusters: ['PLAY', 'IMMERSIVE'], experts: ['Valentina Rodini', 'Luigi Gallo'] },
  { phrase: 'da remoto', clusters: ['PLAY', 'LEARN'], experts: ['Valentina Rodini', 'Roberto Casalino'] },
  { phrase: 'nuovi assunti', clusters: ['PLAY', 'LEARN'], experts: ['Luigi Gallo', 'Roberto Casalino'] },
  { phrase: 'body language', clusters: ['SENSE'], experts: ['Sonia Perrone'] },
  { phrase: 'nutrizione aziendale', clusters: ['SENSE'], experts: ['Paola Meo'] },
  { phrase: 'smart working', clusters: ['LEARN', 'PLAY'], experts: ['Roberto Casalino', 'Luigi Gallo'] },
  { phrase: 'gestione conflitti', clusters: ['LEARN'], experts: ['Luigi Gallo'] },
  { phrase: 'work life balance', clusters: ['SENSE'], experts: ['Paola Meo', 'Ermanno Scattaretico'] },
]

// ─── Sector Trend Data (2024-2026) — injected into diagnosis ───
export const SECTOR_TRENDS: Record<DetectedSector, string> = {
  tech: 'Secondo i dati piu\' recenti, il 42% dei professionisti tech in Italia considera di cambiare lavoro entro 12 mesi a causa del burnout. Le aziende che investono in benessere del team riducono il turnover del 34%.',
  luxury: 'Nel retail di lusso, l\'esperienza del personale in-store determina fino al 70% della decisione d\'acquisto del cliente. Un team formato sulla presenza e sul linguaggio non verbale aumenta il ticket medio del 23%.',
  finance: 'Nelle istituzioni finanziarie italiane, il 58% delle fusioni non raggiunge gli obiettivi previsti a causa di problemi di integrazione culturale tra i team. L\'intervento sui primi 90 giorni e\' determinante.',
  health: 'Il 67% degli operatori sanitari italiani riporta sintomi di burnout. Le strutture che implementano programmi di benessere registrano una riduzione del 40% delle assenze e un miglioramento della soddisfazione dei pazienti.',
  manufacturing: 'Nell\'industria italiana, il costo della non-qualita\' legato a problemi di comunicazione tra reparti supera in media il 5% del fatturato. I programmi di allineamento inter-funzionale recuperano fino al 60% di questa perdita.',
  default: 'Le ricerche piu\' recenti mostrano che il 73% dei dipendenti italiani considera il benessere sul lavoro piu\' importante dello stipendio. Le aziende che investono sulle persone hanno un engagement superiore del 28% rispetto alla media.',
}

// ─── Contextual Intelligence ────────────────────────────────────────
export function analyzeContext(input: string): {
  urgency: 'critical' | 'moderate' | 'normal'
  hasTriedBefore: boolean
  previousAttempts: string | null
  echoPhrase: string
  teamSize: 'small' | 'medium' | 'large' | 'unknown'
} {
  const lower = input.toLowerCase()

  // Urgency detection
  const urgencyWords = ['urgente', 'critico', 'critica', 'emergenza', 'subito', 'immediatamente', 'grave', 'insostenibile', 'collasso', 'collassando', 'disperato', 'non possiamo']
  const criticalCount = urgencyWords.filter(w => lower.includes(w)).length
  const urgency = criticalCount >= 2 ? 'critical' : criticalCount >= 1 ? 'moderate' : 'normal'

  // Anti-pattern: previous attempts
  const attemptPatterns = [
    { pattern: /abbiamo (gia['\u0027]?|già) provato/i, label: 'avete gia\' provato qualcosa' },
    { pattern: /non (ha |hanno |)funzionat/i, label: 'le soluzioni precedenti non hanno funzionato' },
    { pattern: /corsi? (non|tradizional)/i, label: 'i corsi tradizionali non vi hanno soddisfatto' },
    { pattern: /solito (team building|evento|corso)/i, label: 'cercate qualcosa di diverso dal solito' },
    { pattern: /stanchi (dei|di|del)/i, label: 'siete stanchi degli approcci convenzionali' },
  ]
  const matchedAttempt = attemptPatterns.find(p => p.pattern.test(lower))

  // Extract the core challenge phrase (first sentence or first 80 chars)
  const firstSentence = input.split(/[.!?]/)[0]?.trim() || input.trim()
  const echoPhrase = firstSentence.length > 100 ? firstSentence.substring(0, 95) + '...' : firstSentence

  // Team size detection from answers
  let teamSize: 'small' | 'medium' | 'large' | 'unknown' = 'unknown'
  if (lower.includes('meno di 15') || lower.includes('meno di 20') || lower.includes('startup') || lower.includes('< 20') || lower.includes('10-20') || lower.includes('10–20')) teamSize = 'small'
  else if (lower.includes('15-50') || lower.includes('15–50') || lower.includes('20-50') || lower.includes('20–50') || lower.includes('50-100') || lower.includes('50–100') || /\b[2-9]0\b/.test(lower)) teamSize = 'medium'
  else if (lower.includes('oltre 100') || lower.includes('200') || lower.includes('enterprise') || lower.includes('500')) teamSize = 'large'

  return {
    urgency,
    hasTriedBefore: !!matchedAttempt,
    previousAttempts: matchedAttempt?.label || null,
    echoPhrase,
    teamSize,
  }
}

// ─── Sector Detection ───────────────────────────────────────────────
const SECTOR_KEYWORDS: Record<DetectedSector, string[]> = {
  tech:          ['software', 'saas', 'startup', 'develop', 'svilupp', 'coding', 'cloud', 'devops', 'agile', 'scrum', 'tech', 'digital', 'app', 'piattaform', 'release', 'deploy', 'slack', 'sprint', 'codice', 'program', 'frontend', 'backend', 'fintech', 'reparto'],
  luxury:        ['luxury', 'lusso', 'moda', 'fashion', 'brand', 'retail', 'hospitality', 'hotel', 'design', 'premium', 'boutique', 'negozi', 'store', 'vendita', 'fatturato', 'cliente', 'showroom', 'commerc'],
  finance:       ['banca', 'finanz', 'assicuraz', 'invest', 'trading', 'compliance', 'audit', 'contabil', 'patrimoni', 'credito', 'acquisit', 'fusion', 'merger', 'fintech'],
  health:        ['salute', 'farma', 'clinic', 'ospedal', 'medic', 'sanitar', 'biotech', 'pazient', 'terapeut', 'infermier'],
  manufacturing: ['produzion', 'fabbric', 'logistic', 'supply', 'manifattur', 'industri', 'ingegner', 'impianti', 'meccanica', 'magazzin'],
  default:       [],
}

export function detectSector(input: string): DetectedSector {
  const tokens = tokenizeInput(input)
  const scores: Record<string, number> = {}

  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (sector === 'default') continue
    scores[sector] = 0
    tokens.forEach(token => {
      keywords.forEach(kw => {
        if (token.startsWith(kw) || kw.startsWith(token)) scores[sector] += 1
      })
    })
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return (best && best[1] > 0 ? best[0] : 'default') as DetectedSector
}

// ─── Sector-Specific Strategic Framing ──────────────────────────────
const SECTOR_FRAMING: Record<DetectedSector, {
  diagnosisOpener: string
  impactMetrics: string
  tailoringAngle: string
}> = {
  luxury: {
    diagnosisOpener: 'Nel vostro settore, ogni persona a contatto col cliente rappresenta il brand. Quando il team e\' demotivato, i clienti lo percepiscono subito e il fatturato ne risente. Non si tratta di "motivare" con un discorso, ma di restituire alle persone sicurezza, presenza e orgoglio professionale.',
    impactMetrics: 'I KPI di riferimento sono il tasso di conversione in-store, il Net Promoter Score sulla clientela VIP e il ticket medio per interazione. L\'intervento punta a riallineare la presenza commerciale del team alla promessa del brand.',
    tailoringAngle: 'In un contesto di lusso, ogni dettaglio conta: il portamento, il ritmo della voce, l\'occupazione dello spazio. Gli esperti selezionati lavorano sulla presenza fisica e sull\'impatto sensoriale — non sulla teoria.',
  },
  tech: {
    diagnosisOpener: 'Essere sempre connessi non significa comunicare davvero. I team tech spesso sembrano allineati perche\' scrivono su Slack, ma sotto la superficie si accumulano stanchezza, frustrazioni non dette e lavoro rifatto. Il risultato? Le persone migliori iniziano a guardarsi intorno.',
    impactMetrics: 'Le metriche che contano sono la velocità di release, il tasso di rework, il rapporto tra ore lavorate e output effettivo. L\'intervento mira a spezzare il ciclo burnout → inefficienza → straordinari compensativi, recuperando ritmo operativo reale.',
    tailoringAngle: 'Per un team tecnico, il linguaggio motivazionale tradizionale è controproducente. Gli esperti selezionati parlano la lingua dei processi, dell\'energia cognitiva e del biofeedback — strumenti che un ingegnere può misurare e rispettare.',
  },
  finance: {
    diagnosisOpener: 'Quando due organizzazioni si uniscono, il problema vero non e\' tecnico — e\' umano. Le persone proteggono il proprio ruolo, smettono di condividere informazioni e le decisioni rallentano. Se non si interviene, questa situazione diventa la nuova normalita\' e i talenti migliori se ne vanno.',
    impactMetrics: 'I KPI strategici sono il tempo medio di decisione cross-dipartimentale, il tasso di adozione dei processi unificati e l\'indice di fiducia inter-team misurato con survey anonime a 30 e 60 giorni.',
    tailoringAngle: 'In un contesto bancario, l\'intervento deve essere percepito come strategico, non come "team building". Gli esperti selezionati lavorano sulla psicologia della fiducia sotto pressione e sulla rottura delle barriere politiche attraverso esperienze che rendono impossibile nascondersi dietro il ruolo.',
  },
  health: {
    diagnosisOpener: 'Nel vostro settore, la stanchezza delle persone non e\' solo un problema di risorse umane — ha un impatto diretto sulla qualita\' del servizio e sulla sicurezza. Quando il personale e\' esausto, la qualita\' del lavoro cala, gli errori aumentano e i pazienti lo sentono.',
    impactMetrics: 'Gli indicatori chiave sono il tasso di errore clinico, il turnover del personale qualificato, il punteggio di soddisfazione dei pazienti e l\'indice di burnout misurato con il Maslach Burnout Inventory.',
    tailoringAngle: 'Per professionisti sanitari, l\'intervento deve essere evidence-based e rispettare la cultura scientifica del settore. Gli esperti selezionati utilizzano protocolli validati e parlano il linguaggio della clinica, non del coaching generico.',
  },
  manufacturing: {
    diagnosisOpener: 'Nella produzione, quando i reparti non si parlano, i problemi si vedono subito: ritardi, errori, sprechi. La causa quasi mai e\' tecnica — e\' la comunicazione tra le persone. Chi progetta, chi produce e chi gestisce devono tornare a lavorare come un unico team.',
    impactMetrics: 'I KPI operativi di riferimento sono l\'OEE (Overall Equipment Effectiveness), il lead time di produzione, il tasso di reclamo cliente e il costo della non-qualità. L\'intervento mira a fluidificare il passaggio di consegne tra i reparti.',
    tailoringAngle: 'Per operatori e tecnici, l\'intervento deve essere concreto e applicabile. Gli esperti selezionati lavorano con framework visivi, protocolli fisici e metriche tangibili — niente slide, niente astrazioni.',
  },
  default: {
    diagnosisOpener: 'Quello che ci avete descritto e\' una situazione che vediamo spesso. C\'e\' una distanza tra quello che la direzione si aspetta e quello che il team riesce a dare. Non e\' colpa di nessuno — ma se non si interviene, diventa un\'abitudine e le cose peggiorano.',
    impactMetrics: 'L\'intervento produce risultati documentabili nelle survey di clima a 30 e 60 giorni: indice di engagement, percezione di allineamento interno e livello di energia autoriportata. Il delta medio rispetto agli eventi formativi tradizionali è del +28%.',
    tailoringAngle: 'Ogni esperto calibra la propria metodologia sul vostro contesto reale. Non esistono moduli preconfezionati: il percorso viene costruito su casi, dinamiche e obiettivi concreti emersi durante la diagnostica iniziale.',
  },
}

// ─── Expert Strategic Rationale — WHY this expert for THIS challenge ───
const EXPERT_RATIONALE: Record<string, Record<string, string>> = {
  'Sonia Perrone': {
    luxury: 'La biomeccanica del portamento diventa uno strumento di vendita: il personale in boutique che cammina con consapevolezza comunica autorevolezza e cura, elevando l\'esperienza del cliente',
    tech: 'Il linguaggio corporeo è il canale più trascurato nei team remoti che si incontrano raramente di persona. Recuperare la presenza fisica accelera la ricostruzione della fiducia',
    finance: 'In un contesto post-fusione, la postura e l\'occupazione dello spazio comunicano status e apertura. Chi si presenta con sicurezza abbatte le barriere difensive dell\'interlocutore',
    default: 'Il metodo Cammineria® trasforma la consapevolezza corporea in uno strumento di leadership non verbale, misurabile nel modo in cui il team viene percepito in sala riunioni',
  },
  'Luigi Gallo': {
    tech: 'Il Problem Solving Strategico di Nardone applicato ai colli di bottiglia tecnici. Non coaching motivazionale, ma un framework rigoroso per smontare blocchi decisionali e recuperare 5-8 ore/settimana per sviluppatore',
    finance: 'L\'intelligenza emotiva applicata al management post-fusione: gestione dei conflitti politici tra quadri, riallineamento delle aspettative e costruzione di un linguaggio decisionale comune',
    luxury: 'Il programma YOU LEAD trasforma store manager da esecutori a leader consapevoli, capaci di gestire team di vendita con empatia strategica e padronanza del tempo',
    default: 'Interviene sulle tre patologie organizzative più frequenti: leadership reattiva, gestione disfunzionale del tempo e incapacità di risolvere problemi complessi senza escalation',
  },
  'Paola Meo': {
    tech: 'La cronobiologia alimentare per sviluppatori: come il meal-timing e la composizione del pranzo influenzano direttamente il focus cognitivo nelle ore pomeridiane — le più critiche per la qualità del codice',
    default: 'Il protocollo nutrizionale "Brain Fuel" interviene sulla causa biochimica del calo di produttività post-prandiale, documentando una riduzione media del 30% dello sforzo cognitivo percepito',
  },
  'Valentina Rodini': {
    finance: 'L\'esperienza in canoa è una metafora chirurgica per le fusioni: due equipaggi che devono trovare un ritmo comune o affondare insieme. Impossibile nascondersi dietro il ruolo quando si è sull\'acqua',
    default: 'Il team building in canoa forza la fiducia cieca nel compagno e la sincronia operativa — le due competenze che separano i team funzionali da quelli disfunzionali',
  },
  'Mauro Lorenzi': {
    luxury: 'La firma olfattiva aziendale diventa un asset di marca: un profumo esclusivo associato al brand, utilizzabile nei punti vendita e negli eventi, che àncora l\'esperienza del cliente nella memoria a lungo termine',
    default: 'La stimolazione olfattiva aggira la corteccia razionale e crea ancoraggi emotivi condivisi. Il profumo del retreat diventa un artefatto permanente che riattiva il legame di squadra per mesi',
  },
  'Ivano Sciretta': {
    tech: 'Audit dei workflow esistenti (CI/CD, ticketing, documentazione) e installazione di automazioni n8n che eliminano il data-entry ripetitivo — liberando ore di sviluppo reale per sprint',
    default: 'Eliminazione dei colli di bottiglia operativi attraverso automazioni concrete. Non formazione teorica, ma workflow attivi in produzione al termine del modulo',
  },
  'Ermanno Scattaretico': {
    default: 'Ermanno interviene sullo stress fisico del team con protocolli posturali e di benessere corporeo — il primo passo per sbloccare la produttività mentale',
  },
  'TMAX Sport': {
    default: 'TMAX Sport porta esperienze sportive ad alto impatto che accelerano la coesione del gruppo — dal team building atletico ai format con campioni olimpici',
  },
  'Roberto Casalino': {
    default: 'Roberto trasforma la comunicazione interna dell\'azienda in uno strumento strategico — dal public speaking alla narrazione corporate',
  },
}

// ─── Corporate Language Sanitizer ────────────────────────────────────
function sanitizeCorporateLanguage(text: string): string {
  const replacements: [RegExp, string][] = [
    [/soluzion[ei] olistic[ahe]*/gi, 'intervento strutturato'],
    [/sinergi[ae]/gi, 'integrazione operativa'],
    [/potenziar[ei]/gi, 'rafforzare'],
    [/empowerment/gi, 'autonomia operativa'],
    [/piattaforma/gi, 'sistema'],
    [/stakeholder/gi, 'portatori di interesse'],
    [/win-win/gi, 'reciproco vantaggio'],
    [/best practice/gi, 'protocollo validato'],
    [/touchpoint/gi, 'punto di contatto'],
    [/mindset/gi, 'approccio mentale'],
    [/soft skill[s]?/gi, 'competenze relazionali'],
    [/skill[s]?\b/gi, 'competenze'],
    [/resilienza/gi, 'capacità di adattamento'],
    [/proattiv[oai]/gi, 'anticipatori'],
  ]
  let result = text
  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement)
  })
  return result
}

export const useLuminaStore = create<LuminaState>()(persist((set) => ({
  challengeInput: '',
  activeClusters: INITIAL_CLUSTERS.map((c) => ({ ...c, experts: c.experts.map((e) => ({ ...e })) })),
  isGenerating: false,
  hasResults: false,
  selectedExpert: null,
  playingAudio: null,
  audioProgress: 0,
  currentTranscriptLine: 0,
  generatedBlueprint: null,
  selectedPackage: null,
  preMatchedExperts: [],
  videoBackgroundActive: true,
  detectedSector: 'default' as DetectedSector,
  selectedCourses: [],

  setChallengeInput: (input) => set({ challengeInput: input }),

  analyzeChallenge: (input) => {
    set({ isGenerating: true, hasResults: false, challengeInput: input })

    setTimeout(() => {
      // 1. Calculate match scores for all experts
      const scoredExperts = EXPERTS_DATA.map(expert => {
        const score = getExpertMatchScore(input, expert)
        return { expert, score }
      }).sort((a, b) => b.score - a.score)

      // 2. Select top 3 matching experts for the days
      const topExperts = scoredExperts.slice(0, 3)

      // 3. Calculate intent-based cluster boosts from semantic stem matching
      const clusterBoosts: Record<string, number> = { PLAY: 0, SENSE: 0, LEARN: 0, IMMERSIVE: 0 }
      const tokens = tokenizeInput(input)
      tokens.forEach(token => {
        for (const [stem, mapping] of Object.entries(INTENT_MAP)) {
          if (token.length >= 4 && (token.startsWith(stem) || stem.startsWith(token))) {
            mapping.clusters.forEach(c => { clusterBoosts[c] += 18 })
            break
          }
        }
      })

      // 4. Re-calculate clusters intensity: expert scores + intent boosts
      const clusters = INITIAL_CLUSTERS.map((cluster) => {
        const categoryExperts = EXPERTS_DATA.filter(e => e.category === cluster.id || e.category === 'ALL')
        const avgScore = categoryExperts.length > 0
          ? categoryExperts.reduce((sum, e) => {
              const matched = scoredExperts.find(se => se.expert.name === e.name)
              return sum + (matched ? matched.score : 0)
            }, 0) / categoryExperts.length
          : 0

        const boostedScore = avgScore + (clusterBoosts[cluster.id] || 0)
        const intensity = boostedScore > 20 ? Math.min(boostedScore / 100, 1) : 0
        const active = intensity > 0.25

        const updatedExperts = cluster.experts.map(exp => {
          const expertScore = scoredExperts.find(se => se.expert.name === exp.name)?.score || 0
          return { ...exp, active: expertScore > 35 }
        })

        return {
          ...cluster,
          active,
          intensity: active ? Math.max(intensity, 0.3) : 0,
          experts: updatedExperts
        }
      })

      // 5. Determine primary cluster
      const primaryCluster = clusters.reduce((max, c) => c.intensity > max.intensity ? c : max, clusters[0])

      // 6. Generate Diagnostic Insight
      const activeSorted = [...clusters].filter(c => c.active).sort((a, b) => b.intensity - a.intensity)
      const dominant = activeSorted[0]
      const secondary = activeSorted[1]
      const totalActiveIntensity = activeSorted.reduce((s, c) => s + c.intensity, 0)

      // Detect sector early — needed for narrative and framing
      const sector = detectSector(input)

      const clusterBreakdown = activeSorted.map(c => ({
        id: c.id,
        label: c.label,
        percent: totalActiveIntensity > 0 ? Math.round((c.intensity / totalActiveIntensity) * 100) : 0,
      }))

      let diagnosticHeadline = 'Analisi del Profilo Esperienziale'
      let diagnosticNarrative = ''

      // Contextual intelligence
      const context = analyzeContext(input)

      if (dominant) {
        const dDiag = CLUSTER_DIAGNOSTIC[dominant.id]
        diagnosticHeadline = dDiag?.headline || diagnosticHeadline

        // Start with echo-back — quote their own words (skip if too short)
        diagnosticNarrative = context.echoPhrase.length > 5 ? `Ci avete detto: "${context.echoPhrase}". ` : ''

        // Urgency-aware tone
        if (context.urgency === 'critical') {
          diagnosticNarrative += 'Capiamo che la situazione e\' urgente e richiede un intervento rapido. '
        } else if (context.urgency === 'moderate') {
          diagnosticNarrative += 'E\' importante intervenire prima che la situazione si aggravi. '
        }

        // Acknowledge previous attempts
        if (context.hasTriedBefore && context.previousAttempts) {
          diagnosticNarrative += `Sappiamo che ${context.previousAttempts}. Per questo il nostro approccio e' completamente diverso: niente slide, niente teorie, solo interventi concreti con risultati misurabili. `
        }

        // Core diagnosis
        diagnosticNarrative += `Da quello che ci raccontate, il vostro team ha bisogno di ${dDiag?.need || 'un intervento mirato'}. `

        if (secondary) {
          const sDiag = CLUSTER_DIAGNOSTIC[secondary.id]
          diagnosticNarrative += `Allo stesso tempo, vediamo la necessita' di ${sDiag?.need || 'un supporto complementare'}. `
        }

        // Team size awareness
        if (context.teamSize === 'small') {
          diagnosticNarrative += 'Con un team delle vostre dimensioni, l\'intervento puo\' essere molto mirato e personalizzato su ogni persona. '
        } else if (context.teamSize === 'large') {
          diagnosticNarrative += 'Con un\'organizzazione delle vostre dimensioni, strutturiamo il percorso in moduli scalabili che coinvolgono tutti i livelli. '
        }

        // Sector trend
        const trendData = SECTOR_TRENDS[sector]
        if (trendData) {
          diagnosticNarrative += trendData + ' '
        }

        diagnosticNarrative += 'Il percorso che vi proponiamo tiene conto di tutto questo.'
      }

      const diagnosticInsight: DiagnosticInsight = {
        headline: diagnosticHeadline,
        narrative: diagnosticNarrative,
        clusterBreakdown,
      }

      // 5. Generate custom itinerary days using the courses and biographies of the top 3 experts
      const cleanedInput = input.trim()
      const itineraryDays: CustomDay[] = [
        {
          dayNumber: 1,
          theme: "Fase 01: Decompressione Sensoriale e Allineamento",
          focus: "Abbassare le difese cognitive, stimolare l'ascolto corporeo ed emotivo del gruppo.",
          activities: [
            {
              time: "15:00",
              title: "Welcome Circle & Challenge Mapping",
              expert: "Team Lumina",
              description: `Allineamento direzionale per mappare gli obiettivi organizzativi focalizzati su: "${cleanedInput}".`
            },
            {
              time: "17:00",
              title: topExperts[0]?.expert.courses[0]?.title || "Laboratorio Sensoriale Artistico",
              expert: topExperts[0]?.expert.name || "Mauro Lorenzi",
              description: `${topExperts[0]?.expert.courses[0]?.description || "Esperienza per connettere il team attraverso stimolazioni artistiche."} Adattato per supportare lo sviluppo emotivo legato alla sfida: "${cleanedInput}".`
            },
            {
              time: "20:30",
              title: "Cena B2B Emozionale e Nutrizione",
              expert: "Paola Meo",
              description: "Cena per apprendere come la nutrizione clinica supporti l'energia e il focus mentale nei periodi di stress organizzativo."
            }
          ]
        },
        {
          dayNumber: 2,
          theme: "Fase 02: Sincronia e Integrazione Operativa",
          focus: "Sperimentare la collaborazione ad alte prestazioni e integrare soluzioni pratiche.",
          activities: [
            {
              time: "09:30",
              title: "Sincronia ed Empatia sul Dragone",
              expert: "Valentina Rodini",
              description: `L'esperienza dell'oro olimpico Valentina Rodini sull'acqua, allenando la fiducia nel compagno per vincere le criticità legate a: "${cleanedInput}".`
            },
            {
              time: "14:30",
              title: topExperts[1]?.expert.courses[0]?.title || "Workshop Strategico Custom",
              expert: topExperts[1]?.expert.name || "Ivano Sciretta",
              description: `${topExperts[1]?.expert.courses[0]?.description || "Definizione dei workflow operativi per il team."} Customizzato per risolvere direttamente la sfida: "${cleanedInput}".`
            },
            {
              time: "20:30",
              title: topExperts[1]?.expert.courses[1]?.title || "Storytelling & Metafora Creativa",
              expert: topExperts[1]?.expert.name || "Roberto Casalino",
              description: `${topExperts[1]?.expert.courses[1]?.description || "Laboratorio per tradurre i valori in parole."} Incentrato sui temi emersi durante il workshop.`
            }
          ]
        },
        {
          dayNumber: 3,
          theme: "Fase 03: Presenza, Autorevolezza e Rilascio",
          focus: "Affinare la leadership consapevole, la comunicazione e ratificare i KPI post-retreat.",
          activities: [
            {
              time: "09:30",
              title: topExperts[2]?.expert.courses[0]?.title || "Presenza Organizzativa & Portamento",
              expert: topExperts[2]?.expert.name || "Sonia Perrone",
              description: `${topExperts[2]?.expert.courses[0]?.description || "Sviluppo della presenza corporea e comunicazione non verbale per manager."}`
            },
            {
              time: "11:30",
              title: "YOU LEAD & Problem Solving Strategico",
              expert: "Luigi Gallo",
              description: `Sessione conclusiva con Luigi Gallo per consolidare l'adozione delle soluzioni ed impostare i KPI direzionali per: "${cleanedInput}".`
            },
            {
              time: "15:00",
              title: "Closing Circle & Consegna Report Preconfigurato",
              expert: "Team Lumina",
              description: "Closing circle e scaricamento della prima proposta per i dipartimenti e l'approvazione del budget."
            }
          ]
        }
      ]

      // 6. Generate custom ROI impacts based on active categories
      const roiImpact: string[] = []
      if (clusters.find(c => c.id === 'LEARN')?.active) {
        roiImpact.push("Efficienza Operativa: Risparmio fino al 70% dei tempi di data-entry e preventivazione grazie alle automazioni AI integrate.")
      }
      if (clusters.find(c => c.id === 'SENSE')?.active) {
        roiImpact.push("Riduzione dello Stress: Miglioramento della postura fisica e gestione del burn-out per aumentare la fidelizzazione dei dipendenti.")
      }
      if (clusters.find(c => c.id === 'PLAY')?.active) {
        roiImpact.push("Coesione del Gruppo: Sviluppo di fiducia reciproca reale e sincronia operativa testata sul campo da trainer olimpici.")
      }
      if (clusters.find(c => c.id === 'IMMERSIVE')?.active) {
        roiImpact.push("Fidelizzazione e Leadership: Consolidamento del posizionamento aziendale e del senso di appartenenza tramite esperienze memorabili.")
      }
      if (roiImpact.length === 0) {
        roiImpact.push("Ottimizzazione delle soft skills e allineamento operativo del team di lavoro.")
      }

      // Calculate global match score: average score of top experts
      const globalMatchScore = Math.round(
        topExperts.reduce((sum, te) => sum + te.score, 0) / Math.max(topExperts.length, 1)
      )

      // Generate 3 Strategic Pillars — sector-aware, McKinsey-grade language
      const framing = SECTOR_FRAMING[sector] || SECTOR_FRAMING.default
      const topExpertNames = topExperts.map(te => te.expert.name)

      // Build expert rationale strings specific to this sector
      const expertRationales = topExperts.map((te) => {
        const r = EXPERT_RATIONALE[te.expert.name]?.[sector] || EXPERT_RATIONALE[te.expert.name]?.default || ''
        return r ? `${te.expert.name}: ${r}.` : ''
      }).filter(Boolean).join(' ')

      const strategicPillars: StrategicPillar[] = [
        {
          id: 'diagnosis',
          title: 'Cosa abbiamo capito',
          subtitle: 'La nostra lettura della vostra situazione',
          body: sanitizeCorporateLanguage(
            `${framing.diagnosisOpener} ` +
            `${secondary ? `Oltre a questo, il vostro team ha bisogno anche di ${CLUSTER_DIAGNOSTIC[secondary.id]?.need || 'supporto su altri fronti'}.` : ''} ` +
            `Se non si interviene in modo strutturato, questa situazione tende a peggiorare nei mesi successivi. Per questo vi proponiamo un percorso mirato, non un evento generico.`
          ),
        },
        {
          id: 'impact',
          title: 'Cosa cambia dopo',
          subtitle: 'I risultati che potete aspettarvi',
          body: sanitizeCorporateLanguage(
            `${framing.impactMetrics} ` +
            `${roiImpact[0] || ''} ` +
            `I nostri percorsi producono un miglioramento medio del 28% nell'engagement del team rispetto alla formazione tradizionale — lo misuriamo con questionari anonimi a 30 e 60 giorni dal percorso. ` +
            `Al termine ricevete un report chiaro con i risultati misurati, il confronto prima/dopo e le raccomandazioni per i passi successivi.`
          ),
        },
        {
          id: 'tailoring',
          title: 'Chi lavora con voi',
          subtitle: `${topExpertNames.length} professionisti scelti per la vostra situazione`,
          body: sanitizeCorporateLanguage(
            `${framing.tailoringAngle} ` +
            `${context.echoPhrase.length > 5 ? `Per affrontare la situazione che ci avete descritto — "${context.echoPhrase.substring(0, 60)}${context.echoPhrase.length > 60 ? '...' : ''}" — a` : 'A'}bbiamo selezionato ${topExpertNames.join(', ')}. ` +
            `${expertRationales} ` +
            `${context.hasTriedBefore ? 'A differenza delle esperienze che avete gia\' fatto, questi professionisti non usano moduli standard. ' : ''}` +
            `Ogni esperto adatta il proprio metodo alla vostra realta' concreta, con strumenti pratici da usare dal giorno dopo.`
          ),
        },
      ]

      const blueprint: GeneratedBlueprint = {
        title: cleanedInput.substring(0, 50) + (cleanedInput.length > 50 ? '...' : ''),
        summary: sanitizeCorporateLanguage(`Un percorso costruito sulla vostra sfida concreta. Non un evento generico, ma un intervento strutturato con professionisti selezionati per produrre risultati che potete misurare e presentare alla direzione.`),
        primaryFocus: primaryCluster.label,
        days: itineraryDays,
        matchScore: globalMatchScore,
        roiImpact: roiImpact,
        diagnosticInsight,
        strategicPillars,
        detectedSector: sector,
      }

      set({
        activeClusters: clusters,
        generatedBlueprint: blueprint,
        detectedSector: sector,
        isGenerating: false,
        hasResults: true
      })
    }, 1500)
  },

  setSelectedExpert: (expert) => set({ selectedExpert: expert }),
  setPlayingAudio: (track) => set({ playingAudio: track, audioProgress: 0, currentTranscriptLine: 0 }),
  setAudioProgress: (progress) => set({ audioProgress: progress }),
  setCurrentTranscriptLine: (line) => set({ currentTranscriptLine: line }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setPreMatchedExperts: (experts) => set({ preMatchedExperts: experts }),
  toggleCourse: (course) => set((s) => {
    const exists = s.selectedCourses.some(c => c.expertName === course.expertName && c.courseTitle === course.courseTitle)
    return {
      selectedCourses: exists
        ? s.selectedCourses.filter(c => !(c.expertName === course.expertName && c.courseTitle === course.courseTitle))
        : [...s.selectedCourses, course]
    }
  }),
  toggleVideoBackground: () => set((s) => ({ videoBackgroundActive: !s.videoBackgroundActive })),

  reset: () =>
    set({
      challengeInput: '',
      activeClusters: INITIAL_CLUSTERS.map((c) => ({ ...c, experts: c.experts.map((e) => ({ ...e })) })),
      isGenerating: false,
      hasResults: false,
      selectedExpert: null,
      playingAudio: null,
      audioProgress: 0,
      currentTranscriptLine: 0,
      generatedBlueprint: null,
      selectedPackage: null,
      preMatchedExperts: [],
      detectedSector: 'default' as DetectedSector,
      selectedCourses: [],
    }),
}), {
  name: 'lumina-xp-session',
  storage: createJSONStorage(() => sessionStorage),
  // Only persist business-critical data — not UI state or audio
  partialize: (state) => ({
    challengeInput: state.challengeInput,
    activeClusters: state.activeClusters,
    hasResults: state.hasResults,
    generatedBlueprint: state.generatedBlueprint,
    detectedSector: state.detectedSector,
    selectedPackage: state.selectedPackage,
  }),
}))
