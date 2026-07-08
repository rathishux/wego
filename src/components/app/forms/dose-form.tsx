import * as React from "react";
import { toast } from "sonner";

import { EntryList } from "@/components/app/entry-list";
import { PhotoCapture } from "@/components/app/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocalList } from "@/hooks/use-local-list";
import { KEYS, sortByDateDesc, todayISO, uid } from "@/lib/storage";
import { DOSE_STEPS, type DoseEntry } from "@/lib/types";

export function DoseForm({ onSaved }: { onSaved: () => void }) {
  const { list, add, remove } = useLocalList<DoseEntry>(KEYS.doses);
  const [date, setDate] = React.useState(todayISO());
  const [dose, setDose] = React.useState<string>(DOSE_STEPS[0]);
  const [site, setSite] = React.useState("");
  const [sideEffects, setSideEffects] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    add({
      id: uid(),
      createdAt: Date.now(),
      date: date || todayISO(),
      dose,
      site: site.trim(),
      sideEffects: sideEffects.trim(),
      notes: notes.trim(),
      photo,
    });
    setSite("");
    setSideEffects("");
    setNotes("");
    setPhoto(undefined);
    toast.success("Dose logged.");
    onSaved();
  }

  const rows = sortByDateDesc(list).map((d) => ({
    id: d.id,
    date: d.date,
    primary: `${d.dose} mg`,
    secondary: d.site ? `Site: ${d.site}` : undefined,
    notes: [d.sideEffects, d.notes].filter(Boolean).join(" · ") || undefined,
    photo: d.photo,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dose-date">Date</Label>
                <Input
                  id="dose-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dose-amount">Dose (mg)</Label>
                <Select value={dose} onValueChange={setDose}>
                  <SelectTrigger id="dose-amount" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOSE_STEPS.map((step) => (
                      <SelectItem key={step} value={step}>
                        {step} mg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dose-site">Injection site</Label>
              <Input
                id="dose-site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="e.g. Left thigh"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dose-side-effects">Side effects</Label>
              <Textarea
                id="dose-side-effects"
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dose-notes">Notes</Label>
              <Textarea
                id="dose-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Injection site photo</Label>
              <PhotoCapture value={photo} onChange={setPhoto} label="Injection site" />
            </div>

            <Button type="submit" className="self-start">
              Save dose
            </Button>
          </form>
        </CardContent>
      </Card>

      <EntryList title="Past doses" emptyLabel="No doses logged yet." rows={rows} onDelete={remove} />
    </div>
  );
}
