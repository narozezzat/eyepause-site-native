import { describe, expect, it } from "vitest";
import {
  BREAK_SECONDS,
  HEADS_UP_DEMO_SECONDS,
  breakAnnouncement,
  breakControlLabel,
  cycleFraction,
  formatClock,
  formatDuration,
  nextPhase,
  remainingSeconds,
  startPhase,
  type BreakPhase,
} from "../src/lib/preview";
describe("break preview deadline", () => {
  it("keeps the current second until a full second elapses", () => {
    expect(remainingSeconds(20000, 0)).toBe(20);
    expect(remainingSeconds(20000, 999)).toBe(20);
    expect(remainingSeconds(20000, 1000)).toBe(19);
  });
  it("catches up after a background tab resumes and stops at zero", () => {
    expect(remainingSeconds(20000, 17500)).toBe(3);
    expect(remainingSeconds(20000, 20000)).toBe(0);
    expect(remainingSeconds(20000, 60000)).toBe(0);
  });
});
describe("menu bar clock", () => {
  it("formats seconds as the app's menu bar does", () => {
    expect(formatClock(1122)).toBe("18:42");
    expect(formatClock(1200)).toBe("20:00");
    expect(formatClock(5)).toBe("00:05");
  });
  it("never shows a negative or fractional time", () => {
    expect(formatClock(-3)).toBe("00:00");
    expect(formatClock(59.6)).toBe("01:00");
  });
  it("keeps the ring within the cycle", () => {
    expect(cycleFraction(600, 1200)).toBe(0.5);
    expect(cycleFraction(1500, 1200)).toBe(1);
    expect(cycleFraction(-1, 1200)).toBe(0);
  });
});

describe("break sequence", () => {
  it("starts a heads-up and a break with their own deadlines", () => {
    expect(startPhase("headsUp", 1000)).toEqual({ phase: { kind: "headsUp", left: HEADS_UP_DEMO_SECONDS }, deadline: 1000 + HEADS_UP_DEMO_SECONDS * 1000 });
    expect(startPhase("break", 0)).toEqual({ phase: { kind: "break", left: BREAK_SECONDS }, deadline: BREAK_SECONDS * 1000 });
  });
  it("counts the heads-up down, then hands over to the break", () => {
    const { phase, deadline } = startPhase("headsUp", 0);
    expect(nextPhase(phase, 1000, deadline)).toEqual({ kind: "headsUp", left: 2 });
    expect(nextPhase(phase, 3000, deadline)).toEqual({ kind: "break", left: BREAK_SECONDS });
  });
  it("counts the break down to done", () => {
    const { phase, deadline } = startPhase("break", 0);
    expect(nextPhase(phase, 999, deadline)).toEqual({ kind: "break", left: 20 });
    expect(nextPhase(phase, 19_500, deadline)).toEqual({ kind: "break", left: 1 });
    expect(nextPhase(phase, 20_000, deadline)).toEqual({ kind: "done" });
  });
  it("catches up after a background tab without a negative clock", () => {
    const { phase, deadline } = startPhase("break", 0);
    expect(nextPhase(phase, 600_000, deadline)).toEqual({ kind: "done" });
  });
  it("leaves work and done alone", () => {
    expect(nextPhase({ kind: "work" }, 5000, 0)).toEqual({ kind: "work" });
    expect(nextPhase({ kind: "done" }, 5000, 0)).toEqual({ kind: "done" });
  });
  it("labels the control and the live region like before", () => {
    const cases: [BreakPhase, string, string][] = [
      [{ kind: "work" }, "Preview 20-second break", "Break preview ready."],
      [{ kind: "headsUp", left: 2 }, "Skip preview", "A break is coming."],
      [{ kind: "break", left: 12 }, "Skip preview", "Break preview started."],
      [{ kind: "done" }, "Replay break preview", "Break complete. Back to your day."],
    ];
    for (const [phase, label, said] of cases) {
      expect(breakControlLabel(phase)).toBe(label);
      expect(breakAnnouncement(phase)).toBe(said);
    }
  });
});

describe("long duration", () => {
  it("formats hours, minutes and seconds", () => {
    expect(formatDuration(2832)).toBe("00:47:12");
    expect(formatDuration(3600 + 61)).toBe("01:01:01");
    expect(formatDuration(-5)).toBe("00:00:00");
  });
});

describe("break sequence catch-up and identity", () => {
  it("uses the original heads-up deadline for the remaining break", () => {
    const { phase, deadline } = startPhase("headsUp", 1000);
    expect(nextPhase(phase, 4500, deadline)).toEqual({ kind: "break", left: 20 });
    expect(nextPhase(phase, 14_000, deadline)).toEqual({ kind: "break", left: 10 });
    expect(nextPhase(phase, 23_999, deadline)).toEqual({ kind: "break", left: 1 });
    expect(nextPhase(phase, 24_000, deadline)).toEqual({ kind: "done" });
    expect(nextPhase(phase, 600_000, deadline)).toEqual({ kind: "done" });
  });
  it("preserves object identity while the phase and second stay unchanged", () => {
    const headsUp = startPhase("headsUp", 0);
    const activeBreak = startPhase("break", 0);
    const work: BreakPhase = { kind: "work" };
    const done: BreakPhase = { kind: "done" };
    expect(nextPhase(headsUp.phase, 999, headsUp.deadline)).toBe(headsUp.phase);
    expect(nextPhase(activeBreak.phase, 999, activeBreak.deadline)).toBe(activeBreak.phase);
    expect(nextPhase(work, 5000, 0)).toBe(work);
    expect(nextPhase(done, 5000, 0)).toBe(done);
  });
});
