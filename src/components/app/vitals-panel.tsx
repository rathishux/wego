import * as React from "react";

import { GlucoseForm } from "@/components/app/forms/glucose-form";
import { WeightForm } from "@/components/app/forms/weight-form";
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
    const weightItems: VitalsTimelineItem[] = weights.map((entry) => ({
      type: "weight",
      entry,
      deltaFromPrevious: deltaById.get(entry.id) ?? null,
    }));
    const glucoseItems: VitalsTimelineItem[] = glucose.map((entry) => ({ type: "glucose", entry }));
    return [...weightItems, ...glucoseItems].sort((a, b) => {
      if (a.entry.date !== b.entry.date) return a.entry.date < b.entry.date ? 1 : -1;
      return (b.entry.createdAt || 0) - (a.entry.createdAt || 0);
    });
  }, [weights, glucose, deltaById]);

  function handleDelete(type: "weight" | "glucose", id: string) {
    if (type === "weight") removeWeight(id);
    else removeGlucose(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <WeightForm onAdd={addWeight} onSaved={onSaved} />
        <GlucoseForm onAdd={addGlucose} onSaved={onSaved} />
      </div>

      <VitalsTimeline items={items} onDelete={handleDelete} />
    </div>
  );
}
