import { AlertTriangle, Camera, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/storage";

export interface EntryListRow {
  id: string;
  date: string;
  primary: string;
  secondary?: string;
  notes?: string;
  photo?: string;
  /** Shown as a persistent warning banner on this row, e.g. a serious side-effect flag. */
  alert?: string;
}

interface EntryListProps {
  title: string;
  emptyLabel: string;
  rows: EntryListRow[];
  onDelete: (id: string) => void;
}

export function EntryList({ title, emptyLabel, rows, onDelete }: EntryListProps) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground py-2 text-sm">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {rows.map((row) => (
        <div key={row.id} className="bg-card flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              {row.photo ? (
                <img
                  src={row.photo}
                  alt=""
                  className="size-12 shrink-0 rounded-md border object-cover"
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md border">
                  <Camera className="size-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold">{row.primary}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(row.date)}
                  {row.secondary ? ` · ${row.secondary}` : ""}
                </p>
                {row.notes && <p className="text-muted-foreground mt-1 text-xs">{row.notes}</p>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8 shrink-0"
              aria-label="Delete entry"
              onClick={() => onDelete(row.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          {row.alert && (
            <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2 rounded-md border p-2 text-xs">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              <p>{row.alert}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
