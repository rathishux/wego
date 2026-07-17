import type { User } from "@supabase/supabase-js";
import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { seedToHue } from "@/lib/community";

interface AccountMenuProps {
  user: User;
  onSignOut: () => void;
}

export function AccountMenu({ user, onSignOut }: AccountMenuProps) {
  const email = user.email ?? "Signed in";
  const hue = seedToHue(user.id);
  const initial = email.trim()[0]?.toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hover:bg-sidebar-accent/60 flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors"
        >
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 70% 50%), hsl(${(hue + 40) % 360} 70% 40%))`,
            }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{email}</span>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel className="text-muted-foreground truncate text-xs font-normal">
          Signed in as
          <br />
          <span className="text-foreground font-medium">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
