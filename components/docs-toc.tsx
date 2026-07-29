"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  parent?: string;
}

// Highlight the section currently in view as the user scrolls the docs.
//
// Approach: on every scroll event, find the LAST section whose top has crossed
// a fixed offset from the top of the scroll container. This is more robust than
// IntersectionObserver for two reasons:
//   1. Short sections at the bottom always get highlighted when scrolled to
//      (they'd otherwise never enter an IO trigger band).
//   2. Explicit anchor clicks always match — the scroll settles with the
//      target section's top at the threshold line, and this is exactly what
//      the algorithm picks.
export function DocsToc({
  items,
  scrollRootId,
}: {
  items: TocItem[];
  scrollRootId: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const root = document.getElementById(scrollRootId);
    if (!root) return;

    const targets = items
      .map((i) => {
        const el = document.getElementById(i.id);
        return el ? ({ id: i.id, el } as const) : null;
      })
      .filter((t): t is { id: string; el: HTMLElement } => t !== null);
    if (targets.length === 0) return;

    // Offset in px from the top of the scroll container. A section becomes
    // active as soon as its top scrolls above this line.
    const OFFSET = 120;

    let rafId = 0;

    const update = () => {
      rafId = 0;

      const rootTop = root.getBoundingClientRect().top;
      let current = targets[0].id;

      for (const t of targets) {
        const relTop = t.el.getBoundingClientRect().top - rootTop;
        if (relTop - OFFSET <= 0) {
          current = t.id;
        } else {
          break;
        }
      }

      // If we're at (or effectively at) the bottom of the scroll container,
      // force the last item — otherwise short trailing sections like Credits
      // never light up.
      const atBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 4;
      if (atBottom) current = targets[targets.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(update);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) cancelAnimationFrame(rafId);
    };
  }, [items, scrollRootId]);

  return (
    <nav className="p-4 space-y-0.5 sticky top-0">
      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Contents
      </div>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block rounded-md px-2 py-1.5 text-[13px] transition-colors whitespace-pre",
              item.parent && "pl-6 text-[12px]",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
