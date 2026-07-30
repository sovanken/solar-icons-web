"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Icon } from "@iconify/react";
import { CATEGORY_ICONS, FALLBACK_CATEGORY_ICON } from "@/lib/categories";
import { useFavorites } from "@/lib/favorites";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

export function Sidebar({ categories, order, total }: Props) {
  const { activeCategory, setActiveCategory } = useStore();
  const { favorites } = useFavorites();
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

        <CatButton
          active={activeCategory === "__favorites__"}
          onClick={() => setActiveCategory("__favorites__")}
          icon="solar:star-bold-duotone"
          label="Starred"
          count={favorites.size}
          accent="text-amber-500"
        />

        {order.map((cat) => (
          <CatButton
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            icon={CATEGORY_ICONS[cat] ?? FALLBACK_CATEGORY_ICON}
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
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
  accent?: string;
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
        <Icon
          icon={icon}
          className={cn(
            "h-4 w-4 shrink-0",
            accent && !active && accent,
          )}
        />
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
