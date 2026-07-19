import { loadList, loadValue, saveList, saveValue, uid } from "@/lib/storage";

import { generateAvatarSeed, generatePseudonym } from "./pseudonym";
import type {
  CommunityBackend,
  CommunityComment,
  CommunityIdentity,
  CommunityPost,
  CreatePostInput,
  ReportReason,
} from "./types";

const IDENTITY_KEY = "steady.community.identity";
const POSTS_KEY = "steady.community.posts.local";
const REACTIONS_KEY = "steady.community.reactions.local";
const COMMENTS_KEY = "steady.community.comments.local";
const REPORT_THRESHOLD = 3;

interface StoredPost {
  id: string;
  photo?: string;
  caption?: string;
  createdAt: number;
  reactionCount: number;
  commentCount: number;
  reportCount: number;
  hidden: boolean;
}

interface StoredComment {
  id: string;
  postId: string;
  body: string;
  createdAt: number;
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
    commentCount: post.commentCount,
    reactedByMe: reacted.has(post.id),
    mine: true,
  };
}

function toPublicComment(comment: StoredComment, identity: CommunityIdentity): CommunityComment {
  return {
    id: comment.id,
    postId: comment.postId,
    pseudonym: identity.pseudonym,
    avatarSeed: identity.avatarSeed,
    body: comment.body,
    createdAt: comment.createdAt,
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
      commentCount: 0,
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
    const comments = loadList<StoredComment>(COMMENTS_KEY).filter((c) => c.postId !== id);
    saveList(COMMENTS_KEY, comments);
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

  async listComments(postId: string) {
    const identity = getIdentitySync();
    return loadList<StoredComment>(COMMENTS_KEY)
      .filter((c) => c.postId === postId && !c.hidden)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((c) => toPublicComment(c, identity));
  },

  async addComment(postId: string, body: string) {
    const identity = getIdentitySync();
    const comment: StoredComment = {
      id: uid(),
      postId,
      body: body.trim(),
      createdAt: Date.now(),
      reportCount: 0,
      hidden: false,
    };
    const comments = loadList<StoredComment>(COMMENTS_KEY);
    comments.push(comment);
    saveList(COMMENTS_KEY, comments);

    const posts = loadList<StoredPost>(POSTS_KEY);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.commentCount += 1;
      saveList(POSTS_KEY, posts);
    }

    return toPublicComment(comment, identity);
  },

  async deleteComment(id: string) {
    const comments = loadList<StoredComment>(COMMENTS_KEY);
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    saveList(
      COMMENTS_KEY,
      comments.filter((c) => c.id !== id),
    );
    const posts = loadList<StoredPost>(POSTS_KEY);
    const post = posts.find((p) => p.id === comment.postId);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      saveList(POSTS_KEY, posts);
    }
  },

  async reportComment(id: string, _reason: ReportReason) {
    const comments = loadList<StoredComment>(COMMENTS_KEY);
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    comment.reportCount += 1;
    if (comment.reportCount >= REPORT_THRESHOLD) comment.hidden = true;
    saveList(COMMENTS_KEY, comments);
  },
};
