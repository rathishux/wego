export interface CommunityIdentity {
  pseudonym: string;
  avatarSeed: string;
}

export interface CommunityPost {
  id: string;
  pseudonym: string;
  avatarSeed: string;
  photo?: string;
  caption?: string;
  createdAt: number;
  reactionCount: number;
  commentCount: number;
  reactedByMe: boolean;
  mine: boolean;
}

export interface CreatePostInput {
  photo?: string;
  caption?: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  pseudonym: string;
  avatarSeed: string;
  body: string;
  createdAt: number;
  mine: boolean;
}

export type ReportReason = "mocking" | "inappropriate" | "unrelated" | "other";

export interface CommunityBackend {
  mode: "supabase" | "local";
  getIdentity(): Promise<CommunityIdentity>;
  listFeed(): Promise<CommunityPost[]>;
  createPost(input: CreatePostInput): Promise<CommunityPost>;
  deletePost(id: string): Promise<void>;
  toggleReaction(id: string): Promise<void>;
  reportPost(id: string, reason: ReportReason): Promise<void>;
  listComments(postId: string): Promise<CommunityComment[]>;
  addComment(postId: string, body: string): Promise<CommunityComment>;
  deleteComment(id: string): Promise<void>;
  reportComment(id: string, reason: ReportReason): Promise<void>;
}
