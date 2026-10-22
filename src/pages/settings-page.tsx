import {
  ArrowLeft,
  Bell,
  BookOpenText,
  ChevronRight,
  FileText,
  HeartPulse,
  LogOut,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  User,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

function SettingsRow({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="hover:bg-accent -mx-2 flex items-center gap-2.5 rounded-md px-2 py-2.5 text-left text-sm"
      onClick={onClick}
    >
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <span className="flex-1">{label}</span>
      <ChevronRight className="text-muted-foreground size-4 shrink-0" />
    </button>
  );
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { cloudEnabled, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const signedIn = cloudEnabled && user;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("dashboard")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <h1 className="text-lg font-semibold">NivYou</h1>

      <Card>
        <CardContent className="flex flex-col gap-1">
          <SettingsRow icon={User} label="Profile" onClick={() => onNavigate("profile")} />
          <SettingsRow icon={UserCog} label="Account" onClick={() => onNavigate("account")} />
          <SettingsRow icon={Bell} label="Notifications" onClick={() => onNavigate("notifications")} />
          <SettingsRow icon={BookOpenText} label="Tips" onClick={() => onNavigate("tips")} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-muted-foreground mb-2 text-xs">Appearance</p>
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
        <CardContent className="flex flex-col gap-1">
          <SettingsRow icon={ShieldCheck} label="Privacy Policy" onClick={() => onNavigate("privacy")} />
          <SettingsRow
            icon={HeartPulse}
            label="Health Data Privacy"
            onClick={() => onNavigate("healthPrivacy")}
          />
          <SettingsRow icon={FileText} label="Terms & Conditions" onClick={() => onNavigate("terms")} />
        </CardContent>
      </Card>

      {signedIn && (
        <Button
          variant="ghost"
          className="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive w-full gap-1.5"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      )}
    </div>
  );
}
