# Steady — Wegovy & Prediabetes Tracker

A web app for tracking Wegovy (semaglutide) doses, weight, blood glucose, and food/water habits — plus an optional, anonymous **Face Progress Community** for sharing how faces change during treatment. Built as a React + TypeScript + Tailwind CSS web app using the [shadcn/ui](https://ui.shadcn.com) design system, and packaged as an installable PWA.

See `PRD.md` for the full product requirements.

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **Tailwind CSS v4** with **shadcn/ui** components (Radix primitives, "new-york" style)
- **Recharts** for the weight trend chart
- Two data modes, chosen automatically at build time (see "Account & cloud sync" below):
  - **Local-only** (default, no setup required): everything lives in the browser's `localStorage`, no backend, no login.
  - **Cloud-synced**: once a Supabase backend is configured, the app requires signing in (passwordless email code) and all tracking data syncs to your account instead of just one device.
- `vite-plugin-pwa` for installability (works offline, add-to-home-screen)

This is being built web-first. A native mobile app (e.g. via Capacitor) is a planned follow-up, not part of this codebase yet.

## Running locally

```
npm install
npm run dev
```

Then open the printed local URL.

## Building

```
npm run build   # type-checks and builds to dist/
npm run preview # preview the production build locally
```

## Data & privacy

- **Local-only mode (default):** all tracking data (doses, weight, glucose, food, private progress photos) is stored in the browser's `localStorage` only — nothing is sent to a server, and there is no login/account. Clearing browser data or storage will remove logs. Photos attached to log entries are compressed client-side and stored inline as data URLs.
- **Cloud-synced mode (opt-in, see below):** tracking data instead lives in a private, per-account Supabase table, readable only by you (enforced by row-level security), so it follows you across devices once signed in.

The **Face Progress Community** is always the one exception to "your data stays private": posts made there are, by design, visible to other users. See the section below.

## Features

- **Dashboard** — next-dose estimate, latest weight/glucose, and a recent-activity feed
- **Log entry** — dose, weight, glucose, and food/water forms, each with an optional **take photo / upload** attachment
- **Progress** — weight trend chart, weekly logging rhythm, non-scale progress markers, a private timestamped photo gallery, and a full chronological history of every log with its photo and details
- **Face Progress Community** — an opt-in, anonymous space to share and see how faces change during treatment (see below)
- **Tips** — static, non-personalized guidance and safety boundaries

## Account & cloud sync

By default the app has no login and needs none — every page works immediately with `localStorage`. Signing in and syncing data to the cloud is entirely opt-in, activated by configuring a Supabase backend (the same one used for the Community feature).

- **Sign-in method:** passwordless email code (OTP) — enter your email, get a 6-digit code, done. No password to create, remember, or reset.
- **Once a backend is configured**, the whole app requires signing in, and *all* tracking data (dose/weight/glucose/food/progress photos/markers) moves from `localStorage` into a private table scoped to your account via row-level security — nobody else can read it, including other Steady users.
- **Existing local data isn't lost:** the first time you sign in, the app automatically imports whatever was already logged in that browser's `localStorage` into your new account, once, in the background.
- **Multi-device:** once signed in, the same data follows you to any browser/device you sign into with that email.

### Setup

In addition to the Community feature's setup (below), run one more script:

1. Complete steps 1–2 of the Community setup below (Supabase project + enabling sign-in) if you haven't already — this reuses the same project.
2. In the **SQL Editor**, additionally run `supabase/schema_accounts.sql` — it creates the private `entries` and `user_markers` tables and their row-level security policies, separate from the Community feature's public tables.
3. Run `NOTIFY pgrst, 'reload schema';` once afterward (same as the Community setup) so the API picks up the new tables immediately.

No new environment variables are needed — it reuses `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from the Community setup.

**Heads up:** once this is configured on your deployed site, the whole app will require signing in from then on — there's no way to use the cloud-synced build without an account. If you want to keep using the app with no login at all, simply don't configure these two environment variables (or remove them) and it stays in local-only mode.

## Face Progress Community

Everywhere else in Steady, data never leaves your device. This feature is different on purpose: it's a small public community feed where users can share a photo and see others', framed around solidarity rather than comparison or "before/after" spectacle. Because it involves publicly shared face photos tied to a medication side effect, it's built with guardrails:

- **Anonymous by default** — posts show a randomly generated pseudonym and color, never a real name, email, or account handle.
- **Explicit consent** — a one-time dialog explains what's public before your first post, and every post requires checking an acknowledgment box. The dialog is also honest that anonymity protects your identity, not necessarily your face.
- **Report + auto-hide** — any post can be reported (mocking/harassment, inappropriate, unrelated, other); a post is automatically hidden from the public feed once it collects 3 reports, pending manual review.
- **Delete anytime** — you can remove your own posts at any time.
- No public free-text comments in v1 — only a lightweight "support" reaction, to reduce the surface for ridicule.

### Setup

The Community feature needs a small backend to actually share posts between users (everything else in the app stays local-only). Without one configured, it falls back to a **local demo mode** — clearly labeled in the UI — where posts only stay on your device.

To enable it for real, using a free [Supabase](https://supabase.com) project:

1. Create a Supabase project.
2. In **Authentication → Sign In / Providers**, enable **Anonymous Sign-Ins**.
3. In the **SQL Editor**, run `supabase/schema.sql` from this repo — it creates the tables, triggers, row-level security policies, and the `community-photos` storage bucket.
4. Copy `.env.example` to `.env.local` and fill in your project's `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API) for local development.
5. For the deployed GitHub Pages build, add the same two values as repository secrets (`Settings → Secrets and variables → Actions`) named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — the deploy workflow already passes them through at build time.

### Moderating reports

There's no in-app admin panel yet. Reported/auto-hidden posts can be reviewed and restored (or permanently removed) directly from the Supabase Table Editor: check `community_posts.hidden = true` and `community_reports` for the reasons filed against it.

## Structure

- `src/pages/` — the top-level screens (Dashboard, Log entry, Progress, Community, Tips) plus `login-page.tsx`
- `src/components/app/` — app-specific components (sidebar/shell, photo capture, entry forms/lists, community UI)
- `src/components/ui/` — shadcn/ui primitives
- `src/lib/` — types, `localStorage` persistence, and shared formatting helpers
- `src/lib/supabase.ts` — the shared Supabase client, used by both the Community feature and cloud sync
- `src/lib/community/` — the Community feature's backend abstraction (Supabase-backed when configured, local demo mode otherwise)
- `src/lib/migrate-local-data.ts` — the one-time local-to-cloud data import that runs on first sign-in
- `src/hooks/use-auth.tsx`, `use-entries.ts`, `use-cloud-list.ts`, `use-cloud-markers.ts`, `use-markers.ts` — auth state and the local/cloud data hooks that transparently swap based on whether a backend is configured
- `supabase/schema.sql` — database schema, RLS policies, and storage bucket setup for the Community feature
- `supabase/schema_accounts.sql` — database schema and RLS policies for private, per-account cloud-synced tracking data
- `public/icon.svg` — app icon (used for favicon and PWA manifest)
