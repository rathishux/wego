import * as React from "react";
import { toast } from "sonner";

import { PhotoCapture } from "@/components/app/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { todayISO, uid } from "@/lib/storage";
import { GLUCOSE_TIMING_LABEL, type GlucoseEntry, type GlucoseTiming, type WeightEntry } from "@/lib/types";

interface VitalsFormProps {
  onSubmit: (result: { weight: WeightEntry; glucose: GlucoseEntry | null }) => void;
  onSaved: () => void;
}

export function VitalsForm({ onSubmit, onSaved }: VitalsFormProps) {
  const [date, setDate] = React.useState(todayISO());
  const [weight, setWeight] = React.useState("");
  const [reading, setReading] = React.useState("");
  const [timing, setTiming] = React.useState<GlucoseTiming>("fasting");
  const [notes, setNotes] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const weightVal = parseFloat(weight);
    if (Number.isNaN(weightVal)) return;

    const createdAt = Date.now();
    const entryDate = date || todayISO();

    const weightEntry: WeightEntry = { id: uid(), createdAt, date: entryDate, weight: weightVal, photo };

    let glucoseEntry: GlucoseEntry | null = null;
    const readingVal = parseInt(reading, 10);
    if (!Number.isNaN(readingVal)) {
      glucoseEntry = {
        id: uid(),
        createdAt,
        date: entryDate,
        timing,
        reading: readingVal,
        notes: notes.trim(),
        photo,
      };
    }

    onSubmit({ weight: weightEntry, glucose: glucoseEntry });

    setWeight("");
    setReading("");
    setNotes("");
    setPhoto(undefined);
    toast.success(glucoseEntry ? "Weight and glucose logged." : "Weight logged.");
    onSaved();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Log weight & glucose</CardTitle>
        <p className="text-muted-foreground text-sm">Glucose reading is optional</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="vitals-date">Date</Label>
              <Input id="vitals-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vitals-weight">Weight (kg)</Label>
              <Input
                id="vitals-weight"
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

          <div className="space-y-3 rounded-lg border border-dashed p-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Glucose (optional)</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="vitals-reading">Reading (mg/dL)</Label>
                <Input
                  id="vitals-reading"
                  type="number"
                  min="0"
                  placeholder="Leave blank to skip"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vitals-timing">Timing</Label>
                <Select value={timing} onValueChange={(v) => setTiming(v as GlucoseTiming)}>
                  <SelectTrigger id="vitals-timing" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(GLUCOSE_TIMING_LABEL) as [GlucoseTiming, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vitals-notes">Notes</Label>
              <Textarea
                id="vitals-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Photo</Label>
            <PhotoCapture value={photo} onChange={setPhoto} label="Weight & glucose" />
          </div>

          <Button type="submit" className="self-start">
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
