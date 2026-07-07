"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useGSAP(
    () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const active = isFinePointer && !prefersReducedMotion();
      setEnabled(active);
      if (!active) return;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      const setDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
      const setDotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });
      const setRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
      const setRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

      const moveHandler = (e: MouseEvent) => {
        setDot(e.clientX);
        setDotY(e.clientY);
        setRing(e.clientX);
        setRingY(e.clientY);
      };
      window.addEventListener("mousemove", moveHandler);

      const overHandler = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest("a, button, [data-cursor-hover]");
        setHovering(!!target);
      };
      window.addEventListener("mouseover", overHandler);

      return () => {
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseover", overHandler);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={enabled ? "" : "hidden"}>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-lime"
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-green transition-[width,height,opacity] duration-200 ${
          hovering ? "h-12 w-12 opacity-100" : "h-8 w-8 opacity-60"
        }`}
      />
    </div>
  );
}
