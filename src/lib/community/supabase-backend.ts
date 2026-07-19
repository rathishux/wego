import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

import { generateAvatarSeed, generatePseudonym } from "./pseudonym";
import type {
  CommunityBackend,
  CommunityComment,
  CommunityIdentity,
  CommunityPost,
  CreatePostInput,
  ReportReason,
} from "./types";

export { isSupabaseConfigured };

async function getUserId(): Promise<string> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return data.session.user.id;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.user) throw new Error(error?.message ?? "Could not start an anonymous session");
  return signInData.user.id;
}

async function ensureProfile(userId: string): Promise<CommunityIdentity> {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("community_profiles")
    .select("pseudonym, avatar_seed")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return { pseudonym: existing.pseudonym, avatarSeed: existing.avatar_seed };
  }

  const identity: CommunityIdentity = {
    pseudonym: generatePseudonym(),
    avatarSeed: generateAvatarSeed(),
  };
  const { error } = await supabase.from("community_profiles").insert({
    user_id: userId,
    pseudonym: identity.pseudonym,
    avatar_seed: identity.avatarSeed,
  });
  if (error) throw new Error(error.message);
  return identity;
}

async function loadProfiles(userIds: string[]): Promise<Map<string, CommunityIdentity>> {
  const supabase = getSupabase();
  const profiles = new Map<string, CommunityIdentity>();
  const uniqueIds = Array.from(new Set(userIds));
  if (uniqueIds.length === 0) return profiles;

  const { data: profileRows, error } = await supabase
    .from("community_profiles")
    .select("user_id, pseudonym, avatar_seed")
    .in("user_id", uniqueIds);
  if (error) throw new Error(error.message);
  for (const p of profileRows ?? []) {
    profiles.set(p.user_id, { pseudonym: p.pseudonym, avatarSeed: p.avatar_seed });
  }
  return profiles;
}

interface PostRow {
  id: string;
  user_id: string;
  photo_url: string | null;
  caption: string | null;
  created_at: string;
  reaction_count: number;
  comment_count: number;
}

function rowToPost(
  row: PostRow,
  userId: string,
  profiles: Map<string, CommunityIdentity>,
  reactedIds: Set<string>,
): CommunityPost {
  const profile = profiles.get(row.user_id);
  return {
    id: row.id,
    pseudonym: profile?.pseudonym ?? "Anonymous",
    avatarSeed: profile?.avatarSeed ?? row.id,
    photo: row.photo_url ?? undefined,
    caption: row.caption ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    reactionCount: row.reaction_count,
    commentCount: row.comment_count,
    reactedByMe: reactedIds.has(row.id),
    mine: row.user_id === userId,
  };
}

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

function rowToComment(row: CommentRow, userId: string, profiles: Map<string, CommunityIdentity>): CommunityComment {
  const profile = profiles.get(row.user_id);
  return {
    id: row.id,
    postId: row.post_id,
    pseudonym: profile?.pseudonym ?? "Anonymous",
    avatarSeed: profile?.avatarSeed ?? row.id,
    body: row.body,
    createdAt: new Date(row.created_at).getTime(),
    mine: row.user_id === userId,
  };
}

export const supabaseCommunityBackend: CommunityBackend = {
  mode: "supabase",

  async getIdentity() {
    const userId = await getUserId();
    return ensureProfile(userId);
  },

  async listFeed() {
    const supabase = getSupabase();
    const userId = await getUserId();
    await ensureProfile(userId);

    const [{ data: posts, error }, { data: myReactions, error: reactionsError }] = await Promise.all([
      supabase
        .from("community_posts")
        .select("id, user_id, photo_url, caption, created_at, reaction_count, comment_count")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("community_reactions").select("post_id").eq("user_id", userId),
    ]);

    if (error) throw new Error(error.message);
    if (reactionsError) throw new Error(reactionsError.message);

    const postRows = (posts ?? []) as PostRow[];
    const profiles = await loadProfiles(postRows.map((p) => p.user_id));
    const reactedIds = new Set((myReactions ?? []).map((r) => r.post_id as string));
    return postRows.map((row) => rowToPost(row, userId, profiles, reactedIds));
  },

  async createPost(input: CreatePostInput) {
    const supabase = getSupabase();
    const userId = await getUserId();
    const identity = await ensureProfile(userId);

    let photoUrl: string | null = null;
    if (input.photo) {
      const path = `${userId}/${Date.now()}.jpg`;
      const blob = await (await fetch(input.photo)).blob();
      const { error: uploadError } = await supabase.storage.from("community-photos").upload(path, blob, {
        contentType: "image/jpeg",
      });
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicUrlData } = supabase.storage.from("community-photos").getPublicUrl(path);
      photoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert({ user_id: userId, photo_url: photoUrl, caption: input.caption?.trim() || null })
      .select("id, user_id, photo_url, caption, created_at, reaction_count, comment_count")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Could not create post");

    return {
      id: data.id,
      pseudonym: identity.pseudonym,
      avatarSeed: identity.avatarSeed,
      photo: data.photo_url ?? undefined,
      caption: data.caption ?? undefined,
      createdAt: new Date(data.created_at).getTime(),
      reactionCount: data.reaction_count,
      commentCount: data.comment_count,
      reactedByMe: false,
      mine: true,
    };
  },

  async deletePost(id: string) {
    const supabase = getSupabase();
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async toggleReaction(id: string) {
    const supabase = getSupabase();
    const userId = await getUserId();
    const { data: existing } = await supabase
      .from("community_reactions")
      .select("post_id")
      .eq("post_id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("community_reactions").delete().eq("post_id", id).eq("user_id", userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("community_reactions").insert({ post_id: id, user_id: userId });
      if (error) throw new Error(error.message);
    }
  },

  async reportPost(id: string, reason: ReportReason) {
    const supabase = getSupabase();
    const userId = await getUserId();
    const { error } = await supabase.from("community_reports").insert({ post_id: id, user_id: userId, reason });
    if (error) throw new Error(error.message);
  },

  async listComments(postId: string) {
    const supabase = getSupabase();
    const userId = await getUserId();

    const { data: rows, error } = await supabase
      .from("community_comments")
      .select("id, post_id, user_id, body, created_at")
      .eq("post_id", postId)
      .eq("hidden", false)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const commentRows = (rows ?? []) as CommentRow[];
    const profiles = await loadProfiles(commentRows.map((r) => r.user_id));
    return commentRows.map((row) => rowToComment(row, userId, profiles));
  },

  async addComment(postId: string, body: string) {
    const supabase = getSupabase();
    const userId = await getUserId();
    const identity = await ensureProfile(userId);

    const { data, error } = await supabase
      .from("community_comments")
      .insert({ post_id: postId, user_id: userId, body: body.trim() })
      .select("id, post_id, created_at")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Could not add comment");

    return {
      id: data.id,
      postId: data.post_id,
      pseudonym: identity.pseudonym,
      avatarSeed: identity.avatarSeed,
      body: body.trim(),
      createdAt: new Date(data.created_at).getTime(),
      mine: true,
    };
  },

  async deleteComment(id: string) {
    const supabase = getSupabase();
    const { error } = await supabase.from("community_comments").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async reportComment(id: string, reason: ReportReason) {
    const supabase = getSupabase();
    const userId = await getUserId();
    const { error } = await supabase.from("community_comment_reports").insert({ comment_id: id, user_id: userId, reason });
    if (error) throw new Error(error.message);
  },
};
