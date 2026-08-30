"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reading localStorage during SSR is impossible, so the usual shape is
 * "render a default, then correct it in an effect". That works but calls
 * setState synchronously from an effect, which causes a second render pass
 * on every mount and is what react-hooks/set-state-in-effect warns about.
 *
 * useSyncExternalStore is the built-in answer: it takes a server snapshot
 * (the default) and a client snapshot (the stored value), and React handles
 * the hydration handover itself — no effect, no cascading render.
 */

const listeners = new Set<() => void>();

/** Re-read every subscribed value. Call after writing to localStorage. */
export function notifyPersistedChanged(): void {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` only fires in *other* tabs, so same-tab writes go through
  // notifyPersistedChanged above. Both paths are needed.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * A value backed by localStorage. `parse` returns null for anything stored
 * that is missing or no longer valid, in which case `fallback` is used.
 */
export function usePersisted<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T | null,
): T {
  const getSnapshot = useCallback(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      // Private mode or blocked storage — fall back rather than throw.
      return fallback;
    }
    if (raw === null) return fallback;
    return parse(raw) ?? fallback;
  }, [key, fallback, parse]);

  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

/** Write a persisted value and refresh every reader in this tab. */
export function writePersisted(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore write failures; the in-memory value still updates on re-read.
  }
  notifyPersistedChanged();
}

/**
 * False during SSR and the hydration render, true afterwards. Replaces the
 * `const [mounted, setMounted] = useState(false); useEffect(...)` idiom.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
