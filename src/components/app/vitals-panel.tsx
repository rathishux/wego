import * as React from "react";

import { VitalsForm } from "@/components/app/forms/vitals-form";
import { VitalsTimeline, type VitalsTimelineItem } from "@/components/app/vitals-timeline";
import { useLocalList } from "@/hooks/use-local-list";
import { KEYS, sortByDateAsc } from "@/lib/storage";
import type { GlucoseEntry, WeightEntry } from "@/lib/types";

interface VitalsPanelProps {
  onSaved: () => void;
}

export function VitalsPanel({ onSaved }: VitalsPanelProps) {
  const { list: weights, add: addWeight, remove: removeWeight } = useLocalList<WeightEntry>(KEYS.weights);
  const { list: glucose, add: addGlucose, remove: removeGlucose } = useLocalList<GlucoseEntry>(KEYS.glucose);

  const deltaById = React.useMemo(() => {
    const ascending = sortByDateAsc(weights);
    const map = new Map<string, number | null>();
    ascending.forEach((entry, i) => {
      map.set(entry.id, i === 0 ? null : +(entry.weight - ascending[i - 1].weight).toFixed(1));
    });
    return map;
  }, [weights]);

  const items: VitalsTimelineItem[] = React.useMemo(() => {
    const glucoseByCreatedAt = new Map(glucose.map((g) => [g.createdAt, g]));
    const pairedGlucoseIds = new Set<string>();

    const weightItems: VitalsTimelineItem[] = weights.map((entry) => {
      const matched = glucoseByCreatedAt.get(entry.createdAt) ?? null;
      if (matched) pairedGlucoseIds.add(matched.id);
      return {
        id: entry.id,
        date: entry.date,
        createdAt: entry.createdAt,
        weight: entry,
        glucose: matched,
        deltaFromPrevious: deltaById.get(entry.id) ?? null,
      };
    });

    const orphanGlucoseItems: VitalsTimelineItem[] = glucose
      .filter((g) => !pairedGlucoseIds.has(g.id))
      .map((entry) => ({
        id: entry.id,
        date: entry.date,
        createdAt: entry.createdAt,
        weight: null,
        glucose: entry,
        deltaFromPrevious: null,
      }));

    return [...weightItems, ...orphanGlucoseItems].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
  }, [weights, glucose, deltaById]);

  function handleSubmit({ weight, glucose: glucoseEntry }: { weight: WeightEntry; glucose: GlucoseEntry | null }) {
    addWeight(weight);
    if (glucoseEntry) addGlucose(glucoseEntry);
  }

  function handleDelete(item: VitalsTimelineItem) {
    if (item.weight) removeWeight(item.weight.id);
    if (item.glucose) removeGlucose(item.glucose.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <VitalsForm onSubmit={handleSubmit} onSaved={onSaved} />
      <VitalsTimeline items={items} onDelete={handleDelete} />
    </div>
  );
}
