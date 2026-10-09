import { describe, expect, it } from "vitest";
import { tiltAngles } from "../src/lib/tilt";

const rect = { left: 100, top: 100, width: 200, height: 100 };
const max = { x: 3, y: 4 };

describe("tilt angles", () => {
  it("is flat at the centre", () => {
    expect(tiltAngles({ x: 200, y: 150 }, rect, max)).toEqual({ rx: 0, ry: 0 });
  });
  it("leans toward the pointer at the corners", () => {
    expect(tiltAngles({ x: 100, y: 100 }, rect, max)).toEqual({ rx: 3, ry: -4 });
    expect(tiltAngles({ x: 300, y: 200 }, rect, max)).toEqual({ rx: -3, ry: 4 });
  });
  it("clamps a pointer outside the element", () => {
    expect(tiltAngles({ x: 9999, y: -9999 }, rect, max)).toEqual({ rx: 3, ry: 4 });
  });
  it("never divides by a zero-sized rect", () => {
    expect(tiltAngles({ x: 0, y: 0 }, { left: 0, top: 0, width: 0, height: 0 }, max)).toEqual({ rx: 0, ry: 0 });
  });
  it("returns flat angles for negative dimensions", () => {
    expect(tiltAngles({ x: 100, y: 100 }, { ...rect, width: -1 }, max)).toEqual({ rx: 0, ry: 0 });
  });
  it("rounds fractional angles to two decimal places", () => {
    expect(tiltAngles({ x: 233.333, y: 133.333 }, rect, max)).toEqual({ rx: 1, ry: 1.33 });
  });
});
