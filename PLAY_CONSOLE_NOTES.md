# Play Console — how to actually find things (current UI, confirmed Oct 2026)

Google renames and reshuffles the Play Console sidebar often. Generic "go to Store
settings" advice goes stale fast. This is the path that was confirmed working for
NivYou's production app (`com.rathish.nivyou`) on Oct 18, 2026 — update this file
whenever the layout changes again instead of relying on memory.

## Open your app

1. Go to `play.google.com/console`.
2. You land on "All apps" — click **NivYou** (shows as `com.rathish.nivyou`).
3. There is no separate "Your app" menu item — clicking the app card from the list
   *is* that step.

## Check why a release was rejected

1. Dashboard shows a red "⚠ Update rejected" line directly, if one exists.
2. Click **"Go to Policy status"** next to it.
3. Or: left sidebar → **Monitor and improve → Policy and programs → App content**.
   This lists every policy declaration (privacy policy, data safety, ads, content
   rating, target audience, etc.) and flags which ones need attention.

## Fix a flagged declaration (e.g. Privacy Policy URL)

1. Monitor and improve → Policy and programs → App content.
2. Find the flagged item (e.g. "Privacy policy") under **"Need attention"**.
3. Click **"Edit declaration"**.
4. Fix/confirm the field (e.g. the Privacy Policy URL — test it loads with no
   login in an incognito window first).
5. Save.

## See release status directly

1. Left sidebar → **Test and release → Production**.
2. Tabs: "Release dashboard" (stats/suggestions, not status) / **"Releases"**
   (actual status) / "Countries / regions".
3. Click **"Releases"** tab — shows e.g. `1 (1.0)` with a status line like
   "Update rejected" or "Live".

## Actually resubmit — the part that's easy to get wrong

**"Recovery tools" on the release page is NOT for resubmitting a rejected
release** — it only has things like "Prompt user update" (nudges existing
installed users to update to a newer version; irrelevant here).

The real resubmit path:

1. Left sidebar → **Publishing overview**.
2. If there's anything rejected, a red banner says "Some recent changes were
   rejected" with its own "Go to Policy status" link.
3. Scroll to **"Changes not yet submitted for review"**.
4. Review the listed changes (declarations you edited, the release itself,
   etc.) so nothing unintended is bundled in.
5. Click the blue **"Submit N changes for review"** button.
6. That's the actual resubmission — not anything under "Test and release" or
   "Recovery tools".

## Context: why NivYou got rejected (Oct 2026 round)

Vercel's deployment protection (password/login wall on preview deployments)
was blocking Google's reviewer from opening the Privacy Policy URL submitted
in App content → Privacy policy. Fix was two-part:
- Vercel project setting: disable deployment protection on that preview
  (done by the app owner directly in Vercel, not in this repo).
- Code: removed the "Draft — not legal advice" banner from the legal pages
  (`src/components/app/legal-page-layout.tsx`) and tightened the Privacy
  Policy's account-deletion section, since a published policy page
  shouldn't read as unfinished to a reviewer.

## Rejection round 2 (Oct 22, 2026): "Privacy Policy is not clearly labeled"

Exact rejection text: *"Your privacy policy does not include an explicit
label identifying it as a 'Privacy policy.' Add a prominent 'Privacy Policy'
header to the top of your document."*

Root cause: the page had no heading at all — it went straight from the
"Back" button to "Last updated" to an "Overview" section. No visible text
anywhere said "Privacy Policy."

Fix: added a `title` prop to `LegalPageLayout`, rendered as a real `<h1>` at
the very top of the page (before "Last updated"). Applied to all three legal
pages so none of them repeat this mistake — Privacy Policy, Terms &
Conditions, Health Data Privacy each now have their own `<h1>` matching
their actual name. Also set `document.title` per standalone legal route in
`App.tsx` so the same label shows in the browser tab, not just the page
body.

**Lesson for next time**: before resubmitting after a rejection, actually
read the rendered page like a reviewer would — check for the exact thing
named in the rejection (a literal heading, a literal link, a literal
section), not just "does the content cover this topic somewhere."
