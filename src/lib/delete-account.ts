import { getSupabase } from "@/lib/supabase";

// Deletes every row this user owns across all tables, removes their
// Community photos from storage, then signs them out. This does NOT remove
// the underlying Supabase auth user record itself — that requires an admin
// API call with the service role key, which can't safely run in client code.
// A handful of moderation rows (reports/comment-reports this user filed
// against others) also can't be deleted client-side by design (see
// schema.sql/schema_v2.sql — those tables intentionally have no delete
// policy, so reports can't be tampered with after filing). Both are disclosed
// to the user before they confirm.
export async function deleteAccountData(userId: string): Promise<void> {
  const supabase = getSupabase();

  const deletions = await Promise.all([
    supabase.from("entries").delete().eq("user_id", userId),
    supabase.from("user_markers").delete().eq("user_id", userId),
    supabase.from("user_profile").delete().eq("user_id", userId),
    supabase.from("community_comments").delete().eq("user_id", userId),
    supabase.from("community_reactions").delete().eq("user_id", userId),
  ]);

  for (const { error } of deletions) {
    if (error) throw new Error(error.message);
  }

  // Deleting a user's own posts cascades (via foreign keys) to remove any
  // reactions/comments/reports other users left on those specific posts.
  const { error: postsError } = await supabase.from("community_posts").delete().eq("user_id", userId);
  if (postsError) throw new Error(postsError.message);

  const { error: profileError } = await supabase.from("community_profiles").delete().eq("user_id", userId);
  if (profileError) throw new Error(profileError.message);

  try {
    const { data: files } = await supabase.storage.from("community-photos").list(userId);
    if (files && files.length > 0) {
      await supabase.storage.from("community-photos").remove(files.map((f) => `${userId}/${f.name}`));
    }
  } catch {
    // Storage cleanup is best-effort — don't block account deletion on it.
  }

  await supabase.auth.signOut();
}
