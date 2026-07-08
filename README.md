# Steady — Wegovy & Prediabetes Tracker

A private, single-user web app for tracking Wegovy (semaglutide) doses, weight, blood glucose, and food/water habits. Built as a React + TypeScript + Tailwind CSS web app using the [shadcn/ui](https://ui.shadcn.com) design system, and packaged as an installable PWA.

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

All entries are stored in the browser's `localStorage` only — nothing is sent to a server, and there is no login/account. Clearing browser data or storage will remove logs. Photos attached to log entries are compressed client-side and stored inline as data URLs, also only in `localStorage`.

## Features

- **Dashboard** — next-dose estimate, latest weight/glucose, and a recent-activity feed
- **Log entry** — dose, weight, glucose, and food/water forms, each with an optional **take photo / upload** attachment
- **Progress** — weight trend chart, weekly logging rhythm, non-scale progress markers, and a full chronological history of every log with its photo and details
- **Tips** — static, non-personalized guidance and safety boundaries

## Structure

- `src/pages/` — the four top-level screens (Dashboard, Log entry, Progress, Tips)
- `src/components/app/` — app-specific components (sidebar/shell, photo capture, entry forms/lists)
- `src/components/ui/` — shadcn/ui primitives
- `src/lib/` — types, `localStorage` persistence, and shared formatting helpers
- `public/icon.svg` — app icon (used for favicon and PWA manifest)
