const paths: Record<string, string> = {
  macos:
    "M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4Z",
  windows: "M3 5.4 10.4 4.4v7H3zM11.4 4.2 21 2.8v8.6h-9.6zM3 12.6h7.4v7L3 18.6zM11.4 12.6H21v8.6l-9.6-1.4z",
  linux:
    "M12 2c-2.2 0-3.6 1.8-3.6 4.4 0 1.6.4 2.6-.7 4.3C6.4 12.6 5 14.6 5 17c0 .6.1 1.1.3 1.5-.8.4-1.6 1-1.4 1.8.3 1 2 .8 3.2 1.4 1.1.5 2.3.6 3-.3h3.8c.7.9 1.9.8 3 .3 1.2-.6 2.9-.4 3.2-1.4.2-.8-.6-1.4-1.4-1.8.2-.4.3-.9.3-1.5 0-2.4-1.4-4.4-2.7-6.3-1.1-1.7-.7-2.7-.7-4.3C15.6 3.8 14.2 2 12 2Z",
};

/** Decorative OS logo; the surrounding control carries the accessible name. */
export function PlatformIcon({ platformId, className }: { platformId: string; className?: string }) {
  const d = paths[platformId];
  if (!d) return null;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
