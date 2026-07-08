import * as React from "react";

import { AppShell } from "@/components/app/app-shell";
import type { PageId } from "@/components/app/nav-items";
import { DashboardPage } from "@/pages/dashboard-page";
import { LogEntryPage } from "@/pages/log-entry-page";
import { TipsPage } from "@/pages/tips-page";
import type { LogType } from "@/lib/types";

const ProgressPage = React.lazy(() =>
  import("@/pages/progress-page").then((m) => ({ default: m.ProgressPage })),
);

export default function App() {
  const [page, setPage] = React.useState<PageId>("dashboard");
  const [logTab, setLogTab] = React.useState<LogType>("dose");

  function navigate(next: PageId, tab?: LogType) {
    setPage(next);
    if (tab) setLogTab(tab);
  }

  return (
    <AppShell active={page} onNavigate={navigate}>
      {page === "dashboard" && <DashboardPage onNavigate={navigate} />}
      {page === "log" && <LogEntryPage initialTab={logTab} onNavigate={navigate} />}
      {page === "progress" && (
        <React.Suspense fallback={null}>
          <ProgressPage />
        </React.Suspense>
      )}
      {page === "tips" && <TipsPage />}
    </AppShell>
  );
}
