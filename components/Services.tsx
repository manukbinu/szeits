"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ServiceItem } from "@/lib/i18n/types";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";
import { useTilt } from "@/lib/useTilt";

const icons: Record<string, React.ReactNode> = {
  code: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 9l-4 4 4 4M16 9l4 4-4 4M13.5 6l-3 14"
    />
  ),
  layers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5"
    />
  ),
  sparkles: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l1.8 4.9L19 9.5l-5.2 1.6L12 16l-1.8-4.9L5 9.5l5.2-1.6L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"
    />
  ),
  cloud: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1-.5 7.98"
    />
  ),
};

function ServiceCard({ service }: { service: ServiceItem }) {
  const tilt = useTilt(6);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
    tilt.onMouseMove(e);
  };

  return (
    <div style={{ perspective: 800 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        className="glass spotlight-card flex h-full flex-col justify-center rounded-2xl p-6 sm:rounded-3xl sm:p-8"
      >
        <div className="glass flex h-11 w-11 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#svcGradient)"
            strokeWidth="1.5"
            className="h-5 w-5 sm:h-7 sm:w-7"
          >
            <defs>
              <linearGradient id="svcGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--gold)" />
              </linearGradient>
            </defs>
            {icons[service.icon]}
          </svg>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold sm:text-2xl">{service.title}</h3>
        <p className="mt-2 text-sm text-muted sm:text-base">{service.description}</p>
      </motion.div>
    </div>
  );
}

// Interactive carousel: native scroll-snap for touch/trackpad, plus a
// pointer-drag handler so desktop mouse users can grab and drag it too.
function ServiceCarousel({ items }: { items: ServiceItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!dragging.current || !el) return;
    el.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.children.length) return;
    const cardWidth = el.scrollWidth / el.children.length;
    const idx = Math.round(Math.abs(el.scrollLeft) / cardWidth);
    setActive(Math.min(items.length - 1, Math.max(0, idx)));
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 active:cursor-grabbing sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active === i}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-gradient-accent" : "w-2 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <motion.div
        style={{ y: orbY }}
        className="glow-orb pointer-events-none absolute -top-10 end-0 h-80 w-80 rounded-full bg-accent/20"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl sm:mb-14 lg:mb-16">
          <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
            <ChapterTag number="01" />
            {t.services.eyebrow}
          </p>
          <StaggerHeading
            before={t.services.headingBefore}
            highlight={t.services.headingHighlight}
            className="text-display-md font-bold tracking-tight"
          />
        </div>

        <ServiceCarousel items={t.services.items} />
      </div>
    </section>
  );
}
