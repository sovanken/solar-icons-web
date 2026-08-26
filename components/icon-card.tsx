"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { PREFIX } from "@/lib/libraries";

interface Props {
  base: string;
  category: string;
  suffix: string;
  onClick: (base: string, category: string) => void;
  focused?: boolean;
}

export function IconCard({ base, category, suffix, onClick, focused }: Props) {
  const iconName = `${PREFIX}:${base}${suffix}`;

  return (
    <button
      onClick={() => onClick(base, category)}
      data-icon-card="1"
      tabIndex={focused ? 0 : -1}
      className={cn(
        "icon-card-anim group relative flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-3.5",
        "transition-all duration-150 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md",
        "cursor-pointer overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        focused
          ? "border-foreground/60 ring-2 ring-foreground/30 shadow-md"
          : "border-border/60",
      )}
      style={{
        minHeight: "calc(var(--icon-size, 48px) + 72px)",
        contentVisibility: "auto",
        containIntrinsicSize: "auto calc(var(--icon-size, 48px) + 72px)",
      }}
      title={base}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-foreground/[0.04] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div
        className="relative z-10 grid place-items-center transition-transform group-hover:scale-110"
        style={{ height: "var(--icon-size, 48px)", width: "var(--icon-size, 48px)" }}
      >
        <Icon
          icon={iconName}
          className="text-foreground"
          style={{ fontSize: "var(--icon-size, 48px)", width: "1em", height: "1em" }}
        />
      </div>
      {/* Two lines, wrapping anywhere: Solar names share long prefixes, so a
          single truncated line renders four different icons identically
          (e.g. "double-alt-ar…"). */}
      <span className="relative z-10 line-clamp-2 w-full text-center font-mono text-[10px] leading-tight text-muted-foreground [overflow-wrap:anywhere]">
        {base}
      </span>
    </button>
  );
}
