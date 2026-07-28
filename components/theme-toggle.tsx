"use client";

import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Button variant="outline" size="icon" className="h-9 w-9" />;
  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Icon icon={isDark ? "solar:moon-bold" : "solar:sun-bold"} className="h-4 w-4" />
    </Button>
  );
}
