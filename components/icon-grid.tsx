"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { type CollectionData } from "@/lib/iconify";
import { STYLE_MAP } from "@/lib/libraries";
import { fuzzyFilter } from "@/lib/search";
import { useFavorites } from "@/lib/favorites";
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
  const { viewStyle, activeCategory, filter, setSelected, setCommandOpen } =
    useStore();
  const { favorites } = useFavorites();

  // Grid keyboard focus. Null means no icon is focused; user must ↓/→ into
  // the grid to activate. Reset whenever the visible list changes.
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeStyle = STYLE_MAP[viewStyle];
  const suffix = activeStyle?.suffix ?? "";
  const styleLabel = activeStyle?.label ?? "—";

  const visible = useMemo<VisibleItem[]>(() => {
    const { categories, order } = collection;
    let all: VisibleItem[];
    if (activeCategory === "__all__") {
      all = order.flatMap((c) =>
        categories[c].map((b) => ({ base: b, category: c })),
      );
    } else if (activeCategory === "__favorites__") {
      // Locate each favorite's original category so the dialog shows the
      // right context badge; fall back to "Starred" if a favorite's
      // category can't be found (icon was removed upstream, etc).
      const catByBase = new Map<string, string>();
      for (const cat of order) {
        for (const base of categories[cat]) catByBase.set(base, cat);
      }
      all = [...favorites].map((base) => ({
        base,
        category: catByBase.get(base) ?? "Starred",
      }));
    } else {
      all = (categories[activeCategory] ?? []).map((b) => ({
        base: b,
        category: activeCategory,
      }));
    }
    return fuzzyFilter(all, filter);
  }, [collection, activeCategory, filter, favorites]);

  const title =
    activeCategory === "__all__"
      ? "All Icons"
      : activeCategory === "__favorites__"
        ? "Starred"
        : activeCategory;

  // Reset focus when the visible list changes (filter/category/style).
  useEffect(() => {
    setFocusedIndex(null);
  }, [activeCategory, filter, viewStyle]);

  // Global keyboard handling: arrow keys navigate the grid, Enter opens
  // the focused icon, "/" or "s" focuses the search palette, Esc clears
  // focus / dismisses selection. We ignore keys while the user is typing
  // in an input to avoid stealing focus from search.
  useEffect(() => {
    const isTypingInField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("role") === "combobox"
      );
    };

    const measureColumns = (): number => {
      const grid = gridRef.current;
      if (!grid) return 1;
      // Count child elements in the first row by comparing offsetTop values.
      const cards = grid.querySelectorAll<HTMLElement>('[data-icon-card="1"]');
      if (cards.length === 0) return 1;
      const firstTop = cards[0].offsetTop;
      let cols = 0;
      for (const card of cards) {
        if (card.offsetTop !== firstTop) break;
        cols += 1;
      }
      return Math.max(1, cols);
    };

    const handler = (e: KeyboardEvent) => {
      // Ignore modifier combos apart from ⌘K (handled elsewhere).
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTypingInField(e.target)) return;
      if (visible.length === 0) return;

      const cols = measureColumns();
      const clamp = (n: number) => Math.max(0, Math.min(visible.length - 1, n));

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          setFocusedIndex((cur) => (cur === null ? 0 : clamp(cur + 1)));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setFocusedIndex((cur) => (cur === null ? 0 : clamp(cur - 1)));
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((cur) =>
            cur === null ? 0 : clamp(cur + cols),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((cur) =>
            cur === null ? 0 : clamp(cur - cols),
          );
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(visible.length - 1);
          break;
        case "Enter":
          if (focusedIndex !== null) {
            e.preventDefault();
            const item = visible[focusedIndex];
            setSelected({ base: item.base, category: item.category });
          }
          break;
        case "Escape":
          setFocusedIndex(null);
          break;
        case "/":
        case "s":
          e.preventDefault();
          setCommandOpen(true);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedIndex, visible, setSelected, setCommandOpen]);

  // Scroll the focused card into view whenever the index changes.
  useEffect(() => {
    if (focusedIndex === null) return;
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>('[data-icon-card="1"]');
    const target = cards[focusedIndex];
    target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    target?.focus?.();
  }, [focusedIndex]);

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
            {activeCategory === "__favorites__" && !filter ? (
              <>
                <Icon
                  icon="solar:star-bold-duotone"
                  className="mb-3 h-10 w-10 text-amber-500/70"
                />
                <p className="text-sm font-medium">No starred icons yet</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                  Open any icon and tap the star to keep it here for quick
                  access across sessions.
                </p>
              </>
            ) : (
              <>
                <Icon
                  icon="solar:magnifer-bug-linear"
                  className="mb-3 h-10 w-10 text-muted-foreground/70"
                />
                <p className="text-sm text-muted-foreground">
                  No icons match your search.
                </p>
              </>
            )}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid-fade grid gap-2 sm:gap-2.5 grid-cols-[repeat(auto-fill,minmax(84px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))]"
          >
            {visible.map((item, i) => (
              <IconCard
                key={`${item.base}-${item.category}`}
                base={item.base}
                category={item.category}
                suffix={suffix}
                onClick={(base, category) => setSelected({ base, category })}
                focused={i === focusedIndex}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
