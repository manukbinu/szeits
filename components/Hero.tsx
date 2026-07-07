"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Magnetic from "@/components/Magnetic";
import TerminalWindow from "@/components/TerminalWindow";

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
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24 pb-16"
    >
      <motion.div
        style={{ y: blobOneY }}
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]"
      />
      <motion.div
        style={{ y: blobTwoY }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-lime/10 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="neu-chip mb-6 inline-block rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {t.hero.headingBefore}
            <span className="text-gradient">{t.hero.headingHighlight}</span>
            {t.hero.headingAfter}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg text-muted"
          >
            {t.siteConfig.description}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="btn-primary shine bg-gradient-brand inline-block rounded-full px-7 py-3.5 text-sm font-semibold"
              >
                {t.hero.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="neu-btn inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-foreground"
              >
                {t.hero.ctaSecondary}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 flex min-w-0 justify-center lg:justify-end"
        >
          <TerminalWindow />
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative z-10 mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-5 px-6 sm:grid-cols-3 lg:px-10"
      >
        {t.hero.kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass glass-hover rounded-2xl px-5 py-4"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {kpi.label}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-gradient">
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
      >
        <span>{t.hero.scroll}</span>
        <span className="h-10 w-px animate-pulse bg-gradient-brand" />
      </motion.div>
    </section>
  );
}
