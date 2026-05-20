export type Language = 'en' | 'ro' | 'ru'

export type QuestionType = 'open' | 'scale' | 'choice'

/** Screen phase controlling which component is rendered */
export type Phase = 'intro' | 'block-header' | 'question' | 'results'

export interface Question {
  id: number
  block: number
  blockTitle: string
  blockGoal: string
  text: string
  type: QuestionType
  options?: string[]
  placeholder?: string
  /** For scale questions: label for value 1 */
  scaleLow?: string
  /** For scale questions: label for value 5 */
  scaleHigh?: string
}

export interface BlockInfo {
  block: number
  title: string
  goal: string
}

export interface QuizAnswer {
  questionId: number
  value: string
  timestamp: string
}

export interface QuizState {
  language: Language
  phase: Phase
  /** 1-7, 0 before quiz starts */
  currentBlock: number
  /** 0-indexed position in the full question list */
  currentQuestion: number
  answers: QuizAnswer[]
  isCompleted: boolean
  startedAt: string | null
  completedAt: string | null
}
