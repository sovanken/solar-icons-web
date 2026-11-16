"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { LATEST_RELEASE, NEW_ICON_NAMES } from "@/lib/whats-new";
import { useFavorites } from "@/lib/favorites";
import { CATEGORY_ICONS, FALLBACK_CATEGORY_ICON } from "@/lib/categories";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

export function MobileNav({ categories, order, total }: Props) {
  const { activeCategory, setActiveCategory } = useStore();
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);

  const pick = (cat: string) => {
    setActiveCategory(cat);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Browse categories"
        title="Categories"
        className={cn(
          // Mobile only — the desktop sidebar covers this above md.
          "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md",
          "border border-border bg-background text-foreground",
          "hover:bg-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        )}
      >
        <Icon icon="solar:widget-5-bold-duotone" className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="border-b border-border/60 p-4">
          <SheetTitle className="text-sm font-semibold">Categories</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <MobileItem
            active={activeCategory === "__all__"}
            onClick={() => pick("__all__")}
            icon="solar:widget-5-bold-duotone"
            label="All Icons"
            count={total}
          />
          <MobileItem
            active={activeCategory === "__new__"}
            onClick={() => pick("__new__")}
            icon="solar:stars-bold-duotone"
            label={`New in ${LATEST_RELEASE.version}`}
            count={NEW_ICON_NAMES.length}
          />
          {/* Starred was reachable only from the desktop sidebar, so phone
              users could star icons and never get back to them. */}
          <MobileItem
            active={activeCategory === "__favorites__"}
            onClick={() => pick("__favorites__")}
            icon="solar:star-bold-duotone"
            label="Starred"
            count={favorites.size}
          />

          <div className="mx-1 my-2 h-px bg-border/60" role="presentation" />

          {order.map((cat) => (
            <MobileItem
              key={cat}
              active={activeCategory === cat}
              onClick={() => pick(cat)}
              icon={CATEGORY_ICONS[cat] ?? FALLBACK_CATEGORY_ICON}
              label={cat}
              count={categories[cat].length}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileItem({
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
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-foreground text-background font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon icon={icon} className="h-5 w-5 shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold min-w-[28px] text-center tabular-nums",
          active
            ? "bg-background/20 text-background"
            : "bg-muted-foreground/10 text-muted-foreground",
        )}
      >
        {count.toLocaleString()}
      </span>
    </button>
  );
}
