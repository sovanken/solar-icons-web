"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your observability backend here if desired.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center px-6 py-24">
      <div className="max-w-md text-center">
        <Icon
          icon="solar:danger-triangle-bold-duotone"
          className="mx-auto mb-4 h-16 w-16 text-red-500"
        />
        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground break-all">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mt-1 text-[11px] text-muted-foreground/70 font-mono">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Icon icon="solar:refresh-bold-duotone" width={16} height={16} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
