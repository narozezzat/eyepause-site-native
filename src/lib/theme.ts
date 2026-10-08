export const THEME_OPTIONS = ["system", "light", "dark"] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number];

export const THEME_STORAGE_KEY = "eyepause-theme";

/** Any stored or reported theme that isn't an explicit choice falls back to System. */
export function toThemeOption(value: string | undefined | null): ThemeOption {
  return value === "light" || value === "dark" ? value : "system";
}
