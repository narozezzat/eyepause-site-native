import { afterEach, expect, it, vi } from "vitest";
const animation = vi.hoisted(() => ({ timeline: vi.fn() }));
vi.mock("gsap", () => ({ gsap: animation }));
import { breathe, syncBreathing } from "@/components/motion/engine";
import type { gsap } from "gsap";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

it("coordinates visibility and user pause through callbacks installed at construction", () => {
  let userPaused = false;
  const paused = vi.fn();
  const timeline = {
    paused,
    scrollTrigger: { isActive: false },
    to: vi.fn().mockReturnThis(),
  };
  vi.stubGlobal("document", { querySelectorAll: () => [{}] });
  animation.timeline.mockReturnValue(timeline);
  breathe(".progress", 2, () => userPaused);
  const options = animation.timeline.mock.calls[0][0];
  const trigger = { animation: timeline };
  expect(options.paused).toBe(true);
  expect(options.scrollTrigger.toggleActions).toBe("none none none none");
  expect(paused).toHaveBeenLastCalledWith(true); // restored offscreen position
  timeline.scrollTrigger.isActive = true;
  options.scrollTrigger.onToggle(trigger);
  expect(paused).toHaveBeenLastCalledWith(false);
  userPaused = true;
  options.scrollTrigger.onRefresh(trigger);
  expect(paused).toHaveBeenLastCalledWith(true);
  timeline.scrollTrigger.isActive = false;
  options.scrollTrigger.onToggle(trigger);
  timeline.scrollTrigger.isActive = true;
  options.scrollTrigger.onToggle(trigger);
  expect(paused).toHaveBeenLastCalledWith(true); // paused re-entry
  timeline.scrollTrigger.isActive = false;
  userPaused = false;
  syncBreathing(timeline as unknown as gsap.core.Timeline, userPaused);
  expect(paused).toHaveBeenLastCalledWith(true); // offscreen Resume/Skip
  timeline.scrollTrigger.isActive = true;
  options.scrollTrigger.onToggle(trigger);
  expect(paused).toHaveBeenLastCalledWith(false);
});
