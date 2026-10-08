import { describe, expect, it } from "vitest";
import { remainingSeconds } from "../src/lib/preview";
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
