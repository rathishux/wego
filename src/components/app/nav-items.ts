import { BookOpenText, LayoutDashboard, ListPlus, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type PageId = "dashboard" | "log" | "progress" | "community" | "tips";

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
    id: "community",
    label: "Face Progress Community",
    description: "Share and see how faces change during treatment — anonymously",
    icon: Users,
  },
  {
    id: "tips",
    label: "Tips",
    description: "General guidance — not medical advice",
    icon: BookOpenText,
  },
];
