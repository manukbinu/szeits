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
import type { ProcessStep } from "@/lib/i18n/types";

gsap.registerPlugin(ScrollTrigger);

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
        className="neu-raised spotlight-card flex h-full flex-col justify-between rounded-3xl p-10"
      >
        <span className="font-display text-6xl font-bold text-gradient">{step.number}</span>
        <div>
          <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
          <p className="mt-3 text-muted">{step.description}</p>
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
      if (prefersReducedMotion()) return;
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
            scrub: 1,
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
    <section id="process" ref={sectionRef} className="relative overflow-hidden py-32">
      <div className="mx-auto mb-16 max-w-7xl px-6 lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
          {t.process.eyebrow}
        </p>
        <StaggerHeading
          before={t.process.headingBefore}
          highlight={t.process.headingHighlight}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense">
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
