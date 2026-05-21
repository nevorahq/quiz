'use client'

import { getQuizMessages } from '@/lib/getQuizMessages'

interface QuizProgressProps {
  currentIndex: number // 0-based (0–11)
  locale: string
}

const TOTAL = 12

export default function QuizProgress({ currentIndex, locale }: QuizProgressProps) {
  const msg = getQuizMessages(locale)
  const percent = (currentIndex / TOTAL) * 100

  return (
    <div className="w-full">
      {/* 3px indigo fill line */}
      <div
        className="w-full overflow-hidden"
        style={{ height: 3 }}
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: '#6366F1',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Counter */}
      <p
        className="mt-3 text-sm text-slate-400"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {msg.progress.question} {currentIndex + 1} {msg.progress.of} {TOTAL}
      </p>
    </div>
  )
}
