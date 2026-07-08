import * as React from "react";
import { toast } from "sonner";

import { EntryList } from "@/components/app/entry-list";
import { PhotoCapture } from "@/components/app/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalList } from "@/hooks/use-local-list";
import { KEYS, sortByDateDesc, todayISO, uid } from "@/lib/storage";
import type { FoodEntry } from "@/lib/types";

export function FoodForm({ onSaved }: { onSaved: () => void }) {
  const { list, add, remove } = useLocalList<FoodEntry>(KEYS.food);
  const [date, setDate] = React.useState(todayISO());
  const [meal, setMeal] = React.useState("");
  const [protein, setProtein] = React.useState(false);
  const [fiber, setFiber] = React.useState(false);
  const [veg, setVeg] = React.useState(false);
  const [water, setWater] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [photo, setPhoto] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    add({
      id: uid(),
      createdAt: Date.now(),
      date: date || todayISO(),
      meal: meal.trim(),
      protein,
      fiber,
      veg,
      water: parseInt(water, 10) || 0,
      notes: notes.trim(),
      photo,
    });
    setMeal("");
    setProtein(false);
    setFiber(false);
    setVeg(false);
    setWater("");
    setNotes("");
    setPhoto(undefined);
    toast.success("Food log saved.");
    onSaved();
  }

  const rows = sortByDateDesc(list).map((f) => ({
    id: f.id,
    date: f.date,
    primary: f.meal || "Food & water log",
    secondary: [
      [f.protein && "Protein", f.fiber && "Fiber", f.veg && "Veg"].filter(Boolean).join(" · "),
      `${f.water || 0} glasses water`,
    ]
      .filter(Boolean)
      .join(" · "),
    notes: f.notes,
    photo: f.photo,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="food-date">Date</Label>
              <Input id="food-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="food-meal">Meal description</Label>
              <Textarea
                id="food-meal"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                placeholder="e.g. Grilled chicken, salad, rice"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={protein} onCheckedChange={(v) => setProtein(v === true)} /> Protein goal met
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={fiber} onCheckedChange={(v) => setFiber(v === true)} /> High-fiber foods
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={veg} onCheckedChange={(v) => setVeg(v === true)} /> Vegetables eaten
              </label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="food-water">Water (glasses)</Label>
              <Input
                id="food-water"
                type="number"
                min="0"
                placeholder="e.g. 6"
                value={water}
                onChange={(e) => setWater(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="food-notes">Notes</Label>
              <Textarea id="food-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
            </div>

            <div className="space-y-1.5">
              <Label>Meal photo</Label>
              <PhotoCapture value={photo} onChange={setPhoto} label="Meal" />
            </div>

            <Button type="submit" className="self-start">
              Save log
            </Button>
          </form>
        </CardContent>
      </Card>

      <EntryList title="Past logs" emptyLabel="No food logs yet." rows={rows} onDelete={remove} />
    </div>
  );
}
