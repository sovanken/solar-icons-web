"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Icon } from "@iconify/react";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

const CATEGORY_ICON: Record<string, string> = {
  "Arrows": "solar:arrow-right-bold-duotone",
  "Arrows Action": "solar:refresh-bold-duotone",
  "Astronomy": "solar:planet-bold-duotone",
  "Building, Infrastructure": "solar:buildings-2-bold-duotone",
  "Business, Statistic": "solar:chart-bold-duotone",
  "Call": "solar:phone-bold-duotone",
  "Design, Tools": "solar:palette-bold-duotone",
  "Electronic, Devices": "solar:cpu-bold-duotone",
  "Essentional, UI": "solar:home-2-bold-duotone",
  "Faces, Emotions, Stickers": "solar:emoji-funny-square-bold-duotone",
  "Files": "solar:file-bold-duotone",
  "Folders": "solar:folder-bold-duotone",
  "Food, Kitchen": "solar:cup-hot-bold-duotone",
  "Hands": "solar:hand-shake-bold-duotone",
  "Home, Furniture": "solar:sofa-2-bold-duotone",
  "Like": "solar:heart-bold-duotone",
  "List": "solar:list-bold-duotone",
  "Map & Location": "solar:map-point-bold-duotone",
  "Medicine": "solar:pill-bold-duotone",
  "Messages, Conversation": "solar:chat-round-bold-duotone",
  "Money": "solar:wallet-money-bold-duotone",
  "Nature, Travel": "solar:leaf-bold-duotone",
  "Network, IT, Programming": "solar:code-bold-duotone",
  "Notes": "solar:notebook-bold-duotone",
  "Notifications": "solar:bell-bold-duotone",
  "School": "solar:square-academic-cap-bold-duotone",
  "Search": "solar:magnifer-bold-duotone",
  "Security": "solar:shield-check-bold-duotone",
  "Settings, Fine Tuning": "solar:settings-bold-duotone",
  "Shopping, Ecommerce": "solar:cart-3-bold-duotone",
  "Sports": "solar:basketball-bold-duotone",
  "Text Formatting": "solar:text-square-2-bold-duotone",
  "Time": "solar:clock-circle-bold-duotone",
  "Transport, Parts, Service": "solar:bus-bold-duotone",
  "Users": "solar:users-group-two-rounded-bold-duotone",
  "Video, Audio, Sound": "solar:play-circle-bold-duotone",
  "Weather": "solar:sun-2-bold-duotone",
};

export function Sidebar({ categories, order, total }: Props) {
  const { activeCategory, setActiveCategory } = useStore();
  const hasCategories = order.length > 0;

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 overflow-y-auto overflow-x-hidden">
      <div className="p-3 space-y-0.5">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Categories
        </div>

        <CatButton
          active={activeCategory === "__all__"}
          onClick={() => setActiveCategory("__all__")}
          icon="solar:widget-5-bold-duotone"
          label="All Icons"
          count={total}
        />

        {order.map((cat) => (
          <CatButton
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            icon={CATEGORY_ICON[cat] ?? "solar:folder-bold-duotone"}
            label={cat}
            count={categories[cat].length}
          />
        ))}

        {!hasCategories && (
          <div className="px-3 py-4 text-xs text-muted-foreground">
            This library has no categories.
          </div>
        )}
      </div>
    </aside>
  );
}

function CatButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-foreground text-background font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon icon={icon} className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[24px] text-center",
          active ? "bg-background/20 text-background" : "bg-muted-foreground/10 text-muted-foreground",
        )}
      >
        {count.toLocaleString()}
      </span>
    </button>
  );
}
