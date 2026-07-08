import { Camera, ImageUp } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { readAndCompressImage } from "@/lib/image";

interface PhotoCaptureButtonProps {
  onCapture: (photo: string) => void;
  facingMode?: "user" | "environment";
}

export function PhotoCaptureButton({ onCapture, facingMode = "user" }: PhotoCaptureButtonProps) {
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await readAndCompressImage(file);
      onCapture(dataUrl);
    } catch {
      toast.error("Couldn't process that photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture={facingMode}
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
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
  );
}
