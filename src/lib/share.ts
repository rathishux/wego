import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

interface ShareNativeInput {
  photo?: string;
  title?: string;
  text?: string;
}

async function shareCapacitor({ photo, title, text }: ShareNativeInput) {
  let files: string[] | undefined;
  if (photo) {
    const base64Data = photo.split(",")[1] ?? photo;
    const written = await Filesystem.writeFile({
      path: `share-${Date.now()}.jpg`,
      data: base64Data,
      directory: Directory.Cache,
    });
    files = [written.uri];
  }
  await Share.share({ title, text, files, dialogTitle: title ?? "Share" });
}

async function shareWeb({ photo, title, text }: ShareNativeInput) {
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };

  if (!nav.share) {
    throw new Error("Sharing isn't supported on this browser.");
  }

  let files: File[] | undefined;
  if (photo) {
    try {
      const res = await fetch(photo);
      const blob = await res.blob();
      const file = new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" });
      if (nav.canShare?.({ files: [file] })) {
        files = [file];
      }
    } catch {
      // fall back to a text-only share if the photo can't be turned into a file
    }
  }

  await nav.share({ title, text, files });
}

export async function shareNative(input: ShareNativeInput) {
  if (Capacitor.isNativePlatform()) {
    await shareCapacitor(input);
  } else {
    await shareWeb(input);
  }
}

// The Web Share API rejects with a DOMException("AbortError") when the user
// dismisses the share sheet; native Capacitor plugins instead reject with a
// plain error whose message mentions the cancellation.
export function isShareCancelled(err: unknown): boolean {
  if (err instanceof DOMException && err.name === "AbortError") return true;
  return err instanceof Error && /cancel/i.test(err.message);
}
