"use client";

import { useSyncExternalStore } from "react";
import {
  DARK_QUERY,
  THEME_COLOR_META_ID,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  parseStoredTheme,
  resolveTheme,
  type ResolvedTheme,
  type ThemeChoice,
} from "@/lib/theme";

export interface ThemeState {
  choice: ThemeChoice;
  resolved: ResolvedTheme;
}

const listeners = new Set<() => void>();
let state: ThemeState | undefined;
let media: MediaQueryList | undefined;

function systemDark(): boolean {
  media ??= window.matchMedia(DARK_QUERY);
  return media.matches;
}

function compute(choice: ThemeChoice): ThemeState {
  return { choice, resolved: resolveTheme(choice, systemDark()) };
}

/** Mirrors the inline head script, minus the storage read. */
function apply({ choice, resolved }: ThemeState) {
  const root = document.documentElement;
  // One frame without transitions, so every surface swaps at once instead of fading unevenly.
  root.classList.add("theme-switching");
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  root.style.colorScheme = resolved;

  let meta = document.getElementById(THEME_COLOR_META_ID) as HTMLMetaElement | null;
  if (choice === "system") {
    meta?.remove();
  } else {
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.id = THEME_COLOR_META_ID;
      // First theme-color in the document wins over the media-query defaults.
      document.head.prepend(meta);
    }
    meta.content = THEME_COLORS[choice];
  }

  void window.getComputedStyle(root).colorScheme;
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}

function update(next: ThemeState) {
  const current = state;
  if (current && current.choice === next.choice && current.resolved === next.resolved) return;
  state = next;
  apply(next);
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== THEME_STORAGE_KEY && e.key !== null) return;
  update(compute(parseStoredTheme(e.newValue) ?? "system"));
}

function onSystemChange() {
  if (state?.choice === "system") update(compute("system"));
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage);
    systemDark();
    media?.addEventListener("change", onSystemChange);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
      media?.removeEventListener("change", onSystemChange);
    }
  };
}

function getSnapshot(): ThemeState {
  // The head script already resolved the stored choice; reading the DOM keeps
  // this in step with what was painted, even when storage is blocked.
  state ??= compute(parseStoredTheme(document.documentElement.dataset.theme) ?? "system");
  return state;
}

/** Null during prerender and hydration, so server and client HTML always match. */
const getServerSnapshot = (): ThemeState | null => null;

export function useTheme(): ThemeState | null {
  return useSyncExternalStore<ThemeState | null>(subscribe, getSnapshot, getServerSnapshot);
}

export function setThemeChoice(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  update(compute(choice));
}
