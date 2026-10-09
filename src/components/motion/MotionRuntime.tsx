"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroTimer } from "@/hooks/useDemoTimer";
import { formatDuration } from "@/lib/preview";
import {
  breathe,
  syncBreathing,
  count,
  draw,
  flipOnChange,
  grow,
  GENTLE,
  nodes,
  lineReveal,
  rollDigits,
  tilt,
  reveal,
  trigger,
  vars,
} from "./engine";
import { MOTION, registerEases } from "./tokens";

function choreograph(onDrain: (callback: () => void) => void, playGhost: boolean) {
  const intro = gsap.timeline({ delay: 0.9 });
  intro
    .add(lineReveal("#hero-title"), 0)
    .from(".hero .eyebrow", vars("fade"), 0)
    .from(".intro-right > *", vars("rise", { stagger: GENTLE.stagger }), 0.25)
    .from(".hero .scene-intro", vars("rise", { y: 8 }), 0.35)
    .from(".scene-caption", vars("fade"), 1.2);
  let stopRoll = () => {};
  let rollFrame = 0;
  let disposed = false;
  onDrain(() => {
    // React commits the final timer text before slots start observing changes.
    rollFrame = requestAnimationFrame(() => {
      if (!disposed) stopRoll = rollDigits("#menu-time, #timer");
    });
  });
  heroTimer.animate(heroTimer.cycle, heroTimer.start, {
    duration: GENTLE.count, delay: 1.6, ease: "power2.inOut",
  });
  const pauseBtn = document.getElementById("pause-btn");
  const isPaused = () => pauseBtn?.getAttribute("aria-pressed") === "true";
  const focus = breathe(".hero .status-dot", intro.delay() + intro.duration(), isPaused);
  let settle: gsap.core.Tween | undefined;
  const syncPause = () => {
    settle?.kill();
    if (focus) syncBreathing(focus, isPaused());
    if (isPaused()) {
      settle = gsap.to(".hero .status-dot", { opacity: 1, duration: MOTION.ui, ease: MOTION.release });
    }
  };
  const pauseObs = new MutationObserver(syncPause);
  if (pauseBtn) pauseObs.observe(pauseBtn, { attributes: true, attributeFilter: ["aria-pressed"] });
  syncPause();
  const ghost = document.querySelector<SVGElement>(".cursor-ghost");
  const timer = document.querySelector<HTMLElement>(".menu-timer");
  if (playGhost && ghost && timer) {
    const g = ghost.getBoundingClientRect();
    const t = timer.getBoundingClientRect();
    intro
      .to(ghost, { opacity: 1, duration: MOTION.micro }, "+=0.2")
      .to(ghost, { x: t.left + t.width / 2 - g.left, y: t.top + t.height / 2 - g.top, duration: 1, ease: MOTION.settle })
      .to(ghost, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 })
      .to(ghost, { opacity: 0, duration: MOTION.ui });
  }

  reveal(".rule-lead", "rise", { trigger: ".rule" });
  reveal(".unit", "rise", { trigger: ".rule" });
  nodes(".unit b").forEach((el, i) =>
    count(el, { delay: 0.2 + i * 0.15, scrollTrigger: trigger(".rule") }),
  );

  grow(".unit-rule", "x", { scrollTrigger: trigger(".rule"), delay: 0.3 });
  gsap.timeline({ scrollTrigger: trigger(".rule") }).add(draw(".unit-glyph circle, .unit-glyph path"), 0.2);

  lineReveal("#watch-title", { scrollTrigger: trigger(".watch", "top 75%") });
  reveal(".watch-copy > :not(h2)", "rise", { trigger: ".watch", start: "top 75%" });
  reveal(".promo-stage", "depth", { trigger: ".promo-stage" });
  reveal(".promo-bar", "fade", { trigger: ".promo-stage" });

  const problem = document.querySelector<HTMLElement>(".problem");
  const clock = problem?.querySelector<HTMLElement>(".problem-time");
  const restoreProblemClock = () => {
    if (clock) clock.textContent = formatDuration(2832);
  };
  const problemMedia = gsap.matchMedia();
  problemMedia.add("(min-width: 1024px)", () => {
    if (!problem) return;
    gsap.fromTo(problem, { "--glare": 0 }, {
      "--glare": 1,
      ease: "none",
      scrollTrigger: { trigger: problem, start: "top top", end: "bottom bottom", scrub: true },
    });
    if (clock) {
      const proxy = { seconds: 2790 };
      gsap.to(proxy, {
        seconds: 2832,
        ease: "none",
        scrollTrigger: { trigger: problem, start: "top top", end: "bottom bottom", scrub: true },
        onUpdate: () => { clock.textContent = formatDuration(proxy.seconds); },
      });
    }
    return restoreProblemClock;
  });
  problemMedia.add("(max-width: 1023px)", () => {
    if (!problem) return;
    restoreProblemClock();
    gsap.fromTo(problem, { "--glare": 0 }, {
      "--glare": 1,
      duration: 2.4,
      ease: MOTION.settle,
      scrollTrigger: trigger(problem, "top 60%"),
    });
  });
  lineReveal("#problem-title", { scrollTrigger: trigger(".problem", "top 70%") });

  lineReveal("#details-title", { scrollTrigger: trigger("#details", "top 75%") });
  reveal("#details .section-copy > :not(h2)", "rise", { trigger: "#details" });
  grow("#details .horizon", "x", { scrollTrigger: trigger("#details", "top 85%"), duration: 1.6, ease: MOTION.settle });
  grow(".footer-horizon", "x", { scrollTrigger: trigger(".site-footer", "top 95%"), duration: 1.6, ease: MOTION.settle });
  gsap
    .timeline({ scrollTrigger: trigger("#details figure", "top 85%") })
    .from("#details .toast", vars("slide"))
    .from("#details .figure-label", vars("fade"), "<0.3");

  lineReveal("#product-title", { scrollTrigger: trigger("#product", "top 75%") });
  const stage = document.querySelector<HTMLElement>(".product-stage");
  const list = document.querySelector<HTMLElement>(".product-rows");
  const productRows = nodes(".product-row");
  const productScreens = nodes(".product-shot, .product-inline");
  const restoreProduct = () => {
    if (stage) stage.dataset.active = "0";
    list?.removeAttribute("data-active");
    productRows.forEach((row) => row.removeAttribute("data-current"));
    productScreens.forEach((el) => el.removeAttribute("data-seen"));
  };
  const productMedia = gsap.matchMedia();
  productMedia.add("(min-width: 1024px)", () => {
    productRows.forEach((row) => {
      const activate = () => {
        if (!stage || !list) return;
        stage.dataset.active = row.dataset.row;
        list.dataset.active = "";
        productRows.forEach((item) => item.toggleAttribute("data-current", item === row));
        stage.querySelector<HTMLElement>(`[data-shot="${row.dataset.row}"]`)?.setAttribute("data-seen", "");
      };
      ScrollTrigger.create({
        trigger: row,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => { if (self.isActive) activate(); },
        onRefresh: (self) => { if (self.isActive) activate(); },
      });
    });
    return restoreProduct;
  });
  productMedia.add("(max-width: 1023px)", () => {
    nodes(".product-inline").forEach((el) =>
      ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => el.setAttribute("data-seen", "") }),
    );
    return restoreProduct;
  });

  lineReveal("#habit-title", { scrollTrigger: trigger("#habit", "top 75%") });
  reveal(".insights-copy > :not(h2)", "rise", { trigger: "#habit" });
  const habit = trigger(".insights-window", "top 60%");
  count(".insights-84", { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  const values = nodes(".insights-window .stat-value");
  count(values[0], { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  count(values[1], { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  count(values[2], { duration: 2, ease: MOTION.settle, format: (v) => `${Math.round(v)}%`, scrollTrigger: habit });
  grow(".insights-window .stat-bar", "y", { stagger: 0.06, scrollTrigger: habit });
  gsap.from(".insights-window .stat-heat", {
    opacity: 0,
    duration: MOTION.ui,
    ease: MOTION.settle,
    clearProps: "opacity",
    // Column-major cells reveal along diagonals over about 900 ms.
    stagger: (i) => (Math.floor(i / 7) + (i % 7)) * (0.9 / 31),
    scrollTrigger: habit,
  });

  lineReveal("#download-title", { scrollTrigger: trigger("#download", "top 75%") });
  reveal(".download-intro > :not(h2)", "rise", { trigger: "#download" });
  reveal(".download-controls", "depth");
  const stopIcon = tilt(".app-icon-face", { max: { x: 6, y: 6 }, depth: 0 });

  // One planar object; the untransformed scene supplies stable pointer bounds.
  const tiltMedia = gsap.matchMedia();
  tiltMedia.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () =>
    tilt(".hero .desktop", { max: { x: 2, y: 2 }, depth: 0, perspective: 12000, bounds: ".hero .scene" }),
  );
  const stopFlips = flipOnChange("#seconds-tens, #seconds-ones");
  return () => {
    disposed = true;
    onDrain(() => {});
    cancelAnimationFrame(rollFrame);
    stopRoll();
    pauseObs.disconnect();
    settle?.kill();
    focus?.kill();
    intro.kill();
    gsap.set(".hero .status-dot", { clearProps: "opacity" });
    gsap.set(".cursor-ghost", { clearProps: "transform,opacity" });
    tiltMedia.revert();
    problemMedia.revert();
    productMedia.revert();
    restoreProduct();
    // Text writes are outside GSAP's style restoration. CSS owns the final glare.
    restoreProblemClock();
    problem?.style.removeProperty("--glare");
    stopFlips();
    stopIcon();
  };
}

/** Tracks present beats and remeasures the underline after layout changes. */
function navIndicator() {
  const bar = document.querySelector<HTMLElement>(".nav-links");
  if (!bar) return () => {};
  const links = Array.from(bar.querySelectorAll<HTMLElement>("[data-nav]"));
  const clear = () => {
    delete bar.dataset.active;
    links.forEach((link) => link.removeAttribute("aria-current"));
  };
  const measure = () => {
    const link = links.find((item) => item.dataset.nav === bar.dataset.active);
    if (!link) return;
    bar.style.setProperty("--nav-x", `${link.offsetLeft}px`);
    bar.style.setProperty("--nav-w", `${link.offsetWidth}`);
  };
  const triggers = links.flatMap((link) => {
    const section = document.getElementById(link.dataset.nav ?? "");
    if (!section) return [];
    const activate = () => {
      bar.dataset.active = link.dataset.nav;
      links.forEach((item) => item === link ? item.setAttribute("aria-current", "location") : item.removeAttribute("aria-current"));
      measure();
    };
    return [ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) activate();
        else if (bar.dataset.active === link.dataset.nav) clear();
      },
      onRefresh: (self) => { if (self.isActive) activate(); },
    })];
  });
  const observer = new ResizeObserver(measure);
  observer.observe(bar);
  links.forEach((link) => observer.observe(link));
  return () => {
    observer.disconnect();
    triggers.forEach((item) => item.kill());
    clear();
    bar.style.removeProperty("--nav-x");
    bar.style.removeProperty("--nav-w");
  };
}

/** Mounted with the page: choreography, the header's scrolled state, and timer glides. */
export function MotionRuntime() {
  const ghostPlayed = useRef(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    registerEases(gsap);
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
      let drainComplete = () => {};
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
          onComplete: () => {
            done();
            const complete = drainComplete;
            drainComplete = () => {};
            complete();
          },
          onInterrupt: done,
        });
      });
      const stopChoreography = choreograph((callback) => { drainComplete = callback; }, !ghostPlayed.current);
      ghostPlayed.current = true;
      const stopNav = navIndicator();
      return () => {
        document.removeEventListener("click", onAnchorClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        // Restore GSAP's defaults; this runtime owns the ticker configuration.
        gsap.ticker.lagSmoothing(500, 33);
        stopChoreography();
        stopNav();
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
