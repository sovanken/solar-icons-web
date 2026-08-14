"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

// Bumped whenever the announcement copy changes so dismissed users see the
// next milestone. Local storage stores the last-dismissed banner key.
const BANNER_KEY = "solar-iconkit-banner-v1";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    setDismissed(localStorage.getItem(BANNER_KEY) === "1");
  }, []);

  // Wait until we know the dismissal state to avoid a flash of the banner.
  if (dismissed === null || dismissed) return null;

  const onDismiss = () => {
    localStorage.setItem(BANNER_KEY, "1");
    setDismissed(true);
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
          1,247 Flutter icons across 6 native styles, one type-safe widget.{" "}
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
