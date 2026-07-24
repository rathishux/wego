import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { getSupabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

const EMPTY_PROFILE: Profile = { name: "", photo: "", sex: "", birthday: "", height: "", weight: "" };

export function useCloudProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<Profile>(EMPTY_PROFILE);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const supabase = getSupabase();
    supabase
      .from("user_profile")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ ...EMPTY_PROFILE, ...(data.data as Profile) });
        setLoading(false);
      });
  }, [user]);

  const update = React.useCallback(
    (key: keyof Profile, value: string) => {
      if (!user) return;
      setProfile((prev) => {
        const next = { ...prev, [key]: value };
        const supabase = getSupabase();
        supabase
          .from("user_profile")
          .upsert({ user_id: user.id, data: next, updated_at: new Date().toISOString() })
          .then();
        return next;
      });
    },
    [user],
  );

  return { profile, update, loading };
}
