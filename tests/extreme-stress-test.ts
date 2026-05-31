import { detectSector, detectIntentExperts, getExpertMatchScore, EXPERTS_DATA } from '../src/store/useLuminaStore'

// 30 scenari — include input vaghi, corti, con errori, settori misti, linguaggio colloquiale
const scenarios = [
  // ── LINGUAGGIO COLLOQUIALE (come parla un CEO al telefono) ──
  'i miei non lavorano bene',
  'ho bisogno di qualcosa per il team',
  'non so cosa fare con questi dipendenti',
  'voglio cambiare le cose in azienda',
  'c\'è un problema tra i reparti',
  // ── SETTORI SPECIFICI ──
  'gestisco un hotel di lusso e lo staff non sa accogliere i clienti VIP',
  'siamo una banca e dopo la fusione i due team non collaborano',
  'la mia startup tech cresce ma il team dev è in burnout totale',
  'ho una fabbrica e gli operai sono demotivati, il turnover è alto',
  'gestisco una clinica e il personale sanitario è esausto',
  // ── RICHIESTE SPECIFICHE ──
  'voglio un retreat sul Lago di Como per 60 dirigenti',
  'mi serve un corso di public speaking per i miei commerciali',
  'voglio integrare l\'intelligenza artificiale nei nostri processi',
  'ho bisogno di un team building sportivo con un campione famoso',
  'mi serve qualcuno che insegni ai manager a gestire il tempo',
  // ── FRASI MOLTO CORTE ──
  'team rotto',
  'stress',
  'leadership',
  'evento Roma',
  'AI formazione',
  // ── FRASI MOLTO LUNGHE ──
  'La nostra azienda ha 200 dipendenti distribuiti su 3 sedi in Italia, il problema principale è che i team non comunicano, ci sono silos informativi, i manager non sanno delegare e il morale è bassissimo dopo un anno di ristrutturazione',
  'Siamo un\'agenzia di comunicazione digitale con 30 persone, lavoriamo da remoto, il CEO vuole fare un evento che unisca il team e che non sia il solito aperitivo, qualcosa di davvero trasformativo',
  // ── EDGE CASES OSTILI ──
  'boh non so',
  'ciao',
  'test',
  // ── FLUSSO COMPLETO SIMULATO (categoria + dettagli + risposte) ──
  'Il team non funziona: Il reparto vendite non raggiunge gli obiettivi. In che settore opera la vostra azienda? Retail / Lusso / Moda / Vendita. Conflitti tra reparti e comunicazione a silos. 50–100 dipendenti',
  'Stress e burnout: I developer lavorano 12 ore al giorno e stanno mollando. In che settore opera la vostra azienda? Tech / Software / Digital / Startup. Reparto sviluppo, tech e IT con deadline continue. Si, il turnover è critico, perdiamo talenti',
  'La leadership è debole: I nuovi manager non sanno gestire i conflitti. In che settore opera la vostra azienda? Finance / Banca / Assicurazioni. Middle management e quadri intermedi. Gestione delle persone e intelligenza emotiva',
  'Evento trasformativo: Vogliamo un retreat memorabile. In che settore opera la vostra azienda? Industria / Produzione / Manifattura. Retreat immersivo 2–3 giorni in location esclusiva. 50–100 persone',
  'Serve innovazione: I processi sono da digitalizzare. In che settore opera la vostra azienda? Servizi / Consulenza / Altro. Processi interni, automazione e workflow operativi. Vogliamo formare tutti con AI e automazione operativa',
]

console.log('\n╔══════════════════════════════════════════════════════════════╗')
console.log('║  EXTREME STRESS TEST — 30 scenari (include ostili)         ║')
console.log('╚══════════════════════════════════════════════════════════════╝\n')

let totalAvg = 0
let above70 = 0
let above50 = 0
const results: Array<{ input: string; avg: number; sector: string }> = []

scenarios.forEach((input, i) => {
  const sector = detectSector(input)
  const scores = EXPERTS_DATA.map(e => ({
    name: e.name,
    score: getExpertMatchScore(input, e),
  })).sort((a, b) => b.score - a.score)

  const top3avg = Math.round(scores.slice(0, 3).reduce((s, e) => s + e.score, 0) / 3)
  totalAvg += top3avg
  if (top3avg >= 70) above70++
  if (top3avg >= 50) above50++
  results.push({ input, avg: top3avg, sector })

  const status = top3avg >= 70 ? '✓' : top3avg >= 50 ? '~' : '✗'
  const top3Names = scores.slice(0, 3).map(e => `${e.name.split(' ')[1] || e.name} ${e.score}%`).join(' | ')
  console.log(`${status} [${top3avg}%] "${input.substring(0, 60)}${input.length > 60 ? '...' : ''}"`)
  console.log(`  ${sector} → ${top3Names}`)
  console.log()
})

const globalAvg = Math.round(totalAvg / scenarios.length)

console.log('═'.repeat(62))
console.log(`  MEDIA GLOBALE:     ${globalAvg}%`)
console.log(`  Sopra 70%:         ${above70}/${scenarios.length} (${Math.round(above70/scenarios.length*100)}%)`)
console.log(`  Sopra 50%:         ${above50}/${scenarios.length} (${Math.round(above50/scenarios.length*100)}%)`)
console.log()

// Worst performers
console.log('  ── PEGGIORI 5 ──')
results.sort((a, b) => a.avg - b.avg).slice(0, 5).forEach(r => {
  console.log(`  [${r.avg}%] "${r.input.substring(0, 50)}..."`)
})
console.log()

// Best performers
console.log('  ── MIGLIORI 5 ──')
results.sort((a, b) => b.avg - a.avg).slice(0, 5).forEach(r => {
  console.log(`  [${r.avg}%] "${r.input.substring(0, 50)}..."`)
})
console.log()
