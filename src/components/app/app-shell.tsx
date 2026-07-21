import * as React from "react";

import { AccountMenu } from "@/components/app/account-menu";
import { AppSidebar } from "@/components/app/app-sidebar";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { NAV_ITEMS, SECONDARY_ITEMS, type PageId } from "@/components/app/nav-items";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

interface AppShellProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
  children: React.ReactNode;
}

export function AppShell({ active, onNavigate, children }: AppShellProps) {
  const { cloudEnabled, user } = useAuth();
  const activeItem =
    [...NAV_ITEMS, ...SECONDARY_ITEMS].find((item) => item.id === active) ?? NAV_ITEMS[0];

  return (
    <div className="bg-background flex min-h-svh w-full">
      <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 border-r md:block">
        <div className="sticky top-0 h-svh">
          <AppSidebar active={active} onNavigate={onNavigate} />
        </div>
      </aside>

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <header
          className="bg-background/80 sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur md:px-8"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{activeItem.label}</h1>
            <p className="text-muted-foreground truncate text-sm">{activeItem.description}</p>
          </div>
          <ThemeToggle />
          <AccountMenu user={cloudEnabled ? user : null} onNavigate={onNavigate} compact className="md:hidden" />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          {children}
        </main>
      </div>

      <BottomTabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}
