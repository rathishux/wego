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
