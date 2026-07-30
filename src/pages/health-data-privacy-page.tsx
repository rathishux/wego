import { LegalPageLayout } from "@/components/app/legal-page-layout";
import type { PageId } from "@/components/app/nav-items";

interface HealthDataPrivacyPageProps {
  onNavigate: (page: PageId) => void;
}

export function HealthDataPrivacyPage({ onNavigate }: HealthDataPrivacyPageProps) {
  return (
    <LegalPageLayout onNavigate={onNavigate} lastUpdated="July 23, 2026">
      <section>
        <h2>Why a separate health data notice</h2>
        <p>
          NivYou's general Privacy Policy covers the app as a whole. This page focuses specifically on
          your health information — dose, weight, glucose, food logs, side-effect notes, and your private
          "You" photo timeline — since some regions (for example, Washington State's My Health My Data
          Act) expect health data to be described on its own, in plain terms, separate from a general
          privacy policy.
        </p>
      </section>

      <section>
        <h2>What counts as health data here</h2>
        <ul>
          <li>Dose entries: amount, injection site, side-effect notes, and any photo you attach</li>
          <li>Weight and blood glucose readings</li>
          <li>Food and water logs</li>
          <li>Optional progress markers: waist measurement, sleep, mood, GI side effects</li>
          <li>Your "You" timeline: photos and descriptions documenting physical changes over time</li>
          <li>Optional account profile fields: sex, birthday, height, weight</li>
        </ul>
      </section>

      <section>
        <h2>Why we collect it</h2>
        <p>
          Solely so the app can do the one thing it's for: let you track your own treatment and see your
          own trends. Nothing here is used for advertising, profiling, or any purpose beyond showing your
          data back to you.
        </p>
      </section>

      <section>
        <h2>We do not sell or share your health data</h2>
        <p>
          Your health data is never sold, licensed, or shared with advertisers, data brokers, or any third
          party for their own purposes. When cloud sync is enabled, Supabase (our infrastructure provider)
          processes it strictly on our behalf to run the app — it does not use it for anything else. We
          never use location data to target you near a doctor's office, pharmacy, or clinic, and we don't
          use geofencing at all.
        </p>
      </section>

      <section>
        <h2>Where it lives</h2>
        <p>
          By default, everything stays only on your device (local-only mode) — nothing is transmitted
          anywhere. If you choose to enable cloud sync, your data moves to a private, per-account database
          protected so only you can read or write it, encrypted in transit.
        </p>
      </section>

      <section>
        <h2>The one thing you can choose to share</h2>
        <p>
          Community is opt-in and separate from the rest of your health data — nothing is posted there
          automatically, and it always requires an explicit action and one-time consent from you first.
        </p>
      </section>

      <section>
        <h2>Your control over this data</h2>
        <ul>
          <li>Delete any individual entry, You post, or Community post/comment at any time — no need to delete your whole account for that</li>
          <li>Use NivYou entirely without an account by never enabling cloud sync</li>
        </ul>
      </section>

      <section>
        <h2>Delete your NivYou account and data</h2>
        <p>If you've signed in with cloud sync, you can permanently delete your NivYou account at any time:</p>
        <ol>
          <li>Open NivYou and sign in</li>
          <li>Go to Settings → Account</li>
          <li>Scroll to the bottom and select Delete account</li>
          <li>Confirm in the dialog that appears</li>
        </ol>
        <p>
          This deletes your account and every record tied to it — dose, weight, glucose, and food entries,
          progress markers, You timeline photos, Community posts and comments, and profile details —
          immediately and completely. Nothing is retained afterward, and there is no grace period or backup
          copy kept once you confirm.
        </p>
        <p>If you're using NivYou without an account (local-only mode), just delete the app to remove all your data — nothing was ever sent anywhere.</p>
      </section>

      <section>
        <h2>Not a medical record</h2>
        <p>
          NivYou only stores what you enter. It doesn't diagnose, interpret your readings, or substitute
          for your actual medical record with your care team. Some entries may trigger a general,
          non-diagnostic reminder to check with your doctor if what you've described sounds serious — that
          reminder is based on simple keyword matching against publicly available safety information, not
          a medical assessment of you personally.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about how your health data specifically is handled? Reach out at bushchat3@gmail.com.</p>
      </section>
    </LegalPageLayout>
  );
}
