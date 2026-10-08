import { formatBytes, formatDate } from "@/lib/format";
import type { DetectedPlatform } from "@/lib/platform/detect";
import type { DownloadFile, DownloadOption } from "./types";

/**
 * What the download area shows for the selected option.
 * - ready: installer attached
 * - error: the primary installer is missing but another format is attached
 * - unavailable: nothing attached (fallback release), explain and show requirements
 * - coming-soon: platform not built yet
 * - mobile: phone or tablet visitor, offer to copy the link instead
 */
export type DownloadView = "ready" | "error" | "unavailable" | "coming-soon" | "mobile";

export function downloadView(option: DownloadOption, detected: DetectedPlatform | null): DownloadView {
  if (detected === "ios" || detected === "android") return "mobile";
  if (option.status === "coming-soon") return "coming-soon";
  if (option.status === "available" && option.primary) return "ready";
  return option.alternate ? "error" : "unavailable";
}

/** Small print under the button: version · size · minimum OS · date. Size only when a file is attached. */
export function downloadMeta(option: DownloadOption, file: DownloadFile | null = option.primary): string[] {
  return [
    `v${option.version}`,
    file ? formatBytes(file.size) : null,
    option.minimumOs,
    formatDate(option.publishedAt),
  ].filter((part): part is string => Boolean(part));
}
