import * as React from "react";

import { LogoMark } from "@/components/app/logo-mark";
import { MedicationField } from "@/components/app/medication-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/use-profile";

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { update } = useProfile();
  const [medication, setMedication] = React.useState("");

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (medication.trim()) update("medication", medication.trim());
    onComplete();
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
          <CardTitle>Welcome to NivYou</CardTitle>
          <CardDescription>One quick question to personalize your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContinue} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="onboarding-medication">Which GLP-1 medication are you taking?</Label>
              <MedicationField id="onboarding-medication" value={medication} onChange={setMedication} />
            </div>
            <Button type="submit">Continue</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onComplete}>
              Skip for now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
