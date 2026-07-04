"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import Magnetic from "@/components/Magnetic";

const RibbonShape = dynamic(() => import("@/components/three/RibbonShape"), {
  ssr: false,
});

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
  const { scrollYProgress } = useScroll();
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <motion.div
        style={{ y: blobOneY }}
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]"
      />
      <motion.div
        style={{ y: blobTwoY }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-lime/10 blur-[140px]"
      />

      <div className="absolute inset-0 -z-0 opacity-90">
        <RibbonShape />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="mb-6 inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
          >
            Software Company &middot; Sharjah, UAE
          </motion.p>
          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Software, <span className="text-gradient">engineered</span> for
            what&apos;s next.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg text-muted"
          >
            {siteConfig.description}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="inline-block rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                Get in Touch
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="inline-block rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-white/50"
              >
                Our Services
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
      >
        <span>Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-brand" />
      </motion.div>
    </section>
  );
}
