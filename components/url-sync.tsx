"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { STYLE_MAP } from "@/lib/libraries";

/// Two-way sync between the app store and the URL query string.
///
/// URL params:
///   ?icon=home-2               opens the icon detail dialog for that base name
///   ?style=bold-duotone        selects a specific style
///   ?category=Arrows           filters the grid to a category
///   ?q=search-term             pre-fills the search filter
///
/// On mount: reads params, hydrates the store.
/// On store change: rewrites the URL (via history.replaceState so back-button
/// behaves like a normal single-page site — no history churn on every click).
export function UrlSync() {
  const {
    viewStyle,
    setViewStyle,
    activeCategory,
    setActiveCategory,
    filter,
    setFilter,
    selected,
    setSelected,
  } = useStore();

  // Only hydrate from URL once on mount.
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const params = new URLSearchParams(window.location.search);

    const styleParam = params.get("style");
    if (styleParam && STYLE_MAP[styleParam]) {
      setViewStyle(styleParam);
    }

    const categoryParam = params.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }

    const qParam = params.get("q");
    if (qParam) {
      setFilter(qParam);
    }

    const iconParam = params.get("icon");
    if (iconParam) {
      // Selection needs a category too; use "__all__" if none given.
      setSelected({
        base: iconParam,
        category: categoryParam ?? "__all__",
      });
    }
  }, [setViewStyle, setActiveCategory, setFilter, setSelected]);

  // Write store state back to URL whenever it changes.
  useEffect(() => {
    if (!hydratedRef.current) return;

    const params = new URLSearchParams();
    if (viewStyle !== "linear") params.set("style", viewStyle);
    if (activeCategory !== "__all__") params.set("category", activeCategory);
    if (filter) params.set("q", filter);
    if (selected) params.set("icon", selected.base);

    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    // replaceState keeps the browser history clean — every state change
    // isn't a new entry to back through.
    window.history.replaceState(null, "", newUrl);
  }, [viewStyle, activeCategory, filter, selected]);

  return null;
}
