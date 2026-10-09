import { afterEach, describe, expect, it, vi } from "vitest";

const animation = vi.hoisted(() => ({ set: vi.fn(), quickTo: vi.fn() }));
vi.mock("gsap", () => ({ gsap: animation }));
import { tilt } from "@/components/motion/engine";

afterEach(() => { vi.unstubAllGlobals(); vi.resetAllMocks(); });

function setup(matches = true) {
  const media = { matches, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  const matchMedia = vi.fn(() => media);
  const layer = { style: { transform: "", transformStyle: "", perspective: "" } };
  const element = {
    style: { transform: "", transformStyle: "", perspective: "" },
    querySelectorAll: () => [layer],
    getBoundingClientRect: vi.fn(),
  };
  const surface = {
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 100 }),
  };
  const rx = Object.assign(vi.fn(), { tween: { kill: vi.fn() } });
  const ry = Object.assign(vi.fn(), { tween: { kill: vi.fn() } });
  animation.quickTo.mockReturnValueOnce(rx).mockReturnValueOnce(ry);
  vi.stubGlobal("window", { matchMedia });
  vi.stubGlobal("document", { querySelectorAll: (selector: string) => selector === ".scene" ? [surface] : [element] });
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  const flush = () => { frames.forEach((callback) => callback(0)); frames.clear(); };
  const stop = tilt(".desktop", { max: { x: 2, y: 2 }, depth: 0, perspective: 12000, bounds: ".scene" });
  const move = surface.addEventListener.mock.calls.find(([name]) => name === "pointermove")?.[1];
  const leave = surface.addEventListener.mock.calls.find(([name]) => name === "pointerleave")?.[1];
  return { media, matchMedia, layer, element, surface, rx, ry, flush, stop, move, leave, frames };
}

describe("planar hero tilt", () => {
  it("uses stable bounds, clamps corners and leaves child layers untouched", () => {
    const f = setup();
    expect(animation.set).toHaveBeenCalledWith(f.element, { transformPerspective: 12000, transformStyle: "flat" });
    expect(animation.set).not.toHaveBeenCalledWith(f.layer, expect.anything());
    f.move({ clientX: 9999, clientY: -9999, pointerType: "mouse" });
    f.flush();
    expect(f.rx).toHaveBeenLastCalledWith(2);
    expect(f.ry).toHaveBeenLastCalledWith(2);
    expect(f.element.getBoundingClientRect).not.toHaveBeenCalled();
    f.leave();
    expect(f.rx).toHaveBeenLastCalledWith(0);
    expect(f.ry).toHaveBeenLastCalledWith(0);
    f.stop();
  });

  it("ignores touch and cancels pending pointer work on leave and cleanup", () => {
    const f = setup();
    f.move({ clientX: 100, clientY: 100, pointerType: "touch" });
    f.flush();
    expect(f.rx).not.toHaveBeenCalled();
    f.move({ clientX: 100, clientY: 100, pointerType: "mouse" });
    f.leave();
    f.flush();
    expect(f.rx).toHaveBeenCalledTimes(1);
    f.move({ clientX: 100, clientY: 100, pointerType: "mouse" });
    f.stop();
    expect(f.frames.size).toBe(0);
    expect(f.rx.tween.kill).toHaveBeenCalledOnce();
    expect(f.ry.tween.kill).toHaveBeenCalledOnce();
    expect(f.surface.removeEventListener).toHaveBeenCalledWith("pointermove", f.move);
    expect(f.surface.removeEventListener).toHaveBeenCalledWith("pointerleave", f.leave);
    expect(f.surface.removeEventListener).toHaveBeenCalledWith("pointercancel", f.leave);
    expect(f.media.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("does not attach when motion or pointer capabilities disallow tilt", () => {
    const f = setup(false);
    expect(f.matchMedia).toHaveBeenCalledWith("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    expect(f.surface.addEventListener).not.toHaveBeenCalled();
    expect(animation.quickTo).not.toHaveBeenCalled();
    f.stop();
  });

  it("detaches and restores styles when capabilities change", () => {
    const f = setup();
    f.media.matches = false;
    f.media.addEventListener.mock.calls[0][1]();
    expect(f.rx.tween.kill).toHaveBeenCalledOnce();
    expect(f.element.style).toEqual({ transform: "", transformStyle: "", perspective: "" });
    f.stop();
    expect(f.rx.tween.kill).toHaveBeenCalledOnce();
  });
});
