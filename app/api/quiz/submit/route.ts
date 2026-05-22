// SQL DDL — run in Supabase SQL Editor before deploying:
//
// CREATE TABLE IF NOT EXISTS quiz_submissions (
//   id            bigserial PRIMARY KEY,
//   email         text NOT NULL,
//   answers       jsonb NOT NULL,
//   answers_count smallint NOT NULL CHECK (answers_count BETWEEN 1 AND 12),
//   score         smallint NOT NULL CHECK (score BETWEEN 0 AND 100),
//   profile       text NOT NULL CHECK (profile IN ('under_control','managed_chaos','losing_track','full_chaos')),
//   insights      text[] NOT NULL,
//   language      text NOT NULL CHECK (language IN ('en','ro','ru')),
//   pathname      text,
//   utm_source    text,
//   utm_medium    text,
//   utm_campaign  text,
//   utm_content   text,
//   utm_term      text,
//   submitted_at  timestamptz NOT NULL DEFAULT now()
// );
//
// ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "anon_insert" ON quiz_submissions FOR INSERT TO anon WITH CHECK (true);

import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const utmString = z.string().max(500).optional()

const submitSchema = z.object({
  email: z.email(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  answers_count: z.number().int().min(1).max(12),
  score: z.number().min(0).max(100),
  profile: z.enum(['under_control', 'managed_chaos', 'losing_track', 'full_chaos']),
  insights: z.array(z.string()).max(10),
  language: z.enum(['en', 'ro', 'ru']),
  pathname: z.string().max(500),
  timestamp: z.string().datetime(),
  utm_source: utmString,
  utm_medium: utmString,
  utm_campaign: utmString,
  utm_content: utmString,
  utm_term: utmString,
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 422 },
    )
  }

  const {
    email,
    answers,
    answers_count,
    score,
    profile,
    insights,
    language,
    pathname,
    timestamp,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [submissionResult, waitlistResult] = await Promise.all([
    supabase.from('quiz_submissions').insert({
      email,
      answers,
      answers_count,
      score,
      profile,
      insights,
      language,
      pathname,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      submitted_at: timestamp,
    }),
    supabase
      .from('waitlist')
      .upsert({ email, pain_score: score, profile, language }, { onConflict: 'email', ignoreDuplicates: true }),
  ])

  if (submissionResult.error) {
    console.error('[quiz/submit] Supabase error:', submissionResult.error.message)
    return Response.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  if (waitlistResult.error) {
    // Non-fatal: submission was saved, waitlist upsert is best-effort
    console.warn('[quiz/submit] Waitlist upsert failed:', waitlistResult.error.message)
  }

  return Response.json({ success: true })
}
