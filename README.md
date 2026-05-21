# Nevora Quiz

A 2-minute pain-score quiz that helps users discover how well they manage subscriptions, deadlines, and household finances. Built with Next.js 16, Tailwind CSS v4, Framer Motion v12, PostHog, and Supabase.

---

## Local setup

```bash
npm install
cp .env.example .env.local
# Fill in the variables (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The proxy rewrites `/` → `/en` automatically.

### Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (e.g. `https://eu.i.posthog.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

---

## Deployment

```bash
vercel deploy --prod
```

Add all four environment variables in the Vercel project settings before deploying.

---

## Supabase setup

Run the following SQL in the Supabase SQL Editor before the first deploy:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id         bigserial PRIMARY KEY,
  email      text UNIQUE NOT NULL,
  pain_score smallint NOT NULL CHECK (pain_score BETWEEN 0 AND 100),
  profile    text NOT NULL CHECK (profile IN ('under_control','managed_chaos','losing_track','full_chaos')),
  language   text NOT NULL CHECK (language IN ('en','ro','ru')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow the anon key (used by the /api/waitlist route handler) to insert rows
CREATE POLICY "anon_insert" ON waitlist FOR INSERT TO anon WITH CHECK (true);
```

Duplicate emails are silently ignored (upsert with `ignoreDuplicates: true`).

---

## PostHog setup

The following events are captured. Create a funnel in PostHog with these steps to measure drop-off:

| Event | When fired | Key properties |
|---|---|---|
| `quiz_started` | User lands on `/[locale]/quiz` | `locale` |
| `quiz_block_completed` | User finishes block A, B, or C | `block`, `locale` |
| `quiz_completed` | User submits the last question | `score`, `profile`, `locale` |
| `waitlist_joined` | User submits the email form | `score`, `profile`, `locale` |
| `quiz_abandoned` | User closes tab before completing | `currentIndex`, `phase`, `locale` |

**Recommended funnel:** `quiz_started` → `quiz_block_completed (block=A)` → `quiz_block_completed (block=B)` → `quiz_block_completed (block=C)` → `quiz_completed` → `waitlist_joined`

**Recommended insight:** break down `waitlist_joined` by `profile` to see which pain profiles convert best.

---

## Routes

| Path | Description |
|---|---|
| `/en`, `/ro`, `/ru` | Intro landing page |
| `/[locale]/quiz` | 12-question quiz |
| `/[locale]/result?score=&profile=&insights=` | Shareable result page (deep-linkable) |
| `/api/waitlist` | POST — saves email + score to Supabase waitlist table |

---

## i18n

Supported locales: **en**, **ro**, **ru**. The language switcher is available on every screen. Translation strings live in `messages/[locale].json`. Adding a new locale requires:

1. Adding the locale to `i18n/routing.ts`
2. Creating `messages/[locale].json` with all keys from `messages/en.json`
