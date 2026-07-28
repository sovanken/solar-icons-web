"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { STYLES, PREFIX } from "@/lib/libraries";
import { SIZE_PRESETS } from "@/lib/styles";
import { Icon } from "@iconify/react";

const SAMPLE_ICON = "home-2";

export function StyleBar() {
  const { viewStyle, setViewStyle, size, setSize } = useStore();

  return (
    <div className="shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl z-20">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 overflow-x-auto px-6 py-3.5">
        <ControlGroup label="Style" icon="solar:palette-bold-duotone">
          <SegmentedControl>
            {STYLES.map((style) => {
              const active = viewStyle === style.id;
              return (
                <SegmentButton
                  key={style.id}
                  active={active}
                  onClick={() => setViewStyle(style.id)}
                  className="min-w-[94px]"
                >
                  <Icon
                    icon={`${PREFIX}:${SAMPLE_ICON}${style.suffix}`}
                    className={cn(
                      "h-4 w-4 transition-all",
                      active ? "opacity-100 scale-105" : "opacity-60",
                    )}
                  />
                  <span>{style.label}</span>
                </SegmentButton>
              );
            })}
          </SegmentedControl>
        </ControlGroup>

        <ControlGroup label="Size" icon="solar:ruler-cross-pen-bold-duotone">
          <SegmentedControl>
            {SIZE_PRESETS.map((s) => {
              const active = size === s;
              const dotSize = 4 + ((s - SIZE_PRESETS[0]) / (SIZE_PRESETS[SIZE_PRESETS.length - 1] - SIZE_PRESETS[0])) * 10;
              return (
                <SegmentButton
                  key={s}
                  active={active}
                  onClick={() => setSize(s)}
                  className="min-w-[58px]"
                >
                  <div
                    className={cn(
                      "rounded-full transition-all",
                      active ? "bg-foreground opacity-100" : "bg-current opacity-45",
                    )}
                    style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
                  />
                  <span className="tabular-nums font-semibold">{s}</span>
                </SegmentButton>
              );
            })}
          </SegmentedControl>
        </ControlGroup>
      </div>
    </div>
  );
}

function ControlGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 shrink-0">
        {icon && (
          <Icon icon={icon} className="h-4 w-4 text-foreground/70" />
        )}
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function SegmentedControl({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner">
      {children}
    </div>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium",
        "transition-all duration-200 whitespace-nowrap min-h-[32px]",
        active
          ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-border/80"
          : "text-muted-foreground hover:text-foreground hover:bg-background/60",
        className,
      )}
    >
      {children}
    </button>
  );
}
