// Lightweight analytics event tracker
// In production, replace with GA4, Mixpanel, or Segment

interface AnalyticsEvent {
  event: string
  properties?: Record<string, string | number | boolean>
}

const events: AnalyticsEvent[] = []

export function trackEvent(event: string, properties?: Record<string, string | number | boolean>) {
  const entry: AnalyticsEvent = { event, properties }
  events.push(entry)

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, properties || '')
  }

  // In production, send to your analytics endpoint:
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(entry) })
}

// Predefined event helpers
export const analytics = {
  categorySelected: (category: string) => trackEvent('category_selected', { category }),
  challengeSubmitted: (input: string, sector: string) => trackEvent('challenge_submitted', { inputLength: input.length, sector }),
  expertClicked: (name: string) => trackEvent('expert_clicked', { name }),
  blueprintGenerated: (matchScore: number, sector: string) => trackEvent('blueprint_generated', { matchScore, sector }),
  pdfDownloaded: (sector: string) => trackEvent('pdf_downloaded', { sector }),
  whatsappClicked: () => trackEvent('whatsapp_clicked'),
  audioPlayed: (track: string) => trackEvent('audio_played', { track }),
  packageSelected: (tier: string) => trackEvent('package_selected', { tier }),
  formSubmitted: () => trackEvent('form_submitted'),
  courseExpanded: (title: string, expert: string) => trackEvent('course_expanded', { title, expert }),
}
