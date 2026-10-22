import * as React from "react";

import { LogoMark } from "@/components/app/logo-mark";

interface SplashIntroProps {
  onFinish: () => void;
}

type Phase = "reveal" | "pulse" | "settle" | "hold" | "exit";

const PHASE_DURATIONS: Record<Phase, number> = {
  reveal: 350,
  pulse: 450,
  settle: 500,
  hold: 500,
  exit: 400,
};

const PHASE_ORDER: Phase[] = ["reveal", "pulse", "settle", "hold", "exit"];

const DARK_BG = "#0a0a0a";
const BRAND_GREEN = "#1F6B41";
const MARK_GREEN = "#2f9c6e";

/** One-time animated app-open sequence: dark reveal of the mark, a pulse, then a crossfade into the brand-green lockup. */
export function SplashIntro({ onFinish }: SplashIntroProps) {
  const [phase, setPhase] = React.useState<Phase>("reveal");

  React.useEffect(() => {
    const index = PHASE_ORDER.indexOf(phase);
    const timer = setTimeout(() => {
      const next = PHASE_ORDER[index + 1];
      if (next) {
        setPhase(next);
      } else {
        onFinish();
      }
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase, onFinish]);

  const isDark = phase === "reveal" || phase === "pulse";
  const showWordmark = phase === "settle" || phase === "hold";
  const markScale = phase === "pulse" ? 1.8 : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: isDark ? DARK_BG : BRAND_GREEN,
        opacity: phase === "exit" ? 0 : 1,
        transition:
          phase === "exit" ? "opacity 400ms ease-out" : "background-color 500ms ease-out, opacity 400ms ease-out",
      }}
    >
      <div className="flex items-center gap-3">
        <LogoMark
          className="size-11 shrink-0"
          style={{
            color: isDark ? MARK_GREEN : "#ffffff",
            transform: `scale(${markScale})`,
            opacity: phase === "reveal" ? 0 : 1,
            transition: "transform 500ms ease-out, color 500ms ease-out, opacity 350ms ease-out",
          }}
        />
        <span
          className="text-2xl font-bold tracking-tight text-white"
          style={{
            opacity: showWordmark ? 1 : 0,
            transform: showWordmark ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 500ms ease-out, transform 500ms ease-out",
          }}
        >
          NivYou
        </span>
      </div>
    </div>
  );
}
