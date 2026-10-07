export type DetectedPlatform =
  | "macos"
  | "windows"
  | "linux"
  | "ios"
  | "android"
  | "unknown";

/**
 * Best-effort OS detection. Mobile checks run first because iPadOS reports
 * "MacIntel" as its platform and Android user agents contain "Linux".
 */
export function detectPlatform(
  userAgent: string,
  platformHint = "",
  maxTouchPoints = 0,
): DetectedPlatform {
  const ua = userAgent.toLowerCase();
  const hint = platformHint.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/mac/.test(hint + ua) && maxTouchPoints > 1) return "ios";
  if (/android/.test(ua)) return "android";
  if (/mac/.test(hint) || /mac os x|macintosh/.test(ua)) return "macos";
  if (/win/.test(hint) || /windows/.test(ua)) return "windows";
  if (/linux|x11|cros/.test(hint + ua)) return "linux";
  return "unknown";
}

export function isMobile(platform: DetectedPlatform): boolean {
  return platform === "ios" || platform === "android";
}
