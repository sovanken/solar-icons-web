"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  parent?: string;
}

interface TocGroup {
  parent: TocItem;
  children: TocItem[];
}

/// Highlight the active section AND provide a collapsible tree.
///
/// Items with `parent` are grouped under their parent. Parents render with a
/// chevron and expand/collapse on click. Children render indented with a
/// vertical guide line on the left, similar to VSCode / Docusaurus sidebars.
///
/// Scroll-position detection is unchanged from the earlier version: find the
/// last section whose top has crossed a 120 px offset from the top of the
/// scroll container, with a bottom-of-scroll override for short trailing
/// sections.
export function DocsToc({
  items,
  scrollRootId,
}: {
  items: TocItem[];
  scrollRootId: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  // Build the parent → children groups. Flat items (no parent, no children)
  // pass through as parents with an empty children array.
  const groups = useMemo<TocGroup[]>(() => {
    const result: TocGroup[] = [];
    let current: TocGroup | null = null;
    for (const item of items) {
      if (item.parent) {
        // Attach to the most recent group with matching parent id.
        if (current && current.parent.id === item.parent) {
          current.children.push({ ...item, label: item.label.trim() });
        } else {
          // Orphan child — no matching parent above it. Treat as top-level.
          result.push({
            parent: { ...item, label: item.label.trim() },
            children: [],
          });
        }
      } else {
        current = { parent: item, children: [] };
        result.push(current);
      }
    }
    return result;
  }, [items]);

  // Expansion state per parent id. Default: everything expanded so nothing
  // hides unless the user chooses to collapse.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of groups) {
      if (g.children.length > 0) initial[g.parent.id] = true;
    }
    return initial;
  });

  // When the active section changes to a child, auto-expand its parent so
  // the highlight is visible. Never auto-collapse — user might want it open.
  // Adjusted during render so the parent is already open on the frame the
  // highlight moves.
  const [prevActiveId, setPrevActiveId] = useState(activeId);
  if (activeId !== prevActiveId) {
    setPrevActiveId(activeId);
    const parent = items.find((i) => i.id === activeId)?.parent;
    if (parent) {
      setExpanded((prev) => (prev[parent] ? prev : { ...prev, [parent]: true }));
    }
  }

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

    const OFFSET = 120;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rootTop = root.getBoundingClientRect().top;
      let current = targets[0].id;
      for (const t of targets) {
        const relTop = t.el.getBoundingClientRect().top - rootTop;
        if (relTop - OFFSET <= 0) current = t.id;
        else break;
      }
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

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav className="p-4 space-y-0.5 sticky top-0">
      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Contents
      </div>
      {groups.map(({ parent, children }) => {
        const hasChildren = children.length > 0;
        const isOpen = expanded[parent.id] ?? true;
        const parentActive = activeId === parent.id;
        return (
          <div key={parent.id}>
            {/* Parent row */}
            <div
              className={cn(
                "flex items-center rounded-md transition-colors",
                parentActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <a
                href={`#${parent.id}`}
                className={cn(
                  "flex-1 min-w-0 px-2 py-1.5 text-[13px] truncate",
                  parentActive && "font-medium",
                )}
              >
                {parent.label}
              </a>
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggle(parent.id)}
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen ? `Collapse ${parent.label}` : `Expand ${parent.label}`
                  }
                  className="shrink-0 grid h-7 w-7 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-150",
                      !isOpen && "-rotate-90",
                    )}
                  />
                </button>
              )}
            </div>
            {/* Children — indented with a vertical guide line */}
            {hasChildren && isOpen && (
              <div className="ml-3 mt-0.5 border-l border-border/60 pl-2 space-y-0.5">
                {children.map((child) => {
                  const active = activeId === child.id;
                  return (
                    <a
                      key={child.id}
                      href={`#${child.id}`}
                      className={cn(
                        "block rounded-md px-2 py-1 text-[12.5px] transition-colors",
                        active
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {child.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
