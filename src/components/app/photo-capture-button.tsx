import { Camera as CapacitorCamera, CameraDirection, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Camera, ImageUp } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { compressDataUrl, readAndCompressImage } from "@/lib/image";

interface PhotoCaptureButtonProps {
  onCapture: (photo: string) => void;
  facingMode?: "user" | "environment";
}

export function PhotoCaptureButton({ onCapture, facingMode = "user" }: PhotoCaptureButtonProps) {
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const isNative = Capacitor.isNativePlatform();

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

  async function handleNativeCapture(source: CameraSource) {
    setBusy(true);
    try {
      const photo = await CapacitorCamera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source,
        quality: 85,
        direction: facingMode === "user" ? CameraDirection.Front : CameraDirection.Rear,
      });
      if (!photo.dataUrl) return;
      const compressed = await compressDataUrl(photo.dataUrl);
      onCapture(compressed);
    } catch (err) {
      // user cancelling the native picker rejects the promise — not a real error
      if (err instanceof Error && /cancel/i.test(err.message)) return;
      toast.error("Couldn't process that photo.");
    } finally {
      setBusy(false);
    }
  }

  if (isNative) {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => handleNativeCapture(CameraSource.Camera)}
        >
          <Camera /> Take photo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => handleNativeCapture(CameraSource.Photos)}
        >
          <ImageUp /> Upload
        </Button>
      </div>
    );
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
