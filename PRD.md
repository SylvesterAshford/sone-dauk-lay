# Product Requirements Document — San Dauk Lay ("Little Detective")

## 1. Overview

**Product:** San Dauk Lay — a friendly digital-safety workspace that teaches users to recognize and respond to online scams (phishing, OTP theft, money-pressure fraud, prize bait).

**Stage:** Presentation-ready prototype. Learning modules run client-side only; authentication and user administration are fully functional against a real backend.

**Target users:**

- **Learners/students** — people who want to check suspicious messages and learn safe online habits.
- **Admins** — platform operators who manage accounts, roles, and monitor sign-ups.

## 2. Problem Statement

Everyday users — particularly students and less tech-savvy people — fall for scam messages (fake bank alerts, OTP requests, prize offers, urgent money transfers). There is no simple, localized, friendly tool that lets them (a) quickly assess a suspicious message before acting and (b) build lasting safe-internet habits through short lessons.

## 3. Goals

1. Give users a fast, guided way to evaluate suspicious messages before they reply, pay, click, or share data.
2. Teach core scam-defense habits through bite-sized lessons.
3. Lay the groundwork for community scam reporting.
4. Provide admins with basic user and role management.
5. Support both email/password and Google sign-in.

**Non-goals (current phase):** real AI/ML message analysis, persistent lesson progress, live community report submission, mobile apps, multi-language content.

## 4. Features & Requirements

### 4.1 Authentication & Accounts

- Email/password **register, login, logout** (Laravel Sanctum token auth).
- Optional **Google OAuth** login (Socialite; redirect + callback flow, tokens passed back to the SPA via `/auth/callback`).
- Route guards: guests are redirected to login for protected pages; authenticated users are kept out of guest pages; non-admins are bounced from `/admin` to the dashboard.

### 4.2 Dashboard

- Personalized greeting, sidebar navigation, logout.
- Card grid of the four learner modules (Safety Check, AI Detective, Academy, Community Watch), each with status badges.
- Admin-only section linking to User Management, Content Review, and Reports.

### 4.3 Safety Check (interactive checklist)

- Five common scam signs (urgency pressure, money/gift-card requests, strange links, OTP/password requests, too-good-to-be-true offers).
- Live **risk score** = number of checked signs:
  - 0 → "No signs selected" (green)
  - 1–2 → "Be careful" (yellow)
  - 3+ → "High risk" (red)
- Each tier shows guidance text; the check is resettable.

### 4.4 AI Detective (message analyzer)

- User pastes an SMS/chat/email; a **rule-based keyword engine** (explicitly not real AI) flags five warning categories: urgent pressure, money requests, private-code requests, suspicious links, prize bait.
- Same 0 / 1–2 / 3+ risk tiering with advice; matched signs are listed; "Load Example" provides a demo scam message.

### 4.5 Safety Academy (micro-lessons)

- Six lessons: check the sender, protect OTP codes, pause money pressure, inspect links, save evidence, report safely.
- Check-off progress tracker (`X / 6 lessons`) with reset. **Progress is session-only, not persisted** (known limitation).

### 4.6 Community Watch (report drafting)

- Form: scam type (fake shop, phishing link, OTP request, money emergency, prize message), channel, and description, with a live report preview.
- Explicitly local-only: "reports are not submitted to a live database yet."

### 4.7 Admin Panel

- **Overview stats:** total users, admins, Google vs. email users, new sign-ups this week, plus 6 most recent users.
- **User management:** paginated (12/page), searchable by name/email/role/provider; change role (admin/user); delete accounts.
- **Safeguards:** the last remaining admin cannot be demoted; an admin cannot delete their own account. All admin endpoints re-verify the admin role server-side.

## 5. Technical Architecture

| Layer      | Choice                                                                          |
| ---------- | ------------------------------------------------------------------------------- |
| Frontend   | Vue 3 SPA, Vite, Vue Router, Pinia (user store), Tailwind CSS (dark theme)       |
| Backend    | Laravel (PHP 8.3+), Sanctum tokens, Socialite for Google OAuth                   |
| Database   | SQLite (`storage/app/database.sqlite`), seeded demo data                         |
| Deployment | Docker Compose — frontend at `:5173` (nginx), API at `:8000/api`; SQLite persisted in a Docker volume |

**API surface:**

- Public: `POST /register`, `POST /login`
- Authenticated: `POST /logout`, `GET /user`
- Admin: `GET /admin/overview`, `GET /admin/users`, `PATCH /admin/users/{user}`, `DELETE /admin/users/{user}`
- Web routes for Google OAuth redirect/callback

**Demo accounts:** `admin@sandauklay.test` / `password` and `student@sandauklay.test` / `password`, plus six seeded sample users.

## 6. Success Criteria (prototype)

- A demo walkthrough works end-to-end with one command (`docker compose up --build`): register/login → run all four modules → admin manages users.
- Risk scoring responds instantly and gives clear, actionable advice at each tier.
- Admin operations enforce role checks and safety rules (last-admin, self-delete).

## 7. Known Limitations / Future Roadmap

1. **AI Detective** is regex keyword matching — replace with a real classification model or LLM API.
2. **Academy progress** and **Community Watch reports** are not persisted — add backend models/endpoints.
3. Community reports have no submission, moderation, or public feed.
4. Admin "Content Review" and "Reports" modules just link to the learner pages — no real admin tooling behind them yet.
5. No password reset, email verification flow in the UI, localization (Burmese), or automated frontend tests.
