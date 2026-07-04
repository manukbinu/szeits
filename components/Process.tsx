"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden py-32"
    >
      <div className="mx-auto mb-16 max-w-7xl px-6 lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
          How We Work
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          A process built for{" "}
          <span className="text-gradient">clarity and speed.</span>
        </h2>
      </div>

      <div ref={trackRef} className="flex w-max gap-6 px-6 lg:px-10">
        {processSteps.map((step) => (
          <div
            key={step.number}
            className="flex h-72 w-[80vw] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-10 sm:w-[380px]"
          >
            <span className="font-display text-6xl font-bold text-gradient">
              {step.number}
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-3 text-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
