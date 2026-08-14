"use client";

import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStore } from "@/lib/store";
import { fuzzyFilter } from "@/lib/search";
import { Icon } from "@iconify/react";
import { PREFIX, BASE_SUFFIX } from "@/lib/libraries";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
}

/// How many results to put in the DOM. Ranking runs over the whole catalog;
/// only the top slice is rendered, because mounting ~1,250 <Icon> components
/// is what actually costs time here.
const MAX_RESULTS = 60;

export function CommandMenu({ categories, order }: Props) {
  const { commandOpen, setCommandOpen, setSelected } = useStore();
  const [query, setQuery] = useState("");

  const flatIcons = useMemo(() => {
    const list: { base: string; category: string }[] = [];
    for (const cat of order) {
      for (const base of categories[cat]) {
        list.push({ base, category: cat });
      }
    }
    return list;
  }, [categories, order]);

  // Rank the full catalog, then trim. Previously this rendered a fixed
  // first-200 slice and let cmdk filter the DOM, which made the remaining
  // ~85% of icons unreachable from the palette.
  const results = useMemo(
    () => fuzzyFilter(flatIcons, query).slice(0, MAX_RESULTS),
    [flatIcons, query],
  );

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={(open) => {
        setCommandOpen(open);
        // Start each visit from a clean query rather than the last search.
        if (!open) setQuery("");
      }}
      title="Search icons"
      description="Search the Solar icon set by name."
      // Ranking is ours (see lib/search.ts) — cmdk's own matcher would
      // re-filter the already-ranked list and reorder it.
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput
        placeholder="Search icons — try “arrow right”, “search”, “delete”..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          No icon matches “{query}”. Try a shorter or more general word.
        </CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={query ? "Results" : "Icons"}>
            {results.map(({ base, category }) => (
              <CommandItem
                key={`${category}-${base}`}
                value={`${category}-${base}`}
                onSelect={() => {
                  setSelected({ base, category });
                  setCommandOpen(false);
                }}
              >
                <Icon
                  icon={`${PREFIX}:${base}${BASE_SUFFIX}`}
                  className="mr-2 h-4 w-4 shrink-0"
                />
                <span className="flex-1 truncate font-mono text-xs">
                  {base}
                </span>
                <span className="ml-2 max-w-[140px] shrink-0 truncate text-right text-[10px] text-muted-foreground">
                  {category}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
