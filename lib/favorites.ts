"use client";

/// Persistent set of favorited (starred) icon base names. Stored in
/// localStorage under a single JSON string so we can round-trip without
/// per-key noise, and versioned so schema changes can migrate safely.

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "solar-favorites-v1";

function readFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

function writeFavorites(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Storage quota or private-browsing mode — silently skip.
  }
}

/// React hook exposing the favorites set + mutators.
///
/// Multi-tab safe via the `storage` event: if the user stars an icon in
/// another tab, every other open tab reflects the change.
export function useFavorites() {
  // Start empty on server; hydrate from localStorage on client to avoid an
  // SSR/CSR mismatch that would trigger a hydration warning.
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setFavorites(readFavorites());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((base: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(base)) {
        next.delete(base);
      } else {
        next.add(base);
      }
      writeFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (base: string) => favorites.has(base),
    [favorites],
  );

  const clear = useCallback(() => {
    setFavorites(new Set());
    writeFavorites(new Set());
  }, []);

  return { favorites, toggle, isFavorite, clear };
}
