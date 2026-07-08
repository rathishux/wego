# Steady — Wegovy & Prediabetes Tracker

A private, single-user web app for tracking Wegovy (semaglutide) doses, weight, blood glucose, and food/water habits. Built as a static, dependency-free PWA (vanilla HTML/CSS/JS) so it installs on mobile home screens today and can be wrapped for Android/iOS later (e.g. with Capacitor) without a rewrite.

See `PRD.md` for the full product requirements.

## Running locally

No build step. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Data & privacy

All entries are stored in the browser's `localStorage` only — nothing is sent to a server, and there is no login/account. Clearing browser data or storage will remove logs.

## Structure

- `index.html` — app shell + `<template>` markup for each tab
- `styles.css` — design system (light/dark aware)
- `app.js` — routing, storage, and rendering logic
- `manifest.json` / `sw.js` — PWA installability and offline app-shell caching
- `icons/` — app icon
