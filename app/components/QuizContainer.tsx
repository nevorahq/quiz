'use client'

import { useReducer, useEffect, useState, useCallback } from 'react'
import { Language, QuizState } from '@/types/quiz'
import {
  quizReducer,
  initialQuizState,
  selectAnswerForQuestion,
} from '@/lib/quizReducer'
import { getQuestions, getBlockInfo, blockStartIndex } from '@/data/questions'
import QuizIntro from './QuizIntro'
import QuizBlockHeader from './QuizBlockHeader'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'

const STORAGE_KEY = 'nevora-quiz-state'

export default function QuizContainer() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  // Prevent hydration mismatch — only restore localStorage after mount
  const [isHydrated, setIsHydrated] = useState(false)
  // Track direction for slide animation ('forward' | 'backward')
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  // ── Restore state from localStorage after first render ──────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as QuizState
        // Only restore if the user had actually started
        if (parsed.phase !== 'intro') {
          dispatch({ type: 'RESTORE_STATE', payload: parsed })
        }
      }
    } catch {
      // Silently ignore corrupted data
    }
    setIsHydrated(true)
  }, [])

  // ── Persist state to localStorage on every change ───────────────────
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Silently ignore storage quota errors
    }
  }, [state, isHydrated])

  // ── Action dispatchers ───────────────────────────────────────────────

  const handleStart = useCallback((language: Language) => {
    setDirection('forward')
    dispatch({ type: 'START_QUIZ', payload: { language } })
  }, [])

  const handleProceedFromBlockHeader = useCallback(() => {
    setDirection('forward')
    dispatch({ type: 'PROCEED_FROM_BLOCK_HEADER' })
  }, [])

  const handleNext = useCallback(() => {
    setDirection('forward')
    dispatch({ type: 'NEXT_QUESTION' })
  }, [])

  const handleBack = useCallback(() => {
    setDirection('backward')
    dispatch({ type: 'PREV_QUESTION' })
  }, [])

  const handleAnswer = useCallback((value: string) => {
    const questions = getQuestions(state.language)
    const question = questions[state.currentQuestion]
    if (!question) return
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId: question.id, value },
    })
  }, [state.language, state.currentQuestion])

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    dispatch({ type: 'RESTART_QUIZ' })
  }, [])

  // ── Render nothing until hydration completes (avoids flicker) ────────
  if (!isHydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      </div>
    )
  }

  // ── Phase routing ────────────────────────────────────────────────────

  if (state.phase === 'intro') {
    return <QuizIntro onStart={handleStart} />
  }

  if (state.phase === 'results') {
    return <QuizResults state={state} onRestart={handleRestart} />
  }

  const questions = getQuestions(state.language)
  const blocks = getBlockInfo(state.language)
  const currentQuestion = questions[state.currentQuestion]
  const currentBlockInfo = blocks.find((b) => b.block === state.currentBlock)

  if (!currentQuestion || !currentBlockInfo) {
    // Should never happen — safety net
    return <QuizIntro onStart={handleStart} />
  }

  if (state.phase === 'block-header') {
    return (
      <QuizBlockHeader
        blockInfo={currentBlockInfo}
        language={state.language}
        firstQuestionIndex={blockStartIndex(state.currentBlock)}
        onContinue={handleProceedFromBlockHeader}
        onBack={handleBack}
      />
    )
  }

  // phase === 'question'
  const currentValue = selectAnswerForQuestion(state.answers, currentQuestion.id)

  return (
    <QuizQuestion
      question={currentQuestion}
      questionIndex={state.currentQuestion}
      currentBlock={state.currentBlock}
      language={state.language}
      value={currentValue}
      direction={direction}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
    />
  )
}
