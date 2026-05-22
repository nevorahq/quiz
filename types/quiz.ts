export type Language = 'en' | 'ro' | 'ru'

export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export interface QuizSubmitPayload extends UtmParams {
  email: string
  answers: QuizAnswers
  answers_count: number
  score: number
  profile: PainProfile
  insights: string[]
  language: string
  pathname: string
  timestamp: string  // ISO 8601
}

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
