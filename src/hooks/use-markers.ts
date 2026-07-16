import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { useCloudMarkers } from "@/hooks/use-cloud-markers";
import { KEYS, loadValue, saveValue } from "@/lib/storage";
import type { Markers } from "@/lib/types";

const EMPTY_MARKERS: Markers = { waist: "", sleep: "", mood: "" };

export function useMarkers() {
  const { cloudEnabled } = useAuth();
  const cloud = useCloudMarkers();
  const [localMarkers, setLocalMarkers] = React.useState<Markers>(() => loadValue(KEYS.markers, EMPTY_MARKERS));

  const updateLocal = React.useCallback((key: keyof Markers, value: string) => {
    setLocalMarkers((prev) => {
      const next = { ...prev, [key]: value };
      saveValue(KEYS.markers, next);
      return next;
    });
  }, []);

  if (cloudEnabled) {
    return { markers: cloud.markers, update: cloud.update, loading: cloud.loading };
  }
  return { markers: localMarkers, update: updateLocal, loading: false };
}
