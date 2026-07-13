"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const tileVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [-70, 70]);

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <motion.div
        style={{ y: orbY }}
        className="glow-orb pointer-events-none absolute top-0 start-1/4 h-72 w-72 rounded-full bg-accent/20"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense"
        >
          <motion.div
            variants={tileVariant}
            className="glass-strong rounded-3xl p-6 sm:p-8 lg:col-span-2 lg:row-span-2"
          >
            <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              <ChapterTag number="03" />
              {t.about.eyebrow}
            </p>
            <StaggerHeading
              before={t.about.headingBefore}
              highlight={t.about.headingHighlight}
              after={t.about.headingAfter}
              className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            />
            <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">{t.about.body}</p>
          </motion.div>

          <motion.div
            variants={tileVariant}
            className="glass flex items-center rounded-3xl p-6 sm:p-8 lg:col-span-2 lg:row-span-1"
          >
            <p className="font-display text-lg leading-snug sm:text-xl">
              &ldquo;{t.about.quote}&rdquo;
            </p>
          </motion.div>

          {t.about.highlights.map((h, i) => (
            <motion.div
              key={i}
              variants={tileVariant}
              className="glass flex flex-col justify-center rounded-2xl px-4 py-3 sm:px-6 sm:py-5 lg:col-span-1"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-muted">{h.label}</p>
              <p className="mt-1 font-display text-sm font-semibold text-gradient sm:text-base">
                {h.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
