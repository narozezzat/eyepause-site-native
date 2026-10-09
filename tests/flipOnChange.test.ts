import { afterEach, describe, expect, it, vi } from "vitest";

const animation = vi.hoisted(() => ({ fromTo: vi.fn(), set: vi.fn() }));
vi.mock("gsap", () => ({ gsap: animation }));
import { flipOnChange } from "@/components/motion/engine";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("flipOnChange", () => {
  it("cancels replaced flips and restores final styles on immediate cleanup", () => {
    const elements = [{ textContent: "1" }, { textContent: "2" }];
    const notifications: (() => void)[] = [];
    const disconnect = vi.fn();
    vi.stubGlobal("MutationObserver", class {
      constructor(callback: () => void) { notifications.push(callback); }
      observe = vi.fn();
      disconnect = disconnect;
    });
    vi.stubGlobal("document", { querySelectorAll: () => elements });
    const kills = [vi.fn(), vi.fn(), vi.fn()];
    kills.forEach((kill) => animation.fromTo.mockReturnValueOnce({ kill }));
    const stop = flipOnChange(".digit");
    notifications[0]();
    notifications[1]();
    notifications[0]();
    expect(kills[0]).toHaveBeenCalledOnce();
    stop();
    expect(kills[1]).toHaveBeenCalledOnce();
    expect(kills[2]).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledTimes(2);
    elements.forEach((element) => {
      expect(animation.set).toHaveBeenCalledWith(element, { clearProps: "transform,opacity" });
    });
    expect(elements.map((element) => element.textContent)).toEqual(["1", "2"]);
  });
});
