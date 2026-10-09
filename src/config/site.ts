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

/** The story's beats that the header links to, in page order. */
export const sections = [
  { id: "details", index: "02", label: "The pause" },
  { id: "product", index: "04", label: "The details" },
  { id: "habit", index: "05", label: "The habit" },
] as const satisfies readonly { id: string; index: string; label: string }[];
