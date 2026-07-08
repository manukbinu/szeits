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
  const velocity = useRef(0);
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const language = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      gsap.killTweensOf(flightProgress);
      velocity.current += e.deltaY * 0.0026;
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      gsap.killTweensOf(flightProgress);
      velocity.current += (touchStartY - y) * 0.012;
      touchStartY = y;
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
    velocity.current = 0;
    gsap.killTweensOf(flightProgress);
    gsap.to(flightProgress, {
      current: index,
      duration: 0.9,
      ease: "power2.inOut",
    });
  };

  // Existing section components (Hero's CTA buttons, Footer-style links,
  // etc.) still contain plain `href="#id"` anchors from the old scrolling
  // site, unchanged per the "don't touch section internals" constraint.
  // Reinterpret them here instead of leaving them dead now that there's no
  // real page to scroll — same interception pattern the old SmoothScroll
  // component used for Lenis, just repointed at jumpTo.
  useEffect(() => {
    const idToIndex = new Map(PLANETS.map((p, i) => [p.id, i]));
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
      <Canvas
        camera={{ position: [0, 1.9, 8], fov: 45 }}
        dpr={[1, tier === "high" ? 1.5 : 1]}
        gl={{ alpha: false, antialias: true }}
      >
        <SolarScene
          sections={sections}
          flightProgress={flightProgress}
          velocity={velocity}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          onJump={jumpTo}
          reducedMotion={reducedMotion}
          tier={tier}
          language={language}
        />
      </Canvas>

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
