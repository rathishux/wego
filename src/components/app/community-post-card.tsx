import { Flag, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import * as React from "react";

import { CommunityAvatar } from "@/components/app/community-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { communityBackend, type CommunityComment, type CommunityPost, type ReportReason } from "@/lib/community";
import { formatRelativeTime } from "@/lib/storage";
import { cn } from "@/lib/utils";

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "mocking", label: "Mocking or harassment" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "unrelated", label: "Not related to progress" },
  { value: "other", label: "Other" },
];

function ReportButton({ onReport }: { onReport: (reason: ReportReason) => void }) {
  const [open, setOpen] = React.useState(false);
  const [reported, setReported] = React.useState(false);

  if (reported) {
    return <span className="text-muted-foreground text-xs">Reported</span>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-7 gap-1.5 px-2 text-xs">
          <Flag className="size-3" /> Report
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="end">
        {REPORT_REASONS.map((reason) => (
          <button
            key={reason.value}
            type="button"
            className="hover:bg-accent w-full rounded-sm px-2 py-1.5 text-left text-sm"
            onClick={() => {
              onReport(reason.value);
              setReported(true);
              setOpen(false);
            }}
          >
            {reason.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

interface CommentsSectionProps {
  postId: string;
  onCommentCountChange: (delta: number) => void;
}

function CommentsSection({ postId, onCommentCountChange }: CommentsSectionProps) {
  const [comments, setComments] = React.useState<CommunityComment[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [text, setText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    communityBackend
      .listComments(postId)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setPosting(true);
    try {
      const comment = await communityBackend.addComment(postId, body);
      setComments((prev) => [...(prev ?? []), comment]);
      onCommentCountChange(1);
      setText("");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id: string) {
    setComments((prev) => (prev ?? []).filter((c) => c.id !== id));
    onCommentCountChange(-1);
    await communityBackend.deleteComment(id);
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-3">
      {loading ? (
        <p className="text-muted-foreground text-xs">Loading comments…</p>
      ) : comments && comments.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <CommunityAvatar seed={comment.avatarSeed} className="mt-0.5 size-6" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="truncate text-xs font-medium">{comment.pseudonym}</span>
                  <span className="text-muted-foreground shrink-0 text-[11px]">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm break-words">{comment.body}</p>
              </div>
              {comment.mine ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive size-6 shrink-0"
                  aria-label="Delete comment"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              ) : (
                <ReportButton onReport={(reason) => communityBackend.reportComment(comment.id, reason)} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">No comments yet — be the first to reply.</p>
      )}

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a supportive reply…"
          maxLength={280}
          className="h-8 text-sm"
        />
        <Button type="submit" size="icon" className="size-8 shrink-0" disabled={posting || !text.trim()}>
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}

interface CommunityPostCardProps {
  post: CommunityPost;
  onToggleReaction: (id: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string, reason: ReportReason) => void;
  onCommentCountChange: (postId: string, delta: number) => void;
}

export function CommunityPostCard({
  post,
  onToggleReaction,
  onDelete,
  onReport,
  onCommentCountChange,
}: CommunityPostCardProps) {
  const [commentsOpen, setCommentsOpen] = React.useState(false);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <CommunityAvatar seed={post.avatarSeed} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{post.pseudonym}</p>
          <p className="text-muted-foreground text-xs">{formatRelativeTime(post.createdAt)}</p>
        </div>
        {post.mine ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8 shrink-0"
            aria-label="Delete post"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : (
          <ReportButton onReport={(reason) => onReport(post.id, reason)} />
        )}
      </div>

      {post.photo && <img src={post.photo} alt="" className="aspect-square w-full object-cover" />}

      <CardContent className="flex flex-col gap-2 py-3">
        {post.caption && (
          <p className="text-sm whitespace-pre-wrap">
            <span className="font-medium">{post.pseudonym}</span> {post.caption}
          </p>
        )}

        <div className="-ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleReaction(post.id)}
            className={cn("gap-1.5", post.reactedByMe && "text-destructive")}
          >
            <Heart className={cn("size-4", post.reactedByMe && "fill-current")} />
            {post.reactionCount > 0 ? post.reactionCount : "Support"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1.5"
            onClick={() => setCommentsOpen((v) => !v)}
          >
            <MessageCircle className="size-4" />
            {post.commentCount > 0 ? post.commentCount : "Reply"}
          </Button>
        </div>

        {commentsOpen && (
          <CommentsSection postId={post.id} onCommentCountChange={(delta) => onCommentCountChange(post.id, delta)} />
        )}
      </CardContent>
    </Card>
  );
}
