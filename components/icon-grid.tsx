"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { type CollectionData } from "@/lib/iconify";
import { STYLE_MAP } from "@/lib/libraries";
import { IconCard } from "./icon-card";
import { IconDialog } from "./icon-dialog";
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
  const { viewStyle, activeCategory, filter } = useStore();
  const [selected, setSelected] = useState<{ base: string; category: string } | null>(null);

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
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <Badge variant="outline" className="rounded-full font-medium">
              Solar · {styleLabel}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {visible.length.toLocaleString()} icons
            </Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Explore {visible.length.toLocaleString()} icons in Solar {styleLabel} · click any icon to preview, copy, or download
          </p>
        </header>

        {visible.length === 0 ? (
          <div className="grid place-items-center py-24 text-center">
            <Icon icon="solar:magnifer-bug-linear" className="mb-3 h-10 w-10 text-muted-foreground/70" />
            <p className="text-sm text-muted-foreground">No icons match your search.</p>
          </div>
        ) : (
          <div
            className="grid-fade grid gap-2.5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
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

      <IconDialog selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
