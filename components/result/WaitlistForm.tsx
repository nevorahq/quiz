'use client'

import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { PainProfile } from '@/types/quiz'
import { getQuizMessages } from '@/lib/getQuizMessages'

interface WaitlistFormProps {
  score: number
  profile: PainProfile
  language: string
  onSuccess: () => void
}

export default function WaitlistForm({ score, profile, language, onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const ph = usePostHog()
  const msg = getQuizMessages(language)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!email.trim() || submitting) return
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), pain_score: score, profile, language }),
      })

      const data: { success?: boolean; error?: string } = await res.json()

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      ph?.capture('waitlist_joined', { locale: language, profile, score })
      onSuccess()
    } catch {
      setError('Network error. Please try again.')
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
        <p
          className="text-sm leading-relaxed"
          style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}
        >
          {msg.result.waitlist_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
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
          {error && (
            <p className="text-xs" style={{ color: '#F87171', fontFamily: 'var(--font-body)' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{
            background: '#6366F1',
            boxShadow: hovering ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
          }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M13 7A6 6 0 0 0 7 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          ) : (
            msg.result.waitlist_cta
          )}
        </button>
      </form>

      <p
        className="text-center text-xs"
        style={{ color: '#475569', fontFamily: 'var(--font-body)' }}
      >
        {msg.result.waitlist_note}
      </p>
    </div>
  )
}
