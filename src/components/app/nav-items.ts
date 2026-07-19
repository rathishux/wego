import { BookOpenText, Camera, LayoutDashboard, ListPlus, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type PageId = "dashboard" | "log" | "progress" | "you" | "community" | "tips";

export interface NavItem {
  id: PageId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Calm snapshot for daily tracking",
    icon: LayoutDashboard,
  },
  {
    id: "log",
    label: "Log entry",
    description: "Add a new entry in under 30 seconds",
    icon: ListPlus,
  },
  {
    id: "progress",
    label: "Progress",
    description: "Trends and full history across your logs",
    icon: TrendingUp,
  },
  {
    id: "you",
    label: "You",
    description: "Your private visual timeline — photos, weight, face and body changes",
    icon: Camera,
  },
  {
    id: "community",
    label: "Community",
    description: "Share your progress and support each other — anonymously",
    icon: Users,
  },
  {
    id: "tips",
    label: "Tips",
    description: "General guidance — not medical advice",
    icon: BookOpenText,
  },
];
