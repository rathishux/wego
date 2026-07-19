# Product Requirements Document: Steady — Wegovy & Prediabetes Tracker

**Status:** Draft v1.0
**Author:** [Your name]
**Last updated:** July 4, 2026

---

## 1. Overview

Steady is a lightweight, personal tracking app for someone managing weight loss on Wegovy (semaglutide) while prediabetic and under a doctor's care. It consolidates dosage, weight, blood glucose, and food/water logging in one place so the user and their care team can spot patterns and stay on track between appointments.

## 2. Problem Statement

People managing a GLP-1 medication alongside a condition like prediabetes are usually asked to track several things at once — injections, weight, glucose readings, diet — often across paper logs, a phone notes app, and memory. This fragmentation makes it hard to:

- Remember whether a dose was taken and when the next one is due
- Spot correlations (e.g., certain foods and nausea, or activity and glucose trends)
- Bring an organized picture to doctor visits

## 3. Goals

| Goal | Success looks like |
|---|---|
| Centralize tracking | One place for dose, weight, glucose, food/water logs |
| Support doctor visits | Logs are exportable/reviewable at a glance before appointments |
| Reduce daily friction | Logging an entry takes under 30 seconds |
| Reinforce good habits | Tips are visible in-context, not just at onboarding |
| Preserve data | Nothing is lost between sessions without any account/login |

### Non-goals

- Not a diagnostic or medical-advice tool; it does not interpret readings or flag "dangerous" values
- Not a replacement for a doctor, dietitian, or diabetes educator
- Not a general-purpose calorie counter or macro tracker
- No social/sharing features in v1 (single-user, private data only)

## 4. Target User

One primary user profile for v1: an adult prediabetic patient prescribed Wegovy, tracking their own progress, possibly with a caregiver or family member (like the person requesting this) helping set it up or review it periodically.

## 5. Key Use Cases

1. **Log a dose** after a weekly injection, including site and any side effects.
2. **Log weight** periodically (daily or weekly) and see the trend over time.
3. **Log a blood glucose reading** (fasting, pre-meal, post-meal, or bedtime).
4. **Log food and water** for the day, with quick checkboxes for protein/fiber/vegetables rather than full macro entry.
5. **Review a dashboard** before a doctor's appointment to recall recent patterns.
6. **Reference tips** on diet and do's/don'ts without leaving the app.

## 6. Functional Requirements

### 6.1 Dashboard
- Show latest weight, net weight change since first log, latest glucose reading, and estimated next dose date (last dose + 7 days).
- Show a merged, reverse-chronological feed of the most recent entries across all logs.

### 6.2 Dosage Log
- Fields: date, dose (mg, from standard Wegovy titration steps: 0.25 / 0.5 / 1 / 1.7 / 2.4), injection site, side effects (free text), notes.
- List view of past doses with delete capability.

### 6.3 Weight Log
- Fields: date, weight.
- Line chart of weight over time (rendered when 2+ entries exist).
- List view with delete capability.

### 6.4 Blood Glucose Log
- Fields: date, timing (fasting / before meal / 2hr after meal / bedtime), reading (mg/dL), notes.
- List view with delete capability.

### 6.5 Food & Water Log
- Fields: date, free-text meal description, checkboxes (protein goal met, high-fiber foods eaten, vegetables eaten), water intake (glasses), notes.
- List view with delete capability.

### 6.6 Tips Reference
- Static, in-app reference covering: helpful eating patterns, foods/habits to limit, do's and don'ts specific to GLP-1 use and prediabetes, and additional metrics worth tracking (sleep, mood, waist measurement, GI side effects, activity, A1c/labs).

### 6.7 Data Persistence
- All entries persist across sessions using the app's key-value storage, scoped privately to the user (not shared).
- No login/account required for v1.

## 7. Non-Functional Requirements

- **Privacy:** All data is personal-scoped; nothing is shared or transmitted elsewhere.
- **Performance:** Entry logging and tab switches feel instant (no visible lag on typical entries).
- **Reliability:** Storage failures are handled gracefully (e.g., a failed save doesn't crash the tab or silently lose the entry).
- **Accessibility:** Usable via keyboard; sufficient color contrast; form fields have visible labels.
- **Platform:** Single-page web app, works on both desktop and mobile browser widths.

## 8. Explicit Safety & Content Boundaries

- The app never offers medical interpretation of glucose or weight values (e.g., no "this reading is dangerous" logic).
- No dosage recommendation or auto-adjustment logic; the app only records what the doctor already prescribed.
- Tips content is general best-practice information, explicitly framed as non-personalized, with a standing reminder to defer to the prescribing doctor and a dietitian.
- No calorie-restriction targets or numeric diet prescriptions are surfaced, to avoid encouraging unsupervised under-eating on top of appetite suppression from the medication.

## 9. Out of Scope for v1 (Future Considerations)

- Multi-user support / caregiver shared view
- Data export (CSV/PDF) for doctor visits
- Reminders/notifications for upcoming doses
- Integration with wearables or glucose meters (automatic reading import)
- Sleep, mood, and activity as first-class tracked fields (currently only referenced in Tips)
- Charting for glucose trends (currently only weight has a chart)

## 10. Open Questions

- Should glucose trend charting be added in v1.1, matching the weight chart?
- Should there be a lightweight weekly summary (e.g., "logged 5/7 days") to encourage consistency?
- Is a data export needed before the next doctor visit, or is on-screen review sufficient?
- Should missed-dose handling include a neutral, doctor-referred prompt (e.g., "Ask your doctor/pharmacist how to handle a missed dose") rather than leaving it unaddressed?

## 11. Success Metrics (informal, single-user context)

- Consistency: doses, weight, and glucose logged on the days they occur.
- Usefulness at doctor visits: the dashboard/history is enough to answer "how has this month gone?" without digging through notes.

## 12. v1.1 Addendum — Web-first rebuild

- The product is being built **web-first** (desktop + mobile browser), using the **shadcn/ui** design system (React + Tailwind + Radix). (A native mobile app wrapper was deferred at this point in the project; see Section 17 for when it was added.)
- Every log type (dose, weight, glucose, food) now supports an optional **take photo / upload photo** attachment, captured client-side and compressed before storage.
- The **Progress** screen was expanded into a full chronological history of every log entry — including its photo and full details — plus a private, timestamped progress-photo gallery, in addition to the existing weight trend chart, weekly rhythm, and progress markers.

## 13. v1.2 Addendum — Face Progress Community (public, opt-in)

This is a deliberate, scoped exception to Section 3's "no social/sharing features" non-goal and Section 7's privacy posture — everything else in the product remains private and local-only.

- **What it is:** an opt-in, anonymous public feed where users can share a photo of how their face is changing during treatment and see others', framed around solidarity rather than "before/after" comparison or competition. Explicitly not framed as a viral "challenge."
- **Why an exception:** rapid weight loss on GLP-1 medications can visibly change the face ("Ozempic face" — gauntness, hollow cheeks, prominent jowls/wrinkles), which can be an isolating, hard-to-discuss side effect. Peer visibility was requested as a way to normalize it.
- **Identity model:** pseudonymous, not anonymous in the strictest sense — a random pseudonym/avatar hides account identity, but the photo itself can still be facially recognizable. The consent flow says this explicitly rather than overpromising anonymity.
- **Safety requirements (non-negotiable for this feature):** explicit one-time consent screen plus a per-post acknowledgment checkbox before anything is posted; report-and-auto-hide (a post is pulled from public view after 3 reports, pending manual review); users can delete their own posts at any time; no open-ended public comments in v1 (a single lightweight "support" reaction only), to limit the surface for mockery or harassment.
- **Infrastructure:** requires a real backend (Supabase: Postgres + anonymous auth + storage) since, unlike the rest of the app, data must be shared across users. Falls back to a clearly labeled on-device "demo mode" when no backend is configured, so the feature degrades gracefully rather than breaking.
- **Explicitly out of scope for v1:** in-app moderation/admin UI (reviewed via the Supabase dashboard directly for now), blur/crop tooling before posting, follows/DMs, and any leaderboard, streak, or contest mechanic.

## 14. v1.3 Addendum — Account login and cloud sync (opt-in)

This revises Section 6.7 ("Data Persistence") and the "no login/account required" framing in Sections 1 and 3 — but only when a backend is configured. With no backend configured, the app behaves exactly as originally specified (fully local, no account).

- **What it is:** an opt-in account system, gated entirely behind whether a Supabase backend is configured. When configured, the whole app (not just Community) requires sign-in, and dose/weight/glucose/food/progress-photo/marker data moves from `localStorage` into a private, per-account table instead — enabling multi-device use.
- **Sign-in method:** passwordless email one-time-code (OTP), chosen over a traditional password. Rationale: lower friction for a daily-use personal health app, no password-reset flow to build/support, and it avoids the security downsides of password reuse — consistent with where modern consumer apps have been trending. Deliberately no password field exists.
- **Local data is preserved, not discarded:** on first sign-in, any existing local data in that browser is automatically imported into the new account once (tracked via a local flag to avoid re-importing).
- **Graceful degradation:** if no backend is configured, the app requires no login at all and behaves exactly as in v1 — this is the default, unconfigured state, and is what keeps local development possible without any setup.
- **Explicitly out of scope for v1:** a full account-import/merge UI (the import is automatic and silent beyond a confirmation toast), social/OAuth sign-in (Google/Apple), phone-number OTP, and account deletion/data-export tooling.

## 15. v1.4 Addendum — You (private timeline) and Community v2 (comments, text posts)

- **You page:** a new, private, Instagram-style visual timeline — photo required, optional title and description — for tracking face/body/weight changes over time. Stored the same way as other tracking data (local-only or cloud-synced, matching whatever mode is active); nothing here is ever public on its own.
- **Share to Community:** each You entry has an explicit "Share to Community" action that publishes just that entry (photo + title/description as caption) to the public Community feed. This goes through the same one-time consent flow as posting directly to Community — sharing is opt-in per post, never automatic or default-on.
- **Community becomes a general support feed, not face-progress-only:** posts are no longer required to include a photo — text-only updates (progress, wins, motivation) are fully supported, reframing Community from strictly "Ozempic face" comparison toward general peer support during treatment, per user request ("treat it like a Twitter timeline").
- **Comments, added deliberately with matching guardrails:** Section 13 explicitly excluded open-ended comments because they're the primary vector for turning appearance-change content into mockery. Re-introducing them (per explicit user request, weighed against that risk) required carrying the same protection down a level: every individual comment — not just posts — can be reported and auto-hides after 3 reports; comment authors can delete their own comments; the consent dialog now discloses that replies are possible and covers comments explicitly.
- **Explicitly out of scope for this addendum:** comment threading/replies-to-replies, @mentions, follows/DMs, image attachments on comments, and any edit-after-posting capability for posts or comments (delete-and-repost is the only correction path).

## 16. v1.5 Addendum — Settings, Privacy Policy, and Terms & Conditions

- **Account menu redesign:** the sidebar's bottom control now shows "Account" (not the raw email) with an avatar and dropdown, reachable in both local-only and cloud-synced mode — not just when signed in. The dropdown surfaces Settings, Privacy Policy, and Terms & Conditions, plus Sign out when applicable.
- **Settings page:** account info (signed-in email + sign out, or a note about local-only mode), an appearance switcher (light/dark/system), and links to the two legal pages. Not a top-level nav item — reached only via the account menu, to keep the main sidebar focused on tracking features.
- **Privacy Policy and Terms & Conditions:** standard-launch boilerplate pages describing what Steady actually does (local-first storage, opt-in cloud sync, Community's public/pseudonymous exception, no medical advice) — explicitly marked as a draft starting point, not reviewed legal advice, since Section 12 already carries the same "not medical advice" boundary that these pages restate for the legal surface.
- **Explicitly out of scope for this addendum:** real payment/subscription tiers (no monetization exists in the product), a cookie-consent banner (not applicable — Steady doesn't use tracking cookies), and data export/account deletion tooling (already tracked as out of scope in Section 14).

## 17. v1.6 Addendum — Native iOS and Android apps

This revises Section 12: the native mobile app wrapper deferred there is now part of this codebase.

- **Approach:** Capacitor wraps the existing web app in a native shell rather than a from-scratch rewrite (e.g. React Native/Flutter) — one codebase, one Supabase backend, every web feature carries over automatically instead of being reimplemented.
- **Platform-adaptive, not a straight wrapper, per explicit request:** a bottom tab bar (the iOS/Android navigation convention) replaces the sidebar below desktop width; compose dialogs become edge-to-edge bottom sheets on mobile instead of staying centered modals; photo capture uses the native camera/photo-library pickers instead of a browser file input; sharing uses the native share sheet instead of the Web Share API; layout respects safe areas (notch, home indicator, status/navigation bars); the Android hardware back button navigates within the app; status bar style follows the light/dark theme.
- **Tab bar scope:** capped at 5 destinations (Dashboard, Log entry, Progress, You, Community) per iOS HIG guidance. Tips moved into Settings on mobile to make room; Settings/Privacy Policy/Terms & Conditions stay reachable via the account menu on every platform.
- **Build/publish is explicitly out of scope for the agent doing this work:** producing a signed, installable binary and publishing to the App Store/Play Store requires Xcode on a Mac and each platform's developer account, neither of which exist in this project's dev environment. What's delivered instead is the fully configured Capacitor project (`capacitor.config.ts`, generated `android/` and `ios/` native projects, placeholder app icon/splash resources) ready to open directly in Android Studio / Xcode.
- **Explicitly out of scope for this addendum:** push notifications, deep linking, biometric login, and any native widget/watch companion — all deferred to a future phase if needed.
