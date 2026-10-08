"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_OPTIONS, toThemeOption, type ThemeOption } from "@/lib/theme";

const LABELS: Record<ThemeOption, string> = { system: "System", light: "Light", dark: "Dark" };

const subscribe = () => () => {};

function ThemeIcon({ option }: { option: ThemeOption }) {
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
  const current: ThemeOption = mounted ? toThemeOption(theme) : "system";
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<Partial<Record<ThemeOption, HTMLButtonElement | null>>>({});
  // A click outside closes the menu without pulling focus back to the trigger.
  const closedOutside = useRef(false);
  const focusedChecked = useRef(false);
  // Radix opens on pointerdown and blocks the click's own focus, so the browser
  // would treat focus moved into the menu as keyboard focus and show its ring.
  const openedWithPointer = useRef(false);

  useEffect(() => {
    if (!open) return;
    // The header is sticky, so an open menu would hang still while the page
    // slides under it. Close on a real scroll, like a native macOS menu, but
    // ignore the tail of trackpad momentum or a smooth scroll still settling.
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) >= 24) setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <div className="theme-menu">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            ref={trigger}
            type="button"
            className="theme-trigger"
            aria-label={`Color theme: ${LABELS[current]}`}
            data-pending={mounted ? undefined : ""}
            onPointerDown={() => {
              openedWithPointer.current = true;
            }}
            onKeyDown={() => {
              openedWithPointer.current = false;
            }}
          >
            <ThemeIcon option={current} />
            <span className="theme-current">{LABELS[current]}</span>
            <svg className="theme-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="theme-list"
          align="end"
          sideOffset={8}
          loop
          onFocus={(event) => {
            // Radix focuses the list (pointer) or its first item (keyboard) on
            // open. Start on the checked option instead, once per open.
            if (event.target !== event.currentTarget || focusedChecked.current) return;
            focusedChecked.current = true;
            queueMicrotask(() =>
              items.current[current]?.focus({ preventScroll: true, focusVisible: !openedWithPointer.current }),
            );
          }}
          onInteractOutside={() => {
            closedOutside.current = true;
          }}
          onCloseAutoFocus={(event) => {
            // Radix's own refocus would scroll the page; the header is sticky.
            event.preventDefault();
            if (!closedOutside.current) trigger.current?.focus({ preventScroll: true });
            closedOutside.current = false;
            focusedChecked.current = false;
          }}
          onKeyDown={(event) => {
            // Radix keeps Tab inside the menu; a menu should close on Tab instead.
            if (event.key === "Tab") {
              event.preventDefault();
              setOpen(false);
            }
          }}
        >
          <DropdownMenuRadioGroup className="theme-options" value={current} onValueChange={(value) => setTheme(toThemeOption(value))}>
            {THEME_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option} value={option} asChild>
                <button
                  ref={(node) => {
                    items.current[option] = node;
                  }}
                  type="button"
                  className="theme-item"
                >
                  <ThemeIcon option={option} />
                  <span>{LABELS[option]}</span>
                  <svg className="theme-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </button>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
