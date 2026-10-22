import * as React from "react";

import { LogoMark } from "@/components/app/logo-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const HealthDataPrivacyPage = React.lazy(() =>
  import("@/pages/health-data-privacy-page").then((m) => ({ default: m.HealthDataPrivacyPage })),
);
const PrivacyPolicyPage = React.lazy(() =>
  import("@/pages/privacy-policy-page").then((m) => ({ default: m.PrivacyPolicyPage })),
);
const TermsPage = React.lazy(() => import("@/pages/terms-page").then((m) => ({ default: m.TermsPage })));

const PAGE_FALLBACK = <p className="text-muted-foreground text-sm">Loading…</p>;

interface LegalAcceptancePageProps {
  onAccept: () => void;
}

type LegalDocView = "consent" | "terms" | "privacy" | "healthPrivacy";

export function LegalAcceptancePage({ onAccept }: LegalAcceptancePageProps) {
  const [view, setView] = React.useState<LegalDocView>("consent");
  const [agreed, setAgreed] = React.useState(false);
  const backToConsent = React.useCallback(() => setView("consent"), []);

  if (view !== "consent") {
    return (
      <div className="bg-background flex min-h-svh justify-center px-4 py-8">
        <React.Suspense fallback={PAGE_FALLBACK}>
          {view === "terms" && <TermsPage onNavigate={backToConsent} />}
          {view === "privacy" && <PrivacyPolicyPage onNavigate={backToConsent} />}
          {view === "healthPrivacy" && <HealthDataPrivacyPage onNavigate={backToConsent} />}
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <LogoMark className="size-5.5" />
            </div>
            <span className="font-semibold">NivYou</span>
          </div>
          <CardTitle>Before you start</CardTitle>
          <CardDescription>Please review and accept these to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="legal-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="legal-agree" className="text-sm leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2"
                  onClick={() => setView("terms")}
                >
                  Terms &amp; Conditions
                </button>
                , the{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2"
                  onClick={() => setView("privacy")}
                >
                  Privacy Policy
                </button>
                , and the{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2"
                  onClick={() => setView("healthPrivacy")}
                >
                  Health Data Privacy
                </button>{" "}
                notice.
              </label>
            </div>
            <Button type="button" disabled={!agreed} onClick={onAccept}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
