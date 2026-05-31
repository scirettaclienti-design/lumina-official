import { analyzeContext } from '../src/store/useLuminaStore'

console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log('║  CONTEXT INTELLIGENCE TEST                              ║')
console.log('╚══════════════════════════════════════════════════════════╝\n')

const tests = [
  { input: 'È urgente, il team sta collassando e non possiamo più aspettare', expectUrgency: 'critical' },
  { input: 'La situazione è critica, stiamo perdendo clienti ogni giorno', expectUrgency: 'moderate' },
  { input: 'Vorremmo migliorare la comunicazione nel team', expectUrgency: 'normal' },
  { input: 'Abbiamo già provato un team building ma non ha funzionato', expectTriedBefore: true },
  { input: 'Siamo stanchi dei soliti corsi, servono risultati concreti', expectTriedBefore: true },
  { input: 'Il team non funziona: 50-100 dipendenti', expectSize: 'medium' },
  { input: 'Siamo una startup con meno di 20 persone', expectSize: 'small' },
  { input: 'Enterprise oltre 100 dipendenti su 3 sedi', expectSize: 'large' },
]

tests.forEach((t, i) => {
  const ctx = analyzeContext(t.input)
  const checks: string[] = []

  if (t.expectUrgency && ctx.urgency === t.expectUrgency) checks.push(`urgency=${ctx.urgency} ✓`)
  else if (t.expectUrgency) checks.push(`urgency=${ctx.urgency} ✗ (expected ${t.expectUrgency})`)

  if (t.expectTriedBefore !== undefined) {
    if (ctx.hasTriedBefore === t.expectTriedBefore) checks.push(`triedBefore=${ctx.hasTriedBefore} ✓`)
    else checks.push(`triedBefore=${ctx.hasTriedBefore} ✗`)
    if (ctx.previousAttempts) checks.push(`"${ctx.previousAttempts}"`)
  }

  if (t.expectSize && ctx.teamSize === t.expectSize) checks.push(`size=${ctx.teamSize} ✓`)
  else if (t.expectSize) checks.push(`size=${ctx.teamSize} ✗ (expected ${t.expectSize})`)

  console.log(`${i + 1}. "${t.input.substring(0, 55)}..."`)
  console.log(`   Echo: "${ctx.echoPhrase.substring(0, 50)}..."`)
  console.log(`   ${checks.join(' | ')}`)
  console.log()
})
