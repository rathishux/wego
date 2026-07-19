import * as React from "react";
import { toast } from "sonner";

import { CommunityConsentDialog } from "@/components/app/community-consent-dialog";
import { YouPostForm } from "@/components/app/forms/you-post-form";
import { YouTimeline } from "@/components/app/you-timeline";
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
    <div className="flex flex-col gap-6">
      <YouPostForm onAdd={add} />
      <YouTimeline posts={posts} onDelete={remove} onShare={handleShareClick} sharing={sharing} />

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
