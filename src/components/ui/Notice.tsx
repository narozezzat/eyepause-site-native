import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type NoticeTone = "info" | "error" | "success";

const iconTone: Record<NoticeTone, string> = {
  info: "text-fg-muted",
  error: "text-danger",
  success: "text-success",
};

const toneIcon: Record<NoticeTone, LucideIcon> = {
  info: Info,
  error: CircleAlert,
  success: CircleCheck,
};

function ToneIcon({ tone }: { tone: NoticeTone }) {
  const Icon = toneIcon[tone];
  return <Icon className="mt-0.5 size-4 flex-none" aria-hidden="true" focusable="false" />;
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
