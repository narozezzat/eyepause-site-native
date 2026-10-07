const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Decimal megabytes, matching how macOS Finder reports file sizes. */
export function formatBytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
