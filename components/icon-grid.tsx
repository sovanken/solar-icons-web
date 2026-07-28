"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { type CollectionData } from "@/lib/iconify";
import { STYLE_MAP } from "@/lib/libraries";
import { IconCard } from "./icon-card";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";

interface Props {
  collection: CollectionData;
}

interface VisibleItem {
  base: string;
  category: string;
}

export function IconGrid({ collection }: Props) {
  const { viewStyle, activeCategory, filter, setSelected } = useStore();

  const activeStyle = STYLE_MAP[viewStyle];
  const suffix = activeStyle?.suffix ?? "";
  const styleLabel = activeStyle?.label ?? "—";

  const visible = useMemo<VisibleItem[]>(() => {
    const { categories, order } = collection;
    const all: VisibleItem[] =
      activeCategory === "__all__"
        ? order.flatMap((c) => categories[c].map((b) => ({ base: b, category: c })))
        : (categories[activeCategory] ?? []).map((b) => ({ base: b, category: activeCategory }));
    if (!filter) return all;
    const q = filter.trim().toLowerCase();
    return all.filter(({ base }) => base.toLowerCase().includes(q));
  }, [collection, activeCategory, filter]);

  const title = activeCategory === "__all__" ? "All Icons" : activeCategory;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {title}
            </h1>
            <Badge variant="outline" className="rounded-full font-medium text-[10px] sm:text-xs">
              Solar · {styleLabel}
            </Badge>
            <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">
              {visible.length.toLocaleString()} icons
            </Badge>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            {visible.length.toLocaleString()} icons in {styleLabel} · tap any icon to preview and export
          </p>
        </header>

        {visible.length === 0 ? (
          <div className="grid place-items-center py-24 text-center">
            <Icon icon="solar:magnifer-bug-linear" className="mb-3 h-10 w-10 text-muted-foreground/70" />
            <p className="text-sm text-muted-foreground">No icons match your search.</p>
          </div>
        ) : (
          <div
            className="grid-fade grid gap-2 sm:gap-2.5 grid-cols-[repeat(auto-fill,minmax(84px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))]"
          >
            {visible.map((item) => (
              <IconCard
                key={`${item.base}-${item.category}`}
                base={item.base}
                category={item.category}
                suffix={suffix}
                onClick={(base, category) => setSelected({ base, category })}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
