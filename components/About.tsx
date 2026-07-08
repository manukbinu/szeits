"use client";

import { motion } from "framer-motion";
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

  return (
    <section id="about" className="relative py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense"
        >
          <motion.div
            variants={tileVariant}
            className="neu-raised rounded-3xl p-6 lg:col-span-2 lg:row-span-2"
          >
            <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              <ChapterTag number="03" />
              {t.about.eyebrow}
            </p>
            <StaggerHeading
              before={t.about.headingBefore}
              highlight={t.about.headingHighlight}
              after={t.about.headingAfter}
              className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
            />
            <p className="mt-3 max-w-xl text-sm text-muted">{t.about.body}</p>
          </motion.div>

          <motion.div
            variants={tileVariant}
            className="neu-raised flex items-center rounded-3xl p-6 lg:col-span-2 lg:row-span-1"
          >
            <p className="font-display text-base leading-snug">&ldquo;{t.about.quote}&rdquo;</p>
          </motion.div>

          {t.about.highlights.map((h, i) => (
            <motion.div
              key={i}
              variants={tileVariant}
              className="neu-chip flex flex-col justify-center rounded-2xl px-4 py-3 lg:col-span-1"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                {h.label}
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-gradient">
                {h.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
