import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type NoticeTone = "info" | "error" | "success";

const tones: Record<NoticeTone, { box: string; icon: string }> = {
  info: { box: "border-border bg-surface", icon: "text-fg-muted" },
  error: { box: "border-danger/40 bg-danger-soft", icon: "text-danger" },
  success: { box: "border-success/40 bg-success-soft", icon: "text-success" },
};

function ToneIcon({ tone }: { tone: NoticeTone }) {
  return (
    <svg
      className="mt-0.5 size-4 flex-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      {tone === "success" && <path d="m8 12.5 2.5 2.5L16 9.5" />}
      {tone === "error" && <path d="M12 7.5v5.5M12 16.5h.01" />}
      {tone === "info" && <path d="M12 11v5.5M12 7.5h.01" />}
    </svg>
  );
}

interface NoticeProps {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Defaults to "alert" for errors and "status" otherwise. Pass null inside a live region that already announces. */
  role?: "status" | "alert" | null;
  className?: string;
}

/** Inline message: icon, optional title, text. */
export function Notice({ tone = "info", title, children, role, className }: NoticeProps) {
  const t = tones[tone];
  const resolvedRole = role === undefined ? (tone === "error" ? "alert" : "status") : (role ?? undefined);
  return (
    <div
      className={cn("flex min-w-0 gap-3 rounded-card border px-4 py-3.5 text-body-sm", t.box, className)}
      role={resolvedRole}
    >
      <span className={t.icon}>
        <ToneIcon tone={tone} />
      </span>
      <div className="min-w-0 wrap-anywhere">
        {title && <p className="font-semibold text-fg">{title}</p>}
        {children && <div className={cn("text-pretty text-fg-muted", Boolean(title) && "mt-1")}>{children}</div>}
      </div>
    </div>
  );
}
