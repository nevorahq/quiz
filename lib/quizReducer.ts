import { QuizState, QuizAnswer, Language, Phase } from '@/types/quiz'
import {
  TOTAL_BLOCKS,
  TOTAL_QUESTIONS,
  blockStartIndex,
  blockEndIndex,
  getQuestions,
} from '@/data/questions'

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type QuizAction =
  | { type: 'START_QUIZ'; payload: { language: Language } }
  | { type: 'PROCEED_FROM_BLOCK_HEADER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: number; value: string } }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESTART_QUIZ' }
  | { type: 'RESTORE_STATE'; payload: QuizState }

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export const initialQuizState: QuizState = {
  language: 'en',
  phase: 'intro',
  currentBlock: 0,
  currentQuestion: 0,
  answers: [],
  isCompleted: false,
  startedAt: null,
  completedAt: null,
}

// ---------------------------------------------------------------------------
// Helper: which block does question index i belong to?
// ---------------------------------------------------------------------------

function blockOf(questionIndex: number, language: Language): number {
  const questions = getQuestions(language)
  return questions[questionIndex]?.block ?? 1
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    // ── Restore saved state from localStorage ──────────────────────────
    case 'RESTORE_STATE':
      return action.payload

    // ── Start quiz with chosen language ────────────────────────────────
    case 'START_QUIZ':
      return {
        ...initialQuizState,
        language: action.payload.language,
        phase: 'block-header',
        currentBlock: 1,
        currentQuestion: 0,
        startedAt: new Date().toISOString(),
      }

    // ── User clicked "Continue" on block header → show first question of block
    case 'PROCEED_FROM_BLOCK_HEADER':
      return {
        ...state,
        phase: 'question',
        // currentQuestion already points to the first question of the block
      }

    // ── Move to next question (or next block header, or results) ────────
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestion + 1

      // Exhausted all questions
      if (nextIndex >= TOTAL_QUESTIONS) {
        return {
          ...state,
          phase: 'results',
          isCompleted: true,
          completedAt: new Date().toISOString(),
        }
      }

      const nextBlock = blockOf(nextIndex, state.language)

      // Entering a new block → show block header first
      if (nextBlock > state.currentBlock) {
        return {
          ...state,
          phase: 'block-header',
          currentBlock: nextBlock,
          currentQuestion: nextIndex,
        }
      }

      // Same block → just advance
      return {
        ...state,
        phase: 'question',
        currentQuestion: nextIndex,
      }
    }

    // ── Move back one step ─────────────────────────────────────────────
    case 'PREV_QUESTION': {
      // On block-header: go to last question of previous block (or intro)
      if (state.phase === 'block-header') {
        if (state.currentBlock === 1) {
          return { ...state, phase: 'intro', currentBlock: 0, currentQuestion: 0 }
        }
        const prevBlock = state.currentBlock - 1
        const prevQuestionIndex = blockEndIndex(prevBlock)
        return {
          ...state,
          phase: 'question',
          currentBlock: prevBlock,
          currentQuestion: prevQuestionIndex,
        }
      }

      // On first question of the block → go to block header
      const blockStart = blockStartIndex(state.currentBlock)
      if (state.currentQuestion === blockStart) {
        return { ...state, phase: 'block-header' }
      }

      // Go to the previous question
      return {
        ...state,
        phase: 'question',
        currentQuestion: state.currentQuestion - 1,
      }
    }

    // ── Save (or update) an answer ──────────────────────────────────────
    case 'ANSWER_QUESTION': {
      const { questionId, value } = action.payload
      const existing = state.answers.findIndex((a) => a.questionId === questionId)
      const newAnswer: QuizAnswer = {
        questionId,
        value,
        timestamp: new Date().toISOString(),
      }

      const answers =
        existing >= 0
          ? state.answers.map((a, i) => (i === existing ? newAnswer : a))
          : [...state.answers, newAnswer]

      return { ...state, answers }
    }

    // ── Force-complete (e.g. from last question "Next") ─────────────────
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        phase: 'results',
        isCompleted: true,
        completedAt: new Date().toISOString(),
      }

    // ── Restart from scratch ────────────────────────────────────────────
    case 'RESTART_QUIZ':
      return { ...initialQuizState }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Selectors (pure helpers used by components)
// ---------------------------------------------------------------------------

export function selectAnswerForQuestion(
  answers: QuizAnswer[],
  questionId: number,
): string {
  return answers.find((a) => a.questionId === questionId)?.value ?? ''
}

export function selectAnsweredCountForBlock(
  answers: QuizAnswer[],
  block: number,
  language: Language,
): number {
  const questions = getQuestions(language)
  const blockIds = questions.filter((q) => q.block === block).map((q) => q.id)
  return answers.filter((a) => blockIds.includes(a.questionId) && a.value.trim() !== '').length
}

export function selectTotalAnswered(answers: QuizAnswer[]): number {
  return answers.filter((a) => a.value.trim() !== '').length
}

/** 0–100 progress percentage */
export function selectProgressPercent(currentQuestion: number, phase: Phase): number {
  if (phase === 'intro') return 0
  if (phase === 'results') return 100
  return Math.round(((currentQuestion + 1) / TOTAL_QUESTIONS) * 100)
}
