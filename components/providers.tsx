"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={200}>
        <StoreProvider>
          {children}
          <Toaster position="bottom-center" theme="system" richColors />
        </StoreProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
