"use client";

import type { ComponentProps } from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}
function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}
function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn(className)} {...props} />;
}
function SheetContent({ className, children, side = "top", showCloseButton = true, ...props }: ComponentProps<typeof SheetPrimitive.Content> & { side?: "top"; showCloseButton?: boolean }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay data-slot="sheet-overlay" className="sheet-overlay" />
      <SheetPrimitive.Content data-slot="sheet-content" data-side={side} data-lenis-prevent className={cn("sheet-content", className)} {...props}>
        {children}
        {showCloseButton && <SheetClose className="sheet-close" aria-label="Close sections menu"><X aria-hidden="true" /></SheetClose>}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
export { Sheet, SheetTrigger, SheetClose, SheetTitle, SheetContent };
