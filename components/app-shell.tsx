"use client";

import { useEffect, useState } from "react";
import { fetchCollection, type CollectionData } from "@/lib/iconify";
import { SiteHeader } from "@/components/site-header";
import { Sidebar } from "@/components/sidebar";
import { IconGrid } from "@/components/icon-grid";
import { IconDialog } from "@/components/icon-dialog";
import { CommandMenu } from "@/components/command-menu";
import { SkeletonGrid, SidebarSkeleton } from "@/components/skeleton-grid";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { UrlSync } from "@/components/url-sync";
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
      <UrlSync />
      <AnnouncementBanner />
      <SiteHeader
        total={total}
        categories={collection?.categories ?? {}}
        order={collection?.order ?? []}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {error ? (
          <div className="flex-1 grid place-items-center py-24">
            <div className="text-center max-w-md">
              <Icon
                icon="solar:danger-triangle-bold-duotone"
                className="mx-auto mb-3 h-12 w-12 text-red-500"
              />
              <p className="text-sm font-medium">Failed to load Solar collection</p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : collection ? (
          <>
            <Sidebar categories={collection.categories} order={collection.order} total={total} />
            <IconGrid collection={collection} />
          </>
        ) : (
          <>
            <SidebarSkeleton />
            <SkeletonGrid />
          </>
        )}
      </div>
      {collection && (
        <CommandMenu categories={collection.categories} order={collection.order} />
      )}
      <IconDialog />
    </div>
  );
}
