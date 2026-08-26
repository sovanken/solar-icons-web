"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { NEW_ICON_NAMES } from "@/lib/whats-new";
import { useFavorites } from "@/lib/favorites";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

const CATEGORY_ICON: Record<string, string> = {
  Arrows: "solar:arrow-right-bold-duotone",
  "Arrows Action": "solar:refresh-bold-duotone",
  Astronomy: "solar:planet-bold-duotone",
  "Building, Infrastructure": "solar:buildings-2-bold-duotone",
  "Business, Statistic": "solar:chart-bold-duotone",
  Call: "solar:phone-bold-duotone",
  "Design, Tools": "solar:palette-bold-duotone",
  "Electronic, Devices": "solar:cpu-bold-duotone",
  "Essentional, UI": "solar:home-2-bold-duotone",
  "Faces, Emotions, Stickers": "solar:emoji-funny-square-bold-duotone",
  Files: "solar:file-bold-duotone",
  Folders: "solar:folder-bold-duotone",
  "Food, Kitchen": "solar:cup-hot-bold-duotone",
  Hands: "solar:hand-shake-bold-duotone",
  "Home, Furniture": "solar:sofa-2-bold-duotone",
  Like: "solar:heart-bold-duotone",
  List: "solar:list-bold-duotone",
  "Map & Location": "solar:map-point-bold-duotone",
  Medicine: "solar:pill-bold-duotone",
  "Messages, Conversation": "solar:chat-round-bold-duotone",
  Money: "solar:wallet-money-bold-duotone",
  "Nature, Travel": "solar:leaf-bold-duotone",
  "Network, IT, Programming": "solar:code-bold-duotone",
  Notes: "solar:notebook-bold-duotone",
  Notifications: "solar:bell-bold-duotone",
  School: "solar:square-academic-cap-bold-duotone",
  Search: "solar:magnifier-bold-duotone",
  Security: "solar:shield-check-bold-duotone",
  "Settings, Fine Tuning": "solar:settings-bold-duotone",
  "Shopping, Ecommerce": "solar:cart-3-bold-duotone",
  Sports: "solar:basketball-bold-duotone",
  "Text Formatting": "solar:text-square-2-bold-duotone",
  Time: "solar:clock-circle-bold-duotone",
  "Transport, Parts, Service": "solar:bus-bold-duotone",
  Users: "solar:users-group-two-rounded-bold-duotone",
  "Video, Audio, Sound": "solar:play-circle-bold-duotone",
  Weather: "solar:sun-2-bold-duotone",
};

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
            label="New"
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
              icon={CATEGORY_ICON[cat] ?? "solar:folder-bold-duotone"}
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
