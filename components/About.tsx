"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const highlights = [
  { label: "Based in", value: "Sharjah, UAE" },
  { label: "Focus", value: "Web, AI & Cloud" },
  { label: "Approach", value: "Built to scale" },
];

export default function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
            About SZEITS
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            A software company built for the region&apos;s{" "}
            <span className="text-gradient">next decade.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Based in Sharjah, United Arab Emirates, SZEITS partners with
            ambitious businesses to design, build, and scale digital
            products &mdash; from custom software and mobile apps to AI-driven
            automation and cloud infrastructure. We combine engineering rigor
            with a design-first mindset to ship products that hold up under
            real-world growth.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="relative flex flex-col justify-center gap-4"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-green/20 blur-[100px]" />
            <p className="font-display text-2xl leading-snug">
              &ldquo;We build the software layer that lets businesses in the
              UAE move faster than their market.&rdquo;
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.label}>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">
                    {h.label}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-gradient">
                    {h.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
