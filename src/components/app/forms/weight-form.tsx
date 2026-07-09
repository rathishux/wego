import * as React from "react";
import { toast } from "sonner";

import { PhotoCapture } from "@/components/app/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO, uid } from "@/lib/storage";
import type { WeightEntry } from "@/lib/types";

interface WeightFormProps {
  onAdd: (entry: WeightEntry) => void;
  onSaved: () => void;
}

export function WeightForm({ onAdd, onSaved }: WeightFormProps) {
  const [date, setDate] = React.useState(todayISO());
  const [weight, setWeight] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(weight);
    if (Number.isNaN(val)) return;
    onAdd({ id: uid(), createdAt: Date.now(), date: date || todayISO(), weight: val, photo });
    setWeight("");
    setPhoto(undefined);
    toast.success("Weight logged.");
    onSaved();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Log weight</CardTitle>
      </CardHeader>
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
  );
}
