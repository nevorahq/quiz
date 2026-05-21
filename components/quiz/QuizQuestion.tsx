'use client'

import { Question, QuizAnswers } from '@/types/quiz'
import { getQuizMessages, t } from '@/lib/getQuizMessages'
import QuizChoiceAnswer from './QuizChoiceAnswer'
import QuizScaleAnswer from './QuizScaleAnswer'
import QuizMultiAnswer from './QuizMultiAnswer'

interface QuizQuestionProps {
  question: Question
  answers: QuizAnswers
  onAnswer: (value: string | string[]) => void
  locale: string
}

const BLOCK_LABEL: Record<'A' | 'B' | 'C', string> = {
  A: 'blocks.A.title',
  B: 'blocks.B.title',
  C: 'blocks.C.title',
}

export default function QuizQuestion({
  question,
  answers,
  onAnswer,
  locale,
}: QuizQuestionProps) {
  const msg = getQuizMessages(locale)

  const questionText = t(msg, `${question.questionKey}.question`)
  const blockTitle = t(msg, BLOCK_LABEL[question.block])

  // Extract the current answer for this question
  const rawAnswer = answers[String(question.id)]
  const choiceAnswer = typeof rawAnswer === 'string' ? rawAnswer : ''
  const multiAnswer = Array.isArray(rawAnswer) ? rawAnswer : []

  // Scale-question endpoint labels (q3, q6, q10)
  const scaleLow = t(msg, `${question.questionKey}.scale_low`)
  const scaleHigh = t(msg, `${question.questionKey}.scale_high`)
  const hasScaleLabels =
    scaleLow !== `${question.questionKey}.scale_low` // t() returns path on miss

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Block label */}
      <p
        className="mb-5 text-xs font-semibold tracking-widest uppercase"
        style={{ color: '#818CF8', fontFamily: 'var(--font-body)', letterSpacing: '0.12em' }}
      >
        Block {question.block}&nbsp;&middot;&nbsp;{blockTitle}
      </p>

      {/* Question text */}
      <h2
        className="mb-8 leading-snug"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: '#F1F5F9',
          lineHeight: 1.3,
        }}
      >
        {questionText}
      </h2>

      {/* Answer area */}
      {question.type === 'choice' && (
        <QuizChoiceAnswer
          options={question.options}
          selected={choiceAnswer}
          onSelect={(v) => onAnswer(v)}
          locale={locale}
        />
      )}

      {question.type === 'scale' && (
        <QuizScaleAnswer
          selected={choiceAnswer}
          onSelect={(v) => onAnswer(v)}
          scaleLow={hasScaleLabels ? scaleLow : undefined}
          scaleHigh={hasScaleLabels ? scaleHigh : undefined}
        />
      )}

      {question.type === 'multi' && (
        <QuizMultiAnswer
          options={question.options}
          selected={multiAnswer}
          onSelect={(v) => onAnswer(v)}
          locale={locale}
        />
      )}
    </div>
  )
}
