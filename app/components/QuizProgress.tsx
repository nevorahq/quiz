'use client'

import { TOTAL_QUESTIONS, TOTAL_BLOCKS } from '@/data/questions'
import { getTranslations } from '@/lib/translations'
import { Language } from '@/types/quiz'

interface QuizProgressProps {
  currentQuestion: number
  currentBlock: number
  language: Language
}

// Tailwind accent colours per block — must be full class strings (no interpolation)
const BLOCK_COLORS: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-violet-500',
  3: 'bg-amber-500',
  4: 'bg-emerald-500',
  5: 'bg-teal-500',
  6: 'bg-rose-500',
  7: 'bg-indigo-500',
}

const BLOCK_TEXT: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-violet-600',
  3: 'text-amber-600',
  4: 'text-emerald-600',
  5: 'text-teal-600',
  6: 'text-rose-600',
  7: 'text-indigo-600',
}

export default function QuizProgress({
  currentQuestion,
  currentBlock,
  language,
}: QuizProgressProps) {
  const t = getTranslations(language)
  const questionNumber = currentQuestion + 1
  const percent = Math.round((questionNumber / TOTAL_QUESTIONS) * 100)
  const barColor = BLOCK_COLORS[currentBlock] ?? 'bg-slate-500'
  const textColor = BLOCK_TEXT[currentBlock] ?? 'text-slate-600'

  return (
    <div className="w-full space-y-2">
      {/* Question counter + block indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {t.questionLabel} {questionNumber} {t.ofLabel} {TOTAL_QUESTIONS}
        </span>
        <span className={`font-medium ${textColor}`}>
          {t.blockLabel} {currentBlock}/{TOTAL_BLOCKS}
        </span>
      </div>

      {/* Animated progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={questionNumber}
          aria-valuemin={1}
          aria-valuemax={TOTAL_QUESTIONS}
        />
      </div>

      {/* Block dots */}
      <div className="flex justify-between">
        {Array.from({ length: TOTAL_BLOCKS }, (_, i) => i + 1).map((b) => (
          <div
            key={b}
            className={`h-1 flex-1 mx-0.5 rounded-full transition-colors duration-300 ${
              b < currentBlock
                ? BLOCK_COLORS[b]
                : b === currentBlock
                  ? BLOCK_COLORS[b] + ' opacity-60'
                  : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
