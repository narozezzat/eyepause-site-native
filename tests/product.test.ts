import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("Product final states", () => {
  it("keeps the desktop stage decorative with an accessible equivalent", () => {
    const component = source("src/components/sections/ProductDetails.tsx");
    expect(component).toContain('className="product-stage" data-active="0" aria-hidden="true"');
    expect(component).toContain('className="product-description"');
    expect(component).not.toContain('id="settings');
  });

  it("scopes row dimming and pending toggle states to desktop motion", () => {
    const css = source("src/app/globals.css");
    expect(css).toMatch(/@media \(min-width: 1024px\) and \(prefers-reduced-motion: no-preference\)\s*\{\s*html\[data-motion="ready"\] \.product-rows/);
    expect(css).toContain('and (prefers-reduced-motion: no-preference)');
  });

  it("restores Product attributes when motion preferences change", () => {
    const runtime = source("src/components/motion/MotionRuntime.tsx");
    expect(runtime).toContain('list?.removeAttribute("data-active")');
    expect(runtime).toContain('row.removeAttribute("data-current")');
    expect(runtime).toContain('el.removeAttribute("data-seen")');
    expect(runtime).toContain('stage.dataset.active = "0"');
  });
});
