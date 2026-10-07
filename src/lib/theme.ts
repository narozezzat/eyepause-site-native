export const THEME_OPTIONS = ["system", "light", "dark"] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number];

export const THEME_STORAGE_KEY = "eyepause-theme";

/** Any stored or reported theme that isn't an explicit choice falls back to System. */
export function toThemeOption(value: string | undefined | null): ThemeOption {
  return value === "light" || value === "dark" ? value : "system";
}

const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * Radio group keyboard model: arrows wrap around, Home and End jump to the ends.
 * Returns null for keys the group doesn't handle.
 */
export function nextThemeOption(current: ThemeOption, key: string): ThemeOption | null {
  const last = THEME_OPTIONS.length - 1;
  if (key === "Home") return THEME_OPTIONS[0];
  if (key === "End") return THEME_OPTIONS[last];
  if (!(key in STEP)) return null;
  const index = THEME_OPTIONS.indexOf(current);
  return THEME_OPTIONS[(index + STEP[key] + THEME_OPTIONS.length) % THEME_OPTIONS.length];
}
