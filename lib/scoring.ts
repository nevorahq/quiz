import { QuizAnswers, Question, PainProfile, PainResult } from '@/types/quiz'

const MAX_SCORE = 120

// ---------------------------------------------------------------------------
// Profile thresholds
// ---------------------------------------------------------------------------

function resolveProfile(score: number): PainProfile {
  if (score <= 30) return 'under_control'
  if (score <= 55) return 'managed_chaos'
  if (score <= 79) return 'losing_track'
  return 'full_chaos'
}

export function getPainProfileKey(profile: PainProfile): string {
  return `profile.${profile}`
}

// ---------------------------------------------------------------------------
// Insight rules
// ---------------------------------------------------------------------------
// Each rule maps a specific (questionId, answer condition) pair to an insight
// key. The spec's symbolic names resolve to the option value strings used in
// lib/questions.ts:
//   q1=unknown   → options 'c' | 'd'  (8–15 or 15+ subscriptions)
//   q3=no_idea   → options '1' | '2'  (scale low = no clue)
//   q2=week      → option  'd'        (monthly or more = most frequent)
//   q5=head      → option  'c'        (rely on memory)
//   q5=nowhere   → option  'd'        (often find out too late)
//   q7=regular   → option  'c'        (10–30 min searching)
//   q7=several   → option  'd'        (couldn't figure it out)
//   q11=tried_quit → options 'c' | 'd' (scattered / in head / nowhere)
//   q9=6plus     → option  'd'        (largely uncoordinated)
//   q9=4to5      → option  'c'        (each manages own, loosely)
// ---------------------------------------------------------------------------

type InsightRule = {
  questionId: number
  test: (answer: string | string[]) => boolean
  key: string
}

const INSIGHT_RULES: InsightRule[] = [
  { questionId: 1,  test: (a) => a === 'c' || a === 'd',        key: 'insights.subscriptions_unknown' },
  { questionId: 3,  test: (a) => a === '1' || a === '2',        key: 'insights.subscriptions_unknown' },
  { questionId: 2,  test: (a) => a === 'd',                     key: 'insights.subscriptions_week'    },
  { questionId: 5,  test: (a) => a === 'c',                     key: 'insights.deadlines_head'        },
  { questionId: 5,  test: (a) => a === 'd',                     key: 'insights.deadlines_head'        },
  { questionId: 7,  test: (a) => a === 'c' || a === 'd',        key: 'insights.deadlines_regular'     },
  { questionId: 11, test: (a) => a === 'c' || a === 'd',        key: 'insights.tools_chaos'           },
  { questionId: 9,  test: (a) => a === 'c' || a === 'd',        key: 'insights.tools_many'            },
]

// Exhaustive fallback pool — ensures we can always fill to exactly 3
const FALLBACK_POOL: string[] = [
  'insights.subscriptions_unknown',
  'insights.deadlines_head',
  'insights.tools_chaos',
  'insights.subscriptions_week',
  'insights.deadlines_regular',
  'insights.tools_many',
]

// ---------------------------------------------------------------------------
// Raw-score helpers
// ---------------------------------------------------------------------------

type ScoredQuestion = { question: Question; raw: number }

function rawForQuestion(question: Question, answer: string | string[]): number {
  if (question.type === 'choice' || question.type === 'scale') {
    const selected = Array.isArray(answer) ? answer[0] : answer
    return question.options.find((o) => o.value === selected)?.weight ?? 0
  }

  // multi: sum weights of every selected value, capped at 10
  const selected = Array.isArray(answer) ? answer : [answer]
  const sum = selected.reduce((acc, val) => {
    return acc + (question.options.find((o) => o.value === val)?.weight ?? 0)
  }, 0)
  return Math.min(sum, 10)
}

// ---------------------------------------------------------------------------
// Insight derivation
// ---------------------------------------------------------------------------

function deriveInsights(answers: QuizAnswers, scored: ScoredQuestion[]): string[] {
  // Evaluate insight rules against the top-scoring answers in rank order
  const ranked = [...scored].sort((a, b) => b.raw - a.raw)

  const insights: string[] = []
  const seen = new Set<string>()

  for (const { question } of ranked) {
    if (insights.length >= 3) break
    const answer = answers[String(question.id)]
    if (answer == null) continue

    for (const rule of INSIGHT_RULES) {
      if (rule.questionId !== question.id) continue
      if (rule.test(answer) && !seen.has(rule.key)) {
        seen.add(rule.key)
        insights.push(rule.key)
        break // one insight key per question
      }
    }
  }

  // Fill remaining slots from the fallback pool (no duplicates)
  for (const key of FALLBACK_POOL) {
    if (insights.length >= 3) break
    if (!seen.has(key)) {
      seen.add(key)
      insights.push(key)
    }
  }

  return insights
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function calculatePainScore(answers: QuizAnswers, questions: Question[]): PainResult {
  const scored: ScoredQuestion[] = questions.map((question) => {
    const answer = answers[String(question.id)]
    const raw = answer != null ? rawForQuestion(question, answer) : 0
    return { question, raw }
  })

  const rawScore = scored.reduce((acc, { raw }) => acc + raw, 0)
  const score = Math.round((rawScore / MAX_SCORE) * 100)
  const profile = resolveProfile(score)
  const insights = deriveInsights(answers, scored)

  return { score, profile, insights }
}
