import { afterEach, describe, expect, it, vi } from "vitest";

const animation = vi.hoisted(() => ({ fromTo: vi.fn(), set: vi.fn() }));
vi.mock("gsap", () => ({ gsap: animation }));
import { rollDigits } from "@/components/motion/engine";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("rollDigits", () => {
  it("rolls only changed slots without replacing React-owned text", () => {
    const slots = [..."18:42"].map((textContent) => ({ textContent }));
    const element = { querySelectorAll: () => slots };
    let notify = () => {};
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal("MutationObserver", class {
      constructor(callback: () => void) { notify = callback; }
      observe = observe;
      disconnect = disconnect;
    });
    vi.stubGlobal("document", { querySelectorAll: () => [element] });
    const kill = vi.fn();
    animation.fromTo.mockReturnValue({ kill });
    const stop = rollDigits("#menu-time");
    notify();
    expect(animation.fromTo).not.toHaveBeenCalled();
    slots[4].textContent = "1";
    notify();
    expect(animation.fromTo).toHaveBeenCalledTimes(1);
    expect(animation.fromTo.mock.calls[0][0]).toBe(slots[4]);
    expect(slots.map((slot) => slot.textContent).join("")).toBe("18:41");
    notify();
    expect(animation.fromTo).toHaveBeenCalledTimes(1);
    stop();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(kill).toHaveBeenCalledOnce();
    expect(animation.set).toHaveBeenCalledWith(slots[4], { clearProps: "transform,opacity" });
    expect(observe).toHaveBeenCalledWith(element, { childList: true, characterData: true, subtree: true });
  });
});
