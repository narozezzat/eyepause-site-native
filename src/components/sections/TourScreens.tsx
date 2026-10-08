"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";

/* Mock-ups of the real app's screens for the tour. All decorative: each is a single role="img". */

/** Desktop backdrop for the break card and heads-up toast. */
const screen =
  "relative grid min-h-85 place-items-center overflow-hidden rounded-window border border-border bg-surface-2 p-4 sm:p-5.5";
/** A macOS window. */
const win = "overflow-hidden rounded-card border border-border bg-surface text-caption shadow-float";
const chip =
  "inline-block flex-none rounded-[calc(var(--radius-control)-4px)] bg-accent-soft px-2 py-1.25 font-mono text-micro leading-none font-medium tracking-caps text-accent-text";
const optRow = "flex items-center justify-between gap-3 border-b border-border py-2.25";
const optDetail = "block text-micro text-fg-subtle";
const mockButton = "rounded-[calc(var(--radius-control)-2px)] p-2 text-xs font-medium";

function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex h-8.5 items-center gap-1.75 border-b border-border bg-bg px-3">
      <i className="size-2.75 rounded-full bg-tl-red" />
      <i className="size-2.75 rounded-full bg-tl-yellow" />
      <i className="size-2.75 rounded-full bg-tl-green" />
      <span className="mx-auto -translate-x-5 truncate text-xs font-semibold text-fg-muted">{title}</span>
    </div>
  );
}

const BREAK_RING = 326.7;

export function BreakScreen({ active }: { active: boolean }) {
  const [b, ref] = useCountdown<HTMLDivElement>(20, 20, active);
  return (
    <div ref={ref} className={screen} role="img" aria-label="Floating break card counting down 20 seconds">
      <div className="w-full max-w-95 rounded-window border border-border bg-surface p-5 text-center shadow-float sm:p-6">
        <span className={chip}>MICRO BREAK</span>
        <div className="relative mx-auto my-4 grid size-30 place-items-center">
          <svg className="absolute inset-0" viewBox="0 0 120 120" fill="none">
            <circle className="stroke-border" cx="60" cy="60" r="52" strokeWidth="5" />
            <circle
              className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
              cx="60"
              cy="60"
              r="52"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={BREAK_RING}
              strokeDashoffset={BREAK_RING * (1 - b / 20)}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <b className="relative font-mono text-3xl leading-none font-medium tabular-nums">
            00:{String(b).padStart(2, "0")}
          </b>
        </div>
        <h4 className="mb-1 text-lede font-semibold">Look away from your screen</h4>
        <p className="mb-1 text-caption text-fg-muted">Focus on an object at least 20 feet (6m) away.</p>
        <p className="mb-1 text-caption text-fg-muted">Blink slowly to lubricate your eyes.</p>
        <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-[1fr_1fr_1.3fr]">
          <span className={cn(mockButton, "bg-surface-2")}>Skip</span>
          <span className={cn(mockButton, "bg-surface-2")}>Snooze</span>
          <span className={cn(mockButton, "bg-accent text-accent-fg")}>I&apos;m Done</span>
        </div>
        <div className="mt-2.5 font-mono text-micro text-fg-subtle">Exit Break (Esc)</div>
      </div>
    </div>
  );
}

export function HeadsUpScreen() {
  return (
    <div
      className={screen}
      role="img"
      aria-label="Heads-up toast under the menu bar: break in 30 seconds, Postpone 5 min"
    >
      <div className="absolute inset-x-0 top-0 h-6.5 border-b border-border bg-menu-bar" />
      <div className="absolute top-6.5 left-1/2 flex w-[min(92%,340px)] -translate-x-1/2 items-center gap-3 rounded-b-card border border-t-0 border-border bg-surface px-3.5 py-3 text-left shadow-float">
        <svg className="size-7.5 flex-none" viewBox="0 0 30 30" fill="none">
          <circle className="stroke-border" cx="15" cy="15" r="12" strokeWidth="3" />
          <circle
            className="stroke-accent"
            cx="15"
            cy="15"
            r="12"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="75.4"
            strokeDashoffset="37.7"
            transform="rotate(-90 15 15)"
          />
        </svg>
        <span className="min-w-0">
          <b className="block text-caption">Break in 30s</b>
          <small className="text-micro text-fg-subtle">Micro break · 20 sec</small>
        </span>
        <em className="ml-auto rounded-[calc(var(--radius-control)-2px)] bg-surface-2 px-2.25 py-1.5 text-xs font-medium whitespace-nowrap not-italic">
          Postpone 5 min
        </em>
      </div>
      <div className="grid w-[70%] gap-2.5 opacity-50">
        {[80, 100, 60, 90, 40].map((w, i) => (
          <i key={i} className="h-2.5 rounded-[calc(var(--radius-control)-4px)] bg-border" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

/** [bar height %, completed, skipped] for Mon–Sun. */
const week: [number, number, number][] = [
  [82, 16, 2],
  [86, 18, 1],
  [82, 14, 4],
  [91, 19, 1],
  [86, 17, 2],
  [32, 6, 1],
  [91, 18, 2],
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** 26 weeks × 7 days of activity levels (0–3), column-major like the app's heatmap. */
const heat =
  "11032210002213301221131301103331311111333331032132211121033231012313321222122111133000231223231131021332111232132110303113223101112001301331011113323323301212111221120102113311000000";
const heatClass = ["bg-border", "bg-heat-1", "bg-heat-2", "bg-accent"];
const completed = "bg-accent";
const skipped = "bg-fg-subtle/45";

const stats = [
  ["18", "Breaks Completed"],
  ["2", "Breaks Skipped"],
  ["90%", "Completion Rate"],
  ["6h 40m", "Screen Time"],
];

export function StatisticsScreen() {
  return (
    <div
      className={win}
      role="img"
      aria-label="EyePause Statistics window: 18 breaks completed, 2 skipped, 90 percent completion, weekly chart and yearly heatmap"
    >
      <TitleBar title="EyePause Statistics" />
      <div className="p-4 sm:p-4.5">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-control border border-border px-3 py-2.5">
              <b className="block font-mono text-lg leading-tight font-medium tabular-nums">{value}</b>
              <span className="text-micro text-fg-subtle">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 mb-1 grid h-27.5 grid-cols-7 items-end gap-2">
          {week.map(([h, c, k], i) => (
            <div key={days[i]} className="flex flex-col-reverse overflow-hidden rounded-sm" style={{ height: `${h}%` }}>
              <span className={completed} style={{ flex: c }} />
              <span className={skipped} style={{ flex: k }} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center font-mono text-micro font-medium text-fg-subtle">
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-micro text-fg-subtle">
          <span>
            <i className={cn("mr-1.25 inline-block size-2 rounded-xs", completed)} />
            Completed
          </span>
          <span>
            <i className={cn("mr-1.25 inline-block size-2 rounded-xs", skipped)} />
            Skipped
          </span>
          <span className="ml-auto">Current Streak · 12 days</span>
        </div>
        <div className="mt-3.5 grid grid-flow-col grid-cols-[repeat(26,minmax(0,1fr))] grid-rows-7 gap-0.5">
          {Array.from(heat, (level, i) => (
            <i key={i} className={cn("aspect-square rounded-xs", heatClass[Number(level)])} />
          ))}
        </div>
      </div>
    </div>
  );
}

const presets = [
  { name: "20-20-20", detail: "20m · 20s · 5m", on: true },
  { name: "Pomodoro", detail: "25m · 5m · 15m", on: false },
  { name: "Deep work", detail: "50m · 10m · 20m", on: false },
];

const toggles = [
  { label: "Heads-up before break", detail: "30 seconds", on: true },
  { label: "Only Remind During Work Hours", detail: "Mon–Fri · 9:00–18:00", on: true },
  { label: "Delay breaks during calls", on: true },
  { label: "Strict Mode", on: false },
];

export function SettingsScreen() {
  return (
    <div className={win} role="img" aria-label="Settings window, Schedule tab, with presets and toggles">
      <TitleBar title="Settings" />
      <div className="grid min-h-80 grid-cols-1 sm:grid-cols-[130px_1fr]">
        <div className="hidden content-start gap-0.5 border-r border-border px-2 py-2.5 sm:grid">
          {["General", "Schedule", "Behavior", "Appearance", "Audio", "About"].map((s) => (
            <span
              key={s}
              className={cn(
                "rounded-[calc(var(--radius-control)-4px)] px-2.25 py-1.5",
                s === "Schedule" ? "bg-accent-soft font-medium text-accent-text" : "text-fg-muted",
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="grid content-start gap-1 px-4 py-4 sm:px-4.5">
          <h5 className="mb-1.5 font-mono text-micro leading-none font-medium tracking-caps text-fg-subtle uppercase">
            Preset
          </h5>
          <div className="mb-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {presets.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-[calc(var(--radius-control)-2px)] border p-2 text-xs",
                  p.on ? "border-accent ring-1 ring-accent ring-inset" : "border-border",
                )}
              >
                <b className="block">{p.name}</b>
                {p.detail}
              </div>
            ))}
          </div>
          {toggles.map((t) => (
            <div key={t.label} className={optRow}>
              <span>
                {t.label}
                {t.detail && <small className={optDetail}>{t.detail}</small>}
              </span>
              <i
                className={cn(
                  "relative h-4.5 w-7.5 flex-none rounded-full after:absolute after:top-0.5 after:size-3.5 after:rounded-full after:bg-knob after:ring-1 after:ring-border-strong/40 after:content-['']",
                  t.on ? "bg-accent after:left-3.5" : "bg-border after:left-0.5",
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const statuses = [
  { title: "Idle", detail: "No keyboard or mouse for 5 minutes", chip: "PAUSED" },
  { title: "Locked · Asleep", detail: "Screen locked or lid closed", chip: "PAUSED" },
  { title: "Waiting: On a call", detail: "Microphone or camera in use", chip: "WAITING" },
  { title: "Waiting: Full screen", detail: "Keynote in front, up to 10 min", chip: "WAITING" },
  { title: "Off Hours", detail: "Outside your work hours", chip: "OFF" },
];

export function SmartPauseScreen() {
  return (
    <div className={win} role="img" aria-label="Popover status chips: Idle, Locked, Waiting on a call, Off Hours">
      <TitleBar title="Status" />
      <div className="grid gap-2 p-4 sm:p-4.5">
        {statuses.map((s) => (
          <div key={s.title} className={cn(optRow, "last:border-b-0")}>
            <span className="min-w-0">
              <b>{s.title}</b>
              <small className={optDetail}>{s.detail}</small>
            </span>
            <span className={chip}>{s.chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
