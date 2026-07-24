import { LegalPageLayout } from "@/components/app/legal-page-layout";
import type { PageId } from "@/components/app/nav-items";

interface TermsPageProps {
  onNavigate: (page: PageId) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <LegalPageLayout onNavigate={onNavigate} lastUpdated="July 19, 2026">
      <section>
        <h2>Acceptance of terms</h2>
        <p>By using NivYou, you agree to these terms. If you don't agree, please don't use the app.</p>
      </section>

      <section>
        <h2>What NivYou is</h2>
        <p>
          NivYou is a personal tracking tool for Wegovy (semaglutide) doses, weight, blood glucose, and
          food/water logging, along with a private visual timeline and an opt-in public support feed.
        </p>
      </section>

      <section>
        <h2>Not medical advice</h2>
        <p>
          NivYou is not a diagnostic or medical-advice tool. It does not interpret your readings, flag
          "dangerous" values, or recommend dosage changes — it only records what you enter. NivYou is not a
          substitute for your doctor, pharmacist, or dietitian. Always follow your care team's guidance,
          especially before changing anything about your treatment.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <p>
          If cloud sync is enabled, you're responsible for the accuracy of the email you sign in with and
          for anything posted from your account. NivYou is intended for adults managing their own
          treatment.
        </p>
      </section>

      <section>
        <h2>Community conduct</h2>
        <p>
          Community exists for solidarity and support during treatment — not comparison, mockery, or
          harassment. Posts and comments you find inappropriate can be reported; reported content is
          automatically hidden after enough reports, pending review. Repeated or severe misuse may result
          in content removal or loss of access to Community.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You own the photos and text you post. By sharing something to Community, you give NivYou
          permission to display it to other users within the app, and you confirm you have the right to
          share it. You can delete your own posts and comments at any time.
        </p>
      </section>

      <section>
        <h2>Prohibited use</h2>
        <ul>
          <li>Posting content that harasses, mocks, or targets another user's appearance</li>
          <li>Impersonating another person or misrepresenting your identity</li>
          <li>Using NivYou for anything unlawful, or to distribute malware or spam</li>
        </ul>
      </section>

      <section>
        <h2>Disclaimer & limitation of liability</h2>
        <p>
          NivYou is provided "as is," without warranties of any kind. To the fullest extent permitted by
          law, we aren't liable for any indirect, incidental, or consequential damages arising from your
          use of the app, including decisions made based on tracked data.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>If these terms change, we'll update the "last updated" date above.</p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about these terms? Reach out at rathishuid@gmail.com.</p>
      </section>
    </LegalPageLayout>
  );
}
