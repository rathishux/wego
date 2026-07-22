import {
  BookOpenText,
  Camera,
  FileText,
  LayoutDashboard,
  ListPlus,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export type PageId =
  | "dashboard"
  | "log"
  | "progress"
  | "you"
  | "community"
  | "tips"
  | "settings"
  | "privacy"
  | "terms";

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

// The 5 primary destinations shown in the mobile bottom tab bar (iOS/Android
// convention caps out around 5 tabs). Tips moves into Settings on mobile.
export const MOBILE_TAB_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => item.id !== "tips");

// Reachable from the account menu / Settings, not shown in the main sidebar nav.
export const SECONDARY_ITEMS: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    description: "Account, appearance, and app info",
    icon: Settings,
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    description: "What data NivYou stores and how it's used",
    icon: ShieldCheck,
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    description: "Rules for using NivYou",
    icon: FileText,
  },
];
