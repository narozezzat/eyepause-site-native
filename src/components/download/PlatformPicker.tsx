"use client";

import { useRef, type KeyboardEvent } from "react";
import { PlatformIcon } from "./PlatformIcon";
import { cn } from "@/lib/cn";

interface PlatformChoice {
  id: string;
  label: string;
}

interface PlatformPickerProps {
  choices: PlatformChoice[];
  selected: string;
  recommended: string | null;
  onSelect: (id: string) => void;
}

const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Segmented control following the ARIA radio group pattern: one tab stop, arrows move and select. */
export function PlatformPicker({ choices, selected, recommended, onSelect }: PlatformPickerProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function move(index: number) {
    const next = choices[(index + choices.length) % choices.length];
    onSelect(next.id);
    refs.current[next.id]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = choices.findIndex((c) => c.id === selected);
    if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(choices.length - 1);
    } else if (event.key in step) {
      event.preventDefault();
      move(current + step[event.key]);
    }
  }

  return (
    <div
      className="flex gap-0.5 rounded-control bg-surface-2 p-[3px]"
      role="radiogroup"
      aria-label="Platform"
      onKeyDown={onKeyDown}
    >
      {choices.map((c) => {
        const checked = c.id === selected;
        const isRecommended = c.id === recommended;
        return (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[c.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            aria-label={isRecommended ? `${c.label}, recommended for this device` : undefined}
            className={cn(
              "flex min-h-11 flex-[1_0_auto] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-ui font-medium whitespace-nowrap transition-[background-color,color,box-shadow] hover:text-fg focus-visible:outline-offset-[-1px] sm:gap-2",
              checked ? "bg-surface text-fg shadow-seg" : "text-fg-muted",
            )}
            onClick={() => onSelect(c.id)}
          >
            <PlatformIcon className="size-[15px] flex-none" platformId={c.id} />
            {c.label}
            {isRecommended && (
              // Below sm the badge collapses to an accent dot; the radio's aria-label still says "recommended".
              <span
                className="inline-flex size-1.5 items-center rounded-full bg-accent font-mono text-3xs font-medium tracking-[0.06em] text-accent uppercase sm:size-auto sm:rounded-[5px] sm:bg-accent-soft sm:px-[5px] sm:py-[3px]"
                aria-hidden="true"
              >
                <span className="hidden sm:inline">Recommended</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
