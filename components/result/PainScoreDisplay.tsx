'use client'

import { useEffect, useRef, useState } from 'react'
import { PainProfile } from '@/types/quiz'
import { getQuizMessages, t } from '@/lib/getQuizMessages'

interface PainScoreDisplayProps {
  score: number
  profile: PainProfile
  locale: string
}

function scoreColor(score: number): string {
  if (score < 31) return '#10B981'
  if (score <= 55) return '#F59E0B'
  if (score <= 79) return '#F97316'
  return '#EF4444'
}

export default function PainScoreDisplay({ score, profile, locale }: PainScoreDisplayProps) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number | null>(null)
  const msg = getQuizMessages(locale)
  const color = scoreColor(score)

  useEffect(() => {
    const start = performance.now()
    const DURATION = 1500

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [score])

  return (
    <div className="text-center space-y-3">
      <div
        className="tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4.5rem, 22vw, 6rem)',
          lineHeight: 1,
          color,
          fontWeight: 700,
        }}
      >
        {displayed}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', color: '#CBD5E1' }}>
        {t(msg, `result.profiles.${profile}`)}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#94A3B8' }}>
        {t(msg, `result.profile_descriptions.${profile}`)}
      </p>
    </div>
  )
}
