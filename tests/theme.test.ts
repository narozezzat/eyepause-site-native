import { describe, expect, it } from "vitest";
import { THEME_OPTIONS, toThemeOption } from "@/lib/theme";

describe("toThemeOption", () => {
  it("keeps explicit choices and falls back to system", () => {
    expect(toThemeOption("light")).toBe("light");
    expect(toThemeOption("dark")).toBe("dark");
    expect(toThemeOption("system")).toBe("system");
    expect(toThemeOption(undefined)).toBe("system");
    expect(toThemeOption(null)).toBe("system");
    expect(toThemeOption("Dark")).toBe("system");
  });
});

describe("THEME_OPTIONS", () => {
  it("orders the options System, Light, Dark", () => {
    expect(THEME_OPTIONS).toEqual(["system", "light", "dark"]);
  });
});
