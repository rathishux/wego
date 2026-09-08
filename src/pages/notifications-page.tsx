import { ArrowLeft } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";

interface NotificationsPageProps {
  onNavigate: (page: PageId) => void;
}

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const { prefs, update } = useNotificationPrefs();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("settings")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <div className="bg-warning/10 border-warning/40 rounded-lg border p-3 text-sm">
        <strong>Not wired up yet.</strong> These preferences are saved, but NivYou doesn't actually send
        notifications yet — that needs to be built separately.
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="notif-alerts">Alerts</Label>
              <p className="text-muted-foreground text-sm">General app alerts and updates</p>
            </div>
            <Switch
              id="notif-alerts"
              checked={prefs.alerts}
              onCheckedChange={(checked) => update("alerts", checked)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="notif-dose">Upcoming dose reminders</Label>
              <p className="text-muted-foreground text-sm">A nudge when your next dose is due</p>
            </div>
            <Switch
              id="notif-dose"
              checked={prefs.doseReminders}
              onCheckedChange={(checked) => update("doseReminders", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
