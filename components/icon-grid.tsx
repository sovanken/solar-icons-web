"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { type CollectionData } from "@/lib/iconify";
import { STYLE_MAP } from "@/lib/libraries";
import { SIZE_PRESETS } from "@/lib/styles";
import { LATEST_RELEASE, NEW_ICON_NAMES } from "@/lib/whats-new";
import { fuzzyFilter } from "@/lib/search";
import { useFavorites } from "@/lib/favorites";
import { IconCard } from "./icon-card";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  collection: CollectionData;
}

interface VisibleItem {
  base: string;
  category: string;
}

export function IconGrid({ collection }: Props) {
  const {
    viewStyle,
    activeCategory,
    setActiveCategory,
    filter,
    setFilter,
    size,
    setSize,
    setSelected,
  } = useStore();
  const { favorites } = useFavorites();
  const newSet = useMemo(() => new Set(NEW_ICON_NAMES), []);

  // Grid keyboard focus. Null means no icon is focused; user must ↓/→ into
  // the grid to activate. Reset whenever the visible list changes.
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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
    } else if (activeCategory === "__new__") {
      // Icons added in the current release. Names are filtered
      // against the live catalog so a stale entry drops out rather than
      // rendering a broken tile.
      const catByBase = new Map<string, string>();
      for (const cat of order) {
        for (const base of categories[cat]) catByBase.set(base, cat);
      }
      all = NEW_ICON_NAMES.filter((b) => catByBase.has(b)).map((base) => ({
        base,
        category: catByBase.get(base)!,
      }));
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

  // Fixed locale and UTC so server and client render the same string.
  const releaseDate = new Date(
    `${LATEST_RELEASE.date}T00:00:00Z`,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  const title =
    activeCategory === "__all__"
      ? "All Icons"
      : activeCategory === "__new__"
        ? `New in ${LATEST_RELEASE.version}`
        : activeCategory === "__favorites__"
          ? "Starred"
          : activeCategory;

  // Reset focus when the visible list changes (filter/category/style).
  // Adjusted during render rather than in an effect: an effect would paint
  // one frame with the stale index still highlighted.
  const listKey = `${activeCategory}|${filter}|${viewStyle}`;
  const [prevListKey, setPrevListKey] = useState(listKey);
  if (listKey !== prevListKey) {
    setPrevListKey(listKey);
    setFocusedIndex(null);
  }

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

      // Focus the inline search box rather than the palette — searching in
      // place keeps the grid visible, which is what these keys imply.
      // ⌘K still opens the palette.
      if (e.key === "/" || e.key === "s") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      // Everything below navigates the grid, so it needs something in it.
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
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedIndex, visible, setSelected]);

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
            {activeCategory === "__new__"
              ? `Added in solar_iconkit ${LATEST_RELEASE.version} (${releaseDate}) · tap any icon to preview and export`
              : `${visible.length.toLocaleString()} icons in ${styleLabel} · tap any icon to preview and export`}
          </p>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Inline search. Filters the grid in place — the store's `filter`
              is URL-synced as ?q=, so a search is shareable. */}
          <div className="relative min-w-[220px] flex-1 max-w-md">
            <Icon
              icon="solar:magnifier-linear"
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchRef}
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  if (filter) setFilter("");
                  else e.currentTarget.blur();
                }
              }}
              placeholder="Search icons — try “arrow right” or “delete”"
              aria-label="Search icons by name"
              className={cn(
                "h-10 w-full rounded-lg border border-border bg-background",
                "pl-9 pr-20 text-sm",
                "placeholder:text-muted-foreground/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                "[&::-webkit-search-cancel-button]:appearance-none",
              )}
            />
            {filter ? (
              <button
                type="button"
                onClick={() => {
                  setFilter("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Clear
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                /
              </kbd>
            )}
          </div>

          {/* Icon size. The store already persisted this and drove
              --icon-size; it just had no control until now. */}
          <div
            role="group"
            aria-label="Icon size"
            className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner"
          >
            {SIZE_PRESETS.map((preset) => {
              const active = size === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSize(preset)}
                  aria-pressed={active}
                  title={`${preset}px icons`}
                  className={cn(
                    "min-w-[34px] rounded-full px-2 py-1 text-[11px] font-medium tabular-nums",
                    "transition-all duration-200",
                    active
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/80"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                  )}
                >
                  {preset}
                </button>
              );
            })}
          </div>
          </div>
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
                  icon="solar:magnifier-bug-linear"
                  className="mb-3 h-10 w-10 text-muted-foreground/70"
                />
                <p className="text-sm font-medium">
                  No icons match “{filter}”.
                </p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  {activeCategory === "__all__"
                    ? "Try a shorter or more general word — search understands common synonyms, so “delete”, “save” and “wifi” all work."
                    : `Nothing in ${title} matches. It may exist in another category.`}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilter("");
                      searchRef.current?.focus();
                    }}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    Clear search
                  </button>
                  {activeCategory !== "__all__" && (
                    <button
                      type="button"
                      onClick={() => setActiveCategory("__all__")}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      Search all icons
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid-fade grid gap-2 sm:gap-2.5"
            // Track the icon size so cards stay proportionate: at 80px a
            // fixed 110px column clips the icon, and at 20px it leaves most
            // of the card empty. The +62px offset keeps the default 48px
            // size on exactly the 110px column it used before.
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(max(72px, calc(var(--icon-size, 48px) + 62px)), 1fr))",
            }}
          >
            {visible.map((item, i) => (
              <IconCard
                key={`${item.base}-${item.category}`}
                base={item.base}
                category={item.category}
                suffix={suffix}
                onClick={(base, category) => setSelected({ base, category })}
                focused={i === focusedIndex}
                // Redundant in the New view, where every tile qualifies.
                isNew={activeCategory !== "__new__" && newSet.has(item.base)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
