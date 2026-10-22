import * as React from "react";

import { KEYS, loadValue, saveValue } from "@/lib/storage";
import type { NotificationPrefs } from "@/lib/types";

const DEFAULT_PREFS: NotificationPrefs = { alerts: true, doseReminders: true };

// Notification preferences are per-device by nature (unlike tracking data or
// profile info), so this intentionally never syncs to the cloud.
export function useNotificationPrefs() {
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(() => ({
    ...DEFAULT_PREFS,
    ...loadValue(KEYS.notificationPrefs, DEFAULT_PREFS),
  }));

  const update = React.useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      saveValue(KEYS.notificationPrefs, next);
      return next;
    });
  }, []);

  return { prefs, update };
}
