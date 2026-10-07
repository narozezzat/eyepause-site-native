"use client";

import { useRef, type KeyboardEvent } from "react";
import { PlatformIcon } from "./PlatformIcon";
import styles from "./download.module.css";

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
    <div className={styles.seg} role="radiogroup" aria-label="Platform" onKeyDown={onKeyDown}>
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
            onClick={() => onSelect(c.id)}
          >
            <PlatformIcon platformId={c.id} />
            {c.label}
            {isRecommended && (
              <span className={styles.rec} aria-hidden="true">
                <span className={styles.recText}>Recommended</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
