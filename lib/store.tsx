"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SIZE_PRESETS, type SizePreset } from "./styles";
import { BASE_STYLE_ID, STYLE_MAP } from "./libraries";

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
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [viewStyle, setViewStyleInner] = useState<string>(BASE_STYLE_ID);
  const [activeCategory, setActiveCategory] = useState<string>("__all__");
  const [filter, setFilter] = useState<string>("");
  const [size, setSizeInner] = useState<SizePreset>(48);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("solar-size");
    if (s && SIZE_PRESETS.includes(Number(s) as SizePreset)) setSizeInner(Number(s) as SizePreset);
    const vs = localStorage.getItem("solar-viewStyle");
    if (vs && STYLE_MAP[vs]) setViewStyleInner(vs);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--icon-size", `${size}px`);
  }, [size]);

  const setSize = useCallback((s: SizePreset) => {
    setSizeInner(s);
    localStorage.setItem("solar-size", String(s));
  }, []);
  const setViewStyle = useCallback((v: string) => {
    setViewStyleInner(v);
    localStorage.setItem("solar-viewStyle", v);
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
    }),
    [viewStyle, setViewStyle, activeCategory, filter, size, setSize, commandOpen],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
