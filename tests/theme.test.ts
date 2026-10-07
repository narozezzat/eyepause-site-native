import { describe, expect, it } from "vitest";
import { nextThemeOption, THEME_OPTIONS, toThemeOption } from "@/lib/theme";

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

describe("nextThemeOption", () => {
  it("orders the options System, Light, Dark", () => {
    expect(THEME_OPTIONS).toEqual(["system", "light", "dark"]);
  });

  it("moves forward with Right and Down, wrapping at the end", () => {
    expect(nextThemeOption("system", "ArrowRight")).toBe("light");
    expect(nextThemeOption("light", "ArrowDown")).toBe("dark");
    expect(nextThemeOption("dark", "ArrowRight")).toBe("system");
  });

  it("moves back with Left and Up, wrapping at the start", () => {
    expect(nextThemeOption("dark", "ArrowLeft")).toBe("light");
    expect(nextThemeOption("light", "ArrowUp")).toBe("system");
    expect(nextThemeOption("system", "ArrowLeft")).toBe("dark");
  });

  it("jumps to the ends with Home and End", () => {
    expect(nextThemeOption("dark", "Home")).toBe("system");
    expect(nextThemeOption("system", "End")).toBe("dark");
  });

  it("ignores other keys", () => {
    expect(nextThemeOption("light", "Enter")).toBeNull();
    expect(nextThemeOption("light", "a")).toBeNull();
  });
});
