import * as React from "react";
import { toast } from "sonner";

import { PhotoCaptureButton } from "@/components/app/photo-capture-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { CreatePostInput } from "@/lib/community";

const CAPTION_MAX = 140;

interface CommunityComposerProps {
  onSubmit: (input: CreatePostInput) => Promise<void>;
  onRequireConsent: () => boolean;
}

export function CommunityComposer({ onSubmit, onRequireConsent }: CommunityComposerProps) {
  const [photo, setPhoto] = React.useState<string>();
  const [caption, setCaption] = React.useState("");
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [posting, setPosting] = React.useState(false);

  const canPost = Boolean(photo) && acknowledged && !posting;

  async function handlePost() {
    if (!photo) return;
    if (!onRequireConsent()) return;
    setPosting(true);
    try {
      await onSubmit({ photo, caption: caption.trim() || undefined });
      setPhoto(undefined);
      setCaption("");
      setAcknowledged(false);
      toast.success("Posted to the community.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't post right now.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Share your progress</CardTitle>
        <p className="text-muted-foreground text-sm">
          Visible publicly, anonymously — no name or personal details attached
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {photo ? (
          <div className="relative w-fit">
            <img src={photo} alt="" className="h-40 w-40 rounded-lg border object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute -top-2 -right-2 h-7 rounded-full px-2"
              onClick={() => setPhoto(undefined)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <PhotoCaptureButton onCapture={setPhoto} facingMode="user" />
        )}

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, CAPTION_MAX))}
          placeholder="Optional caption — e.g. how you're feeling about the change (optional)"
          maxLength={CAPTION_MAX}
        />
        <p className="text-muted-foreground -mt-3 text-right text-xs">
          {caption.length}/{CAPTION_MAX}
        </p>

        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox
            checked={acknowledged}
            onCheckedChange={(v) => setAcknowledged(v === true)}
            className="mt-0.5"
          />
          I understand this photo will be posted publicly and anonymously.
        </label>

        <Button onClick={handlePost} disabled={!canPost} className="self-start">
          {posting ? "Posting…" : "Post to community"}
        </Button>
      </CardContent>
    </Card>
  );
}
