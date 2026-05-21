import { redirect } from 'next/navigation'
import { getQuizMessages, t, QuizMessages } from '@/lib/getQuizMessages'
import { PainProfile } from '@/types/quiz'
import BackgroundMesh from '@/components/quiz/BackgroundMesh'
import LanguageSwitcher from '@/components/quiz/LanguageSwitcher'
import ResultWaitlistForm from './ResultWaitlistForm'

// ---------------------------------------------------------------------------
// Profile colour map (kept in sync with QuizContainer)
// ---------------------------------------------------------------------------

const PROFILE_COLOR: Record<PainProfile, string> = {
  under_control: '#10B981',
  managed_chaos: '#F59E0B',
  losing_track: '#F97316',
  full_chaos: '#EF4444',
}

const VALID_PROFILES = new Set<string>([
  'under_control',
  'managed_chaos',
  'losing_track',
  'full_chaos',
])

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    score?: string
    profile?: string
    insights?: string
  }>
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams

  const scoreRaw = sp.score
  const profileRaw = sp.profile
  const insightsRaw = sp.insights

  // Guard — redirect to quiz if essential params are missing or invalid
  if (
    !scoreRaw ||
    !profileRaw ||
    !VALID_PROFILES.has(profileRaw)
  ) {
    redirect(`/${locale}/quiz`)
  }

  const score = Number(scoreRaw)
  if (isNaN(score)) redirect(`/${locale}/quiz`)

  const profile = profileRaw as PainProfile
  const insights = insightsRaw ? insightsRaw.split(',').filter(Boolean).slice(0, 3) : []
  const color = PROFILE_COLOR[profile]
  const msg = getQuizMessages(locale)

  return (
    <div className="relative min-h-svh">
      <BackgroundMesh />

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageSwitcher locale={locale} />
      </div>

      <div className="flex min-h-svh flex-col items-center justify-start px-4 py-12 gap-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Score card */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#64748B', fontFamily: 'var(--font-body)' }}
            >
              {msg.result.your_score}
            </p>
            <div
              className="text-7xl font-bold tabular-nums leading-none mb-4"
              style={{ color, fontFamily: 'var(--font-display)' }}
            >
              {score}
            </div>
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ background: `${color}22`, color }}
            >
              {t(msg, `result.profiles.${profile}`)}
            </span>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="space-y-3">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#64748B', fontFamily: 'var(--font-body)' }}
              >
                {msg.result.insights_title}
              </p>
              {insights.map((key) => (
                <div
                  key={key}
                  className="rounded-xl px-5 py-4 text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#CBD5E1',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t(msg, key)}
                </div>
              ))}
            </div>
          )}

          {/* Waitlist form — client component for interactivity */}
          <ResultWaitlistForm locale={locale} profile={profile} score={score} />
        </div>
      </div>
    </div>
  )
}
