import { ArrowLeft, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import type { PageId } from "@/components/app/nav-items";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { deleteAccountData } from "@/lib/delete-account";

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
  const [deleting, setDeleting] = React.useState(false);
  const signedIn = cloudEnabled && user;

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteAccountData(user.id);
      toast.success("Your account and all its data have been deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete your account. Please try again.");
      setDeleting(false);
    }
  }

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

      {signedIn && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive text-base">Delete account</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-1.5">
                  <Trash2 className="size-4" /> Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently erases all your data — every dose, weight, glucose, and food log,
                    your entire You timeline, and anything you've posted or commented on in Community.
                    You'll be signed out immediately afterward. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? "Deleting…" : "Delete permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
