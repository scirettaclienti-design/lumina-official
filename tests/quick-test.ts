import { detectSector, detectIntentExperts, getExpertMatchScore, EXPERTS_DATA } from '../src/store/useLuminaStore'

const scenarios = [
  'Il mio team commerciale non raggiunge i target e c\'è tensione tra vendite e marketing',
  'Vogliamo organizzare un retreat aziendale per 40 persone sul Lago di Como',
  'I nuovi assunti non si integrano, il turnover è al 30% e il clima è pessimo',
  'Il reparto IT lavora troppo, le deadline saltano e nessuno comunica con il business',
  'Siamo una startup fintech, cresciamo velocemente ma la cultura aziendale si sta perdendo',
  'I manager non sanno gestire i conflitti e il team è frammentato in silos',
  'Dobbiamo motivare 80 persone dopo una ristrutturazione aziendale difficile',
]

console.log('\n=== TEST QUALITA\' ANALISI — 7 SCENARI ===\n')

let totalAvg = 0

scenarios.forEach((input, i) => {
  const sector = detectSector(input)
  const experts = detectIntentExperts(input)
  const scores = EXPERTS_DATA.map(e => ({
    name: e.name,
    score: getExpertMatchScore(input, e),
  })).sort((a, b) => b.score - a.score)

  const top3avg = Math.round(scores.slice(0, 3).reduce((s, e) => s + e.score, 0) / 3)
  totalAvg += top3avg

  console.log(`Scenario ${i + 1}: "${input.substring(0, 65)}..."`)
  console.log(`  Settore: ${sector}`)
  console.log(`  Pre-match: ${experts.join(', ') || 'nessuno'}`)
  console.log(`  Top 3: ${scores.slice(0, 3).map(e => `${e.name} ${e.score}%`).join(' | ')}`)
  console.log(`  Media top 3: ${top3avg}%`)
  console.log(`  ${top3avg >= 70 ? '✓ SOPRA SOGLIA' : '✗ SOTTO SOGLIA 70%'}`)
  console.log()
})

const globalAvg = Math.round(totalAvg / scenarios.length)
console.log(`=== MEDIA GLOBALE: ${globalAvg}% ${globalAvg >= 70 ? '✓' : '✗'} ===`)
