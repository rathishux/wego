import { Plus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { CommunityConsentDialog } from "@/components/app/community-consent-dialog";
import { YouPostForm } from "@/components/app/forms/you-post-form";
import { YouTimeline } from "@/components/app/you-timeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCommunityConsent } from "@/hooks/use-community-consent";
import { useEntries } from "@/hooks/use-entries";
import { communityBackend } from "@/lib/community";
import type { YouPost } from "@/lib/types";

export function YouPage() {
  const { list: posts, add, remove, update, loading, error } = useEntries<YouPost>("you_post");
  const { hasConsented, giveConsent } = useCommunityConsent();
  const [consentOpen, setConsentOpen] = React.useState(false);
  const [pendingShare, setPendingShare] = React.useState<YouPost | null>(null);
  const [sharing, setSharing] = React.useState<string | null>(null);
  const [composerOpen, setComposerOpen] = React.useState(false);

  function handleAdd(post: YouPost) {
    add(post);
    setComposerOpen(false);
  }

  async function shareToCommunity(post: YouPost) {
    setSharing(post.id);
    try {
      const caption = [post.title, post.description].filter(Boolean).join("\n\n") || undefined;
      const shared = await communityBackend.createPost({ photo: post.photo, caption });
      update(post.id, { sharedPostId: shared.id });
      toast.success("Shared to Community.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't share that post.");
    } finally {
      setSharing(null);
    }
  }

  function handleShareClick(post: YouPost) {
    if (!hasConsented) {
      setPendingShare(post);
      setConsentOpen(true);
      return;
    }
    shareToCommunity(post);
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading your timeline…</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Couldn't load your data: {error}</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Private by default — visible only to you unless you share it.
      </p>

      <YouTimeline posts={posts} onDelete={remove} onShare={handleShareClick} sharing={sharing} />

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed right-6 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 size-14 rounded-full shadow-lg md:bottom-6"
            aria-label="New entry"
          >
            <Plus className="size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New entry</DialogTitle>
            <DialogDescription>
              Private by default — visible only to you unless you share it.
            </DialogDescription>
          </DialogHeader>
          <YouPostForm onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      <CommunityConsentDialog
        open={consentOpen}
        onOpenChange={setConsentOpen}
        onAgree={() => {
          giveConsent();
          setConsentOpen(false);
          if (pendingShare) {
            shareToCommunity(pendingShare);
            setPendingShare(null);
          }
        }}
      />
    </div>
  );
}
