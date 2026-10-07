import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/cn";

const links = [
  { href: "#tour", label: "Tour", className: "hidden md:inline-flex" },
  { href: "#features", label: "Features", className: "hidden md:inline-flex" },
  { href: "#download", label: "Download", className: "hidden sm:inline-flex" },
];

export function Header({ home = "#" }: { home?: string }) {
  return (
    <header className="flex items-center justify-between gap-3 py-4 sm:py-5.5">
      <a
        className="flex min-h-11 items-center gap-2 font-semibold tracking-[-0.01em] no-underline"
        href={home}
        aria-label="EyePause home"
      >
        <BrandMark />
        <span aria-hidden="true">EyePause</span>
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <nav aria-label="Primary" className="hidden gap-1.5 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              className={cn(
                "min-h-11 items-center rounded-lg px-2.5 text-sm text-fg-muted no-underline transition-colors hover:bg-surface-2 hover:text-fg",
                l.className,
              )}
              href={home === "#" ? l.href : `${home}${l.href}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
