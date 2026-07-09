import { Camera, Droplets, Trash2, Weight as WeightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GLUCOSE_TIMING_LABEL, type GlucoseEntry, type WeightEntry } from "@/lib/types";
import { formatDate } from "@/lib/storage";
import { cn } from "@/lib/utils";

export type VitalsTimelineItem =
  | { type: "weight"; entry: WeightEntry; deltaFromPrevious: number | null }
  | { type: "glucose"; entry: GlucoseEntry };

interface VitalsTimelineProps {
  items: VitalsTimelineItem[];
  onDelete: (type: "weight" | "glucose", id: string) => void;
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
          const id = item.entry.id;
          const isWeight = item.type === "weight";
          return (
            <div key={`${item.type}-${id}`} className="relative flex gap-4 pl-7">
              <span
                className={cn(
                  "absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-background",
                  isWeight ? "bg-chart-2" : "bg-chart-3",
                )}
                aria-hidden="true"
              />

              <div className="bg-card flex-1 rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={isWeight ? "bg-chart-2/15 text-chart-2" : "bg-chart-3/20 text-chart-3"}>
                      {isWeight ? <WeightIcon className="size-3" /> : <Droplets className="size-3" />}
                      {isWeight ? "Weight" : "Glucose"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive size-7"
                      aria-label="Delete entry"
                      onClick={() => onDelete(item.type, id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <div>
                    <p className={cn("text-2xl font-bold", isWeight ? "text-chart-2" : "text-chart-3")}>
                      {isWeight ? `${item.entry.weight} kg` : `${item.entry.reading} mg/dL`}
                    </p>
                    <p className="text-muted-foreground text-xs">{formatDate(item.entry.date)}</p>
                  </div>
                  {item.entry.photo ? (
                    <img
                      src={item.entry.photo}
                      alt=""
                      className="size-14 shrink-0 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-lg border">
                      <Camera className="size-5" />
                    </div>
                  )}
                </div>

                {isWeight ? (
                  item.deltaFromPrevious !== null && (
                    <>
                      <div className="my-3 border-t" />
                      <p className="text-muted-foreground text-xs">
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
                    </>
                  )
                ) : (
                  <>
                    <div className="my-3 border-t" />
                    <p className="text-muted-foreground text-xs">
                      {GLUCOSE_TIMING_LABEL[item.entry.timing]}
                      {item.entry.notes ? ` · ${item.entry.notes}` : ""}
                    </p>
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
