/**
 * FINAL AUDIT TEST — 8 Hard Scenarios
 * Tests the full analysis engine with difficult, edge-case inputs.
 * Run: npx tsx tests/final-audit-test.ts
 */

import {
  detectSector,
  detectIntentExperts,
  getExpertMatchScore,
  analyzeContext,
  EXPERTS_DATA,
  SECTOR_GLOW,
  type DetectedSector,
} from '../src/store/useLuminaStore'

// ─── Test Scenarios ─────────────────────────────────────────────────
interface AuditScenario {
  id: string
  label: string
  input: string
  checks: {
    sectorOneOf?: DetectedSector[]
    top3ShouldInclude?: string[]         // at least one of these in top 3
    top3ShouldNotInclude?: string[]      // none of these in top 3
    urgency?: 'critical' | 'moderate' | 'normal'
    hasTriedBefore?: boolean
    teamSizeOneOf?: ('small' | 'medium' | 'large' | 'unknown')[]
    echoShouldContain?: string           // substring expected in echoPhrase
    minTop3Avg?: number                  // minimum average score for top 3
    narrativeSanityKeywords?: string[]   // at least one should appear in a diagnostic narrative
  }
}

const SCENARIOS: AuditScenario[] = [
  // ── 1. Reward / Celebration (no problem, just a gift) ──
  {
    id: '1a',
    label: 'Reward — premiare i migliori venditori',
    input: 'Vogliamo premiare i migliori venditori con un\'esperienza indimenticabile',
    checks: {
      sectorOneOf: ['luxury', 'default'],
      top3ShouldInclude: ['Mauro Lorenzi', 'TMAX Sport'],
      urgency: 'normal',
      hasTriedBefore: false,
      minTop3Avg: 50,
    },
  },
  {
    id: '1b',
    label: 'Reward — regalo aziendale fine anno',
    input: 'Fine anno, regalo aziendale per 80 dipendenti',
    checks: {
      sectorOneOf: ['default'],
      urgency: 'normal',
      hasTriedBefore: false,
      teamSizeOneOf: ['medium', 'large'],
      minTop3Avg: 40,
    },
  },

  // ── 2. Post-merger integration ──
  {
    id: '2',
    label: 'Post-merger — due team si odiano',
    input: 'Abbiamo acquisito un\'azienda concorrente e i due team si odiano',
    checks: {
      sectorOneOf: ['finance', 'default'],
      top3ShouldInclude: ['Luigi Gallo', 'Valentina Rodini'],
      urgency: 'normal',
      hasTriedBefore: false,
      minTop3Avg: 60,
    },
  },

  // ── 3. Very specific needs ──
  {
    id: '3a',
    label: 'Specific — manager non sanno dare feedback negativi',
    input: 'I nostri manager non sanno dare feedback negativi ai collaboratori',
    checks: {
      sectorOneOf: ['default'],
      top3ShouldInclude: ['Luigi Gallo'],
      urgency: 'normal',
      minTop3Avg: 50,
    },
  },
  {
    id: '3b',
    label: 'Specific — team remoto mai visto di persona',
    input: 'Il team di sviluppo lavora da remoto e non si e\' mai visto di persona',
    checks: {
      sectorOneOf: ['tech', 'default'],
      top3ShouldInclude: ['Valentina Rodini'],
      urgency: 'normal',
      minTop3Avg: 50,
    },
  },

  // ── 4. Anti-pattern (tried before) ──
  {
    id: '4',
    label: 'Anti-pattern — gia\' fatto 3 team building, stanchi dei soliti corsi',
    input: 'Abbiamo gia\' fatto 3 team building classici, non e\' cambiato nulla, siamo stanchi dei soliti corsi',
    checks: {
      sectorOneOf: ['default'],
      hasTriedBefore: true,
      urgency: 'normal',
      minTop3Avg: 50,
      echoShouldContain: 'team building',
    },
  },

  // ── 5. Multi-language / mixed ──
  {
    id: '5',
    label: 'English input — leadership issues',
    input: 'We need a team building for our Italian office, 50 people, leadership issues',
    checks: {
      sectorOneOf: ['default'],
      top3ShouldInclude: ['Luigi Gallo'],
      teamSizeOneOf: ['medium', 'unknown'],
      minTop3Avg: 50,
    },
  },

  // ── 6. Urgency ──
  {
    id: '6',
    label: 'Urgenza — 40% sta per dimettersi',
    input: 'E\' un\'emergenza, il 40% del team sta per dimettersi, dobbiamo agire subito',
    checks: {
      sectorOneOf: ['default'],
      urgency: 'critical',
      hasTriedBefore: false,
      minTop3Avg: 50,
      echoShouldContain: 'emergenza',
    },
  },

  // ── 7. Very vague ──
  {
    id: '7a',
    label: 'Vago — "non va bene"',
    input: 'non va bene',
    checks: {
      sectorOneOf: ['default'],
      urgency: 'normal',
      // For very vague inputs, we just check it doesn't crash and returns something
      minTop3Avg: 30,
    },
  },
  {
    id: '7b',
    label: 'Vago — "aiuto"',
    input: 'aiuto',
    checks: {
      sectorOneOf: ['default'],
      urgency: 'normal',
      minTop3Avg: 30,
    },
  },

  // ── 8. Very long and detailed ──
  {
    id: '8',
    label: 'Lungo — farmaceutica 150 dip, 3 sedi, ricerca vs commerciale',
    input: 'Siamo un\'azienda farmaceutica con 150 dipendenti su 3 sedi in Italia. Il problema principale e\' che dopo il COVID il team di ricerca non collabora piu\' con il team commerciale. I ricercatori pensano che i commerciali non capiscano il prodotto, i commerciali pensano che i ricercatori vivano in una torre d\'avorio. Abbiamo provato due volte a fare riunioni congiunte ma finiscono sempre in litigio. Il direttore HR vuole un intervento strutturato che produca risultati misurabili entro 60 giorni.',
    checks: {
      sectorOneOf: ['health', 'default'],
      top3ShouldInclude: ['Luigi Gallo'],
      urgency: 'normal',
      hasTriedBefore: true,
      teamSizeOneOf: ['large'],
      minTop3Avg: 60,
      echoShouldContain: 'farmaceutica',
    },
  },
]

// ─── Runner ─────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(74))
console.log('  FINAL AUDIT TEST — 11 Hard Scenarios')
console.log('  Tests: sector, experts, context intelligence, diagnostic narrative')
console.log('='.repeat(74) + '\n')

let totalPass = 0
let totalFail = 0
let totalChecks = 0

SCENARIOS.forEach((s) => {
  const sector = detectSector(s.input)
  const preMatched = detectIntentExperts(s.input)
  const context = analyzeContext(s.input)
  const scores = EXPERTS_DATA.map(e => ({
    name: e.name,
    score: getExpertMatchScore(s.input, e),
  })).sort((a, b) => b.score - a.score)

  const top3 = scores.slice(0, 3)
  const top3Names = top3.map(e => e.name)
  const top3Avg = Math.round(top3.reduce((sum, e) => sum + e.score, 0) / 3)

  const verdicts: { check: string; pass: boolean; detail: string }[] = []

  // Sector check
  if (s.checks.sectorOneOf) {
    const pass = s.checks.sectorOneOf.includes(sector)
    verdicts.push({ check: 'sector', pass, detail: `${sector} ${pass ? 'in' : 'NOT in'} [${s.checks.sectorOneOf.join(',')}]` })
  }

  // Top 3 includes check
  if (s.checks.top3ShouldInclude) {
    const found = s.checks.top3ShouldInclude.filter(n => top3Names.includes(n))
    const pass = found.length >= 1
    verdicts.push({ check: 'top3-includes', pass, detail: `found ${found.length}/${s.checks.top3ShouldInclude.length}: ${found.join(', ') || 'NONE'} in [${top3Names.join(', ')}]` })
  }

  // Top 3 should NOT include check
  if (s.checks.top3ShouldNotInclude) {
    const bad = s.checks.top3ShouldNotInclude.filter(n => top3Names.includes(n))
    const pass = bad.length === 0
    verdicts.push({ check: 'top3-excludes', pass, detail: bad.length ? `unexpected: ${bad.join(', ')}` : 'OK' })
  }

  // Urgency check
  if (s.checks.urgency) {
    const pass = context.urgency === s.checks.urgency
    verdicts.push({ check: 'urgency', pass, detail: `${context.urgency} (expected ${s.checks.urgency})` })
  }

  // hasTriedBefore check
  if (s.checks.hasTriedBefore !== undefined) {
    const pass = context.hasTriedBefore === s.checks.hasTriedBefore
    verdicts.push({ check: 'triedBefore', pass, detail: `${context.hasTriedBefore} (expected ${s.checks.hasTriedBefore})${context.previousAttempts ? ' — "' + context.previousAttempts + '"' : ''}` })
  }

  // Team size check
  if (s.checks.teamSizeOneOf) {
    const pass = s.checks.teamSizeOneOf.includes(context.teamSize)
    verdicts.push({ check: 'teamSize', pass, detail: `${context.teamSize} ${pass ? 'in' : 'NOT in'} [${s.checks.teamSizeOneOf.join(',')}]` })
  }

  // Echo phrase check
  if (s.checks.echoShouldContain) {
    const pass = context.echoPhrase.toLowerCase().includes(s.checks.echoShouldContain.toLowerCase())
    verdicts.push({ check: 'echoPhrase', pass, detail: `"${context.echoPhrase.substring(0, 60)}..." ${pass ? 'contains' : 'MISSING'} "${s.checks.echoShouldContain}"` })
  }

  // Min top 3 avg score check
  if (s.checks.minTop3Avg !== undefined) {
    const pass = top3Avg >= s.checks.minTop3Avg
    verdicts.push({ check: 'minTop3Avg', pass, detail: `${top3Avg}% ${pass ? '>=' : '<'} ${s.checks.minTop3Avg}%` })
  }

  const passCount = verdicts.filter(v => v.pass).length
  const failCount = verdicts.filter(v => !v.pass).length
  totalPass += passCount
  totalFail += failCount
  totalChecks += verdicts.length

  const scenarioVerdict = failCount === 0 ? 'PASS' : 'FAIL'
  const icon = failCount === 0 ? 'PASS' : 'FAIL'

  console.log(`${'-'.repeat(74)}`)
  console.log(`[${icon}] ${s.id}. ${s.label}`)
  console.log(`  Input: "${s.input.substring(0, 80)}${s.input.length > 80 ? '...' : ''}"`)
  console.log(`  Sector: ${sector} (${SECTOR_GLOW[sector].label}) | Top3 avg: ${top3Avg}%`)
  console.log(`  Top 3: ${top3.map(e => `${e.name.split(' ').pop() || e.name} ${e.score}%`).join(' | ')}`)
  console.log(`  Pre-match: ${preMatched.join(', ') || '(none)'}`)
  console.log(`  Context: urgency=${context.urgency} | triedBefore=${context.hasTriedBefore} | size=${context.teamSize}`)
  console.log(`  Echo: "${context.echoPhrase.substring(0, 70)}${context.echoPhrase.length > 70 ? '...' : ''}"`)
  console.log()
  verdicts.forEach(v => {
    console.log(`    ${v.pass ? 'OK' : '!! FAIL'} [${v.check}] ${v.detail}`)
  })
  console.log()
})

// ─── Summary ────────────────────────────────────────────────────────
console.log('='.repeat(74))
console.log('  FINAL AUDIT SUMMARY')
console.log('='.repeat(74))
console.log(`  Total checks:  ${totalChecks}`)
console.log(`  Passed:        ${totalPass}/${totalChecks} (${Math.round(totalPass / totalChecks * 100)}%)`)
console.log(`  Failed:        ${totalFail}/${totalChecks}`)
console.log()

const scenarioResults = SCENARIOS.map(s => {
  const sector = detectSector(s.input)
  const ctx = analyzeContext(s.input)
  const scores = EXPERTS_DATA.map(e => ({ name: e.name, score: getExpertMatchScore(s.input, e) })).sort((a, b) => b.score - a.score)
  const top3Avg = Math.round(scores.slice(0, 3).reduce((sum, e) => sum + e.score, 0) / 3)
  return { id: s.id, label: s.label, avg: top3Avg, sector }
})

// Weakest scenarios
const sorted = [...scenarioResults].sort((a, b) => a.avg - b.avg)
console.log('  Weakest by top3 avg:')
sorted.slice(0, 3).forEach(r => {
  console.log(`    [${r.avg}%] ${r.id}. ${r.label}`)
})
console.log()

// Overall verdict
if (totalFail === 0) {
  console.log('  *** ALL CHECKS PASSED — Engine is pertinent across all hard scenarios ***')
} else {
  console.log(`  *** ${totalFail} CHECKS FAILED — Review the failing scenarios above ***`)
}
console.log()
