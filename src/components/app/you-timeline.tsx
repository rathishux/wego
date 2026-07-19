import { Check, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/storage";
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
        Nothing here yet. Add your first photo above to start your timeline.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {[...posts]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((post) => (
          <Card key={post.id} className="overflow-hidden py-0">
            <img src={post.photo} alt={post.title ?? ""} className="aspect-square w-full object-cover" />
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {post.title && <h3 className="truncate font-semibold">{post.title}</h3>}
                  <p className="text-muted-foreground text-xs">{formatDateTime(post.createdAt)}</p>
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

              {post.description && <p className="text-sm">{post.description}</p>}

              <div className="mt-1">
                {post.sharedPostId ? (
                  <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                    <Check className="size-3.5" /> Shared to Community
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={sharing === post.id}
                    onClick={() => onShare(post)}
                  >
                    <Share2 className="size-3.5" />
                    {sharing === post.id ? "Sharing…" : "Share to Community"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
