# Steady — Wegovy & Prediabetes Tracker

A private, single-user web app for tracking Wegovy (semaglutide) doses, weight, blood glucose, and food/water habits — plus an optional, anonymous **Face Progress Community** for sharing how faces change during treatment. Built as a React + TypeScript + Tailwind CSS web app using the [shadcn/ui](https://ui.shadcn.com) design system, and packaged as an installable PWA.

See `PRD.md` for the full product requirements.

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **Tailwind CSS v4** with **shadcn/ui** components (Radix primitives, "new-york" style)
- **Recharts** for the weight trend chart
- Client-only: all data lives in the browser's `localStorage`, no backend/login
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

All tracking data (doses, weight, glucose, food, private progress photos) is stored in the browser's `localStorage` only — nothing is sent to a server, and there is no login/account. Clearing browser data or storage will remove logs. Photos attached to log entries are compressed client-side and stored inline as data URLs, also only in `localStorage`.

The **Face Progress Community** is the one exception: posts made there are, by design, visible to other users. See the section below.

## Features

- **Dashboard** — next-dose estimate, latest weight/glucose, and a recent-activity feed
- **Log entry** — dose, weight, glucose, and food/water forms, each with an optional **take photo / upload** attachment
- **Progress** — weight trend chart, weekly logging rhythm, non-scale progress markers, a private timestamped photo gallery, and a full chronological history of every log with its photo and details
- **Face Progress Community** — an opt-in, anonymous space to share and see how faces change during treatment (see below)
- **Tips** — static, non-personalized guidance and safety boundaries

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

- `src/pages/` — the top-level screens (Dashboard, Log entry, Progress, Community, Tips)
- `src/components/app/` — app-specific components (sidebar/shell, photo capture, entry forms/lists, community UI)
- `src/components/ui/` — shadcn/ui primitives
- `src/lib/` — types, `localStorage` persistence, and shared formatting helpers
- `src/lib/community/` — the Community feature's backend abstraction (Supabase-backed when configured, local demo mode otherwise)
- `supabase/schema.sql` — database schema, RLS policies, and storage bucket setup for the Community feature
- `public/icon.svg` — app icon (used for favicon and PWA manifest)
