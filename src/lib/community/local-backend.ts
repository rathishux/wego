import { loadList, loadValue, saveList, saveValue, uid } from "@/lib/storage";

import { generateAvatarSeed, generatePseudonym } from "./pseudonym";
import type { CommunityBackend, CommunityIdentity, CommunityPost, CreatePostInput, ReportReason } from "./types";

const IDENTITY_KEY = "steady.community.identity";
const POSTS_KEY = "steady.community.posts.local";
const REACTIONS_KEY = "steady.community.reactions.local";
const REPORT_THRESHOLD = 3;

interface StoredPost {
  id: string;
  photo: string;
  caption?: string;
  createdAt: number;
  reactionCount: number;
  reportCount: number;
  hidden: boolean;
}

function getIdentitySync(): CommunityIdentity {
  const existing = loadValue<CommunityIdentity | null>(IDENTITY_KEY, null);
  if (existing) return existing;
  const identity: CommunityIdentity = {
    pseudonym: generatePseudonym(),
    avatarSeed: generateAvatarSeed(),
  };
  saveValue(IDENTITY_KEY, identity);
  return identity;
}

function toPublic(post: StoredPost, identity: CommunityIdentity, reacted: Set<string>): CommunityPost {
  return {
    id: post.id,
    pseudonym: identity.pseudonym,
    avatarSeed: identity.avatarSeed,
    photo: post.photo,
    caption: post.caption,
    createdAt: post.createdAt,
    reactionCount: post.reactionCount,
    reactedByMe: reacted.has(post.id),
    mine: true,
  };
}

export const localCommunityBackend: CommunityBackend = {
  mode: "local",

  async getIdentity() {
    return getIdentitySync();
  },

  async listFeed() {
    const identity = getIdentitySync();
    const reacted = new Set(loadList<string>(REACTIONS_KEY));
    const posts = loadList<StoredPost>(POSTS_KEY).filter((p) => !p.hidden);
    return posts
      .map((p) => toPublic(p, identity, reacted))
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async createPost(input: CreatePostInput) {
    const identity = getIdentitySync();
    const post: StoredPost = {
      id: uid(),
      photo: input.photo,
      caption: input.caption?.trim() || undefined,
      createdAt: Date.now(),
      reactionCount: 0,
      reportCount: 0,
      hidden: false,
    };
    const posts = loadList<StoredPost>(POSTS_KEY);
    posts.push(post);
    saveList(POSTS_KEY, posts);
    return toPublic(post, identity, new Set());
  },

  async deletePost(id: string) {
    const posts = loadList<StoredPost>(POSTS_KEY).filter((p) => p.id !== id);
    saveList(POSTS_KEY, posts);
  },

  async toggleReaction(id: string) {
    const posts = loadList<StoredPost>(POSTS_KEY);
    const reactedIds = new Set(loadList<string>(REACTIONS_KEY));
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (reactedIds.has(id)) {
      reactedIds.delete(id);
      post.reactionCount = Math.max(0, post.reactionCount - 1);
    } else {
      reactedIds.add(id);
      post.reactionCount += 1;
    }
    saveList(POSTS_KEY, posts);
    saveList(REACTIONS_KEY, Array.from(reactedIds));
  },

  async reportPost(id: string, _reason: ReportReason) {
    const posts = loadList<StoredPost>(POSTS_KEY);
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    post.reportCount += 1;
    if (post.reportCount >= REPORT_THRESHOLD) post.hidden = true;
    saveList(POSTS_KEY, posts);
  },
};
