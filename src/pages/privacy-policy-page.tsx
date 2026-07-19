import { LegalPageLayout } from "@/components/app/legal-page-layout";
import type { PageId } from "@/components/app/nav-items";

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageId) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <LegalPageLayout onNavigate={onNavigate} lastUpdated="July 19, 2026">
      <section>
        <h2>Overview</h2>
        <p>
          Steady is a personal tracker for Wegovy (semaglutide) doses, weight, blood glucose, and
          food/water logging, plus a private visual timeline ("You") and an opt-in public support feed
          ("Community"). This policy explains what data Steady collects and how it's stored.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Tracking entries you create: dose, weight, glucose, food/water logs, and any photos attached to them</li>
          <li>Your "You" timeline entries: photos, titles, and descriptions</li>
          <li>If you sign in: your email address, used only for passwordless sign-in</li>
          <li>If you post to Community: the pseudonym, avatar color, photo, and text you choose to share publicly</li>
        </ul>
      </section>

      <section>
        <h2>How your data is stored</h2>
        <p>
          By default, Steady runs in <strong>local-only mode</strong>: everything lives in your browser's
          storage on your device only, with no account and nothing sent to a server. If cloud sync is
          configured, signing in moves your tracking data into a private, per-account database (Supabase),
          protected so that only you can read or write it.
        </p>
      </section>

      <section>
        <h2>Community is the one exception</h2>
        <p>
          Everywhere else in Steady, your data stays private. Community is different by design: posts and
          comments you choose to share there are visible to other Steady users. Your account identity is
          hidden behind a random pseudonym, but if you include a photo, your face may still be
          recognizable — anonymity protects your account, not necessarily your appearance. Sharing to
          Community always requires an explicit action and one-time consent; nothing is posted there
          automatically.
        </p>
      </section>

      <section>
        <h2>Data sharing</h2>
        <p>
          We don't sell your data or share it with advertisers. When cloud sync is enabled, Supabase acts
          as our infrastructure provider (database, authentication, storage, and email delivery for
          sign-in codes) and processes data on our behalf under its own security practices.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <ul>
          <li>You can delete any entry, You post, or Community post/comment at any time</li>
          <li>You can sign out at any time</li>
          <li>You can use Steady without ever creating an account by not configuring cloud sync</li>
        </ul>
      </section>

      <section>
        <h2>Not medical advice</h2>
        <p>
          Steady only records what you enter. It never interprets your readings, offers medical advice, or
          adjusts dosage recommendations. Always talk to your doctor or pharmacist about your treatment.
        </p>
      </section>

      <section>
        <h2>Age</h2>
        <p>
          Steady is intended for adults managing their own prescribed treatment and is not directed at
          children.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, we'll update the "last updated" date above.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about this policy? Reach out at [your contact email].</p>
      </section>
    </LegalPageLayout>
  );
}
