import { cn } from "@/lib/cn";

/** macOS-style segmented control, shared by the theme toggle, platform picker and tour tabs. */
export const segGroup = "rounded-control bg-surface-2 p-0.5";

/** Inner radius follows the group's: control radius minus its 2px padding. */
export function segItem(selected: boolean, className?: string) {
  return cn(
    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[calc(var(--radius-control)-2px)] text-body-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out",
    selected
      ? "bg-surface text-fg ring-1 ring-border"
      : "text-fg-muted hover:bg-surface/60 hover:text-fg active:bg-surface",
    className,
  );
}
