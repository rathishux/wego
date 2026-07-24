export type GlucoseTiming = "fasting" | "before_meal" | "after_meal" | "bedtime";

export interface BaseEntry {
  id: string;
  createdAt: number;
  date: string;
  photo?: string;
}

export interface DoseEntry extends BaseEntry {
  dose: string;
  site?: string;
  sideEffects?: string;
  notes?: string;
}

export interface WeightEntry extends BaseEntry {
  weight: number;
}

export interface GlucoseEntry extends BaseEntry {
  timing: GlucoseTiming;
  reading: number;
  notes?: string;
}

export interface FoodEntry extends BaseEntry {
  meal?: string;
  protein: boolean;
  fiber: boolean;
  veg: boolean;
  water: number;
  notes?: string;
}

export type LogType = "dose" | "weight" | "glucose" | "food";

export type AnyEntry = DoseEntry | WeightEntry | GlucoseEntry | FoodEntry;

export interface Markers {
  waist: string;
  sleep: string;
  mood: string;
}

export interface Profile {
  name: string;
  photo: string;
  sex: string;
  birthday: string;
  height: string;
  weight: string;
}

export interface NotificationPrefs {
  alerts: boolean;
  doseReminders: boolean;
}

export interface ProgressPhoto {
  id: string;
  createdAt: number;
  photo: string;
}

export interface YouPost {
  id: string;
  createdAt: number;
  photo: string;
  title?: string;
  description?: string;
  sharedPostId?: string;
}

export interface FeedItem {
  type: LogType;
  id: string;
  date: string;
  createdAt: number;
  title: string;
  meta: string;
  notes?: string;
  photo?: string;
}

export const DOSE_STEPS = ["0.25", "0.5", "1", "1.7", "2.4"] as const;

export const GLUCOSE_TIMING_LABEL: Record<GlucoseTiming, string> = {
  fasting: "Fasting",
  before_meal: "Before meal",
  after_meal: "2hr after meal",
  bedtime: "Bedtime",
};
