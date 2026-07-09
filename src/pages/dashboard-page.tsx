import { ArrowRight, Camera, Droplets, Syringe, Weight } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalList } from "@/hooks/use-local-list";
import { FEED_TAG_LABEL, FEED_TAG_STYLE, buildFeed } from "@/lib/feed";
import { KEYS, addDays, formatDateShort, sortByDateAsc, sortByDateDesc } from "@/lib/storage";
import type { DoseEntry, FoodEntry, GlucoseEntry, LogType, WeightEntry } from "@/lib/types";

interface DashboardPageProps {
  onNavigate: (page: PageId, tab?: LogType) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { list: doseList } = useLocalList<DoseEntry>(KEYS.doses);
  const { list: weightList } = useLocalList<WeightEntry>(KEYS.weights);
  const { list: glucoseList } = useLocalList<GlucoseEntry>(KEYS.glucose);
  const { list: foodList } = useLocalList<FoodEntry>(KEYS.food);

  const doses = sortByDateDesc(doseList);
  const weights = sortByDateAsc(weightList);
  const glucose = sortByDateDesc(glucoseList);

  const nextDoseDate = doses.length
    ? addDays(doses[0].date, 7).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  const lastWeight = weights.at(-1);
  const firstWeight = weights[0];
  const weightDelta =
    weights.length > 1 && lastWeight ? +(lastWeight.weight - firstWeight.weight).toFixed(1) : null;

  const feed = buildFeed(doses, weights, glucose, foodList).slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
                <Syringe className="size-5" />
              </div>
              <div>
                <CardTitle>Next dose</CardTitle>
                <p className="text-muted-foreground text-sm">Estimated from your last injection</p>
              </div>
            </div>
            <span className="text-primary text-lg font-semibold whitespace-nowrap">
              {doses.length ? `${doses[0].dose} mg` : "—"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {nextDoseDate ? `Estimated ${nextDoseDate}` : "Add your first dose to see an estimate"}
            </p>
            <Button size="sm" onClick={() => onNavigate("log", "dose")}>
              Log dose <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-2/15 text-chart-2 flex size-9 items-center justify-center rounded-lg">
                <Weight className="size-4.5" />
              </div>
              <div>
                <CardTitle className="text-base">Weight</CardTitle>
                <p className="text-muted-foreground text-sm">Since first log</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold">{lastWeight ? lastWeight.weight : "—"}</span>
              <span className="text-muted-foreground text-sm">kg</span>
            </div>
            {weightDelta === null ? (
              <Badge variant="secondary" className="mt-2">
                No trend yet
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className={`mt-2 ${weightDelta < 0 ? "bg-primary/10 text-primary" : weightDelta > 0 ? "bg-destructive/10 text-destructive" : ""}`}
              >
                {weightDelta > 0 ? "+" : ""}
                {weightDelta} kg since first log
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/20 text-chart-3 flex size-9 items-center justify-center rounded-lg">
                <Droplets className="size-4.5" />
              </div>
              <div>
                <CardTitle className="text-base">Glucose</CardTitle>
                <p className="text-muted-foreground text-sm">Latest reading</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold">{glucose.length ? glucose[0].reading : "—"}</span>
              <span className="text-muted-foreground text-sm">mg/dL</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => onNavigate("log", "glucose")}>
              Add
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent logs</CardTitle>
          <p className="text-muted-foreground text-sm">Latest activity across all trackers</p>
        </CardHeader>
        <CardContent>
          {feed.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">
              Nothing logged yet. Add your first entry from Log entry.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {feed.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt=""
                        className="size-9 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                        <Camera className="size-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <Badge variant="secondary" className={`mb-1 ${FEED_TAG_STYLE[item.type]}`}>
                        {FEED_TAG_LABEL[item.type]}
                      </Badge>
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      {item.meta && <p className="text-muted-foreground truncate text-xs">{item.meta}</p>}
                    </div>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {formatDateShort(item.date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
