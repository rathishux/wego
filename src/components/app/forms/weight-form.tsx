import * as React from "react";
import { toast } from "sonner";

import { EntryList } from "@/components/app/entry-list";
import { PhotoCapture } from "@/components/app/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalList } from "@/hooks/use-local-list";
import { KEYS, sortByDateDesc, todayISO, uid } from "@/lib/storage";
import type { WeightEntry } from "@/lib/types";

export function WeightForm({ onSaved }: { onSaved: () => void }) {
  const { list, add, remove } = useLocalList<WeightEntry>(KEYS.weights);
  const [date, setDate] = React.useState(todayISO());
  const [weight, setWeight] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(weight);
    if (Number.isNaN(val)) return;
    add({ id: uid(), createdAt: Date.now(), date: date || todayISO(), weight: val, photo });
    setWeight("");
    setPhoto(undefined);
    toast.success("Weight logged.");
    onSaved();
  }

  const rows = sortByDateDesc(list).map((w) => ({
    id: w.id,
    date: w.date,
    primary: `${w.weight} kg`,
    photo: w.photo,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="weight-date">Date</Label>
                <Input id="weight-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight-value">Weight (kg)</Label>
                <Input
                  id="weight-value"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 82.4"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Progress photo</Label>
              <PhotoCapture value={photo} onChange={setPhoto} label="Weight progress" />
            </div>

            <Button type="submit" className="self-start">
              Save weight
            </Button>
          </form>
        </CardContent>
      </Card>

      <EntryList title="Past entries" emptyLabel="No weight entries yet." rows={rows} onDelete={remove} />
    </div>
  );
}
