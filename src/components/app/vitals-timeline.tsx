import { Camera, Droplets, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/storage";
import { GLUCOSE_TIMING_LABEL, type GlucoseEntry, type WeightEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface VitalsTimelineItem {
  id: string;
  date: string;
  createdAt: number;
  weight: WeightEntry | null;
  glucose: GlucoseEntry | null;
  deltaFromPrevious: number | null;
}

interface VitalsTimelineProps {
  items: VitalsTimelineItem[];
  onDelete: (item: VitalsTimelineItem) => void;
}

export function VitalsTimeline({ items, onDelete }: VitalsTimelineProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground py-2 text-sm">No weight or glucose entries yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">Timeline</h3>
      <div className="relative flex flex-col gap-4">
        <div className="bg-border absolute top-2 bottom-2 left-[7px] w-px" aria-hidden="true" />
        {items.map((item) => {
          const photo = item.weight?.photo ?? item.glucose?.photo;
          const hasBoth = Boolean(item.weight && item.glucose);

          return (
            <div key={item.id} className="relative flex gap-4 pl-7">
              <span
                className={cn(
                  "border-background absolute top-1.5 left-0 size-[15px] rounded-full border-2",
                  item.weight ? "bg-chart-2" : "bg-chart-3",
                )}
                aria-hidden="true"
              />

              <div className="bg-card flex-1 rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.weight && (
                      <Badge variant="secondary" className="bg-chart-2/15 text-chart-2">
                        Weight
                      </Badge>
                    )}
                    {item.glucose && (
                      <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
                        <Droplets className="size-3" />
                        Glucose
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive size-7"
                    aria-label="Delete entry"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    {item.weight && (
                      <p className="text-chart-2 text-2xl font-bold">{item.weight.weight} kg</p>
                    )}
                    {item.glucose && (
                      <p className={cn("text-chart-3 font-semibold", item.weight ? "text-base" : "text-2xl")}>
                        {item.glucose.reading} mg/dL
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs">{formatDate(item.date)}</p>
                  </div>
                  {photo ? (
                    <img src={photo} alt="" className="size-14 shrink-0 rounded-lg border object-cover" />
                  ) : (
                    <div className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-lg border">
                      <Camera className="size-5" />
                    </div>
                  )}
                </div>

                {(item.deltaFromPrevious !== null || item.glucose) && (
                  <>
                    <div className="my-3 border-t" />
                    <div className="text-muted-foreground flex flex-col gap-0.5 text-xs">
                      {item.deltaFromPrevious !== null && (
                        <p>
                          <span
                            className={cn(
                              "font-medium",
                              item.deltaFromPrevious < 0
                                ? "text-primary"
                                : item.deltaFromPrevious > 0
                                  ? "text-destructive"
                                  : "",
                            )}
                          >
                            {item.deltaFromPrevious > 0 ? "+" : ""}
                            {item.deltaFromPrevious} kg
                          </span>{" "}
                          vs previous weigh-in
                        </p>
                      )}
                      {item.glucose && (
                        <p>
                          {hasBoth ? "Glucose · " : ""}
                          {GLUCOSE_TIMING_LABEL[item.glucose.timing]}
                          {item.glucose.notes ? ` · ${item.glucose.notes}` : ""}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
