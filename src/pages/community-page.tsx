import { Info, PenLine } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { CommunityComposer } from "@/components/app/community-composer";
import { CommunityConsentDialog } from "@/components/app/community-consent-dialog";
import { CommunityPostCard } from "@/components/app/community-post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCommunityConsent } from "@/hooks/use-community-consent";
import { communityBackend, isSupabaseConfigured, type CommunityPost, type CreatePostInput, type ReportReason } from "@/lib/community";

export function CommunityPage() {
  const { hasConsented, giveConsent } = useCommunityConsent();
  const [consentOpen, setConsentOpen] = React.useState(false);
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [composerOpen, setComposerOpen] = React.useState(false);

  const loadFeed = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const feed = await communityBackend.listFeed();
      setPosts(feed);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  function requireConsent(): boolean {
    if (hasConsented) return true;
    setConsentOpen(true);
    return false;
  }

  async function handleCreatePost(input: CreatePostInput) {
    const post = await communityBackend.createPost(input);
    setPosts((prev) => [post, ...prev]);
  }

  async function handleToggleReaction(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, reactedByMe: !p.reactedByMe, reactionCount: p.reactionCount + (p.reactedByMe ? -1 : 1) }
          : p,
      ),
    );
    try {
      await communityBackend.toggleReaction(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that reaction.");
      loadFeed();
    }
  }

  async function handleDelete(id: string) {
    const prev = posts;
    setPosts((p) => p.filter((post) => post.id !== id));
    try {
      await communityBackend.deletePost(id);
      toast("Post deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete that post.");
      setPosts(prev);
    }
  }

  async function handleReport(id: string, reason: ReportReason) {
    try {
      await communityBackend.reportPost(id, reason);
      toast("Thanks — we'll review this post.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit that report.");
    }
  }

  function handleCommentCountChange(postId: string, delta: number) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: Math.max(0, p.commentCount + delta) } : p)),
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      {!isSupabaseConfigured && (
        <Card className="border-warning/40 bg-warning/10">
          <CardContent className="flex items-start gap-2.5 py-4 text-sm">
            <Info className="text-warning mt-0.5 size-4 shrink-0" />
            <p className="min-w-0">
              <strong>Demo mode.</strong> No community backend is configured yet, so posts here are only
              visible on this device — they aren't actually shared with other users. See the README for how
              to connect a real backend.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2">
            <PenLine className="size-4" />
            Create post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share with the community</DialogTitle>
            <DialogDescription>
              Progress, a win, a rough day — with or without a photo. Visible publicly, anonymously.
            </DialogDescription>
          </DialogHeader>
          <CommunityComposer
            onSubmit={handleCreatePost}
            onRequireConsent={requireConsent}
            onPosted={() => setComposerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Separator />

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading community posts…</p>
      ) : loadError ? (
        <p className="text-destructive text-sm">Couldn't load the community feed: {loadError}</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No posts yet. Tap "Create post" to be the first to share how it's going.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              onToggleReaction={handleToggleReaction}
              onDelete={handleDelete}
              onReport={handleReport}
              onCommentCountChange={handleCommentCountChange}
            />
          ))}
        </div>
      )}

      <CommunityConsentDialog
        open={consentOpen}
        onOpenChange={setConsentOpen}
        onAgree={() => {
          giveConsent();
          setConsentOpen(false);
        }}
      />
    </div>
  );
}
