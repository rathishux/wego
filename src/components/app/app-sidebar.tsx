import { Leaf } from "lucide-react";

import { AccountMenu } from "@/components/app/account-menu";
import { NAV_ITEMS, type PageId } from "@/components/app/nav-items";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
}

export function AppSidebar({ active, onNavigate }: AppSidebarProps) {
  const { cloudEnabled, user, signOut } = useAuth();
  const signedIn = cloudEnabled && user;

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2 px-2 pt-2">
        <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Leaf className="size-4.5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">NivYou</p>
          <p className="text-muted-foreground text-xs">Wegovy & prediabetes</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-1">
        <AccountMenu
          user={signedIn ? user : null}
          onNavigate={onNavigate}
          onSignOut={signedIn ? () => signOut() : undefined}
        />
      </div>
    </div>
  );
}
