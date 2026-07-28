"use client";

import { useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStore } from "@/lib/store";
import { Icon } from "@iconify/react";
import { PREFIX, BASE_SUFFIX } from "@/lib/libraries";

interface Props {
  categories: Record<string, string[]>;
  order: string[];
}

export function CommandMenu({ categories, order }: Props) {
  const { commandOpen, setCommandOpen, setActiveCategory, setSelected } =
    useStore();

  const flatIcons = useMemo(() => {
    const list: { base: string; category: string }[] = [];
    for (const cat of order) {
      for (const base of categories[cat]) {
        list.push({ base, category: cat });
      }
    }
    return list;
  }, [categories, order]);

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search icons or categories..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Categories">
          <CommandItem
            onSelect={() => {
              setActiveCategory("__all__");
              setCommandOpen(false);
            }}
          >
            <Icon
              icon="solar:widget-5-bold-duotone"
              className="mr-2 h-4 w-4 shrink-0"
            />
            <span className="flex-1 truncate">All Icons</span>
          </CommandItem>
          {order.map((cat) => (
            <CommandItem
              key={cat}
              onSelect={() => {
                setActiveCategory(cat);
                setCommandOpen(false);
              }}
            >
              <Icon
                icon="solar:folder-bold-duotone"
                className="mr-2 h-4 w-4 shrink-0"
              />
              <span className="flex-1 truncate">{cat}</span>
              <span className="ml-2 min-w-[40px] shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                {categories[cat].length}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Icons">
          {flatIcons.slice(0, 200).map(({ base, category }) => (
            <CommandItem
              key={`${category}-${base}`}
              value={`${base} ${category}`}
              onSelect={() => {
                setSelected({ base, category });
                setCommandOpen(false);
              }}
            >
              <Icon
                icon={`${PREFIX}:${base}${BASE_SUFFIX}`}
                className="mr-2 h-4 w-4 shrink-0"
              />
              <span className="flex-1 truncate font-mono text-xs">{base}</span>
              <span className="ml-2 max-w-[140px] shrink-0 truncate text-right text-[10px] text-muted-foreground">
                {category}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
