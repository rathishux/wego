import { getSupabase } from "@/lib/supabase";
import { KEYS, loadList, loadValue } from "@/lib/storage";
import type { DoseEntry, FoodEntry, GlucoseEntry, Markers, Profile, ProgressPhoto, WeightEntry } from "@/lib/types";

const MIGRATION_FLAG_KEY = "steady.cloudMigrationDone";

export async function migrateLocalDataToCloud(userId: string): Promise<number | null> {
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === userId) return null;

  const doses = loadList<DoseEntry>(KEYS.doses);
  const weights = loadList<WeightEntry>(KEYS.weights);
  const glucose = loadList<GlucoseEntry>(KEYS.glucose);
  const food = loadList<FoodEntry>(KEYS.food);
  const progressPhotos = loadList<ProgressPhoto>(KEYS.progressPhotos);
  const markers = loadValue<Markers | null>(KEYS.markers, null);
  const profile = loadValue<Profile | null>(KEYS.profile, null);

  const rows = [
    ...doses.map((e) => ({ id: e.id, user_id: userId, type: "dose", created_at: e.createdAt, date: e.date, data: e })),
    ...weights.map((e) => ({ id: e.id, user_id: userId, type: "weight", created_at: e.createdAt, date: e.date, data: e })),
    ...glucose.map((e) => ({ id: e.id, user_id: userId, type: "glucose", created_at: e.createdAt, date: e.date, data: e })),
    ...food.map((e) => ({ id: e.id, user_id: userId, type: "food", created_at: e.createdAt, date: e.date, data: e })),
    ...progressPhotos.map((e) => ({
      id: e.id,
      user_id: userId,
      type: "progress_photo",
      created_at: e.createdAt,
      date: null,
      data: e,
    })),
  ];

  const supabase = getSupabase();

  if (rows.length > 0) {
    const { error } = await supabase.from("entries").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }

  if (markers && (markers.waist || markers.sleep || markers.mood)) {
    const { error } = await supabase
      .from("user_markers")
      .upsert({ user_id: userId, data: markers, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  if (profile && (profile.name || profile.height || profile.weight)) {
    const { error } = await supabase
      .from("user_profile")
      .upsert({ user_id: userId, data: profile, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  localStorage.setItem(MIGRATION_FLAG_KEY, userId);
  return rows.length;
}
