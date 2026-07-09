export interface CommunityIdentity {
  pseudonym: string;
  avatarSeed: string;
}

export interface CommunityPost {
  id: string;
  pseudonym: string;
  avatarSeed: string;
  photo: string;
  caption?: string;
  createdAt: number;
  reactionCount: number;
  reactedByMe: boolean;
  mine: boolean;
}

export interface CreatePostInput {
  photo: string;
  caption?: string;
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
}
