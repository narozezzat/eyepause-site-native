import { describe, expect, it } from "vitest";
import type { PlatformConfig } from "@/config/platforms";
import { parseRelease } from "@/lib/releases/parse";
import { resolveDownloads } from "@/lib/releases/resolve";
import type { Release } from "@/lib/releases/types";

const release: Release = {
  version: "2.0.0",
  publishedAt: "2026-10-01T00:00:00Z",
  source: "remote",
  assets: [
    { name: "EyePause-2.0.0.dmg", size: 40_000_000, available: true },
    { name: "EyePause-2.0.0.zip", size: 38_000_000, available: true },
  ],
};

const platforms: PlatformConfig[] = [
  {
    id: "macos",
    label: "macOS",
    status: "available",
    requirements: "macOS 14+",
    primary: { pattern: /\.dmg$/, label: "DMG" },
    alternate: { pattern: /\.zip$/, label: "ZIP" },
    installSteps: [],
  },
  { id: "windows", label: "Windows", status: "coming-soon", requirements: "Planned", installSteps: [] },
];

describe("resolveDownloads", () => {
  it("maps assets to platforms with base-path hrefs", () => {
    const [mac] = resolveDownloads(release, platforms, "/site/downloads");
    expect(mac.status).toBe("available");
    expect(mac.version).toBe("2.0.0");
    expect(mac.primary).toEqual({
      name: "EyePause-2.0.0.dmg",
      label: "DMG",
      size: 40_000_000,
      href: "/site/downloads/EyePause-2.0.0.dmg",
    });
    expect(mac.alternate?.label).toBe("ZIP");
  });

  it("marks coming-soon platforms without files", () => {
    const [, win] = resolveDownloads(release, platforms, "/downloads");
    expect(win.status).toBe("coming-soon");
    expect(win.primary).toBeNull();
  });

  it("marks a platform unavailable when its installer is missing", () => {
    const missing = { ...release, assets: [{ ...release.assets[0], available: false }] };
    const [mac] = resolveDownloads(missing, platforms, "/downloads");
    expect(mac.status).toBe("unavailable");
    expect(mac.primary).toBeNull();
  });

  it("marks a platform unavailable when no asset matches", () => {
    const [mac] = resolveDownloads({ ...release, assets: [] }, platforms, "/downloads");
    expect(mac.status).toBe("unavailable");
  });
});

describe("parseRelease", () => {
  it("accepts valid release data", () => {
    expect(parseRelease(release)).toEqual(release);
  });

  it("rejects malformed data", () => {
    expect(() => parseRelease(null)).toThrow();
    expect(() => parseRelease({ ...release, source: "web" })).toThrow();
    expect(() => parseRelease({ ...release, assets: [{ name: "x" }] })).toThrow();
  });
});
