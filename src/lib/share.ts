interface ShareNativeInput {
  photo?: string;
  title?: string;
  text?: string;
}

export async function shareNative({ photo, title, text }: ShareNativeInput) {
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
