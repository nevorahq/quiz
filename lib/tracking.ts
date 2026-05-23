import type { PostHog } from 'posthog-js'

export interface QuizTrackingPayload {
  email: string
  score: number
  profile: string
  language: string
}

/**
 * Identifies the user in PostHog by email and fires quiz_submitted +
 * quiz_completed with full person properties.
 *
 * Call this once when the user submits their email at the end of the quiz.
 * PostHog will retroactively link all prior anonymous events to the profile.
 */
export function trackQuizSubmitted(
  ph: PostHog | null | undefined,
  payload: QuizTrackingPayload,
): void {
  if (!ph) return

  const normalizedEmail = payload.email.trim().toLowerCase()
  if (!normalizedEmail) return

  ph.identify(normalizedEmail, {
    email: normalizedEmail,
    language: payload.language,
    quiz_profile: payload.profile,
    quiz_score: payload.score,
  })

  ph.capture('quiz_submitted', {
    email: normalizedEmail,
    score: payload.score,
    profile: payload.profile,
    language: payload.language,
  })

  ph.capture('quiz_completed', {
    email: normalizedEmail,
    score: payload.score,
    profile: payload.profile,
    language: payload.language,
  })
}
