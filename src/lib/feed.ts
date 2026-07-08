import { GLUCOSE_TIMING_LABEL, type DoseEntry, type FeedItem, type FoodEntry, type GlucoseEntry, type WeightEntry } from "@/lib/types";

export function buildFeed(
  doses: DoseEntry[],
  weights: WeightEntry[],
  glucose: GlucoseEntry[],
  food: FoodEntry[],
): FeedItem[] {
  const items: FeedItem[] = [
    ...doses.map((d): FeedItem => ({
      type: "dose",
      id: d.id,
      date: d.date,
      createdAt: d.createdAt,
      title: `${d.dose} mg dose`,
      meta: d.site ? `Site: ${d.site}` : "",
      notes: [d.sideEffects, d.notes].filter(Boolean).join(" · "),
      photo: d.photo,
    })),
    ...weights.map((w): FeedItem => ({
      type: "weight",
      id: w.id,
      date: w.date,
      createdAt: w.createdAt,
      title: `${w.weight} kg`,
      meta: "",
      photo: w.photo,
    })),
    ...glucose.map((g): FeedItem => ({
      type: "glucose",
      id: g.id,
      date: g.date,
      createdAt: g.createdAt,
      title: `${g.reading} mg/dL`,
      meta: GLUCOSE_TIMING_LABEL[g.timing],
      notes: g.notes,
      photo: g.photo,
    })),
    ...food.map((f): FeedItem => ({
      type: "food",
      id: f.id,
      date: f.date,
      createdAt: f.createdAt,
      title: f.meal ? f.meal : "Food & water log",
      meta: [
        [f.protein && "Protein", f.fiber && "Fiber", f.veg && "Veg"].filter(Boolean).join(" · "),
        `${f.water || 0} glasses water`,
      ]
        .filter(Boolean)
        .join(" · "),
      notes: f.notes,
      photo: f.photo,
    })),
  ];

  items.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.createdAt < b.createdAt ? 1 : -1,
  );

  return items;
}

export const FEED_TAG_STYLE: Record<FeedItem["type"], string> = {
  dose: "bg-primary/10 text-primary",
  weight: "bg-chart-2/15 text-chart-2",
  glucose: "bg-chart-3/20 text-chart-3",
  food: "bg-chart-5/15 text-chart-5",
};

export const FEED_TAG_LABEL: Record<FeedItem["type"], string> = {
  dose: "Dose",
  weight: "Weight",
  glucose: "Glucose",
  food: "Food",
};
