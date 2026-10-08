import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("flex min-w-0 gap-3 rounded-card border px-4 py-3.5 text-body-sm", {
  variants: {
    variant: {
      info: "border-border bg-surface",
      error: "border-danger/40 bg-danger-soft",
      success: "border-success/40 bg-success-soft",
    },
  },
  defaultVariants: { variant: "info" },
});

function Alert({ className, variant, ...props }: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="alert-title" className={cn("font-semibold text-fg", className)} {...props} />;
}

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-pretty text-fg-muted", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
