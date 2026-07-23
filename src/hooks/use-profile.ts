import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { useCloudProfile } from "@/hooks/use-cloud-profile";
import { KEYS, loadValue, saveValue } from "@/lib/storage";
import type { Profile } from "@/lib/types";

const EMPTY_PROFILE: Profile = { name: "", photo: "", sex: "", birthday: "", height: "", weight: "" };

export function useProfile() {
  const { cloudEnabled } = useAuth();
  const cloud = useCloudProfile();
  const [localProfile, setLocalProfile] = React.useState<Profile>(() => ({
    ...EMPTY_PROFILE,
    ...loadValue(KEYS.profile, EMPTY_PROFILE),
  }));

  const updateLocal = React.useCallback((key: keyof Profile, value: string) => {
    setLocalProfile((prev) => {
      const next = { ...prev, [key]: value };
      saveValue(KEYS.profile, next);
      return next;
    });
  }, []);

  if (cloudEnabled) {
    return { profile: cloud.profile, update: cloud.update, loading: cloud.loading };
  }
  return { profile: localProfile, update: updateLocal, loading: false };
}
