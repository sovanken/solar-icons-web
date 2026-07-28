"use client";

import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function SiteHeader({ total }: { total: number }) {
  const { filter, setFilter, setCommandOpen } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  return (
    <header className="shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl z-30">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-3.5">
        <div className="hidden md:block leading-tight shrink-0">
          <div className="text-sm font-semibold">Solar Iconkit</div>
          <div className="text-[11px] text-muted-foreground">
            {total.toLocaleString()} icons · 6 styles
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search icons..."
            className="h-10 pl-10 pr-16 rounded-full bg-muted/40 border-border focus-visible:bg-background"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex select-none items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCommandOpen(true)}
            aria-label="Command menu"
          >
            <Icon icon="solar:command-linear" className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
