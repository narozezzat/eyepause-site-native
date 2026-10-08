/** First focusable element on every page; jumps past the header to `#main`. */
export function SkipLink() {
  return (
    <a
      className="fixed top-2 left-4 z-30 inline-flex h-11 -translate-y-[200%] items-center rounded-control bg-fg px-4 font-medium text-bg no-underline focus-visible:translate-y-0"
      href="#main"
    >
      Skip to content
    </a>
  );
}
