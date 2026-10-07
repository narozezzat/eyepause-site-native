import { describe, expect, it } from "vitest";
import { nextThemeChoice, parseStoredTheme, resolveTheme, themeInitScript } from "@/lib/theme";

describe("parseStoredTheme", () => {
  it("accepts only explicit light or dark", () => {
    expect(parseStoredTheme("light")).toBe("light");
    expect(parseStoredTheme("dark")).toBe("dark");
    expect(parseStoredTheme(null)).toBeNull();
    expect(parseStoredTheme(undefined)).toBeNull();
    expect(parseStoredTheme("system")).toBeNull();
    expect(parseStoredTheme("Dark")).toBeNull();
    expect(parseStoredTheme("")).toBeNull();
  });
});

describe("resolveTheme", () => {
  it("follows the OS only for the system choice", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("nextThemeChoice", () => {
  it("cycles system, light, dark", () => {
    expect(nextThemeChoice("system")).toBe("light");
    expect(nextThemeChoice("light")).toBe("dark");
    expect(nextThemeChoice("dark")).toBe("system");
  });
});

describe("themeInitScript", () => {
  it("is valid JavaScript", () => {
    expect(() => new Function(themeInitScript)).not.toThrow();
  });
});
