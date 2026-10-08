"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroTimer } from "@/hooks/useDemoTimer";
import {
  breathe,
  count,
  flipOnChange,
  grow,
  GENTLE,
  nodes,
  reveal,
  trigger,
  vars,
} from "./engine";

/** The page's motion, played once after the splash. Skipped entirely under reduced motion. */
function choreograph() {
  const intro = gsap.timeline({ delay: 0.9 });
  intro
    .from(
      ".hero-intro > div:first-child > *",
      vars("rise", { stagger: GENTLE.stagger }),
    )
    .from(".intro-right > *", vars("rise", { stagger: GENTLE.stagger }), 0.15)
    .from(
      ".hero .desktop",
      vars("rise", { y: GENTLE.y * 0.6, scale: 0.99 }),
      0.3,
    )
    .from(
      ".desktop-mark, .desktop-word, .desk-bottom",
      vars("fade", { stagger: 0.12 }),
      0.6,
    )
    .from(".popover", vars("pop"), 0.75)
    .from(".scene-caption", vars("fade"), 1.2);
  // The ring drains from a full 20 minutes to the time left, like the real timer.
  heroTimer.animate(heroTimer.cycle, heroTimer.start, {
    duration: GENTLE.count,
    delay: 1.85,
    ease: "power2.inOut",
  });
  breathe(".progress", intro.duration());

  reveal(".rule > p", "rise", { trigger: ".rule" });
  reveal(".unit", "rise", { trigger: ".rule" });
  nodes(".unit b").forEach((el, i) =>
    count(el, { delay: 0.2 + i * 0.15, scrollTrigger: trigger(".rule") }),
  );

  reveal("#details .section-copy > *");
  gsap
    .timeline({ scrollTrigger: trigger("#details figure", "top 85%") })
    .from("#details .toast", vars("slide"))
    .from(".break-screen", vars("depth"), "<0.2")
    .from(
      "#seconds-tens, #seconds-ones",
      {
        rotationX: -90,
        opacity: 0,
        transformPerspective: 500,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      "<0.4",
    )
    .from("#details .figure-label", vars("fade"), "<0.3");

  reveal(".details-intro > *");
  reveal(".ledger-row", "rise", { trigger: ".ledger-row" });

  reveal(".stats-section .section-copy > *");
  gsap
    .timeline({ scrollTrigger: trigger(".stats-window", "top 85%") })
    .from(".stats-window", vars("depth"))
    .add(count(".stat-number"), "<0.3")
    .add(grow(".chart-col i"), "<0.1")
    .add(
      count(".chart-summary strong", {
        format: (v) => `${Math.round(v)} breaks`,
      }),
      "<0.4",
    );

  reveal(".download-intro > *");
  reveal(".download-controls", "depth");

  return flipOnChange("#seconds-tens, #seconds-ones");
}

/** Mounted with the page: choreography, the header's scrolled state, and timer glides. */
export function MotionRuntime() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    const onScroll = () => {
      const scrolled = window.scrollY > 8;
      if (scrolled !== root.hasAttribute("data-scrolled"))
        root.toggleAttribute("data-scrolled", scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      const onAnchorClick = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !(event.target instanceof Element)
        )
          return;
        const anchor = event.target.closest<HTMLAnchorElement>('a[href*="#"]');
        if (
          !anchor ||
          anchor.hasAttribute("download") ||
          (anchor.target && anchor.target !== "_self")
        )
          return;

        let url: URL;
        let id: string;
        try {
          url = new URL(anchor.href, window.location.href);
          id = decodeURIComponent(url.hash.slice(1));
        } catch {
          return;
        }
        if (
          url.origin !== window.location.origin ||
          url.pathname !== window.location.pathname ||
          url.search !== window.location.search ||
          !id
        )
          return;
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        // Measure from the live scroll position: Lenis's own copy can lag behind
        // a restored or native scroll. scroll-padding-top clears the sticky header.
        const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
        lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - pad);
        if (window.location.hash !== url.hash)
          window.history.pushState(null, "", url.hash);
        if (target.tabIndex < 0 && !target.hasAttribute("tabindex"))
          target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      document.addEventListener("click", onAnchorClick);

      let glide: gsap.core.Tween | undefined;
      heroTimer.setGlide((from, to, paint, done, options) => {
        const proxy = { v: from };
        glide?.kill();
        paint(from);
        glide = gsap.to(proxy, {
          v: to,
          duration: options.duration ?? 0.9,
          delay: options.delay ?? 0,
          ease: options.ease ?? "power3.out",
          onUpdate: () => paint(Math.round(proxy.v)),
          onComplete: done,
          onInterrupt: done,
        });
      });
      const stopFlips = choreograph();
      return () => {
        document.removeEventListener("click", onAnchorClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        // Restore GSAP's defaults; this runtime owns the ticker configuration.
        gsap.ticker.lagSmoothing(500, 33);
        stopFlips();
        glide?.kill();
        heroTimer.setGlide(null);
      };
    });
    root.dataset.motion = "ready";
    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
