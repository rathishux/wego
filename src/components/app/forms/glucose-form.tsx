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
import { GLUCOSE_TIMING_LABEL, type GlucoseEntry, type GlucoseTiming } from "@/lib/types";

interface GlucoseFormProps {
  onAdd: (entry: GlucoseEntry) => void;
  onSaved: () => void;
}

export function GlucoseForm({ onAdd, onSaved }: GlucoseFormProps) {
  const [date, setDate] = React.useState(todayISO());
  const [timing, setTiming] = React.useState<GlucoseTiming>("fasting");
  const [reading, setReading] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(reading, 10);
    if (Number.isNaN(val)) return;
    onAdd({
      id: uid(),
      createdAt: Date.now(),
      date: date || todayISO(),
      timing,
      reading: val,
      notes: notes.trim(),
      photo,
    });
    setReading("");
    setNotes("");
    setPhoto(undefined);
    toast.success("Reading logged.");
    onSaved();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Log glucose</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="glucose-date">Date</Label>
              <Input id="glucose-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="glucose-timing">Timing</Label>
              <Select value={timing} onValueChange={(v) => setTiming(v as GlucoseTiming)}>
                <SelectTrigger id="glucose-timing" className="w-full">
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
            <div className="space-y-1.5">
              <Label htmlFor="glucose-reading">Reading (mg/dL)</Label>
              <Input
                id="glucose-reading"
                type="number"
                min="0"
                placeholder="e.g. 98"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="glucose-notes">Notes</Label>
            <Textarea id="glucose-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>

          <div className="space-y-1.5">
            <Label>Photo</Label>
            <PhotoCapture value={photo} onChange={setPhoto} label="Glucose reading" />
          </div>

          <Button type="submit" className="self-start">
            Save reading
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
