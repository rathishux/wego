import { localCommunityBackend } from "./local-backend";
import { isSupabaseConfigured, supabaseCommunityBackend } from "./supabase-backend";
import type { CommunityBackend } from "./types";

export const communityBackend: CommunityBackend = isSupabaseConfigured
  ? supabaseCommunityBackend
  : localCommunityBackend;

export { isSupabaseConfigured };
export * from "./avatar";
export * from "./types";
