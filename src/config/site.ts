export const site = {
  name: "EyePause",
  title: "EyePause · The 20-20-20 rule, in your menu bar",
  description:
    "A quiet macOS menu bar app that reminds you to look 20 feet away for 20 seconds every 20 minutes. Free, private, no account.",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
} as const;

/** Prefixes a root-relative path with the deploy base path (e.g. `/eyepause-site-native` when served from a project subpath). */
export function withBasePath(path: string): string {
  return `${site.basePath}${path}`;
}
