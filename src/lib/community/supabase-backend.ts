import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { generateAvatarSeed, generatePseudonym } from "./pseudonym";
import type { CommunityBackend, CommunityIdentity, CommunityPost, CreatePostInput, ReportReason } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }
  return client;
}

async function getUserId(): Promise<string> {
  const supabase = getClient();
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return data.session.user.id;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.user) throw new Error(error?.message ?? "Could not start an anonymous session");
  return signInData.user.id;
}

async function ensureProfile(userId: string): Promise<CommunityIdentity> {
  const supabase = getClient();
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

interface PostRow {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
  reaction_count: number;
  community_profiles: { pseudonym: string; avatar_seed: string } | null;
}

function rowToPost(row: PostRow, userId: string, reactedIds: Set<string>): CommunityPost {
  return {
    id: row.id,
    pseudonym: row.community_profiles?.pseudonym ?? "Anonymous",
    avatarSeed: row.community_profiles?.avatar_seed ?? row.id,
    photo: row.photo_url,
    caption: row.caption ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    reactionCount: row.reaction_count,
    reactedByMe: reactedIds.has(row.id),
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
    const supabase = getClient();
    const userId = await getUserId();
    await ensureProfile(userId);

    const [{ data: posts, error }, { data: myReactions }] = await Promise.all([
      supabase
        .from("community_posts")
        .select("id, user_id, photo_url, caption, created_at, reaction_count, community_profiles(pseudonym, avatar_seed)")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("community_reactions").select("post_id").eq("user_id", userId),
    ]);

    if (error) throw new Error(error.message);
    const reactedIds = new Set((myReactions ?? []).map((r) => r.post_id as string));
    return ((posts ?? []) as unknown as PostRow[]).map((row) => rowToPost(row, userId, reactedIds));
  },

  async createPost(input: CreatePostInput) {
    const supabase = getClient();
    const userId = await getUserId();
    const identity = await ensureProfile(userId);

    const path = `${userId}/${Date.now()}.jpg`;
    const blob = await (await fetch(input.photo)).blob();
    const { error: uploadError } = await supabase.storage.from("community-photos").upload(path, blob, {
      contentType: "image/jpeg",
    });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from("community-photos").getPublicUrl(path);

    const { data, error } = await supabase
      .from("community_posts")
      .insert({ user_id: userId, photo_url: publicUrlData.publicUrl, caption: input.caption?.trim() || null })
      .select("id, user_id, photo_url, caption, created_at, reaction_count")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Could not create post");

    return {
      id: data.id,
      pseudonym: identity.pseudonym,
      avatarSeed: identity.avatarSeed,
      photo: data.photo_url,
      caption: data.caption ?? undefined,
      createdAt: new Date(data.created_at).getTime(),
      reactionCount: data.reaction_count,
      reactedByMe: false,
      mine: true,
    };
  },

  async deletePost(id: string) {
    const supabase = getClient();
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async toggleReaction(id: string) {
    const supabase = getClient();
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
    const supabase = getClient();
    const userId = await getUserId();
    const { error } = await supabase.from("community_reports").insert({ post_id: id, user_id: userId, reason });
    if (error) throw new Error(error.message);
  },
};
