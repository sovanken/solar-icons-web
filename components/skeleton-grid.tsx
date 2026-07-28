"use client";

interface Props {
  count?: number;
}

/**
 * Placeholder grid shown while the Solar collection is being fetched.
 * Layout mirrors the real IconGrid so hydration doesn't shift when data
 * arrives — user sees the same shape from the first paint.
 */
export function SkeletonGrid({ count = 60 }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="skeleton h-8 w-40 rounded-md" />
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="skeleton mt-2 h-3 w-96 max-w-full rounded" />
        </header>
        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-card p-3.5"
              style={{ minHeight: "calc(var(--icon-size, 48px) + 60px)" }}
            >
              <div className="skeleton h-10 w-10 rounded-lg" />
              <div className="skeleton h-2 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 overflow-hidden">
      <div className="p-3 space-y-1">
        <div className="skeleton mb-2 mx-3 h-3 w-20 rounded" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="skeleton h-4 w-4 rounded-sm shrink-0" />
            <div className="skeleton h-3 flex-1 rounded" />
            <div className="skeleton h-4 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </aside>
  );
}
