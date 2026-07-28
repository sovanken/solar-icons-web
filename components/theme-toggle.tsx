"use client";

import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const btnClasses = cn(
  "inline-flex h-9 w-9 items-center justify-center rounded-md",
  "border border-border bg-background text-foreground",
  "hover:bg-muted transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={btnClasses} />;

  const isDark = theme === "dark";
  return (
    <button
      className={btnClasses}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <Icon
        icon={isDark ? "solar:moon-bold-duotone" : "solar:sun-bold-duotone"}
        className="h-4 w-4"
      />
    </button>
  );
}
