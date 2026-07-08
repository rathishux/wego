import { Trash2 } from "lucide-react";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { PhotoCaptureButton } from "@/components/app/photo-capture-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FEED_TAG_LABEL, FEED_TAG_STYLE, buildFeed } from "@/lib/feed";
import { useLocalList } from "@/hooks/use-local-list";
import {
  KEYS,
  addDays,
  formatDate,
  formatDateTime,
  loadValue,
  migrateLegacyFacePhoto,
  saveValue,
  sortByDateAsc,
  sortByDateDesc,
  todayISO,
  uid,
} from "@/lib/storage";
import type { DoseEntry, FoodEntry, GlucoseEntry, Markers, ProgressPhoto, WeightEntry } from "@/lib/types";

const chartConfig: ChartConfig = {
  weight: { label: "Weight (kg)", color: "var(--chart-2)" },
};

export function ProgressPage() {
  const { list: doseList } = useLocalList<DoseEntry>(KEYS.doses);
  const { list: weightList } = useLocalList<WeightEntry>(KEYS.weights);
  const { list: glucoseList } = useLocalList<GlucoseEntry>(KEYS.glucose);
  const { list: foodList } = useLocalList<FoodEntry>(KEYS.food);

  const weights = sortByDateAsc(weightList);
  const cutoff = addDays(todayISO(), -30).toISOString().slice(0, 10);
  const recentWeights = weights.filter((w) => w.date >= cutoff);

  const trendDelta =
    weights.length > 1 ? +(weights.at(-1)!.weight - weights[0].weight).toFixed(1) : null;

  const chartData = weights.map((w) => ({ date: formatDate(w.date), weight: w.weight }));

  const loggedDates = new Set(
    [...doseList, ...weightList, ...glucoseList, ...foodList].map((e) => e.date),
  );
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(todayISO(), -(6 - i)).toISOString().slice(0, 10));

  const giCount = doseList.filter((d) => d.sideEffects && d.sideEffects.trim().length > 0).length;

  const feed = buildFeed(sortByDateDesc(doseList), weights, sortByDateDesc(glucoseList), foodList);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Weight trend</CardTitle>
              <p className="text-muted-foreground text-sm">
                {recentWeights.length} logs · last 30 days
              </p>
            </div>
            <div className="text-right">
              <p className="text-chart-2 text-base font-semibold">
                {trendDelta === null ? "—" : `${trendDelta > 0 ? "+" : ""}${trendDelta} kg`}
              </p>
              <p className="text-muted-foreground text-xs">Since first log</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weights.length < 2 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Log weight at least twice to see a trend.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <LineChart data={chartData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={36}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="weight"
                  type="monotone"
                  stroke="var(--color-weight)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-weight)" }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly rhythm</CardTitle>
          <p className="text-muted-foreground text-sm">Logging consistency</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {last7.map((d) => {
              const dow = new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" });
              const filled = loggedDates.has(d);
              return (
                <div key={d} className="text-muted-foreground flex flex-col items-center gap-1.5 text-xs">
                  <span className={`size-5.5 rounded-full ${filled ? "bg-primary" : "bg-muted"}`} />
                  {dow}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ProgressMarkers giCount={giCount} />

      <ProgressPhotoGallery />

      <Card>
        <CardHeader>
          <CardTitle>Full history</CardTitle>
          <p className="text-muted-foreground text-sm">Every log entry, with details and photos</p>
        </CardHeader>
        <CardContent>
          {feed.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">Nothing logged yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {feed.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-start gap-3 rounded-lg border p-3">
                  {item.photo && (
                    <img src={item.photo} alt="" className="size-16 shrink-0 rounded-md border object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className={FEED_TAG_STYLE[item.type]}>
                        {FEED_TAG_LABEL[item.type]}
                      </Badge>
                      <span className="text-muted-foreground text-xs">{formatDate(item.date)}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{item.title}</p>
                    {item.meta && <p className="text-muted-foreground text-xs">{item.meta}</p>}
                    {item.notes && <p className="text-muted-foreground mt-1 text-xs">{item.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressMarkers({ giCount }: { giCount: number }) {
  const [markers, setMarkers] = React.useState<Markers>(() =>
    loadValue(KEYS.markers, { waist: "", sleep: "", mood: "" }),
  );

  function updateMarker(key: keyof Markers, value: string) {
    setMarkers((prev) => {
      const next = { ...prev, [key]: value };
      saveValue(KEYS.markers, next);
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress markers</CardTitle>
        <p className="text-muted-foreground text-sm">Optional non-scale wins</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="marker-waist" className="text-muted-foreground text-xs">
              Waist
            </Label>
            <Input
              id="marker-waist"
              value={markers.waist}
              onChange={(e) => updateMarker("waist", e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="marker-sleep" className="text-muted-foreground text-xs">
              Sleep
            </Label>
            <Input
              id="marker-sleep"
              value={markers.sleep}
              onChange={(e) => updateMarker("sleep", e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="marker-mood" className="text-muted-foreground text-xs">
              Mood
            </Label>
            <Input
              id="marker-mood"
              value={markers.mood}
              onChange={(e) => updateMarker("mood", e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">GI side effects</p>
            <p className="flex h-9 items-center text-sm font-medium">
              {giCount} log{giCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressPhotoGallery() {
  React.useEffect(() => {
    migrateLegacyFacePhoto();
  }, []);

  const { list, add, remove } = useLocalList<ProgressPhoto>(KEYS.progressPhotos);
  const photos = [...list].sort((a, b) => b.createdAt - a.createdAt);

  function handleCapture(photo: string) {
    add({ id: uid(), createdAt: Date.now(), photo });
    toast.success("Photo added to your progress gallery.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress photos</CardTitle>
        <p className="text-muted-foreground text-sm">
          A private, timestamped record of how you're looking — stored only on this device
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PhotoCaptureButton onCapture={handleCapture} facingMode="user" />

        {photos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No progress photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-lg border">
                <img src={p.photo} alt={formatDateTime(p.createdAt)} className="aspect-square w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
                  <p className="truncate text-[11px] font-medium text-white">{formatDateTime(p.createdAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete photo"
                  onClick={() => remove(p.id)}
                  className="absolute top-1 right-1 size-7 bg-black/50 text-white opacity-0 hover:bg-black/70 hover:text-white group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
