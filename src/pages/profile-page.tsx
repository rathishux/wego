import { ArrowLeft } from "lucide-react";

import { PhotoCaptureButton } from "@/components/app/photo-capture-button";
import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";

interface ProfilePageProps {
  onNavigate: (page: PageId) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { profile, update } = useProfile();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("settings")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display picture</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {profile.photo ? (
            <img src={profile.photo} alt="" className="size-32 rounded-full border object-cover" />
          ) : (
            <div className="bg-muted text-muted-foreground flex size-32 items-center justify-center rounded-full text-sm">
              No photo
            </div>
          )}

          <div className="flex items-center gap-2">
            <PhotoCaptureButton onCapture={(photo) => update("photo", photo)} facingMode="user" />
            {profile.photo && (
              <Button type="button" variant="outline" size="sm" onClick={() => update("photo", "")}>
                Remove
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
