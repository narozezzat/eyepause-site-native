/** Use a deadline so background-tab throttling never lengthens the break. */
export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
