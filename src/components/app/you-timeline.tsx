import { Camera, Check, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/storage";
import type { YouPost } from "@/lib/types";

interface YouTimelineProps {
  posts: YouPost[];
  onDelete: (id: string) => void;
  onShare: (post: YouPost) => void;
  sharing: string | null;
}

export function YouTimeline({ posts, onDelete, onShare, sharing }: YouTimelineProps) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-sm">
        Nothing here yet. Tap "New entry" to start your timeline.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {[...posts]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((post) => (
          <Card key={post.id} className="gap-0 overflow-hidden py-0">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                <Camera className="text-muted-foreground size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">You</p>
                <p className="text-muted-foreground text-xs">{formatRelativeTime(post.createdAt)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8 shrink-0"
                aria-label="Delete entry"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <img src={post.photo} alt="" className="aspect-square w-full object-cover" />

            <CardContent className="flex flex-col gap-2 py-3">
              {(post.title || post.description) && (
                <p className="text-sm">
                  <span className="font-medium">You</span>{" "}
                  {post.title && <span className="font-medium">{post.title}</span>}
                  {post.title && post.description && " — "}
                  {post.description}
                </p>
              )}

              {post.sharedPostId ? (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                  <Check className="size-3.5" /> Shared to Community
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground -ml-2 w-fit gap-1.5"
                  disabled={sharing === post.id}
                  onClick={() => onShare(post)}
                >
                  <Share2 className="size-3.5" />
                  {sharing === post.id ? "Sharing…" : "Share to Community"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
