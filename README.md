# San Dauk Lay — Little Detective

San Dauk Lay is a friendly digital-safety workspace that helps people spot and
stop online scams (phishing, OTP theft, money-pressure fraud, prize bait). It
includes email/password + Google sign-in, four learner modules, a profile page,
and an admin panel for managing users and roles.

Built with **Next.js (App Router) + Supabase**, designed to deploy on **Vercel**.

## Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------ |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS v4           |
| Backend    | Next.js server actions + route handlers                      |
| Auth       | Supabase Auth (email/password + Google OAuth)                |
| Database   | Supabase Postgres (`profiles` table, RLS, triggers)          |
| Deployment | Vercel (app) + Supabase (managed database & auth)            |

The four learner modules — **Safety Check**, **AI Detective**, **Safety
Academy**, **Community Watch** — run entirely client-side (rule-based, no real
AI), exactly as the PRD specifies. Auth and admin are backed by Supabase.

## Getting started

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then apply the schema
in `supabase/migrations/0001_init.sql` (via the SQL editor, or the Supabase CLI
`supabase db push`). This creates the `profiles` table, row-level security
policies, and the trigger that provisions a profile for every new auth user
(the first account, or any when no admin exists yet, becomes an admin).

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` from **Project Settings → API**.

### 3. Seed demo accounts (optional)

```bash
node scripts/seed.mjs
```

Creates the demo users — all with the password `password`:

- Admin: `admin@sandauklay.test`
- Student: `student@sandauklay.test`
- …plus six sample users (two more Google, one more admin).

### 4. Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Google OAuth (optional)

Enable the Google provider in **Supabase → Authentication → Providers**, add
your Google client ID/secret, and set the redirect URL to
`https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback`
for local dev). No app code changes are needed.

## Deploy to Vercel

1. Import the repo into Vercel.
2. Add the three Supabase env vars (mark `SUPABASE_SERVICE_ROLE_KEY` as
   server-only — it is never exposed to the browser).
3. Deploy. Add your production domain to Supabase's allowed redirect URLs for
   OAuth.

## Notes / known limitations

- Academy progress and Community Watch reports are client-side only (per the
  PRD) — Academy uses `localStorage`; reports are draft-only previews.
- AI Detective is keyword rules, not a real model.
- Admin safeguards match the original: the last remaining admin cannot be
  demoted or deleted, and admins cannot delete their own account.
