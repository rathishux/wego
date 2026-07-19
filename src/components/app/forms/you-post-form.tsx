import * as React from "react";
import { toast } from "sonner";

import { PhotoCaptureButton } from "@/components/app/photo-capture-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uid } from "@/lib/storage";
import type { YouPost } from "@/lib/types";

interface YouPostFormProps {
  onAdd: (post: YouPost) => void;
}

export function YouPostForm({ onAdd }: YouPostFormProps) {
  const [photo, setPhoto] = React.useState<string>();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photo) return;
    onAdd({
      id: uid(),
      createdAt: Date.now(),
      photo,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    });
    setPhoto(undefined);
    setTitle("");
    setDescription("");
    toast.success("Added to your timeline.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {photo ? (
        <div className="relative w-fit">
          <img src={photo} alt="" className="h-48 w-48 rounded-lg border object-cover" />
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

      <div className="space-y-1.5">
        <Label htmlFor="you-title">Title</Label>
        <Input
          id="you-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional — e.g. Week 8"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="you-description">Description</Label>
        <Textarea
          id="you-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="How are you feeling about the change? (optional)"
        />
      </div>

      <Button type="submit" disabled={!photo} className="self-start">
        Post
      </Button>
    </form>
  );
}
