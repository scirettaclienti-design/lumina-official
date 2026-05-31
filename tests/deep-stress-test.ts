import { detectSector, detectIntentExperts, getExpertMatchScore, EXPERTS_DATA } from '../src/store/useLuminaStore'

const scenarios = [
  // Linguaggio naturale — come parla un CEO reale
  'Ho 30 dipendenti in negozio e non vendono, il morale è a terra',
  'Dopo la pandemia il team non è più lo stesso, lavoriamo da remoto e siamo disconnessi',
  'Devo preparare i miei manager a gestire la Gen Z che entra in azienda',
  'Il nostro CTO si è dimesso e il team tech è nel panico',
  'Voglio fare un evento aziendale che non sia il solito paintball o escape room',
  'Ho un problema di assenteismo cronico nel reparto produzione',
  'I commerciali e il marketing si odiano, devo risolvere prima che perdiamo clienti',
  'Stiamo lanciando un nuovo prodotto e il team non è allineato sulla vision',
  'Il consiglio di amministrazione vuole vedere risultati sul clima aziendale entro 90 giorni',
  'Abbiamo appena assunto 15 persone e non riusciamo a farle integrare',
  // Edge cases — input vaghi o corti
  'team demotivato',
  'stress lavoro',
  'formazione manager',
  'evento aziendale 100 persone Roma',
  'migliorare comunicazione interna',
]

console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log('║  DEEP STRESS TEST — 15 scenari reali                   ║')
console.log('╚══════════════════════════════════════════════════════════╝\n')

let totalAvg = 0
let above70 = 0
let sectorHits = 0
const sectorExpected = ['luxury','default','default','tech','default','manufacturing','default','default','default','default','default','default','default','default','default']

scenarios.forEach((input, i) => {
  const sector = detectSector(input)
  const experts = detectIntentExperts(input)
  const scores = EXPERTS_DATA.map(e => ({
    name: e.name,
    score: getExpertMatchScore(input, e),
  })).sort((a, b) => b.score - a.score)

  const top3avg = Math.round(scores.slice(0, 3).reduce((s, e) => s + e.score, 0) / 3)
  totalAvg += top3avg
  if (top3avg >= 70) above70++

  const expertNames = scores.slice(0, 3).map(e => e.name.split(' ')[1] || e.name.split(' ')[0]).join(', ')

  console.log(`${top3avg >= 70 ? '✓' : '✗'} [${top3avg}%] "${input.substring(0, 55)}${input.length > 55 ? '...' : ''}"`)
  console.log(`  Settore: ${sector} | Esperti: ${expertNames}`)
  if (top3avg < 70) {
    console.log(`  ⚠ SOTTO SOGLIA — mancano stem per: ${input.split(/\s+/).filter(t => t.length > 3).join(', ')}`)
  }
  console.log()
})

const globalAvg = Math.round(totalAvg / scenarios.length)
console.log('═'.repeat(58))
console.log(`  Media globale: ${globalAvg}%`)
console.log(`  Sopra soglia 70%: ${above70}/${scenarios.length} (${Math.round(above70/scenarios.length*100)}%)`)
console.log(`  ${globalAvg >= 70 ? '✓ MOTORE CALIBRATO' : '✗ CALIBRAZIONE NECESSARIA'}`)
console.log()
