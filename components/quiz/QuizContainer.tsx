'use client'

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import { usePostHog } from 'posthog-js/react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuizAnswers, PainResult, PainProfile, UtmParams } from '@/types/quiz'
import { questions } from '@/lib/questions'
import { calculatePainScore } from '@/lib/scoring'
import { getQuizMessages, t } from '@/lib/getQuizMessages'
import QuizProgress from './QuizProgress'
import QuizQuestion from './QuizQuestion'
import QuizTransition from './QuizTransition'
import { useRouter } from 'next/navigation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Phase = 'quiz' | 'calculating' | 'result' | 'done'

interface QuizContainerProps {
  locale: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'nevora-quiz-v2'

function restoreFromStorage(): { currentIndex: number; answers: QuizAnswers } | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as { currentIndex: number; answers: QuizAnswers }
      if (typeof parsed.currentIndex === 'number' && parsed.answers && typeof parsed.answers === 'object') {
        return parsed
      }
    }
  } catch { /**/ }
  return null
}
const TOTAL = questions.length // 12

/** 0-based indices where a block ends (q4=3, q8=7, q12=11) */
const BLOCK_END: Record<number, 'A' | 'B' | 'C'> = { 3: 'A', 7: 'B', 11: 'C' }

const PROFILE_COLOR: Record<PainProfile, string> = {
  under_control: '#10B981',
  managed_chaos: '#F59E0B',
  losing_track: '#F97316',
  full_chaos: '#EF4444',
}

// ---------------------------------------------------------------------------
// Sub-views (kept inline to avoid extra files)
// ---------------------------------------------------------------------------

function CalculatingView({ label }: { label: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-2 border-white/20 border-t-accent"
      />
      <p className="text-sm text-slate-400" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
    </div>
  )
}

interface ResultViewProps {
  result: PainResult
  locale: string
  onEmailSubmit: (e: React.SubmitEvent, email: string) => Promise<void>
  submitting: boolean
  submitError: string | null
  submitSuccess: boolean
}

function ResultView({ result, locale, onEmailSubmit, submitting, submitError, submitSuccess }: ResultViewProps) {
  const msg = getQuizMessages(locale)
  const [email, setEmail] = useState('')
  const color = PROFILE_COLOR[result.profile]

  return (
    <div className="flex min-h-svh flex-col items-center justify-start px-4 py-12 gap-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            {result.score}
          </div>
          <span
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ background: `${color}22`, color }}
          >
            {t(msg, `result.profiles.${result.profile}`)}
          </span>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#64748B', fontFamily: 'var(--font-body)' }}
          >
            {msg.result.insights_title}
          </p>
          {result.insights.map((key) => (
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
        </motion.div>

        {/* Waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-7 space-y-4"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <div className="space-y-2">
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F1F5F9' }}
            >
              {msg.result.waitlist_title}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}
            >
              {msg.result.waitlist_subtitle}
            </p>
          </div>

          <form onSubmit={(e) => onEmailSubmit(e, email)} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={msg.result.email_placeholder}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent transition"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#F1F5F9',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              disabled={submitting || submitSuccess}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              style={{ background: '#6366F1' }}
            >
              {submitting ? msg.result.sending : msg.result.waitlist_cta}
            </button>
            {submitSuccess && (
              <p
                className="text-center text-sm font-medium"
                style={{ color: '#10B981', fontFamily: 'var(--font-body)' }}
              >
                {msg.result.submit_success}
              </p>
            )}
            {submitError && (
              <p
                className="text-center text-xs"
                style={{ color: '#F87171', fontFamily: 'var(--font-body)' }}
              >
                {submitError}
              </p>
            )}
          </form>
          <p
            className="text-center text-xs"
            style={{ color: '#475569', fontFamily: 'var(--font-body)' }}
          >
            {msg.result.waitlist_note}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function DoneView({ locale }: { locale: string }) {
  const msg = getQuizMessages(locale)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M6 14l6 6L22 8"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#F1F5F9' }}
      >
        {msg.result.success_title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-sm text-center max-w-xs"
        style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}
      >
        {msg.result.success_subtitle}
      </motion.p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function QuizContainer({ locale }: QuizContainerProps) {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [currentIndex, setCurrentIndex] = useState(() => restoreFromStorage()?.currentIndex ?? 0)
  const [answers, setAnswers] = useState<QuizAnswers>(() => restoreFromStorage()?.answers ?? {})
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [result, setResult] = useState<PainResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const isHydrated = useSyncExternalStore(() => () => {}, () => true, () => false)

  const ph = usePostHog()
  const router = useRouter()
  const msg = getQuizMessages(locale)

  // Refs keep latest values accessible in event handlers / timeouts
  const phaseRef = useRef<Phase>('quiz')
  const indexRef = useRef(0)
  const utmRef = useRef<UtmParams>({})
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { indexRef.current = currentIndex }, [currentIndex])

  const question = questions[currentIndex]
  const rawAnswer = question ? answers[String(question.id)] : undefined
  const isAnswered =
    rawAnswer !== undefined &&
    (Array.isArray(rawAnswer) ? rawAnswer.length > 0 : rawAnswer !== '')
  const isLast = currentIndex === TOTAL - 1

  // ── quiz_started + UTM capture ─────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    utmRef.current = {
      utm_source:   params.get('utm_source')   ?? undefined,
      utm_medium:   params.get('utm_medium')   ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
      utm_content:  params.get('utm_content')  ?? undefined,
      utm_term:     params.get('utm_term')     ?? undefined,
    }
    ph?.capture('quiz_started', { locale })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist state ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isHydrated || phase !== 'quiz') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, answers }))
    } catch {
      // ignore quota errors
    }
  }, [currentIndex, answers, phase, isHydrated])

  // ── beforeunload — fire quiz_abandoned if not done ─────────────────────
  useEffect(() => {
    function onBeforeUnload() {
      if (phaseRef.current === 'done') return
      ph?.capture(
        'quiz_abandoned',
        { currentIndex: indexRef.current, locale, phase: phaseRef.current },
        { transport: 'sendBeacon' } as never,
      )
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Answer handler ─────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (value: string | string[]) => {
      if (!question) return
      setAnswers((prev) => ({ ...prev, [String(question.id)]: value }))
    },
    [question],
  )

  // ── Navigation ─────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const idx = indexRef.current
    const block = BLOCK_END[idx]

    if (isLast) {
      // Block C complete + quiz complete
      ph?.capture('quiz_block_completed', { block: 'C', locale })

      // Clear progress now that quiz is done
      try { localStorage.removeItem(STORAGE_KEY) } catch { /**/ }

      setPhase('calculating')

      setTimeout(() => {
        const pain = calculatePainScore(answers, questions)
        setResult(pain)
        ph?.capture('quiz_completed', {
          score: pain.score,
          profile: pain.profile,
          locale,
        })
        setPhase('result')
      }, 1500)
      return
    }

    // Block A or B complete
    if (block) {
      ph?.capture('quiz_block_completed', { block, locale })
    }

    setDirection('forward')
    setCurrentIndex((i) => i + 1)
  }, [isLast, answers, locale, ph])

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return
    setDirection('backward')
    setCurrentIndex((i) => i - 1)
  }, [currentIndex])

  // ── Quiz submit ────────────────────────────────────────────────────────
  const handleEmailSubmit = useCallback(
    async (e: React.SubmitEvent, email: string) => {
      e.preventDefault()
      const normalizedEmail = email.trim()
      if (!normalizedEmail || submitting || !result) return

      setSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        ph?.capture('quiz_submitted', {
          email: normalizedEmail,
          score: result.score,
          profile: result.profile,
          language: locale,
        })
        setSubmitSuccess(true)
        setTimeout(() => router.push('/'), 1500)
      } catch {
        setSubmitError('Network error. Please check your connection and try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [submitting, result, locale, ph, router],
  )

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (!isHydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      </div>
    )
  }

  // ── Phase rendering ────────────────────────────────────────────────────
  if (phase === 'calculating') {
    return <CalculatingView label={msg.result.calculating} />
  }

  if (phase === 'result' && result) {
    return (
      <ResultView
        result={result}
        locale={locale}
        onEmailSubmit={handleEmailSubmit}
        submitting={submitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    )
  }

  if (phase === 'done') {
    return <DoneView locale={locale} />
  }

  // ── Quiz phase ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-svh flex-col">
      {/* Progress header */}
      <header className="px-4 pt-6 sm:px-8">
        <div className="mx-auto max-w-xl">
          <QuizProgress currentIndex={currentIndex} locale={locale} />
        </div>
      </header>

      {/* Question */}
      <main className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <QuizTransition
              key={currentIndex}
              motionKey={String(currentIndex)}
              direction={direction}
            >
              {question && (
                <QuizQuestion
                  question={question}
                  answers={answers}
                  onAnswer={handleAnswer}
                  locale={locale}
                />
              )}
            </QuizTransition>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="px-4 pb-8 sm:px-8">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {/* Back */}
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#94A3B8',
              background: 'transparent',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {msg.navigation.back}
          </button>

          {/* Next / Finish */}
          {isLast ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ background: '#6366F1' }}
            >
              {msg.navigation.finish}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ background: isAnswered ? '#6366F1' : 'rgba(99,102,241,0.4)' }}
            >
              {msg.navigation.next}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
