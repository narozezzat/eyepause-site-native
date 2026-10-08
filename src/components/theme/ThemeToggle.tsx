"use client";

import { useTheme } from "next-themes";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { nextThemeOption, toThemeOption } from "@/lib/theme";

type Option = "system" | "light" | "dark";
const OPTIONS: readonly Option[] = ["system", "light", "dark"];
const LABELS: Record<Option, string> = { system: "System", light: "Light", dark: "Dark" };

const subscribe = () => () => {};

function ThemeIcon({ option }: { option: Option }) {
  return (
    <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {option === "light" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.75v1.5M12 19.75v1.5M4.75 4.75l1.06 1.06M18.19 18.19l1.06 1.06M2.75 12h1.5M19.75 12h1.5M4.75 19.25l1.06-1.06M18.19 5.81l1.06-1.06" />
        </>
      ) : option === "dark" ? (
        <path d="M19.5 14.6A7.75 7.75 0 0 1 9.4 4.5a7.75 7.75 0 1 0 10.1 10.1Z" />
      ) : (
        <>
          <rect x="3" y="4.5" width="18" height="12" rx="2" />
          <path d="M8.5 20h7M12 16.5V20" />
        </>
      )}
    </svg>
  );
}

/**
 * Color theme menu button. A native select can't be styled or placed: macOS
 * draws its popup over the button. This opens a small menu right below it.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const current: Option = mounted ? toThemeOption(theme) : "system";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    items.current[OPTIONS.indexOf(current)]?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    // The header is sticky, so an open menu would hang still while the page
    // slides under it. Close on a real scroll, like a native macOS menu, but
    // ignore the tail of trackpad momentum or a smooth scroll still settling.
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) < 24) return;
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, current]);

  const choose = (option: Option) => {
    setTheme(option);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    const index = items.current.indexOf(document.activeElement as HTMLButtonElement);
    const option = nextThemeOption(OPTIONS[Math.max(index, 0)], event.key);
    const next = option === null ? null : OPTIONS.indexOf(option);
    if (next === null) return;
    event.preventDefault();
    items.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className="theme-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="theme-trigger"
        aria-label={`Color theme: ${LABELS[current]}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        data-pending={mounted ? undefined : ""}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
      >
        <ThemeIcon option={current} />
        <span className="theme-current">{LABELS[current]}</span>
        <svg className="theme-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Color theme"
          className="theme-list"
          onKeyDown={onMenuKeyDown}
        >
          {OPTIONS.map((option, i) => (
            <button
              key={option}
              ref={(node) => {
                items.current[i] = node;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={option === current}
              tabIndex={-1}
              className="theme-item"
              onClick={() => choose(option)}
            >
              <ThemeIcon option={option} />
              <span>{LABELS[option]}</span>
              <svg className="theme-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
