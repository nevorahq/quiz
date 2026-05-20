'use client'

import { QuizState } from '@/types/quiz'
import { getTranslations } from '@/lib/translations'
import {
  getQuestions,
  getBlockInfo,
  TOTAL_BLOCKS,
  TOTAL_QUESTIONS,
} from '@/data/questions'
import {
  selectAnsweredCountForBlock,
  selectTotalAnswered,
} from '@/lib/quizReducer'

interface QuizResultsProps {
  state: QuizState
  onRestart: () => void
}

// Block accent colours — full class strings
const BLOCK_DOT: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-violet-500',
  3: 'bg-amber-500',
  4: 'bg-emerald-500',
  5: 'bg-teal-500',
  6: 'bg-rose-500',
  7: 'bg-indigo-500',
}

const BLOCK_BAR: Record<number, string> = {
  1: 'bg-blue-400',
  2: 'bg-violet-400',
  3: 'bg-amber-400',
  4: 'bg-emerald-400',
  5: 'bg-teal-400',
  6: 'bg-rose-400',
  7: 'bg-indigo-400',
}

export default function QuizResults({ state, onRestart }: QuizResultsProps) {
  const { language, answers, startedAt, completedAt } = state
  const t = getTranslations(language)
  const questions = getQuestions(language)
  const blocks = getBlockInfo(language)
  const totalAnswered = selectTotalAnswered(answers)

  // Build per-block question counts
  const blockQuestionCount = (block: number) =>
    questions.filter((q) => q.block === block).length

  /** Export all answers as a downloadable JSON file */
  function handleExport() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      language,
      startedAt,
      completedAt,
      totalAnswered,
      totalQuestions: TOTAL_QUESTIONS,
      answers: answers.map((a) => {
        const q = questions.find((q) => q.id === a.questionId)
        return {
          questionId: a.questionId,
          block: q?.block,
          blockTitle: q?.blockTitle,
          question: q?.text,
          answer: a.value,
          timestamp: a.timestamp,
        }
      }),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quiz-results-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  /** Duration string from startedAt / completedAt */
  function getDuration(): string | null {
    if (!startedAt || !completedAt) return null
    const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime()
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const duration = getDuration()

  return (
    <div className="flex min-h-svh flex-col items-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header card */}
        <div className="quiz-card-enter rounded-2xl bg-slate-800 p-7 text-white shadow-lg text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-emerald-400">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold">{t.thankYouTitle}</h1>
          <p className="text-slate-300 text-sm leading-relaxed">{t.thankYouMessage}</p>

          {/* Summary stats */}
          <div className="flex justify-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalAnswered}</div>
              <div className="text-xs text-slate-400">{t.answeredLabel}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold">{TOTAL_QUESTIONS}</div>
              <div className="text-xs text-slate-400">{t.totalLabel}</div>
            </div>
            {duration && (
              <>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{duration}</div>
                  <div className="text-xs text-slate-400">time</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Per-block summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {t.blockAnsweredLabel}
          </h2>
          <div className="space-y-3">
            {blocks.map((block) => {
              const answered = selectAnsweredCountForBlock(answers, block.block, language)
              const total = blockQuestionCount(block.block)
              const percent = Math.round((answered / total) * 100)
              const dotColor = BLOCK_DOT[block.block] ?? 'bg-slate-500'
              const barColor = BLOCK_BAR[block.block] ?? 'bg-slate-400'

              return (
                <div key={block.block} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                      <span className="text-sm text-slate-700">{block.title}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {answered}/{total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
            {t.exportButton}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
            </svg>
            {t.restartButton}
          </button>
        </div>
      </div>
    </div>
  )
}
