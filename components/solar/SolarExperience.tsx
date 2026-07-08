"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import Logo from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useDeviceCapability } from "@/lib/useDeviceCapability";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SolarScene from "./SolarScene";
import JumpRail from "./JumpRail";
import { PLANETS, type PlanetId } from "./planetData";

export default function SolarExperience({
  sections,
}: {
  sections: Record<PlanetId, ReactNode>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flightProgress = useRef(0);
  const cameraProgress = useRef(0);
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const language = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Which whole planet index we're at or mid-flight toward, and whether a
  // flight is currently in progress. Scroll input never free-runs on
  // momentum anymore — each gesture steps exactly one planet at a time and
  // must finish arriving (camera centered, panel settled) before the next
  // step is allowed to start. A fast/long scroll just queues one pending
  // step rather than skipping ahead, so a planet can never be flown past
  // without ever becoming active.
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const pendingDirection = useRef(0);

  const advance = (direction: 1 | -1) => {
    if (isAnimating.current) {
      pendingDirection.current = direction;
      return;
    }
    const next = Math.min(PLANETS.length - 1, Math.max(0, currentIndex.current + direction));
    if (next === currentIndex.current) return;
    currentIndex.current = next;
    isAnimating.current = true;
    gsap.killTweensOf(flightProgress);
    gsap.to(flightProgress, {
      current: next,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (pendingDirection.current !== 0) {
          const queued = pendingDirection.current;
          pendingDirection.current = 0;
          // Stay "isAnimating" through this dwell (don't release the gate
          // yet) so scroll input arriving during the pause queues up
          // instead of slipping through as an extra, ungated hop that
          // races the timeout below — that race was letting fast
          // continuous scrolling double-advance and skip a layer's dwell.
          setTimeout(() => {
            isAnimating.current = false;
            advance(queued);
          }, 280);
        } else {
          isAnimating.current = false;
        }
      },
    });
  };

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    // Raised from 60/40 — those were low enough that a small, unintentional
    // scroll nudge already crossed the threshold and advanced a full layer.
    // Higher thresholds require a more deliberate scroll before stepping.
    const WHEEL_THRESHOLD = 220;
    const TOUCH_THRESHOLD = 90;
    let wheelAccum = 0;

    // Panels can be taller than they look (dense grids, longer Arabic
    // text) and now scroll internally (see PlanetPanel) instead of getting
    // silently clipped. So a wheel/swipe over the active panel should
    // scroll its own content first, and only drive layer-to-layer
    // navigation once that content is already at its start/end.
    const findScrollablePanel = (target: EventTarget | null) => {
      const panel = (target as HTMLElement | null)?.closest<HTMLElement>("[data-panel-scroll]");
      return panel && panel.scrollHeight > panel.clientHeight + 1 ? panel : null;
    };

    const onWheel = (e: WheelEvent) => {
      const panel = findScrollablePanel(e.target);
      if (panel) {
        const goingForward = e.deltaY > 0;
        const atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
        const atStart = panel.scrollTop <= 1;
        if ((goingForward && !atEnd) || (!goingForward && !atStart)) {
          // Let the browser scroll the panel's own content natively.
          return;
        }
      }
      e.preventDefault();
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;
      const direction = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      advance(direction);
    };

    let touchStartY = 0;
    let touchAccum = 0;
    let scrollPanel: HTMLElement | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchAccum = 0;
      scrollPanel = findScrollablePanel(e.target);
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dy = touchStartY - y;
      touchStartY = y;

      if (scrollPanel) {
        // The outer container is touch-action:none, which blocks the
        // panel's own overflow-y-auto from ever receiving native touch
        // scrolling too — so its scroll position is driven by hand here.
        const atEnd = scrollPanel.scrollTop + scrollPanel.clientHeight >= scrollPanel.scrollHeight - 1;
        const atStart = scrollPanel.scrollTop <= 1;
        if ((dy > 0 && !atEnd) || (dy < 0 && !atStart)) {
          scrollPanel.scrollTop += dy;
          return;
        }
      }

      touchAccum += dy;
      if (Math.abs(touchAccum) < TOUCH_THRESHOLD) return;
      const direction = touchAccum > 0 ? 1 : -1;
      touchAccum = 0;
      advance(direction);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [reducedMotion]);

  const jumpTo = (index: number) => {
    if (reducedMotion) {
      setActiveIndex(index);
      return;
    }
    currentIndex.current = index;
    pendingDirection.current = 0;
    isAnimating.current = true;
    gsap.killTweensOf(flightProgress);
    gsap.to(flightProgress, {
      current: index,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  // Existing section components (Hero's CTA buttons, Footer-style links,
  // etc.) still contain plain `href="#id"` anchors from the old scrolling
  // site, unchanged per the "don't touch section internals" constraint.
  // Reinterpret them here instead of leaving them dead now that there's no
  // real page to scroll — same interception pattern the old SmoothScroll
  // component used for Lenis, just repointed at jumpTo.
  useEffect(() => {
    const idToIndex = new Map<string, number>(PLANETS.map((p, i) => [p.id, i]));
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      const id = href?.slice(1);
      if (!id || !idToIndex.has(id)) return;
      e.preventDefault();
      jumpTo(idToIndex.get(id)!);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 touch-none overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/*
        Forced to ltr regardless of locale: drei's <Html> positions its
        portal anchors with `transform: translate3d(x, y, 0)` and leaves
        `left`/`right` both auto, relying on the CSS static-position
        algorithm to place the origin at the left edge. Under `dir="rtl"`
        that algorithm resolves from the right edge instead (CSS 2.1
        10.3.7), which throws every panel's anchor off by its own width.
        The 3D layout is positioned entirely by JS/camera math, not CSS, so
        it doesn't need rtl here — PlanetPanel re-applies the real reading
        direction to the actual visible panel content below.
      */}
      <div dir="ltr" className="h-full w-full">
        <Canvas
          camera={{ position: [0, 1.9, 8], fov: 45 }}
          dpr={[1, tier === "high" ? 1.5 : 1]}
          gl={{ alpha: false, antialias: true }}
        >
          <SolarScene
            sections={sections}
            flightProgress={flightProgress}
            cameraProgress={cameraProgress}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onJump={jumpTo}
            reducedMotion={reducedMotion}
            tier={tier}
            language={language}
          />
        </Canvas>
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 lg:px-10">
        <div className="pointer-events-auto">
          <Logo />
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <JumpRail activeIndex={activeIndex} onJump={jumpTo} />

      {reducedMotion && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center">
          <div className="glass pointer-events-auto flex gap-2 rounded-full px-3 py-2">
            {PLANETS.map((planet, i) => (
              <button
                key={planet.id}
                type="button"
                onClick={() => jumpTo(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeIndex === i ? "bg-gradient-brand text-white" : "text-muted"
                }`}
              >
                {planet.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
