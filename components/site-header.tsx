"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { ThemeToggle } from "./theme-toggle";
import { StyleDrawer } from "./style-drawer";
import { MobileNav } from "./mobile-nav";
import { useStore } from "@/lib/store";
import { STYLES, PREFIX } from "@/lib/libraries";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  total: number;
  categories: Record<string, string[]>;
  order: string[];
}

const SAMPLE_ICON = "home-2";

export function SiteHeader({ total, categories, order }: Props) {
  const { setCommandOpen, viewStyle, setViewStyle } = useStore();

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
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3">
        {/* Mobile: leading category + style drawers ---------------------- */}
        {/* MobileNav was written but never mounted, so below md there was no
            category control at all: a phone landing on ?category=Devices saw
            its 91 icons with no way back to All Icons. */}
        <MobileNav categories={categories} order={order} total={total} />
        <StyleDrawer />

        {/* Left spacer — pushes brand toward center on mobile ------------ */}
        <div className="flex-1 md:hidden" />

        {/* Brand ---------------------------------------------------------- */}
        <div className="leading-tight shrink-0 text-center md:text-left">
          <div className="text-sm font-semibold">Solar Iconkit</div>
          <div className="hidden sm:block text-[11px] text-muted-foreground">
            {total.toLocaleString()} icons · 6 styles
          </div>
        </div>

        {/* Style chips (center, icon + label) ---------------------------- */}
        <div className="hidden md:flex flex-1 justify-center min-w-0">
          <div
            className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner overflow-x-auto max-w-full"
            role="tablist"
            aria-label="Icon style"
          >
            {STYLES.map((style) => {
              const active = viewStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setViewStyle(style.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium",
                    "transition-all duration-200 whitespace-nowrap min-h-[32px]",
                    active
                      ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60",
                  )}
                >
                  <Icon
                    icon={`${PREFIX}:${SAMPLE_ICON}${style.suffix}`}
                    width={16}
                    height={16}
                    className={cn(
                      "transition-all",
                      active ? "opacity-100 scale-105" : "opacity-60",
                    )}
                    style={{ color: "currentColor" }}
                  />
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer for mobile so right buttons flush right ---------------- */}
        <div className="flex-1 md:hidden" />

        {/* Right action group: MCP · Docs · Search · Theme --------------------- */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Hidden on phones, where it pushed the theme toggle off-screen;
              the categories sheet links to /mcp instead. */}
          <Link
            href="/mcp"
            className={cn(
              "hidden sm:inline-flex h-9 items-center justify-center rounded-md px-3",
              "text-[13px] font-medium tracking-wide uppercase",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            MCP
          </Link>

          <Link
            href="/docs"
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md px-3",
              "text-[13px] font-medium tracking-wide uppercase",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            Docs
          </Link>

          <button
            onClick={() => setCommandOpen(true)}
            aria-label="Search icons (⌘K)"
            title="Search (⌘K)"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md",
              "border border-border bg-background text-foreground",
              "hover:bg-muted transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            <Icon icon="solar:magnifier-bold-duotone" className="h-4 w-4" />
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
