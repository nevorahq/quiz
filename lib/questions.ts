import { Question } from '@/types/quiz'

// Scoring guide
// choice/scale answers: weight 0 (in control) → 3 or 4 (full chaos)
// scale questions use 5 options (weight 0–4)
// multi q12: each selected option contributes weight 1 (max 5)
// Total max: 3+3+4+3 + 3+4+3+3 + 3+4+3+5 = 41

export const questions: Question[] = [
  // ── Block A: Money & Subscriptions ──────────────────────────────────────

  {
    id: 1,
    block: 'A',
    type: 'choice',
    questionKey: 'q1',
    options: [
      { value: 'a', labelKey: 'q1.a', weight: 0 }, // 1–3
      { value: 'b', labelKey: 'q1.b', weight: 1 }, // 4–7
      { value: 'c', labelKey: 'q1.c', weight: 2 }, // 8–15
      { value: 'd', labelKey: 'q1.d', weight: 3 }, // 15+
    ],
  },

  {
    id: 2,
    block: 'A',
    type: 'choice',
    questionKey: 'q2',
    options: [
      { value: 'a', labelKey: 'q2.a', weight: 0 }, // Never
      { value: 'b', labelKey: 'q2.b', weight: 1 }, // Once or twice a year
      { value: 'c', labelKey: 'q2.c', weight: 2 }, // Every few months
      { value: 'd', labelKey: 'q2.d', weight: 3 }, // Monthly or more
    ],
  },

  {
    id: 3,
    block: 'A',
    type: 'scale',
    questionKey: 'q3',
    // 1 = No idea → weight 4 · 5 = Exact → weight 0
    options: [
      { value: '1', labelKey: 'q3.1', weight: 4 },
      { value: '2', labelKey: 'q3.2', weight: 3 },
      { value: '3', labelKey: 'q3.3', weight: 2 },
      { value: '4', labelKey: 'q3.4', weight: 1 },
      { value: '5', labelKey: 'q3.5', weight: 0 },
    ],
  },

  {
    id: 4,
    block: 'A',
    type: 'choice',
    questionKey: 'q4',
    options: [
      { value: 'a', labelKey: 'q4.a', weight: 0 }, // Cancel immediately when done
      { value: 'b', labelKey: 'q4.b', weight: 1 }, // Cancel after noticing the charge
      { value: 'c', labelKey: 'q4.c', weight: 2 }, // Linger for months before I act
      { value: 'd', labelKey: 'q4.d', weight: 3 }, // Not sure — some may still be running
    ],
  },

  // ── Block B: Life Deadlines ──────────────────────────────────────────────

  {
    id: 5,
    block: 'B',
    type: 'choice',
    questionKey: 'q5',
    options: [
      { value: 'a', labelKey: 'q5.a', weight: 0 }, // Reliable reminder system
      { value: 'b', labelKey: 'q5.b', weight: 1 }, // Calendar / email alerts
      { value: 'c', labelKey: 'q5.c', weight: 2 }, // Rely on memory
      { value: 'd', labelKey: 'q5.d', weight: 3 }, // Often find out too late
    ],
  },

  {
    id: 6,
    block: 'B',
    type: 'scale',
    questionKey: 'q6',
    // 1 = Never → weight 0 · 5 = Constantly → weight 4
    options: [
      { value: '1', labelKey: 'q6.1', weight: 0 },
      { value: '2', labelKey: 'q6.2', weight: 1 },
      { value: '3', labelKey: 'q6.3', weight: 2 },
      { value: '4', labelKey: 'q6.4', weight: 3 },
      { value: '5', labelKey: 'q6.5', weight: 4 },
    ],
  },

  {
    id: 7,
    block: 'B',
    type: 'choice',
    questionKey: 'q7',
    options: [
      { value: 'a', labelKey: 'q7.a', weight: 0 }, // Know immediately
      { value: 'b', labelKey: 'q7.b', weight: 1 }, // A few minutes
      { value: 'c', labelKey: 'q7.c', weight: 2 }, // 10–30 minutes of searching
      { value: 'd', labelKey: 'q7.d', weight: 3 }, // Couldn't figure it out
    ],
  },

  {
    id: 8,
    block: 'B',
    type: 'choice',
    questionKey: 'q8',
    options: [
      { value: 'a', labelKey: 'q8.a', weight: 0 }, // No, never
      { value: 'b', labelKey: 'q8.b', weight: 1 }, // Once or twice
      { value: 'c', labelKey: 'q8.c', weight: 2 }, // A few times a year
      { value: 'd', labelKey: 'q8.d', weight: 3 }, // Regularly
    ],
  },

  // ── Block C: Family & Tools ──────────────────────────────────────────────

  {
    id: 9,
    block: 'C',
    type: 'choice',
    questionKey: 'q9',
    options: [
      { value: 'a', labelKey: 'q9.a', weight: 0 }, // Shared, organised system
      { value: 'b', labelKey: 'q9.b', weight: 1 }, // One person handles everything
      { value: 'c', labelKey: 'q9.c', weight: 2 }, // Each manages their own, loosely
      { value: 'd', labelKey: 'q9.d', weight: 3 }, // Largely uncoordinated
    ],
  },

  {
    id: 10,
    block: 'C',
    type: 'scale',
    questionKey: 'q10',
    // 1 = Terrible → weight 4 · 5 = Perfect → weight 0
    options: [
      { value: '1', labelKey: 'q10.1', weight: 4 },
      { value: '2', labelKey: 'q10.2', weight: 3 },
      { value: '3', labelKey: 'q10.3', weight: 2 },
      { value: '4', labelKey: 'q10.4', weight: 1 },
      { value: '5', labelKey: 'q10.5', weight: 0 },
    ],
  },

  {
    id: 11,
    block: 'C',
    type: 'choice',
    questionKey: 'q11',
    options: [
      { value: 'a', labelKey: 'q11.a', weight: 0 }, // One centralised system
      { value: 'b', labelKey: 'q11.b', weight: 1 }, // Spread across 2–3 tools
      { value: 'c', labelKey: 'q11.c', weight: 2 }, // Scattered across many places
      { value: 'd', labelKey: 'q11.d', weight: 3 }, // In my head, or nowhere
    ],
  },

  {
    id: 12,
    block: 'C',
    type: 'multi',
    questionKey: 'q12',
    // Each selected option adds weight 1 (max score contribution: 5)
    options: [
      { value: 'a', labelKey: 'q12.a', weight: 1 }, // Paid for unused subscription
      { value: 'b', labelKey: 'q12.b', weight: 1 }, // Missed insurance/doc renewal
      { value: 'c', labelKey: 'q12.c', weight: 1 }, // Surprise charge on statement
      { value: 'd', labelKey: 'q12.d', weight: 1 }, // Argued with partner over expense
      { value: 'e', labelKey: 'q12.e', weight: 1 }, // Couldn't find payment/deadline info
    ],
  },
]
