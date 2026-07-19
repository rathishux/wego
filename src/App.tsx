import * as React from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import type { PageId } from "@/components/app/nav-items";
import { useAuth } from "@/hooks/use-auth";
import { useNativeShell } from "@/hooks/use-native-shell";
import { migrateLocalDataToCloud } from "@/lib/migrate-local-data";
import type { LogType } from "@/lib/types";
import { DashboardPage } from "@/pages/dashboard-page";
import { LogEntryPage } from "@/pages/log-entry-page";
import { LoginPage } from "@/pages/login-page";
import { TipsPage } from "@/pages/tips-page";

const ProgressPage = React.lazy(() =>
  import("@/pages/progress-page").then((m) => ({ default: m.ProgressPage })),
);
const CommunityPage = React.lazy(() =>
  import("@/pages/community-page").then((m) => ({ default: m.CommunityPage })),
);
const YouPage = React.lazy(() => import("@/pages/you-page").then((m) => ({ default: m.YouPage })));
const SettingsPage = React.lazy(() =>
  import("@/pages/settings-page").then((m) => ({ default: m.SettingsPage })),
);
const PrivacyPolicyPage = React.lazy(() =>
  import("@/pages/privacy-policy-page").then((m) => ({ default: m.PrivacyPolicyPage })),
);
const TermsPage = React.lazy(() => import("@/pages/terms-page").then((m) => ({ default: m.TermsPage })));

export default function App() {
  const { cloudEnabled, user, loading } = useAuth();

  if (cloudEnabled && loading) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (cloudEnabled && !user) {
    return <LoginPage />;
  }

  return <MainApp />;
}

function MainApp() {
  const { cloudEnabled, user } = useAuth();
  const [page, setPage] = React.useState<PageId>("dashboard");
  const [logTab, setLogTab] = React.useState<LogType>("dose");

  React.useEffect(() => {
    if (!cloudEnabled || !user) return;
    migrateLocalDataToCloud(user.id)
      .then((count) => {
        if (count) {
          toast.success(`Imported ${count} existing local ${count === 1 ? "entry" : "entries"} into your account.`);
        }
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Couldn't import your existing local data.");
      });
  }, [cloudEnabled, user]);

  function navigate(next: PageId, tab?: LogType) {
    setPage(next);
    if (tab) setLogTab(tab);
  }

  useNativeShell(page, navigate);

  return (
    <AppShell active={page} onNavigate={navigate}>
      {page === "dashboard" && <DashboardPage onNavigate={navigate} />}
      {page === "log" && <LogEntryPage initialTab={logTab} onNavigate={navigate} />}
      {page === "progress" && (
        <React.Suspense fallback={null}>
          <ProgressPage />
        </React.Suspense>
      )}
      {page === "you" && (
        <React.Suspense fallback={null}>
          <YouPage />
        </React.Suspense>
      )}
      {page === "community" && (
        <React.Suspense fallback={null}>
          <CommunityPage />
        </React.Suspense>
      )}
      {page === "tips" && <TipsPage />}
      {page === "settings" && (
        <React.Suspense fallback={null}>
          <SettingsPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "privacy" && (
        <React.Suspense fallback={null}>
          <PrivacyPolicyPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "terms" && (
        <React.Suspense fallback={null}>
          <TermsPage onNavigate={navigate} />
        </React.Suspense>
      )}
    </AppShell>
  );
}
