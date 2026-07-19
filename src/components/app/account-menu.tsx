import type { User } from "@supabase/supabase-js";
import { ChevronsUpDown, FileText, LogOut, Settings, ShieldCheck } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { seedToHue } from "@/lib/community";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  user: User | null;
  onNavigate: (id: PageId) => void;
  onSignOut?: () => void;
  /** Avatar-only trigger for the mobile header, instead of the full sidebar row. */
  compact?: boolean;
  className?: string;
}

export function AccountMenu({ user, onNavigate, onSignOut, compact, className }: AccountMenuProps) {
  const email = user?.email;
  const hue = user ? seedToHue(user.id) : 210;
  const initial = email?.trim()[0]?.toUpperCase() ?? "S";

  const avatar = (
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button type="button" className={cn("shrink-0 rounded-full", className)} aria-label="Account menu">
            {avatar}
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              "hover:bg-sidebar-accent/60 flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors",
              className,
            )}
          >
            {avatar}
            <span className="min-w-0 flex-1 truncate text-sm font-medium">Account</span>
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={compact ? "bottom" : "top"}
        className={cn("w-64", compact && "mr-2")}
      >
        <DropdownMenuLabel className="text-muted-foreground truncate text-xs font-normal">
          {email ? (
            <>
              Signed in as
              <br />
              <span className="text-foreground font-medium">{email}</span>
            </>
          ) : (
            "Private · on this device only"
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onNavigate("settings")}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onNavigate("privacy")}>
          <ShieldCheck />
          Privacy Policy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onNavigate("terms")}>
          <FileText />
          Terms & Conditions
        </DropdownMenuItem>
        {onSignOut && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onSignOut}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
