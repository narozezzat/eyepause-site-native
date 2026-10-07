import type { Release, ReleaseAsset } from "./types";

function isAsset(value: unknown): value is ReleaseAsset {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.name === "string" &&
    typeof a.size === "number" &&
    typeof a.available === "boolean"
  );
}

/** Validates release JSON so a malformed file fails the build instead of shipping a broken page. */
export function parseRelease(value: unknown): Release {
  if (typeof value !== "object" || value === null) {
    throw new Error("release.json: expected an object");
  }
  const r = value as Record<string, unknown>;
  if (typeof r.version !== "string" || typeof r.publishedAt !== "string") {
    throw new Error("release.json: missing version or publishedAt");
  }
  if (r.source !== "remote" && r.source !== "fallback") {
    throw new Error("release.json: source must be remote or fallback");
  }
  if (!Array.isArray(r.assets) || !r.assets.every(isAsset)) {
    throw new Error("release.json: invalid assets");
  }
  return {
    version: r.version,
    publishedAt: r.publishedAt,
    source: r.source,
    assets: r.assets,
  };
}
