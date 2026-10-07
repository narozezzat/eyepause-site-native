"use client";

import { EyeGlyph } from "@/components/brand/EyeGlyph";
import { PlatformIcon } from "@/components/download/PlatformIcon";
import { useCountdown } from "@/hooks/useCountdown";

const RING = 414.7;
const CYCLE = 20 * 60;

function clock(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** The macOS menu bar with the EyePause popover open, as the hero's product shot. */
export function ProductShot() {
  const [s, ref] = useCountdown<HTMLDivElement>(18 * 60 + 4, CYCLE);

  return (
    <div
      ref={ref}
      className="relative min-h-110 w-full overflow-hidden rounded-window border border-border bg-surface-2"
      role="img"
      aria-label="EyePause popover open from the macOS menu bar, showing 18 minutes until the next break"
    >
      <div className="flex h-7.5 items-center justify-between gap-3 border-b border-border bg-menu-bar px-3 text-xs font-medium whitespace-nowrap">
        <div className="flex min-w-0 items-center gap-3.5">
          <PlatformIcon className="size-3.5 flex-none" platformId="macos" />
          <span className="font-bold">Xcode</span>
          {["File", "Edit", "View"].map((m) => (
            <span key={m} className="hidden sm:inline">
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-fg-muted">
          <span className="flex items-center gap-1.25 rounded-[5px] bg-fg-subtle/20 px-1.5 py-0.5 text-fg tabular-nums">
            <EyeGlyph className="size-3.5" />
            <span>{Math.ceil(s / 60)}m</span>
          </span>
          <span className="hidden sm:inline">100%</span>
          <span>Tue 14:02</span>
        </div>
      </div>
      <div className="absolute top-10 right-3 w-75 max-w-[calc(100%-24px)] animate-drop rounded-card border border-border bg-surface p-4.5 shadow-elev lg:right-17">
        <div className="relative mx-auto mt-1 mb-3.5 grid size-37.5 place-items-center">
          <svg className="absolute inset-0" viewBox="0 0 150 150" fill="none">
            <circle className="stroke-border" cx="75" cy="75" r="66" strokeWidth="5" />
            <circle
              className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
              cx="75"
              cy="75"
              r="66"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - s / CYCLE)}
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div className="relative">
            <b className="font-mono text-numeral font-medium tracking-[-0.02em] tabular-nums">{clock(s)}</b>
            <span className="mt-1 block text-center text-2xs text-fg-subtle">next micro break</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium">
          <div className="rounded-lg bg-surface-2 p-2">Pause for…</div>
          <div className="rounded-lg bg-accent-soft p-2 text-accent">Break now</div>
        </div>
        <div className="mt-3.5 grid grid-cols-3 border-t border-border pt-3 text-center">
          {[
            ["9", "taken"],
            ["1", "skipped"],
            ["4h 12m", "screen"],
          ].map(([value, label]) => (
            <div key={label}>
              <b className="block font-mono text-base leading-tight font-medium">{value}</b>
              <span className="text-2xs text-fg-subtle">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
