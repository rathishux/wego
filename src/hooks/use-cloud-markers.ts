import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { getSupabase } from "@/lib/supabase";
import type { Markers } from "@/lib/types";

const EMPTY_MARKERS: Markers = { waist: "", sleep: "", mood: "" };

export function useCloudMarkers() {
  const { user } = useAuth();
  const [markers, setMarkers] = React.useState<Markers>(EMPTY_MARKERS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const supabase = getSupabase();
    supabase
      .from("user_markers")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setMarkers({ ...EMPTY_MARKERS, ...(data.data as Markers) });
        setLoading(false);
      });
  }, [user]);

  const update = React.useCallback(
    (key: keyof Markers, value: string) => {
      if (!user) return;
      setMarkers((prev) => {
        const next = { ...prev, [key]: value };
        const supabase = getSupabase();
        supabase
          .from("user_markers")
          .upsert({ user_id: user.id, data: next, updated_at: new Date().toISOString() })
          .then();
        return next;
      });
    },
    [user],
  );

  return { markers, update, loading };
}
