import { todayISO } from "@/lib/storage";

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "Three days in a row — that consistency adds up.",
  7: "A full week of tracking. Nice rhythm.",
  14: "Two weeks straight. That's a real habit forming.",
  30: "30 days in a row — a month of showing up for yourself.",
  60: "60 days straight. Impressive consistency.",
  100: "100 days in a row. That's remarkable.",
  180: "Half a year of consistent tracking.",
  365: "A full year of tracking, one day at a time.",
};

function toUTCDayIndex(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

/** Consecutive-day streak (any tracker counts) ending today or yesterday; 0 if broken. */
export function calculateLoggingStreak(dates: string[]): number {
  const unique = Array.from(new Set(dates)).sort();
  if (unique.length === 0) return 0;

  const today = toUTCDayIndex(todayISO());
  const mostRecent = toUTCDayIndex(unique[unique.length - 1]);
  if (today - mostRecent > 1) return 0;

  let streak = 1;
  for (let i = unique.length - 1; i > 0; i--) {
    const diff = toUTCDayIndex(unique[i]) - toUTCDayIndex(unique[i - 1]);
    if (diff === 1) streak += 1;
    else break;
  }
  return streak;
}

/** Warm, non-gamified copy for a streak — null when there's nothing worth mentioning. */
export function getStreakMessage(current: number): string | null {
  if (current in MILESTONE_MESSAGES) return MILESTONE_MESSAGES[current];
  if (current >= 2) return `${current} days in a row.`;
  return null;
}
