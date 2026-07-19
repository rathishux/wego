import { useAuth } from "@/hooks/use-auth";
import { useCloudList } from "@/hooks/use-cloud-list";
import { useLocalList } from "@/hooks/use-local-list";
import { KEYS } from "@/lib/storage";

const LOCAL_KEY_BY_TYPE = {
  dose: KEYS.doses,
  weight: KEYS.weights,
  glucose: KEYS.glucose,
  food: KEYS.food,
  progress_photo: KEYS.progressPhotos,
  you_post: KEYS.youPosts,
} as const;

export type EntryType = keyof typeof LOCAL_KEY_BY_TYPE;

export function useEntries<T extends { id: string; date?: string; createdAt: number }>(type: EntryType) {
  const { cloudEnabled } = useAuth();
  const local = useLocalList<T>(LOCAL_KEY_BY_TYPE[type]);
  const cloud = useCloudList<T>(type);

  if (cloudEnabled) {
    return {
      list: cloud.list,
      add: cloud.add,
      remove: cloud.remove,
      update: cloud.update,
      loading: cloud.loading,
      error: cloud.error,
    };
  }
  return { list: local.list, add: local.add, remove: local.remove, update: local.update, loading: false, error: null };
}
