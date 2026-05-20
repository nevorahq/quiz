'use client'

import { Question, Language } from '@/types/quiz'
import { getTranslations } from '@/lib/translations'
import QuizProgress from './QuizProgress'
import QuizOpenAnswer from './QuizOpenAnswer'
import QuizScaleAnswer from './QuizScaleAnswer'
import QuizChoiceAnswer from './QuizChoiceAnswer'

interface QuizQuestionProps {
  question: Question
  questionIndex: number
  currentBlock: number
  language: Language
  value: string
  direction: 'forward' | 'backward'
  onAnswer: (value: string) => void
  onNext: () => void
  onBack: () => void
}

// Block accent colours — full class strings only
const BLOCK_BORDER: Record<number, string> = {
  1: 'border-t-blue-500',
  2: 'border-t-violet-500',
  3: 'border-t-amber-500',
  4: 'border-t-emerald-500',
  5: 'border-t-teal-500',
  6: 'border-t-rose-500',
  7: 'border-t-indigo-500',
}

const BLOCK_BADGE_BG: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-violet-100 text-violet-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-emerald-100 text-emerald-700',
  5: 'bg-teal-100 text-teal-700',
  6: 'bg-rose-100 text-rose-700',
  7: 'bg-indigo-100 text-indigo-700',
}

export default function QuizQuestion({
  question,
  questionIndex,
  currentBlock,
  language,
  value,
  direction,
  onAnswer,
  onNext,
  onBack,
}: QuizQuestionProps) {
  const t = getTranslations(language)
  const borderColor = BLOCK_BORDER[currentBlock] ?? 'border-t-slate-500'
  const badgeStyle = BLOCK_BADGE_BG[currentBlock] ?? 'bg-slate-100 text-slate-700'

  const canProceed = value.trim().length > 0

  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      {/* Sticky progress header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-xl">
          <QuizProgress
            currentQuestion={questionIndex}
            currentBlock={currentBlock}
            language={language}
          />
        </div>
      </header>

      {/* Question card — animated with key */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-xl">
          {/*
            The `key` causes React to unmount/remount this div on question change,
            triggering the CSS animation defined in globals.css.
          */}
          <div
            key={`q-${question.id}-${direction}`}
            className={`quiz-card-enter rounded-2xl border border-slate-200 bg-white shadow-sm ${borderColor} border-t-4`}
          >
            <div className="px-5 pt-5 pb-6 sm:px-7 sm:pt-7 sm:pb-8 space-y-6">
              {/* Block badge */}
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
              >
                {question.blockTitle}
              </span>

              {/* Question text */}
              <h2 className="text-xl font-semibold leading-snug text-slate-800 sm:text-2xl">
                {question.text}
              </h2>

              {/* Answer input */}
              <div>
                {question.type === 'open' && (
                  <QuizOpenAnswer
                    questionId={question.id}
                    value={value}
                    placeholder={question.placeholder}
                    language={language}
                    onChange={onAnswer}
                  />
                )}
                {question.type === 'scale' && (
                  <QuizScaleAnswer
                    value={value}
                    scaleLow={question.scaleLow}
                    scaleHigh={question.scaleHigh}
                    onChange={onAnswer}
                  />
                )}
                {question.type === 'choice' && question.options && (
                  <QuizChoiceAnswer
                    options={question.options}
                    value={value}
                    onChange={onAnswer}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-100 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-xl flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            {t.backButton}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
              canProceed
                ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {t.nextButton}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Skip — always available, advances without saving */}
          <button
            type="button"
            onClick={() => {
              onAnswer('')
              onNext()
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-slate-600"
          >
            {t.skipButton}
          </button>
        </div>
      </footer>
    </div>
  )
}
