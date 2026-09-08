import {
  ArrowLeft,
  Activity,
  Ban,
  Calendar,
  Heart,
  ShieldAlert,
  Siren,
  Stethoscope,
  Utensils,
} from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TIPS = [
  {
    icon: Calendar,
    title: "Your first month",
    body: "Nausea and GI symptoms are most common when starting or increasing a dose, and often ease as your body adjusts. Eat slowly, stop when full, and favor small, low-fat meals over the first few weeks. Staying hydrated matters even when eating less.",
    accent: "text-primary",
  },
  {
    icon: Stethoscope,
    title: "Managing common side effects",
    body: "For nausea: smaller meals, eating slowly, and avoiding lying down right after eating can help. For constipation: fiber, water, and movement. For diarrhea: stay hydrated and stick to bland foods until it settles. These are general self-care ideas, not treatment — check with your doctor if anything persists or worsens.",
    accent: "text-primary",
  },
  {
    icon: Utensils,
    title: "Helpful eating patterns",
    body: "Small meals, protein-first choices, fiber, vegetables, and water can support consistency.",
    accent: "text-primary",
  },
  {
    icon: Ban,
    title: "Limit with care",
    body: "Large greasy meals, heavy alcohol, and skipping hydration may worsen nausea for some people.",
    accent: "text-chart-3",
  },
  {
    icon: Activity,
    title: "Track beyond weight",
    body: "Sleep, mood, waist measurement, GI side effects, activity, and A1c/labs can add context for doctor visits.",
    accent: "text-chart-2",
  },
  {
    icon: Siren,
    title: "When to seek care promptly",
    body: "Severe abdominal pain that won't go away (with or without vomiting), yellowing skin or eyes, a lump or swelling in your neck with hoarseness or trouble swallowing, signs of an allergic reaction (face/throat swelling, trouble breathing, severe rash, fainting), vision changes, or signs of very low blood sugar (shakiness, confusion, fast heartbeat) all warrant contacting your doctor or seeking care right away.",
    accent: "text-destructive",
  },
  {
    icon: Heart,
    title: "Missed a dose?",
    body: "Ask your doctor or pharmacist how to handle a missed dose. This app does not provide dosing guidance.",
    accent: "text-destructive",
  },
  {
    icon: ShieldAlert,
    title: "Safety boundary",
    body: "This app records your data only. It does not diagnose, interpret values, or recommend dosage changes. Always defer to your prescribing doctor and dietitian.",
    accent: "text-destructive",
  },
];

interface TipsPageProps {
  onNavigate: (page: PageId) => void;
}

export function TipsPage({ onNavigate }: TipsPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5 md:hidden" onClick={() => onNavigate("settings")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIPS.map((tip) => (
          <Card key={tip.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <tip.icon className={`size-5 ${tip.accent}`} />
                <CardTitle className="text-base">{tip.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{tip.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
