import { MOBILE_TAB_ITEMS, type PageId } from "@/components/app/nav-items";
import { cn } from "@/lib/utils";

interface BottomTabBarProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
}

export function BottomTabBar({ active, onNavigate }: BottomTabBarProps) {
  return (
    <nav
      className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {MOBILE_TAB_ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5.5" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
