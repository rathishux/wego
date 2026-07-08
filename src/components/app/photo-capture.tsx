import { Camera, ImageUp, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { readAndCompressImage } from "@/lib/image";
import { cn } from "@/lib/utils";

interface PhotoCaptureProps {
  value?: string;
  onChange: (photo: string | undefined) => void;
  label?: string;
  className?: string;
}

export function PhotoCapture({ value, onChange, label = "Photo", className }: PhotoCaptureProps) {
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await readAndCompressImage(file);
      onChange(dataUrl);
    } catch {
      toast.error("Couldn't process that photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt={label}
            className="h-32 w-32 rounded-lg border object-cover"
          />
          <button
            type="button"
            aria-label="Remove photo"
            onClick={() => onChange(undefined)}
            className="bg-background text-foreground absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border shadow-sm hover:bg-accent"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera /> Take photo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => uploadInputRef.current?.click()}
          >
            <ImageUp /> Upload
          </Button>
        </div>
      )}
    </div>
  );
}
