import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type NoticeTone = "info" | "error" | "success";

const iconTone: Record<NoticeTone, string> = {
  info: "text-fg-muted",
  error: "text-danger",
  success: "text-success",
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
  const resolvedRole = role === undefined ? (tone === "error" ? "alert" : "status") : (role ?? undefined);
  return (
    <Alert variant={tone} className={className} role={resolvedRole}>
      <span className={iconTone[tone]}>
        <ToneIcon tone={tone} />
      </span>
      <div className="min-w-0 wrap-anywhere">
        {title && <AlertTitle>{title}</AlertTitle>}
        {children && <AlertDescription className={title ? "mt-1" : undefined}>{children}</AlertDescription>}
      </div>
    </Alert>
  );
}
