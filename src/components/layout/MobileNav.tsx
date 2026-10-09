"use client";

import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Radix owns the focus trap; navigation waits until the sheet unlocks the page. */
export function MobileNav({ links }: { links: { href: string; index: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pendingHref = useRef<string | null>(null);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger ref={trigger} className="nav-menu" aria-label="Open sections menu"><Menu aria-hidden="true" /></SheetTrigger>
      <SheetContent ref={content} side="top" showCloseButton={false} aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          content.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus({ preventScroll: true });
          const href = pendingHref.current;
          pendingHref.current = null;
          if (!href) return;
          // Radix restores body scrolling before this frame. A real anchor also
          // reaches the runtime's delegated Lenis handler and supports other pages.
          requestAnimationFrame(() => {
            const anchor = document.createElement("a");
            anchor.href = href;
            anchor.hidden = true;
            document.body.append(anchor);
            anchor.click();
            anchor.remove();
            const url = new URL(href, window.location.href);
            if (url.origin !== location.origin || url.pathname !== location.pathname) return;
            const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
            if (!target) return;
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          });
        }}>
        <SheetTitle className="label">Sections</SheetTitle>
        <ul className="sheet-links">
          {links.map((link) => <li key={link.href}><a href={link.href} onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            pendingHref.current = link.href;
            setOpen(false);
          }}><span className="label">{link.index}</span>{link.label}</a></li>)}
        </ul>
        <SheetClose className="sheet-close" aria-label="Close sections menu"><X aria-hidden="true" /></SheetClose>
      </SheetContent>
    </Sheet>
  );
}
