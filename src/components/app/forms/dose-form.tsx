import { AlertTriangle } from "lucide-react";
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
import { useEntries } from "@/hooks/use-entries";
import { isSeriousSideEffect } from "@/lib/side-effect-alert";
import { sortByDateDesc, todayISO, uid } from "@/lib/storage";
import { DOSE_STEPS, type DoseEntry } from "@/lib/types";

const SITE_OPTIONS = [
  "Left abdomen",
  "Right abdomen",
  "Left thigh",
  "Right thigh",
  "Left upper arm",
  "Right upper arm",
  "Other",
];

const SERIOUS_SIDE_EFFECT_ALERT =
  "What you described can be a sign of something that needs prompt medical attention — please contact your doctor or seek care soon.";

export function DoseForm({ onSaved }: { onSaved: () => void }) {
  const { list, add, remove } = useEntries<DoseEntry>("dose");
  const [date, setDate] = React.useState(todayISO());
  const [dose, setDose] = React.useState<string>(DOSE_STEPS[0]);
  const [site, setSite] = React.useState("");
  const [customSite, setCustomSite] = React.useState("");
  const [sideEffects, setSideEffects] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalSite = site === "Other" ? customSite.trim() : site;
    const trimmedSideEffects = sideEffects.trim();
    add({
      id: uid(),
      createdAt: Date.now(),
      date: date || todayISO(),
      dose,
      site: finalSite,
      sideEffects: trimmedSideEffects,
      notes: notes.trim(),
      photo,
    });
    setSite("");
    setCustomSite("");
    setSideEffects("");
    setNotes("");
    setPhoto(undefined);
    if (isSeriousSideEffect(trimmedSideEffects)) {
      toast.warning(SERIOUS_SIDE_EFFECT_ALERT, { duration: 10000 });
    } else {
      toast.success("Dose logged.");
    }
    onSaved();
  }

  const rows = sortByDateDesc(list).map((d) => ({
    id: d.id,
    date: d.date,
    primary: `${d.dose} mg`,
    secondary: d.site ? `Site: ${d.site}` : undefined,
    notes: [d.sideEffects, d.notes].filter(Boolean).join(" · ") || undefined,
    photo: d.photo,
    alert: d.sideEffects && isSeriousSideEffect(d.sideEffects) ? SERIOUS_SIDE_EFFECT_ALERT : undefined,
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
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger id="dose-site" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {SITE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {site === "Other" && (
                <Input
                  value={customSite}
                  onChange={(e) => setCustomSite(e.target.value)}
                  placeholder="Describe the site"
                  className="mt-1.5"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dose-side-effects">Side effects</Label>
              <Textarea
                id="dose-side-effects"
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                placeholder="Optional"
              />
              {isSeriousSideEffect(sideEffects) && (
                <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2 rounded-md border p-2 text-xs">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  <p>{SERIOUS_SIDE_EFFECT_ALERT}</p>
                </div>
              )}
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
