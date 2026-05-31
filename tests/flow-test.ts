import { detectSector, getExpertMatchScore, EXPERTS_DATA } from '../src/store/useLuminaStore'

// Simulate the EXACT flow a user would go through:
// Category → Details → 3 Questions → enriched prompt

// Simulates the NEW prompt format: cat.label + cat.desc + details + answers (no questions)
const flows = [
  {
    label: 'Team → Retail → Conflitti → 20-50',
    catLabel: 'Il team non funziona',
    catDesc: 'Tensioni, silos, mancanza di fiducia o coesione tra le persone',
    details: 'I miei dipendenti non collaborano e il clima è teso',
    answers: [
      'Retail / Lusso / Moda / Vendita',
      'Conflitti tra reparti e comunicazione a silos',
      '15–50 dipendenti',
    ],
  },
  {
    label: 'Burnout → Tech → IT → Turnover',
    catLabel: 'Stress e burnout',
    catDesc: 'Team esausto, turnover alto, energia bassa, produttivita\' in calo',
    details: 'Il team è esausto e lavora troppo',
    answers: [
      'Tech / Software / Digital / Startup',
      'Reparto sviluppo, tech e IT con deadline continue',
      'Si, il turnover è critico, perdiamo talenti',
    ],
  },
  {
    label: 'Leadership → Finance → Middle mgmt',
    catLabel: 'La leadership è debole',
    catDesc: 'Manager reattivi, assenza di visione, comunicazione inefficace',
    details: 'I nostri manager non sanno gestire le persone',
    answers: [
      'Finance / Banca / Assicurazioni',
      'Middle management e quadri intermedi',
      'Gestione delle persone e intelligenza emotiva',
    ],
  },
  {
    label: 'Reward → Lusso → Sensoriale → 50',
    catLabel: 'Premiare il team',
    catDesc: 'Regalare un\'esperienza speciale come premio, incentivo o celebrazione',
    details: 'Vogliamo regalare qualcosa di speciale ai nostri migliori dipendenti',
    answers: [
      'Retail / Lusso / Moda / Vendita',
      'Esperienza sensoriale unica: profumi, gusto, benessere',
      '20–50 persone',
    ],
  },
  {
    label: 'Evento → Health → Retreat → 100',
    catLabel: 'Evento memorabile',
    catDesc: 'Retreat, convention o team building che lasci un segno reale e duraturo',
    details: 'Vogliamo organizzare un retreat per il nostro ospedale',
    answers: [
      'Healthcare / Farmaceutico / Sanita\'',
      'Retreat immersivo 2–3 giorni in location esclusiva',
      '50–100 persone',
    ],
  },
  {
    label: 'Innovation → Industria → Processi → AI',
    catLabel: 'Serve innovazione',
    catDesc: 'Processi lenti, resistenza al cambiamento, AI non adottata',
    details: 'I processi sono lenti e vecchi',
    answers: [
      'Industria / Produzione / Manifattura',
      'Processi interni, automazione e workflow operativi',
      'Non usa nessuno strumento di automazione o AI',
    ],
  },
]

console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log('║  FLOW TEST — Simulazione flusso completo utente        ║')
console.log('╚══════════════════════════════════════════════════════════╝\n')

let totalAvg = 0
let above70 = 0

flows.forEach((flow, i) => {
  // Build the same enriched prompt as the new Hero format
  const enrichedQuery = [flow.catLabel, flow.catDesc, flow.details, ...flow.answers].join('. ') + '.'

  const sector = detectSector(enrichedQuery)
  const scores = EXPERTS_DATA.map(e => ({
    name: e.name,
    score: getExpertMatchScore(enrichedQuery, e),
  })).sort((a, b) => b.score - a.score)

  const top3avg = Math.round(scores.slice(0, 3).reduce((s, e) => s + e.score, 0) / 3)
  totalAvg += top3avg
  if (top3avg >= 70) above70++

  console.log(`${top3avg >= 70 ? '✓' : '✗'} [${top3avg}%] ${flow.label}`)
  console.log(`  Settore: ${sector}`)
  console.log(`  Top 3: ${scores.slice(0, 3).map(e => `${e.name.split(' ')[1] || e.name} ${e.score}%`).join(' | ')}`)
  console.log(`  Prompt: "${enrichedQuery.substring(0, 80)}..."`)
  console.log()
})

const globalAvg = Math.round(totalAvg / flows.length)
console.log('═'.repeat(58))
console.log(`  Media: ${globalAvg}% | Sopra 70%: ${above70}/${flows.length} (${Math.round(above70/flows.length*100)}%)`)
console.log()
