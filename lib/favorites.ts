"use client";

/// Persistent set of favorited (starred) icon base names.
///
/// The store lives at the module level so every consumer of [useFavorites]
/// shares the same instance. Toggling from any component (icon dialog,
/// sidebar, etc.) instantly updates every other component. Without this,
/// each component held its own copy of the Set and only re-read on refresh.
///
/// Persistence: JSON-serialised array under a single localStorage key,
/// versioned so schema changes can migrate safely. Cross-tab sync via the
/// window `storage` event — starring in another tab updates every open tab.

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "solar-favorites-v1";

// ------- Module-level store --------------------------------------------------

let state: Set<string> = new Set();
const listeners = new Set<() => void>();

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

function writeToStorage(next: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Storage quota / private-browsing / SSR — silently skip.
  }
}

function setState(next: Set<string>, persist = true): void {
  state = next;
  if (persist) writeToStorage(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Set<string> {
  return state;
}

function getServerSnapshot(): Set<string> {
  // SSR — pretend nothing is starred until the client hydrates.
  return EMPTY_SET;
}

const EMPTY_SET: Set<string> = new Set();

// ------- Lifecycle: init from localStorage + cross-tab listener --------------

// Fire once per browser session on the module's first client-side import.
let initialized = false;
function initClientOnce() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  state = loadFromStorage();

  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    // Another tab wrote to storage — refresh our snapshot without echoing
    // the write back to localStorage.
    setState(loadFromStorage(), false);
  });
}

// ------- Public hook + mutators ---------------------------------------------

export function useFavorites() {
  useEffect(initClientOnce, []);

  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback((base: string) => {
    const next = new Set(state);
    if (next.has(base)) {
      next.delete(base);
    } else {
      next.add(base);
    }
    setState(next);
  }, []);

  const isFavorite = useCallback(
    (base: string) => favorites.has(base),
    [favorites],
  );

  const clear = useCallback(() => setState(new Set()), []);

  return { favorites, toggle, isFavorite, clear };
}
