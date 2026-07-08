import { seedToHue } from "@/lib/community";
import { cn } from "@/lib/utils";

interface CommunityAvatarProps {
  seed: string;
  className?: string;
}

export function CommunityAvatar({ seed, className }: CommunityAvatarProps) {
  const hue = seedToHue(seed);
  return (
    <div
      className={cn("size-8 shrink-0 rounded-full", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 45%))`,
      }}
      aria-hidden="true"
    />
  );
}
