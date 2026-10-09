/** Use a deadline so background-tab throttling never lengthens the break. */
export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/** Seconds as the app's menu bar shows them, e.g. 1122 -> "18:42". */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Share of the cycle still to run, clamped to 0...1, so the ring follows the timer. */
export function cycleFraction(left: number, cycle: number): number {
  return Math.min(1, Math.max(0, left / cycle));
}

/** The heads-up runs 30 s in the app; the demo compresses it. */
export const HEADS_UP_DEMO_SECONDS = 3;
export const BREAK_SECONDS = 20;

export type BreakPhase =
  | { kind: "work" }
  | { kind: "headsUp"; left: number }
  | { kind: "break"; left: number }
  | { kind: "done" };

const PHASE_SECONDS = { headsUp: HEADS_UP_DEMO_SECONDS, break: BREAK_SECONDS } as const;

export function startPhase(kind: "headsUp" | "break", now: number): { phase: BreakPhase; deadline: number } {
  const left = PHASE_SECONDS[kind];
  return { phase: { kind, left }, deadline: now + left * 1000 };
}

/**
 * The phase at `now`, using the current phase's absolute deadline.
 * On heads-up handover, the break ends at deadline + BREAK_SECONDS * 1000;
 * callers must preserve that deadline rather than restart at the current time.
 */
export function nextPhase(phase: BreakPhase, now: number, deadline: number): BreakPhase {
  if (phase.kind === "work" || phase.kind === "done") return phase;
  const left = remainingSeconds(deadline, now);
  if (left > 0) return left === phase.left ? phase : { kind: phase.kind, left };
  if (phase.kind === "break") return { kind: "done" };
  const breakLeft = remainingSeconds(deadline + BREAK_SECONDS * 1000, now);
  return breakLeft > 0 ? { kind: "break", left: breakLeft } : { kind: "done" };
}

export function breakControlLabel(phase: BreakPhase): string {
  if (phase.kind === "work") return "Preview 20-second break";
  if (phase.kind === "done") return "Replay break preview";
  return "Skip preview";
}

export function breakAnnouncement(phase: BreakPhase): string {
  switch (phase.kind) {
    case "work":
      return "Break preview ready.";
    case "headsUp":
      return "A break is coming.";
    case "break":
      return "Break preview started.";
    case "done":
      return "Break complete. Back to your day.";
  }
}

/** Seconds as hh:mm:ss, e.g. 2832 -> "00:47:12". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
