"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useIsHydrated, writePersisted } from "@/lib/persisted";

// Bumped whenever the announcement copy changes so dismissed users see the
// next milestone. Local storage stores the last-dismissed banner key.
const BANNER_KEY = "solar-iconkit-banner-v1";

export function AnnouncementBanner() {
  // Dismissal lives in localStorage, which is unreadable during SSR, so the
  // banner stays hidden until hydration rather than flashing in and out.
  const hydrated = useIsHydrated();
  const [dismissedNow, setDismissedNow] = useState(false);

  if (!hydrated) return null;

  let stored = false;
  try {
    stored = window.localStorage.getItem(BANNER_KEY) === "1";
  } catch {
    stored = false;
  }
  if (dismissedNow || stored) return null;

  const onDismiss = () => {
    writePersisted(BANNER_KEY, "1");
    setDismissedNow(true);
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-2.5">
        <Icon
          icon="solar:sun-bold-duotone"
          className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        />
        <div className="min-w-0 flex-1 text-[12px] leading-tight sm:text-[13px]">
          <span className="font-semibold">solar_iconkit is on pub.dev</span> —
          1,576 Flutter icons across 6 native styles, one type-safe widget.{" "}
          <a
            href="https://pub.dev/packages/solar_iconkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90"
          >
            Install now
            <Icon
              icon="solar:arrow-right-up-linear"
              className="h-3 w-3 shrink-0"
            />
          </a>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss announcement"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-white/90 hover:bg-white/15 hover:text-white transition-colors"
        >
          <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
