import { Eye, MessageCircleWarning, ShieldCheck, UserRoundX } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommunityConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}

export function CommunityConsentDialog({ open, onOpenChange, onAgree }: CommunityConsentDialogProps) {
  const [checked, setChecked] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Before you post publicly</DialogTitle>
          <DialogDescription>
            This is different from the rest of Steady — everything else stays private on your device.
            Community posts are visible to other Steady users.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex gap-2.5">
            <UserRoundX className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p>Your posts show a random pseudonym and color, never your real name or account info.</p>
          </div>
          <div className="flex gap-2.5">
            <Eye className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p>
              <strong>Your face may still be recognizable in the photo itself</strong>, even though your
              account is anonymous. Only share a photo you're comfortable with others seeing.
            </p>
          </div>
          <div className="flex gap-2.5">
            <ShieldCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p>You can delete any post you've made at any time.</p>
          </div>
          <div className="flex gap-2.5">
            <MessageCircleWarning className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p>Posts that get reported for mocking or harassment are automatically hidden pending review.</p>
          </div>
        </div>

        <label className="bg-muted flex items-start gap-2.5 rounded-lg p-3 text-sm">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-0.5" />
          I understand my posts will be public and I won't include identifying details.
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!checked}
            onClick={() => {
              onAgree();
              setChecked(false);
            }}
          >
            Agree & continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
