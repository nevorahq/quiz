'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { PainProfile } from '@/types/quiz'
import { getQuizMessages } from '@/lib/getQuizMessages'

interface ResultWaitlistFormProps {
  locale: string
  profile: PainProfile
  score: number
}

export default function ResultWaitlistForm({ locale, profile, score }: ResultWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const ph = usePostHog()
  const router = useRouter()
  const msg = getQuizMessages(locale)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    const normalizedEmail = email.trim()
    if (!normalizedEmail || submitting) return

    setSubmitting(true)
    try {
      ph?.capture('quiz_submitted', {
        email: normalizedEmail,
        score,
        profile,
        language: locale,
      })
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-7 space-y-4"
      style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      <div className="space-y-2">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F1F5F9' }}>
          {msg.result.waitlist_title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
          {msg.result.waitlist_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          aria-label="Email address"
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
          disabled={submitting || success}
          className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: '#6366F1' }}
        >
          {submitting ? msg.result.sending : msg.result.waitlist_cta}
        </button>
        {success && (
          <p
            className="text-center text-sm font-medium"
            style={{ color: '#10B981', fontFamily: 'var(--font-body)' }}
          >
            {msg.result.submit_success}
          </p>
        )}
      </form>

      <p className="text-center text-xs" style={{ color: '#475569', fontFamily: 'var(--font-body)' }}>
        {msg.result.waitlist_note}
      </p>
    </div>
  )
}
