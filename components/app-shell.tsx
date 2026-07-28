"use client";

import { useEffect, useState } from "react";
import { fetchCollection, type CollectionData } from "@/lib/iconify";
import { SiteHeader } from "@/components/site-header";
import { StyleBar } from "@/components/style-bar";
import { Sidebar } from "@/components/sidebar";
import { IconGrid } from "@/components/icon-grid";
import { CommandMenu } from "@/components/command-menu";
import { Icon } from "@iconify/react";

export function AppShell() {
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCollection()
      .then((data) => {
        if (!cancelled) setCollection(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = collection?.total ?? 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SiteHeader total={total} />
      <StyleBar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {collection ? (
          <>
            <Sidebar categories={collection.categories} order={collection.order} total={total} />
            <IconGrid collection={collection} />
          </>
        ) : (
          <div className="flex-1 grid place-items-center py-24">
            {error ? (
              <div className="text-center max-w-md">
                <Icon icon="solar:danger-triangle-linear" className="mx-auto mb-3 h-10 w-10 text-red-500" />
                <p className="text-sm font-medium">Failed to load Solar collection</p>
                <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 rounded-full border-4 border-muted border-t-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Loading Solar icons…</p>
              </div>
            )}
          </div>
        )}
      </div>
      {collection && <CommandMenu categories={collection.categories} order={collection.order} />}
    </div>
  );
}
