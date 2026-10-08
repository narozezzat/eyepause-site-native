"use client";

import { useEffect } from "react";
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
