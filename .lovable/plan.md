
# Plan: Navigation, Auth, Credits, Referrals

The UI fixes (persistent tabs, sticky nav, preserved state) are pure frontend. Everything else (real Google OAuth, atomic credit deduction, server-enforced plan limits, referral abuse prevention, transaction history) **requires a backend**. localStorage-based credits can be bypassed by clearing storage or opening an incognito tab — there's no way to make it "production-ready" without a database.

I'll enable **Lovable Cloud** (Supabase under the hood) to do this properly.

## Phase 1 — Persistent navigation & state (frontend only)

1. New `src/components/AppShell.tsx` — sticky top nav with tabs: CV Review, Interview Prep, LinkedIn Import, Referrals, Pricing, Account. Active-tab highlighting via TanStack Router `activeProps`. Mobile: collapsible menu.
2. Move `/demo`, `/interview`, `/linkedin` under a shared layout route `src/routes/_app.tsx` rendering `<AppShell><Outlet /></AppShell>`. Tabs never unmount.
3. New routes: `/referrals`, `/account`.
4. Centralized session/CV/interview/job state via a Zustand store (`src/lib/app-store.ts`) so switching tabs preserves uploads and form input.

## Phase 2 — Lovable Cloud + auth

5. Enable Lovable Cloud.
6. Tables:
   - `profiles` (id → auth.users, full_name, email, avatar_url, plan, cv_credits, interview_credits, created_at)
   - `cv_usage` (id, user_id, created_at, job_title) — audit log
   - `referrals` (id, referrer_id, referred_email UNIQUE, status enum[pending|signed_up|rewarded|rejected], created_at, rewarded_at)
   - `credit_transactions` (id, user_id, delta, reason, created_at)
   - Trigger: auto-create profile on signup; on new signup, check if email matches a pending referral → mark `signed_up` → grant +1 CV credit to referrer → log transaction → mark `rewarded`. All atomic in a SECURITY DEFINER function.
   - RLS: users read/write only their own rows.
7. Auth: replace `SignupDialog` localStorage flow with `supabase.auth.signUp` (email/password) + `signInWithOAuth({ provider: 'google' })`. Lovable Cloud's managed Google provider — no client ID/secret needed from the user.
8. `AppShell` shows avatar + email when logged in; sign-out via `supabase.auth.signOut`.

## Phase 3 — Atomic credits & plan enforcement

9. Postgres function `consume_cv_credit(user_id)` — `SELECT ... FOR UPDATE`, checks plan + remaining credits, deducts atomically, returns `{ ok, remaining }` or `{ ok: false, reason: 'limit_reached' }`. Plans: free=1, starter=5, pro=15, unlimited=999999.
10. Server function `analyzeCvSecure` wraps the existing analyzer: calls `consume_cv_credit` first, runs analysis, on failure refunds the credit.
11. Frontend `Analyze` button: disabled while pending, shows "Credits Remaining: N", on `limit_reached` opens existing `PricingLimitDialog`.

## Phase 4 — Referral abuse prevention

12. Server function `createReferral({ email })`:
    - Reject if email == referrer's email (self-referral)
    - Reject if email already exists in `referrals` for this referrer (duplicate)
    - Reject if email already a registered user
    - Insert with status `pending`, fire `referral_created` to n8n
13. Reward grant happens server-side in the signup trigger (Phase 2 step 6) — never client-trusted.
14. `/referrals` page lists referrals with status chips and a credit transaction history table.

## Phase 5 — LinkedIn import status & wiring

15. `/linkedin` (job import variant on `/demo`) shows explicit states: `idle | processing | success | failed` with imported title/company/description/skills card.
16. All key events POSTed to existing n8n webhook via `postToN8n`: `signup`, `cv_analysis`, `credit_consumed`, `credit_added`, `referral_created`, `referral_signed_up`, `referral_reward_granted`, `referral_rejected`, `linkedin_import`.

## Technical notes

- Google OAuth: Lovable Cloud has a managed Google provider — **no GOOGLE_CLIENT_ID/SECRET needed from you**. I'll enable it via the cloud auth config. Callback URL is handled automatically.
- All credit checks are server-side; the frontend display is informational only.
- Existing `cv_tries` localStorage is migrated: on first login, if the user already has the `hirely.user` blob locally, we keep their session but credits become authoritative from the DB.
- I will NOT touch the existing landing page design, color tokens, or Stripe links.

## Scope confirmation

This is roughly 15–25 file changes + 1 migration. **Confirm to proceed**, or tell me to skip any phase (e.g. "skip Google OAuth for now", "do Phase 1 only").
