import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon. Replaced by a spinner while `busy`. */
  icon?: ReactNode;
  /** Sets aria-busy and shows a spinner in the icon slot. */
  busy?: boolean;
  /** Stretch to the container width (the primary CTA on phones). */
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type AsButton = ButtonOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & { href?: undefined };
type AsLink = ButtonOwnProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & { href: string };
export type ButtonProps = AsButton | AsLink;

const base =
  "inline-flex min-w-11 cursor-pointer items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap no-underline transition-[background-color,border-color,color,transform] duration-150 ease-out select-none active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0 aria-disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,var(--color-fg))] active:bg-[color-mix(in_srgb,var(--color-accent)_80%,var(--color-fg))] disabled:bg-surface-2 disabled:text-fg-subtle",
  secondary:
    "border border-border-strong bg-surface text-fg hover:bg-surface-2 active:bg-[color-mix(in_srgb,var(--color-surface-2)_80%,var(--color-fg))] disabled:border-border disabled:bg-surface disabled:text-fg-subtle",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg active:bg-border disabled:bg-transparent disabled:text-fg-subtle",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-2.5 text-body-sm sm:px-4",
  lg: "h-12 px-5 text-base",
};

function Spinner() {
  return (
    <span
      className="size-4 flex-none animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}

/** The one button style for every action on the site. Renders a link when given `href`. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, busy, fullWidth, className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  const content = (
    <>
      {busy ? <Spinner /> : icon}
      <span className="min-w-0 truncate">{children}</span>
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes} aria-busy={busy || undefined}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
      aria-busy={busy || undefined}
    >
      {content}
    </button>
  );
}
