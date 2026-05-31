import type { GeneratedBlueprint, DetectedSector } from '../store/useLuminaStore'
import { SECTOR_GLOW, EXPERTS_DATA } from '../store/useLuminaStore'

const SECTOR_HEX: Record<DetectedSector, [number, number, number]> = {
  tech:          [59, 130, 246],
  luxury:        [212, 175, 55],
  finance:       [148, 163, 184],
  health:        [52, 211, 153],
  manufacturing: [251, 146, 60],
  default:       [212, 175, 55],
}

function newPage(doc: any, w: number, h: number) {
  doc.addPage()
  doc.setFillColor(14, 20, 36)
  doc.rect(0, 0, w, h, 'F')
}

export async function generateBlueprintPdf(
  blueprint: GeneratedBlueprint,
  _challengeInput?: string,
) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.setFont('helvetica', 'normal')

  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()
  const accent = SECTOR_HEX[blueprint.detectedSector] || SECTOR_HEX.default
  const sectorLabel = SECTOR_GLOW[blueprint.detectedSector]?.label || 'Enterprise'
  const margin = 25
  const contentW = w - margin * 2

  // ═══ PAGE 1: Cover ═══
  doc.setFillColor(14, 20, 36)
  doc.rect(0, 0, w, h, 'F')

  // Gold accent line at top
  doc.setDrawColor(...accent)
  doc.setLineWidth(1)
  doc.line(margin, 20, w - margin, 20)

  // Logo placeholder
  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('LUMINA XP', margin, 38)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('ADAPTIVE EXPERIENCE PLATFORM', margin, 44)

  // Title — the user's challenge
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  const titleLines = doc.splitTextToSize(blueprint.title, contentW)
  doc.text(titleLines, margin, 70)

  // Subtitle
  let y = 70 + titleLines.length * 8 + 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  const summaryLines = doc.splitTextToSize(blueprint.summary, contentW)
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 4.5 + 10

  // Key metrics row
  doc.setDrawColor(40, 45, 60)
  doc.setLineWidth(0.2)
  doc.line(margin, y, w - margin, y)
  y += 8

  // Match score
  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(`${blueprint.matchScore}%`, margin, y + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.text('COMPATIBILITA\'', margin, y + 13)

  // Sector
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(9)
  doc.text(`Settore: ${sectorLabel}`, margin + 50, y + 5)
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, margin + 50, y + 10)
  doc.text(`Focus: ${blueprint.primaryFocus}`, margin + 50, y + 15)

  // ═══ PAGE 2: Diagnosi ═══
  newPage(doc, w, h)
  y = 25

  doc.setDrawColor(...accent)
  doc.setLineWidth(0.5)
  doc.line(margin, y, w - margin, y)
  y += 10

  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('SEZIONE 1', margin, y)
  y += 6

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('Vi abbiamo ascoltato.', margin, y)
  doc.setFont('helvetica', 'normal')
  y += 10

  doc.setTextColor(190, 190, 190)
  doc.setFontSize(9)
  const diagLines = doc.splitTextToSize(blueprint.diagnosticInsight.narrative, contentW)
  doc.text(diagLines, margin, y)
  y += diagLines.length * 4.5 + 12

  // Cluster breakdown
  doc.setTextColor(...accent)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('ANALISI DEI VETTORI', margin, y)
  y += 7

  blueprint.diagnosticInsight.clusterBreakdown.forEach((cb) => {
    doc.setTextColor(200, 200, 200)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(cb.label, margin, y)

    doc.setTextColor(...accent)
    doc.setFont('helvetica', 'bold')
    doc.text(`${cb.percent}%`, margin + 55, y)

    // Bar
    doc.setFillColor(30, 35, 50)
    doc.roundedRect(margin + 65, y - 2.5, 60, 3, 1, 1, 'F')
    doc.setFillColor(...accent)
    doc.roundedRect(margin + 65, y - 2.5, (60 * cb.percent) / 100, 3, 1, 1, 'F')

    y += 7
  })

  // ═══ PAGE 2 continued: Esperti selezionati ═══
  y += 10
  doc.setDrawColor(40, 45, 60)
  doc.line(margin, y, w - margin, y)
  y += 10

  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('SEZIONE 2', margin, y)
  y += 6

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('Chi si occupera\' di voi.', margin, y)
  y += 10

  // Extract top experts
  const expertNames = new Set<string>()
  blueprint.days.forEach(d => d.activities.forEach(a => {
    if (a.expert !== 'Team Lumina') expertNames.add(a.expert)
  }))

  Array.from(expertNames).slice(0, 3).forEach((name) => {
    if (y > h - 35) { newPage(doc, w, h); y = 25 }

    const expert = EXPERTS_DATA.find(e => e.name === name)
    if (!expert) return

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(name, margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text(expert.role, margin, y + 4.5)

    y += 10
    doc.setTextColor(180, 180, 180)
    doc.setFontSize(8)
    const bioLines = doc.splitTextToSize(expert.bio.substring(0, 200), contentW)
    doc.text(bioLines, margin, y)
    y += bioLines.length * 4 + 8
  })

  // ═══ PAGE 3: Prossimi passi ═══
  newPage(doc, w, h)
  y = 25

  doc.setDrawColor(...accent)
  doc.setLineWidth(0.5)
  doc.line(margin, y, w - margin, y)
  y += 10

  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('SEZIONE 3', margin, y)
  y += 6

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('I prossimi passi, insieme.', margin, y)
  y += 12

  const steps = [
    { time: 'Entro 48 ore', desc: 'Un consulente Lumina vi contatta per validare l\'analisi e personalizzare il percorso sulla vostra realta\' concreta.' },
    { time: 'Entro 2 settimane', desc: 'Ricevete la proposta esecutiva completa con date, location, esperti confermati e preventivo dettagliato.' },
    { time: 'Il percorso', desc: `${blueprint.days.length} giorni di intervento diretto con i professionisti selezionati, seguiti da follow-up a 30 e 60 giorni con survey di impatto.` },
  ]

  steps.forEach((step) => {
    doc.setTextColor(...accent)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(step.time, margin, y)
    y += 5

    doc.setTextColor(190, 190, 190)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const stepLines = doc.splitTextToSize(step.desc, contentW)
    doc.text(stepLines, margin, y)
    y += stepLines.length * 4 + 8
  })

  // ROI
  y += 5
  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('IMPATTO ATTESO', margin, y)
  y += 7

  blueprint.roiImpact.forEach((impact) => {
    if (y > h - 20) { newPage(doc, w, h); y = 25 }
    doc.setTextColor(180, 180, 180)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const lines = doc.splitTextToSize(`• ${impact}`, contentW)
    doc.text(lines, margin, y)
    y += lines.length * 4 + 3
  })

  // ═══ Footer on every page ═══
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(40, 45, 60)
    doc.setLineWidth(0.2)
    doc.line(margin, h - 15, w - margin, h - 15)
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    doc.text('Lumina XP — Riservato alla Direzione Esecutiva', margin, h - 10)
    doc.text(`${i} / ${totalPages}`, w - margin, h - 10, { align: 'right' })
  }

  doc.save(`Lumina_XP_Blueprint_${Date.now()}.pdf`)
}
