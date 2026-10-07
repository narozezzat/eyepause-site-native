import { describe, expect, it } from "vitest";
import { detectPlatform } from "@/lib/platform/detect";

const UA = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  android: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
};

describe("detectPlatform", () => {
  it("detects desktop platforms from the user agent", () => {
    expect(detectPlatform(UA.mac)).toBe("macos");
    expect(detectPlatform(UA.windows)).toBe("windows");
    expect(detectPlatform(UA.linux)).toBe("linux");
  });

  it("prefers the platform hint when present", () => {
    expect(detectPlatform("", "macOS")).toBe("macos");
    expect(detectPlatform("", "Windows")).toBe("windows");
    expect(detectPlatform("", "Linux")).toBe("linux");
  });

  it("treats iPhone as iOS despite 'like Mac OS X'", () => {
    expect(detectPlatform(UA.iphone)).toBe("ios");
  });

  it("treats iPadOS desktop-mode Safari as iOS via touch points", () => {
    expect(detectPlatform(UA.mac, "MacIntel", 5)).toBe("ios");
    expect(detectPlatform(UA.mac, "MacIntel", 0)).toBe("macos");
  });

  it("treats Android as mobile, not Linux", () => {
    expect(detectPlatform(UA.android)).toBe("android");
  });

  it("returns unknown for unrecognised agents", () => {
    expect(detectPlatform("curl/8.0")).toBe("unknown");
  });
});
