import { Flag, Heart, Trash2 } from "lucide-react";
import * as React from "react";

import { CommunityAvatar } from "@/components/app/community-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CommunityPost, ReportReason } from "@/lib/community";
import { formatRelativeTime } from "@/lib/storage";
import { cn } from "@/lib/utils";

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "mocking", label: "Mocking or harassment" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "unrelated", label: "Not related to progress" },
  { value: "other", label: "Other" },
];

interface CommunityPostCardProps {
  post: CommunityPost;
  onToggleReaction: (id: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string, reason: ReportReason) => void;
}

export function CommunityPostCard({ post, onToggleReaction, onDelete, onReport }: CommunityPostCardProps) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reported, setReported] = React.useState(false);

  return (
    <Card className="overflow-hidden py-0">
      <img src={post.photo} alt="" className="aspect-square w-full object-cover" />
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex items-center gap-2.5">
          <CommunityAvatar seed={post.avatarSeed} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{post.pseudonym}</p>
            <p className="text-muted-foreground text-xs">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>

        {post.caption && <p className="text-sm">{post.caption}</p>}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleReaction(post.id)}
            className={cn("gap-1.5", post.reactedByMe && "text-destructive")}
          >
            <Heart className={cn("size-4", post.reactedByMe && "fill-current")} />
            {post.reactionCount > 0 ? post.reactionCount : "Support"}
          </Button>

          {post.mine ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          ) : reported ? (
            <span className="text-muted-foreground text-xs">Reported</span>
          ) : (
            <Popover open={reportOpen} onOpenChange={setReportOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                  <Flag className="size-4" /> Report
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="end">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    className="hover:bg-accent w-full rounded-sm px-2 py-1.5 text-left text-sm"
                    onClick={() => {
                      onReport(post.id, reason.value);
                      setReported(true);
                      setReportOpen(false);
                    }}
                  >
                    {reason.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
