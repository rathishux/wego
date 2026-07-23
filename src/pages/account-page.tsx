import { ArrowLeft } from "lucide-react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";

interface AccountPageProps {
  onNavigate: (page: PageId) => void;
}

const SEX_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { cloudEnabled, user } = useAuth();
  const { profile, update } = useProfile();
  const signedIn = cloudEnabled && user;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("settings")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Name & email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="account-name" className="text-muted-foreground text-xs">
              Name (optional)
            </Label>
            <Input
              id="account-name"
              value={profile.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="text-sm">
              {signedIn ? user.email : "Not signed in — you're using NivYou in local-only mode."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sex & birthday</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="account-sex" className="text-muted-foreground text-xs">
              Sex (optional)
            </Label>
            <Select value={profile.sex || undefined} onValueChange={(v) => update("sex", v)}>
              <SelectTrigger id="account-sex" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {SEX_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="account-birthday" className="text-muted-foreground text-xs">
              Birthday (optional)
            </Label>
            <Input
              id="account-birthday"
              type="date"
              value={profile.birthday}
              onChange={(e) => update("birthday", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Height & weight</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="account-height" className="text-muted-foreground text-xs">
              Height (optional)
            </Label>
            <Input
              id="account-height"
              value={profile.height}
              onChange={(e) => update("height", e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="account-weight" className="text-muted-foreground text-xs">
              Weight (optional)
            </Label>
            <Input
              id="account-weight"
              value={profile.weight}
              onChange={(e) => update("weight", e.target.value)}
              placeholder="—"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
