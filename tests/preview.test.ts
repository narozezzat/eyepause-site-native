import { describe, expect, it } from "vitest";
import { cycleFraction, formatClock, remainingSeconds } from "../src/lib/preview";
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
