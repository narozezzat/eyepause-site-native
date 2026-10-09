import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MOTION } from "../src/components/motion/tokens";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const cssVar = (name: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();

describe("motion tokens", () => {
  it("mirror the CSS custom properties", () => {
    expect(cssVar("--dur-micro")).toBe(`${MOTION.micro * 1000}ms`);
    expect(cssVar("--dur-ui")).toBe(`${MOTION.ui * 1000}ms`);
    expect(cssVar("--dur-section")).toBe(`${MOTION.section * 1000}ms`);
    expect(cssVar("--ease-settle")).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    expect(cssVar("--ease-release")).toBe("cubic-bezier(0.65, 0, 0.35, 1)");
  });
  it("stay inside the tier ranges", () => {
    expect(MOTION.micro).toBeGreaterThanOrEqual(0.15);
    expect(MOTION.micro).toBeLessThanOrEqual(0.25);
    expect(MOTION.ui).toBeGreaterThanOrEqual(0.25);
    expect(MOTION.ui).toBeLessThanOrEqual(0.45);
    expect(MOTION.section).toBeGreaterThanOrEqual(0.5);
    expect(MOTION.section).toBeLessThanOrEqual(0.9);
  });
});

/** Extract a single selector body rather than its surrounding layer. */
function block(selector: string) {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`missing ${selector}`);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i);
  }
  throw new Error(`unclosed ${selector}`);
}

describe("colour tokens", () => {
  const themes = [
    block(":root {"),
    block(':root:not([data-theme="light"])'),
    block(':root[data-theme="dark"]'),
  ];
  const themed = ["--strain", "--strain-glare"];
  const aliases = ["--ink", "--paper", "--rest", "--rest-text"];

  it.each(themed)("%s has a value in every theme root", (name) => {
    for (const theme of themes) expect(theme).toMatch(new RegExp(`${name}:\\s*[^;]+;`));
  });
  it.each(aliases)("%s explicitly aliases an existing token in every theme root", (name) => {
    for (const theme of themes) expect(theme).toMatch(new RegExp(`${name}:\\s*var\\(--[a-z-]+\\);`));
  });
});
