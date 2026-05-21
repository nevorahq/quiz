'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [done, setDone] = useState(false)
  const ph = usePostHog()
  const msg = getQuizMessages(locale)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!email.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), pain_score: score, profile, language: locale }),
      })
      if (res.ok) {
        ph?.capture('waitlist_joined', { locale, profile, score })
      }
    } catch { /**/ }
    setSubmitting(false)
    setDone(true)
  }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-7 text-center space-y-3"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <div className="flex justify-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F1F5F9' }}
          >
            {msg.result.success_title}
          </p>
          <p className="text-sm" style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
            {msg.result.success_subtitle}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            <p className="text-sm leading-relaxed" style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
              {msg.result.waitlist_subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              disabled={submitting}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: '#6366F1' }}
            >
              {submitting ? '…' : msg.result.waitlist_cta}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: '#475569', fontFamily: 'var(--font-body)' }}>
            {msg.result.waitlist_note}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
