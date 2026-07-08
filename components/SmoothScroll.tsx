"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Reduced-motion users get native (instant) scrolling; ScrollTrigger
    // still works off the browser's own scroll events without Lenis.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const anchorClickHandler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        // Lenis's configured duration is tuned for short wheel-throw distances;
        // long anchor jumps (e.g. "Home" from far down the page) need a longer
        // duration too, or they cover thousands of pixels in ~1s and blow
        // through pinned/scroll-triggered sections too fast to settle cleanly.
        const distance = Math.abs(el.getBoundingClientRect().top - 80);
        const duration = Math.min(2.2, Math.max(1.1, distance / 2200));
        lenis.scrollTo(el as HTMLElement, { offset: -80, duration });
      }
    };
    document.addEventListener("click", anchorClickHandler);

    return () => {
      document.removeEventListener("click", anchorClickHandler);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
