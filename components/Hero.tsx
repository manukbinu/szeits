"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Magnetic from "@/components/Magnetic";
import TerminalWindow from "@/components/TerminalWindow";
import StaggerText from "@/components/StaggerText";
import ChapterTag from "@/components/ChapterTag";

const HEADING_STAGGER = 0.06;
const HEADING_BASE_DELAY = 0.32;

function letterCount(text: string) {
  return text.replace(/\s/g, "").length;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  const { t, locale } = useLanguage();
  const { scrollYProgress } = useScroll();

  const beforeDelay = HEADING_BASE_DELAY;
  const highlightDelay = beforeDelay + letterCount(t.hero.headingBefore) * HEADING_STAGGER;
  const afterDelay =
    highlightDelay + letterCount(t.hero.headingHighlight) * HEADING_STAGGER;
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden pt-4 pb-4 sm:pt-10 sm:pb-10"
    >
      <motion.div
        style={{ y: blobOneY }}
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]"
      />
      <motion.div
        style={{ y: blobTwoY }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-lime/10 blur-[140px]"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-4 px-6 sm:gap-8 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="neu-chip mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
          >
            <ChapterTag number="00" />
            {t.hero.eyebrow}
          </motion.p>
          {locale === "en" ? (
            <h1 className="text-2xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              <StaggerText text={t.hero.headingBefore} delay={beforeDelay} stagger={HEADING_STAGGER} />
              <StaggerText
                text={t.hero.headingHighlight}
                delay={highlightDelay}
                stagger={HEADING_STAGGER}
                className="text-gradient"
              />
              {t.hero.headingAfter && (
                <StaggerText text={t.hero.headingAfter} delay={afterDelay} stagger={HEADING_STAGGER} />
              )}
            </h1>
          ) : (
            <motion.h1
              variants={item}
              className="text-2xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
            >
              {t.hero.headingBefore}
              <span className="text-gradient">{t.hero.headingHighlight}</span>
              {t.hero.headingAfter}
            </motion.h1>
          )}
          <motion.p
            variants={item}
            className="mt-3 max-w-lg text-sm text-muted"
          >
            {t.siteConfig.description}
          </motion.p>
          <motion.div variants={item} className="mt-6 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="btn-primary shine bg-gradient-brand inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                {t.hero.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="neu-btn inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-foreground"
              >
                {t.hero.ctaSecondary}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="relative hidden min-w-0 justify-center sm:flex lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10"
          >
            <TerminalWindow />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative z-10 mx-auto mt-4 grid max-w-7xl grid-cols-3 gap-2 px-6 sm:mt-6 sm:gap-4 lg:px-10"
      >
        {t.hero.kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass glass-hover rounded-xl px-2 py-2 sm:rounded-2xl sm:px-4 sm:py-3"
          >
            <p className="truncate text-[9px] uppercase tracking-[0.1em] text-muted sm:text-xs sm:tracking-[0.15em]">
              {kpi.label}
            </p>
            <p className="mt-1 truncate font-display text-[11px] font-semibold text-gradient sm:text-sm">
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
