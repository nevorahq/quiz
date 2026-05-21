export type Language = 'en' | 'ro' | 'ru'

export type QuestionType = 'choice' | 'scale' | 'multi'

export interface QuestionOption {
  value: string
  labelKey: string
  weight: number
}

export interface Question {
  id: number
  block: 'A' | 'B' | 'C'
  type: QuestionType
  questionKey: string
  options: QuestionOption[]
}

export type QuizAnswers = {
  [questionId: string]: string | string[]
}

export interface QuizState {
  currentIndex: number
  answers: QuizAnswers
  startedAt: string | null
  language: string
}

export type PainProfile = 'under_control' | 'managed_chaos' | 'losing_track' | 'full_chaos'

export interface PainResult {
  score: number
  profile: PainProfile
  insights: string[]
}
