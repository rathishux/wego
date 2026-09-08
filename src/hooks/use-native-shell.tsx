import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Style, StatusBar } from "@capacitor/status-bar";
import * as React from "react";

import type { PageId } from "@/components/app/nav-items";
import { useTheme } from "@/hooks/use-theme";

/**
 * Wires up native app-shell behavior on Capacitor builds only (no-op on web):
 * the Android hardware back button navigates within the app instead of
 * immediately closing it, and the status bar style follows the app's theme.
 */
export function useNativeShell(active: PageId, onNavigate: (page: PageId) => void) {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const isDark =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});
    // Keep the status bar out of the WebView so it doesn't sit on top of the
    // sticky header — safe-area padding then handles the remaining inset.
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
  }, [theme]);

  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const listener = CapacitorApp.addListener("backButton", () => {
      if (active === "dashboard") {
        CapacitorApp.exitApp();
      } else {
        onNavigate("dashboard");
      }
    });
    return () => {
      listener.then((l) => l.remove());
    };
  }, [active, onNavigate]);
}
