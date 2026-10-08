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
