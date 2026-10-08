import type { AssetRule, PlatformConfig } from "@/config/platforms";
import type { DownloadFile, DownloadOption, Release } from "./types";

function matchFile(
  release: Release,
  rule: AssetRule | undefined,
  downloadsPath: string,
): DownloadFile | null {
  if (!rule) return null;
  const asset = release.assets.find((a) => rule.pattern.test(a.name));
  if (!asset || !asset.available) return null;
  return {
    name: asset.name,
    label: rule.label,
    size: asset.size,
    href: `${downloadsPath}/${encodeURIComponent(asset.name)}`,
  };
}

/** Maps release assets onto configured platforms. Pure, so new platforms or releases need no UI change. */
export function resolveDownloads(
  release: Release,
  platforms: PlatformConfig[],
  downloadsPath: string,
): DownloadOption[] {
  return platforms.map((platform) => {
    const base = {
      platformId: platform.id,
      label: platform.label,
      version: release.version,
      publishedAt: release.publishedAt,
      requirements: platform.requirements,
      minimumOs: platform.minimumOs ?? null,
    };
    if (platform.status === "coming-soon") {
      return { ...base, status: "coming-soon", primary: null, alternate: null };
    }
    const primary = matchFile(release, platform.primary, downloadsPath);
    const alternate = matchFile(release, platform.alternate, downloadsPath);
    return {
      ...base,
      status: primary ? "available" : "unavailable",
      primary,
      alternate,
    };
  });
}
