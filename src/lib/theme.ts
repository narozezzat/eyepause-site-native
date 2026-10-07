export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "eyepause-theme";
export const THEME_COLOR_META_ID = "theme-color-choice";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Browser chrome colours; they match `--bg` in globals.css. */
export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: "#fbfcfd",
  dark: "#0b0d10",
};

const ORDER: readonly ThemeChoice[] = ["system", "light", "dark"];

/** An explicit stored choice, or null for anything else (missing, "system", junk). */
export function parseStoredTheme(value: unknown): ResolvedTheme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function resolveTheme(choice: ThemeChoice, systemDark: boolean): ResolvedTheme {
  if (choice === "system") return systemDark ? "dark" : "light";
  return choice;
}

/** The choice a single cycling control moves to next: System → Light → Dark → System. */
export function nextThemeChoice(choice: ThemeChoice): ThemeChoice {
  return ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
}

/**
 * Runs synchronously before first paint, so the page (and the splash) never
 * shows the wrong theme. Kept tiny and dependency-free on purpose.
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark")t=null;var r=t||(matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?"dark":"light");if(t){d.dataset.theme=t;var m=document.createElement("meta");m.name="theme-color";m.id=${JSON.stringify(
  THEME_COLOR_META_ID,
)};m.content=t==="dark"?${JSON.stringify(THEME_COLORS.dark)}:${JSON.stringify(
  THEME_COLORS.light,
)};document.head.prepend(m)}d.style.colorScheme=r}catch(e){}})()`;
