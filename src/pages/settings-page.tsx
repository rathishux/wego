import { ArrowLeft, FileText, LogOut, Monitor, Moon, ShieldCheck, Sun } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface SettingsPageProps {
  onNavigate: (page: PageId) => void;
}

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { cloudEnabled, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const signedIn = cloudEnabled && user;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("dashboard")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {signedIn ? (
            <>
              <p className="text-sm">
                Signed in as <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Your tracking data syncs to this account and follows you across devices.
              </p>
              <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => signOut()}>
                <LogOut className="size-4" /> Sign out
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              You're using Steady in local-only mode — everything stays on this device and there's no
              account. See the README for how to enable cloud sync.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  theme === opt.value
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                <opt.icon className="size-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <button
            type="button"
            className="hover:bg-accent -mx-2 flex items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm"
            onClick={() => onNavigate("privacy")}
          >
            <ShieldCheck className="text-muted-foreground size-4" /> Privacy Policy
          </button>
          <button
            type="button"
            className="hover:bg-accent -mx-2 flex items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm"
            onClick={() => onNavigate("terms")}
          >
            <FileText className="text-muted-foreground size-4" /> Terms & Conditions
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
