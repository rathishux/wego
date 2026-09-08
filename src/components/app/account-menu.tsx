import type { User } from "@supabase/supabase-js";
import { ChevronRight } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { useProfile } from "@/hooks/use-profile";
import { seedToHue } from "@/lib/community";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  user: User | null;
  onNavigate: (id: PageId) => void;
  /** Avatar-only trigger for the mobile header, instead of the full sidebar row. */
  compact?: boolean;
  className?: string;
}

export function AccountMenu({ user, onNavigate, compact, className }: AccountMenuProps) {
  const { profile } = useProfile();
  const email = user?.email;
  const hue = user ? seedToHue(user.id) : 210;
  const initial = email?.trim()[0]?.toUpperCase() ?? "S";

  const avatar = profile.photo ? (
    <img src={profile.photo} alt="" className="size-8 shrink-0 rounded-full object-cover" />
  ) : (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 50%), hsl(${(hue + 40) % 360} 70% 40%))`,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );

  if (compact) {
    return (
      <button
        type="button"
        className={cn("shrink-0 rounded-full", className)}
        aria-label="Open Settings"
        onClick={() => onNavigate("settings")}
      >
        {avatar}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "hover:bg-sidebar-accent/60 flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors",
        className,
      )}
      onClick={() => onNavigate("settings")}
    >
      {avatar}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {profile.name || (email ?? "Account")}
      </span>
      <ChevronRight className="text-muted-foreground size-4 shrink-0" />
    </button>
  );
}
