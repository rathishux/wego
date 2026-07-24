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
const HealthDataPrivacyPage = React.lazy(() =>
  import("@/pages/health-data-privacy-page").then((m) => ({ default: m.HealthDataPrivacyPage })),
);
const ProfilePage = React.lazy(() =>
  import("@/pages/profile-page").then((m) => ({ default: m.ProfilePage })),
);
const AccountPage = React.lazy(() =>
  import("@/pages/account-page").then((m) => ({ default: m.AccountPage })),
);
const NotificationsPage = React.lazy(() =>
  import("@/pages/notifications-page").then((m) => ({ default: m.NotificationsPage })),
);

const PAGE_FALLBACK = <p className="text-muted-foreground text-sm">Loading…</p>;

type StandaloneLegalRoute = "privacy" | "terms" | "health-privacy";

function getStandaloneLegalRoute(): StandaloneLegalRoute | null {
  const base = import.meta.env.BASE_URL;
  const path = window.location.pathname;
  if (!path.startsWith(base)) return null;
  const rest = path.slice(base.length).replace(/\/$/, "");
  if (rest === "privacy" || rest === "terms" || rest === "health-privacy") return rest;
  return null;
}

// Lets App Store/Play Store reviewers (and anyone else) open the privacy
// policy, terms, or health data notice straight from a bare URL, without
// signing in or loading the rest of the app.
function StandaloneLegalPage({ route }: { route: StandaloneLegalRoute }) {
  const goHome = () => {
    window.location.href = import.meta.env.BASE_URL;
  };
  return (
    <div className="bg-background flex min-h-svh justify-center px-4 py-8">
      <React.Suspense fallback={PAGE_FALLBACK}>
        {route === "privacy" && <PrivacyPolicyPage onNavigate={goHome} />}
        {route === "terms" && <TermsPage onNavigate={goHome} />}
        {route === "health-privacy" && <HealthDataPrivacyPage onNavigate={goHome} />}
      </React.Suspense>
    </div>
  );
}

export default function App() {
  const legalRoute = getStandaloneLegalRoute();
  if (legalRoute) {
    return <StandaloneLegalPage route={legalRoute} />;
  }

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
        <React.Suspense fallback={PAGE_FALLBACK}>
          <ProgressPage />
        </React.Suspense>
      )}
      {page === "you" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <YouPage />
        </React.Suspense>
      )}
      {page === "community" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <CommunityPage />
        </React.Suspense>
      )}
      {page === "tips" && <TipsPage onNavigate={navigate} />}
      {page === "settings" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <SettingsPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "privacy" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <PrivacyPolicyPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "terms" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <TermsPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "healthPrivacy" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <HealthDataPrivacyPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "profile" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <ProfilePage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "account" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <AccountPage onNavigate={navigate} />
        </React.Suspense>
      )}
      {page === "notifications" && (
        <React.Suspense fallback={PAGE_FALLBACK}>
          <NotificationsPage onNavigate={navigate} />
        </React.Suspense>
      )}
    </AppShell>
  );
}
