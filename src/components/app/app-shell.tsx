import { Menu } from "lucide-react";
import * as React from "react";

import { AppSidebar } from "@/components/app/app-sidebar";
import { NAV_ITEMS, type PageId } from "@/components/app/nav-items";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface AppShellProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
  children: React.ReactNode;
}

export function AppShell({ active, onNavigate, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeItem = NAV_ITEMS.find((item) => item.id === active) ?? NAV_ITEMS[0];

  return (
    <div className="bg-background flex min-h-svh w-full">
      <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 border-r md:block">
        <div className="sticky top-0 h-svh">
          <AppSidebar active={active} onNavigate={onNavigate} />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="bg-sidebar text-sidebar-foreground w-72 p-0"
        >
          <VisuallyHidden>
            <SheetTitle>Navigation</SheetTitle>
          </VisuallyHidden>
          <AppSidebar
            active={active}
            onNavigate={(id) => {
              onNavigate(id);
              setMobileOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-svh flex-1 flex-col">
        <header className="bg-background/80 sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{activeItem.label}</h1>
            <p className="text-muted-foreground truncate text-sm">
              {activeItem.description}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
