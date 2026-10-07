"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
