"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Icon } from "@iconify/react";
import { CATEGORY_ICONS, FALLBACK_CATEGORY_ICON } from "@/lib/categories";
import { useFavorites } from "@/lib/favorites";
import { NEW_ICON_NAMES } from "@/lib/whats-new";
import { fuzzyFilter } from "@/lib/search";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

export function Sidebar({ categories, order, total }: Props) {
  const { activeCategory, setActiveCategory, filter } = useStore();
  const { favorites } = useFavorites();
  const hasCategories = order.length > 0;
  const searching = filter.trim().length > 0;

  const flat = useMemo(
    () =>
      order.flatMap((c) =>
        categories[c].map((base) => ({ base, category: c })),
      ),
    [categories, order],
  );

  /// Counts for the active search. Deliberately one `fuzzyFilter` pass over
  /// the whole catalog rather than one per category: the ranker drops query
  /// words that match nothing, and that decision must be made against the
  /// full set or the per-category tallies would not sum to what the grid
  /// actually shows.
  const matches = useMemo(() => {
    if (!searching) return null;
    const byCategory = new Map<string, number>();
    const matched = fuzzyFilter(flat, filter);
    let starred = 0;
    let fresh = 0;
    const newSet = new Set(NEW_ICON_NAMES);
    for (const item of matched) {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1);
      if (favorites.has(item.base)) starred++;
      if (newSet.has(item.base)) fresh++;
    }
    return { byCategory, total: matched.length, starred, fresh };
  }, [searching, flat, filter, favorites]);

  // While searching, a category with no match is hidden rather than shown as
  // a dead "0" row — the point is to answer "which category holds my icon".
  const visibleOrder = matches
    ? order.filter((c) => (matches.byCategory.get(c) ?? 0) > 0)
    : order;

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 overflow-y-auto overflow-x-hidden">
      <div className="p-3 space-y-0.5">
        <GroupLabel>Browse</GroupLabel>

        <CatButton
          active={activeCategory === "__all__"}
          onClick={() => setActiveCategory("__all__")}
          icon="solar:widget-5-bold-duotone"
          label="All Icons"
          count={matches ? matches.total : total}
        />

        <CatButton
          active={activeCategory === "__new__"}
          onClick={() => setActiveCategory("__new__")}
          icon="solar:stars-bold-duotone"
          label="New"
          count={matches ? matches.fresh : NEW_ICON_NAMES.length}
          accent="text-emerald-500"
        />

        <CatButton
          active={activeCategory === "__favorites__"}
          onClick={() => setActiveCategory("__favorites__")}
          icon="solar:star-bold-duotone"
          label="Starred"
          count={matches ? matches.starred : favorites.size}
          accent="text-amber-500"
        />

        {/* All Icons / New / Starred are views over the whole catalog, not
            Solar categories. They sat under a single "Categories" heading
            and read as the first three categories in the list; naming both
            groups is what separates them. */}
        {hasCategories && <GroupLabel className="mt-4">Categories</GroupLabel>}

        {visibleOrder.map((cat) => (
          <CatButton
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            icon={CATEGORY_ICONS[cat] ?? FALLBACK_CATEGORY_ICON}
            label={cat}
            count={matches ? (matches.byCategory.get(cat) ?? 0) : categories[cat].length}
          />
        ))}

        {matches && visibleOrder.length === 0 && (
          <div className="px-3 py-4 text-xs text-muted-foreground">
            No category matches “{filter.trim()}”.
          </div>
        )}

        {!hasCategories && (
          <div className="px-3 py-4 text-xs text-muted-foreground">
            This library has no categories.
          </div>
        )}
      </div>
    </aside>
  );
}

function GroupLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
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
