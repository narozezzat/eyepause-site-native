import { describe, expect, it } from "vitest";
import { downloadMeta, downloadView } from "@/lib/releases/view";
import type { DownloadOption } from "@/lib/releases/types";

const dmg = { name: "EyePause-2.0.0.dmg", label: "DMG", size: 40_000_000, href: "/downloads/EyePause-2.0.0.dmg" };
const zip = { name: "EyePause-2.0.0.zip", label: "ZIP", size: 38_000_000, href: "/downloads/EyePause-2.0.0.zip" };

const mac: DownloadOption = {
  platformId: "macos",
  label: "macOS",
  status: "available",
  version: "2.0.0",
  publishedAt: "2026-10-01T00:00:00Z",
  requirements: "macOS 14 Sonoma or later",
  minimumOs: "macOS 14+",
  primary: dmg,
  alternate: zip,
};

describe("downloadView", () => {
  it("is ready when the installer is attached", () => {
    expect(downloadView(mac, "macos")).toBe("ready");
    expect(downloadView(mac, null)).toBe("ready");
    expect(downloadView(mac, "unknown")).toBe("ready");
  });

  it("is an error when only the other format is attached", () => {
    expect(downloadView({ ...mac, status: "unavailable", primary: null }, "macos")).toBe("error");
  });

  it("is unavailable when nothing is attached", () => {
    expect(downloadView({ ...mac, status: "unavailable", primary: null, alternate: null }, "macos")).toBe(
      "unavailable",
    );
  });

  it("is coming soon for unbuilt platforms", () => {
    expect(downloadView({ ...mac, status: "coming-soon", primary: null, alternate: null }, "windows")).toBe(
      "coming-soon",
    );
  });

  it("sends phone and tablet visitors to the copy-link view", () => {
    expect(downloadView(mac, "ios")).toBe("mobile");
    expect(downloadView(mac, "android")).toBe("mobile");
  });
});

describe("downloadMeta", () => {
  it("lists version, size, minimum OS and date", () => {
    expect(downloadMeta(mac)).toEqual(["v2.0.0", "40.0 MB", "macOS 14+", "Oct 1, 2026"]);
  });

  it("drops size and OS when unknown", () => {
    expect(downloadMeta({ ...mac, primary: null, minimumOs: null })).toEqual(["v2.0.0", "Oct 1, 2026"]);
  });

  it("can describe the alternate file", () => {
    expect(downloadMeta(mac, zip)[1]).toBe("38.0 MB");
  });
});
