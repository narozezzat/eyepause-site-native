"use client";

import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { nextThemeOption, THEME_OPTIONS, toThemeOption, type ThemeOption } from "@/lib/theme";

const LABEL: Record<ThemeOption, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const subscribe = () => () => {};

/** False during prerender and hydration, true once running in the browser. */
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function ThemeIcon({ option }: { option: ThemeOption }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {option === "system" && (
        <>
          <rect x="3" y="4.5" width="18" height="12" rx="2" />
          <path d="M9 20h6M12 16.5V20" />
        </>
      )}
      {option === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </>
      )}
      {option === "dark" && <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />}
    </svg>
  );
}

const group = "inline-flex shrink-0 gap-0.5 rounded-control bg-surface-2 p-0.5";
const option =
  "grid size-11 cursor-pointer place-items-center rounded-lg transition-colors hover:text-fg focus-visible:outline-offset-[-1px]";

/** System / Light / Dark segmented control, following the ARIA radio group pattern. */
export function ThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const refs = useRef<Partial<Record<ThemeOption, HTMLButtonElement | null>>>({});

  // Same footprint before hydration, so nothing shifts when the real control appears.
  if (!mounted) {
    return (
      <div className={group} aria-hidden="true">
        {THEME_OPTIONS.map((o) => (
          <span key={o} className="size-11" />
        ))}
      </div>
    );
  }

  const selected = toThemeOption(theme);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextThemeOption(selected, event.key);
    if (!next) return;
    event.preventDefault();
    setTheme(next);
    refs.current[next]?.focus();
  }

  return (
    <div className={group} role="radiogroup" aria-label="Color theme" onKeyDown={onKeyDown}>
      {THEME_OPTIONS.map((o) => {
        const checked = o === selected;
        return (
          <button
            key={o}
            ref={(el) => {
              refs.current[o] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            title={LABEL[o]}
            className={cn(option, checked ? "bg-surface text-fg shadow-seg" : "text-fg-muted")}
            onClick={() => setTheme(o)}
          >
            <ThemeIcon option={o} />
            <span className="sr-only">{LABEL[o]}</span>
          </button>
        );
      })}
    </div>
  );
}
