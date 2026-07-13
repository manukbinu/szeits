"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTilt } from "@/lib/useTilt";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";
import type { ProcessStep } from "@/lib/i18n/types";

const tileSpans = [
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function ProcessCard({ step, span }: { step: ProcessStep; span: string }) {
  const tilt = useTilt(6);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
    tilt.onMouseMove(e);
  };

  return (
    <motion.div variants={cardVariant} style={{ perspective: 800 }} className={span}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        className="glass-strong spotlight-card flex h-full flex-col justify-between rounded-2xl p-5 sm:rounded-3xl sm:p-7"
      >
        <span className="font-display text-2xl font-bold text-gradient sm:text-4xl">{step.number}</span>
        <div>
          <h3 className="font-display text-lg font-semibold sm:text-xl">{step.title}</h3>
          <p className="mt-2 text-sm text-muted sm:text-base">{step.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Process() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="process" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <motion.div
        style={{ y: orbY }}
        className="glow-orb pointer-events-none absolute -top-16 start-0 h-72 w-72 rounded-full bg-gold/15"
      />
      <div className="relative mx-auto mb-10 max-w-7xl px-6 sm:mb-14 lg:mb-16 lg:px-10">
        <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
          <ChapterTag number="02" />
          {t.process.eyebrow}
        </p>
        <StaggerHeading
          before={t.process.headingBefore}
          highlight={t.process.headingHighlight}
          className="text-display-md font-bold tracking-tight"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-flow-dense"
        >
          {t.process.steps.map((step, i) => (
            <ProcessCard key={step.number} step={step} span={tileSpans[i]} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
