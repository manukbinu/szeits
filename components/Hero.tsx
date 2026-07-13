"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Magnetic from "@/components/Magnetic";
import TerminalWindow from "@/components/TerminalWindow";
import StaggerText from "@/components/StaggerText";
import ChapterTag from "@/components/ChapterTag";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIntroDone } from "@/components/SiteChrome";

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
  const reducedMotion = useReducedMotion();
  const introDone = useIntroDone();
  const sectionRef = useRef<HTMLElement>(null);

  const beforeDelay = HEADING_BASE_DELAY;
  const highlightDelay = beforeDelay + letterCount(t.hero.headingBefore) * HEADING_STAGGER;
  const afterDelay = highlightDelay + letterCount(t.hero.headingHighlight) * HEADING_STAGGER;
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  // Subtle mouse-follow parallax on the ambient glow orbs.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const parallaxX = useSpring(mx, { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(my, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.03);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.03);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <motion.div
        style={{ y: blobOneY, x: parallaxX }}
        className="glow-orb pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-accent/30"
      />
      <motion.div
        style={{ y: blobTwoY, x: parallaxY }}
        className="glow-orb pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/20"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 sm:gap-14 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
          >
            <ChapterTag number="00" />
            {t.hero.eyebrow}
          </motion.p>
          {locale === "en" ? (
            <h1 className="text-display-lg font-bold tracking-tight">
              <StaggerText
                text={t.hero.headingBefore}
                delay={beforeDelay}
                stagger={HEADING_STAGGER}
                play={introDone}
                variant="flip"
              />
              <StaggerText
                text={t.hero.headingHighlight}
                delay={highlightDelay}
                stagger={HEADING_STAGGER}
                className="text-gradient"
                play={introDone}
                variant="flip"
              />
              {t.hero.headingAfter && (
                <StaggerText
                  text={t.hero.headingAfter}
                  delay={afterDelay}
                  stagger={HEADING_STAGGER}
                  play={introDone}
                  variant="flip"
                />
              )}
            </h1>
          ) : (
            <motion.h1 variants={item} className="text-display-lg font-bold tracking-tight">
              {t.hero.headingBefore}
              <span className="text-gradient">{t.hero.headingHighlight}</span>
              {t.hero.headingAfter}
            </motion.h1>
          )}
          <motion.p variants={item} className="mt-6 max-w-lg text-base text-muted sm:text-lg">
            {t.siteConfig.description}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="btn-primary shine bg-gradient-accent inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                {t.hero.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="btn-ghost inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                {t.hero.ctaSecondary}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="relative flex min-w-0 justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 animate-float"
          >
            <TerminalWindow />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate={introDone ? "show" : "hidden"}
        variants={container}
        className="relative z-10 mx-auto mt-12 grid max-w-7xl grid-cols-3 gap-3 px-6 sm:mt-16 sm:gap-6 lg:px-10"
      >
        {t.hero.kpis.map((kpi, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass rounded-xl px-3 py-3 sm:rounded-2xl sm:px-5 sm:py-4"
          >
            <p className="truncate text-[10px] uppercase tracking-[0.1em] text-muted sm:text-xs sm:tracking-[0.15em]">
              {kpi.label}
            </p>
            <p className="mt-1 truncate font-display text-sm font-semibold text-gradient sm:text-xl">
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={introDone ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
      >
        <span>{t.hero.scroll}</span>
        <motion.span
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
