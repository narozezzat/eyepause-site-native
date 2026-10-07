"use client";

import { setThemeChoice, useTheme } from "@/hooks/useTheme";
import { nextThemeChoice, type ThemeChoice } from "@/lib/theme";
import styles from "./layout.module.css";

const LABEL: Record<ThemeChoice, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function ThemeIcon({ choice }: { choice: ThemeChoice }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {choice === "system" && (
        <>
          <rect x="3" y="4.5" width="18" height="12" rx="2" />
          <path d="M9 20h6M12 16.5V20" />
        </>
      )}
      {choice === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </>
      )}
      {choice === "dark" && <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />}
    </svg>
  );
}

/** Cycles System → Light → Dark, like a compact macOS Appearance setting. */
export function ThemeToggle() {
  const theme = useTheme();

  // Same footprint before hydration, so nothing shifts when the real control appears.
  if (!theme) return <span className={styles.theme} aria-hidden="true" />;

  const next = nextThemeChoice(theme.choice);
  const current =
    theme.choice === "system" ? `System (${LABEL[theme.resolved]})` : LABEL[theme.choice];
  const label = `Theme: ${current}. Switch to ${LABEL[next]}.`;

  return (
    <button
      type="button"
      className={styles.theme}
      aria-label={label}
      title={label}
      onClick={() => setThemeChoice(next)}
    >
      <ThemeIcon choice={theme.choice} />
    </button>
  );
}
