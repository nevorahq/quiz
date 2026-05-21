// SQL DDL — run in Supabase SQL Editor before deploying:
//
// CREATE TABLE IF NOT EXISTS waitlist (
//   id         bigserial PRIMARY KEY,
//   email      text UNIQUE NOT NULL,
//   pain_score smallint NOT NULL CHECK (pain_score BETWEEN 0 AND 100),
//   profile    text NOT NULL CHECK (profile IN ('under_control','managed_chaos','losing_track','full_chaos')),
//   language   text NOT NULL CHECK (language IN ('en','ro','ru')),
//   created_at timestamptz NOT NULL DEFAULT now()
// );
//
// ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
// -- Allow anonymous inserts (used by the anon key from the client route handler)
// CREATE POLICY "anon_insert" ON waitlist FOR INSERT TO anon WITH CHECK (true);

import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const schema = z.object({
  email: z.email(),
  pain_score: z.number().min(0).max(100),
  profile: z.enum(['under_control', 'managed_chaos', 'losing_track', 'full_chaos']),
  language: z.enum(['en', 'ro', 'ru']),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? 'Invalid input' },
      { status: 422 }
    )
  }

  const { email, pain_score, profile, language } = result.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email, pain_score, profile, language }, { onConflict: 'email', ignoreDuplicates: true })

  if (error) {
    console.error('[waitlist] Supabase error:', error.message)
    return Response.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  return Response.json({ success: true })
}
