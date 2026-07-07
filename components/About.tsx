"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import StaggerHeading from "@/components/StaggerHeading";

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

  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense"
        >
          <motion.div
            variants={tileVariant}
            className="neu-raised rounded-3xl p-10 lg:col-span-2 lg:row-span-2"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              {t.about.eyebrow}
            </p>
            <StaggerHeading
              before={t.about.headingBefore}
              highlight={t.about.headingHighlight}
              after={t.about.headingAfter}
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
            />
            <p className="mt-6 max-w-xl text-lg text-muted">{t.about.body}</p>
          </motion.div>

          <motion.div
            variants={tileVariant}
            className="neu-raised flex items-center rounded-3xl p-10 lg:col-span-2 lg:row-span-1"
          >
            <p className="font-display text-2xl leading-snug">&ldquo;{t.about.quote}&rdquo;</p>
          </motion.div>

          {t.about.highlights.map((h) => (
            <motion.div
              key={h.label}
              variants={tileVariant}
              className="neu-chip flex flex-col justify-center rounded-2xl px-5 py-4 lg:col-span-1"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                {h.label}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-gradient">
                {h.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
