"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePersisted, writePersisted } from "./persisted";
import { SIZE_PRESETS, type SizePreset } from "./styles";
import { BASE_STYLE_ID, STYLE_MAP } from "./libraries";

export interface SelectedIcon {
  base: string;
  category: string;
}

interface Store {
  viewStyle: string;
  setViewStyle: (id: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  size: SizePreset;
  setSize: (s: SizePreset) => void;
  commandOpen: boolean;
  setCommandOpen: (o: boolean) => void;
  selected: SelectedIcon | null;
  setSelected: (v: SelectedIcon | null) => void;
}

const SIZE_KEY = "solar-size";
const STYLE_KEY = "solar-viewStyle";

// Module-level so the identities are stable across renders — usePersisted
// memoises its snapshot getter on them.
const parseSize = (raw: string): SizePreset | null => {
  const n = Number(raw);
  return SIZE_PRESETS.includes(n as SizePreset) ? (n as SizePreset) : null;
};
const parseStyle = (raw: string): string | null => (STYLE_MAP[raw] ? raw : null);

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // The two persisted values come straight from localStorage via
  // useSyncExternalStore. Previously they were useState seeded with a
  // default and corrected by a mount effect, which meant every visit
  // rendered twice and briefly showed the wrong size and style.
  const viewStyle = usePersisted<string>(STYLE_KEY, BASE_STYLE_ID, parseStyle);
  const size = usePersisted<SizePreset>(SIZE_KEY, 48, parseSize);

  const [activeCategory, setActiveCategory] = useState<string>("__all__");
  const [filter, setFilter] = useState<string>("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedIcon | null>(null);

  // Pushing the size onto the document is a genuine external-system sync,
  // so it stays an effect — it sets no state.
  useEffect(() => {
    document.documentElement.style.setProperty("--icon-size", `${size}px`);
  }, [size]);

  // Writing storage notifies every reader, so no local state to update.
  const setSize = useCallback((s: SizePreset) => {
    writePersisted(SIZE_KEY, String(s));
  }, []);
  const setViewStyle = useCallback((v: string) => {
    writePersisted(STYLE_KEY, v);
  }, []);

  const value = useMemo<Store>(
    () => ({
      viewStyle,
      setViewStyle,
      activeCategory,
      setActiveCategory,
      filter,
      setFilter,
      size,
      setSize,
      commandOpen,
      setCommandOpen,
      selected,
      setSelected,
    }),
    [
      viewStyle,
      setViewStyle,
      activeCategory,
      filter,
      size,
      setSize,
      commandOpen,
      selected,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
