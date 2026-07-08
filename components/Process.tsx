"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useTilt } from "@/lib/useTilt";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";
import type { ProcessStep } from "@/lib/i18n/types";

gsap.registerPlugin(ScrollTrigger);

// The solar-system experience renders this section inside a fixed,
// non-scrolling panel — there's no real page scroll left for ScrollTrigger's
// pin+scrub to hook into there, and pinning anyway just reserves a huge
// unused spacer. Skip the scroll-driven reveal (cards show at their default
// visible state) whenever the document itself isn't actually scrollable.
function hasScrollableDocument() {
  if (typeof document === "undefined") return true;
  return document.documentElement.scrollHeight > document.documentElement.clientHeight + 4;
}

const tileSpans = [
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

function ProcessCard({
  step,
  span,
  cardRef,
}: {
  step: ProcessStep;
  span: string;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const tilt = useTilt(6);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
    tilt.onMouseMove(e);
  };

  return (
    <div ref={cardRef} style={{ perspective: 800 }} className={span}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        className="neu-raised spotlight-card flex h-full flex-col justify-between rounded-2xl p-3 sm:rounded-3xl sm:p-4"
      >
        <span className="font-display text-lg font-bold text-gradient sm:text-2xl">{step.number}</span>
        <div>
          <h3 className="font-display text-xs font-semibold sm:text-base">{step.title}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] text-muted sm:line-clamp-none sm:text-xs">{step.description}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Process() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  cardsRef.current = [];

  useGSAP(
    () => {
      if (prefersReducedMotion() || !hasScrollableDocument()) return;
      const cards = cardsRef.current.filter((el): el is HTMLDivElement => !!el);
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      // Desktop/tablet-landscape: pin the section and scrub each step in as
      // the user scrolls, so the bento grid reveals in sequence.
      mm.add("(min-width: 1024px)", () => {
        gsap.set(cards, { opacity: 0, y: 60 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${cards.length * 300}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        cards.forEach((card, i) => {
          tl.to(card, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, i);
        });
      });

      // Mobile/tablet: skip the scroll-jack, just a lighter staggered fade-in.
      mm.add("(max-width: 1023px)", () => {
        gsap.set(cards, { opacity: 0, y: 30 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [t] }
  );

  return (
    <section id="process" ref={sectionRef} className="relative overflow-hidden py-6 sm:py-10 lg:py-12">
      <div className="mx-auto mb-4 max-w-7xl px-6 sm:mb-6 lg:mb-8 lg:px-10">
        <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
          <ChapterTag number="02" />
          {t.process.eyebrow}
        </p>
        <StaggerHeading
          before={t.process.headingBefore}
          highlight={t.process.headingHighlight}
          className="text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-flow-dense">
          {t.process.steps.map((step, i) => (
            <ProcessCard
              key={step.number}
              step={step}
              span={tileSpans[i]}
              cardRef={(el) => {
                cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
