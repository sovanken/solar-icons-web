"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { STYLES, PREFIX } from "@/lib/libraries";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SAMPLE_ICON = "home-2";

/**
 * Mobile-only drawer for switching icon style. Renders a leading pill-icon
 * button in the header that opens a sheet from the left. On md+ screens the
 * header carries the inline style chips instead, so this is hidden.
 */
export function StyleDrawer() {
  const { viewStyle, setViewStyle } = useStore();
  const [open, setOpen] = useState(false);

  const pick = (id: string) => {
    setViewStyle(id);
    setOpen(false);
  };

  const active = STYLES.find((s) => s.id === viewStyle);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Change style"
        title="Style"
        className={cn(
          "md:hidden inline-flex h-9 items-center gap-2 rounded-md px-2.5",
          "border border-border bg-background text-foreground",
          "hover:bg-muted transition-colors shrink-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        )}
      >
        <Icon icon="solar:palette-bold-duotone" className="h-4 w-4" />
        <span className="text-[12px] font-medium max-w-[64px] truncate">
          {active?.label ?? "Style"}
        </span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="border-b border-border/60 p-4">
          <SheetTitle className="text-sm font-semibold flex items-center gap-2">
            <Icon icon="solar:palette-bold-duotone" width={18} height={18} />
            Style
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {STYLES.map((s) => {
            const isActive = s.id === viewStyle;
            return (
              <button
                key={s.id}
                onClick={() => pick(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                    isActive
                      ? "bg-background/20"
                      : "bg-muted border border-border/60",
                  )}
                >
                  <Icon
                    icon={`${PREFIX}:${SAMPLE_ICON}${s.suffix}`}
                    width={20}
                    height={20}
                    style={{ color: "currentColor" }}
                  />
                </div>
                <span className="flex-1 text-left">{s.label}</span>
                {isActive && (
                  <Icon
                    icon="solar:check-read-bold-duotone"
                    width={18}
                    height={18}
                  />
                )}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
