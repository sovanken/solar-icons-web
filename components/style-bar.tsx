"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { STYLES, PREFIX } from "@/lib/libraries";
import { Icon } from "@iconify/react";

const SAMPLE_ICON = "home-2";

export function StyleBar() {
  const { viewStyle, setViewStyle } = useStore();

  return (
    <div className="shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl z-20">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center overflow-x-auto px-3 sm:px-6 py-3">
        <div className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner">
          {STYLES.map((style) => {
            const active = viewStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setViewStyle(style.id)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium",
                  "transition-all duration-200 whitespace-nowrap min-h-[32px] min-w-[94px]",
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
    </div>
  );
}
