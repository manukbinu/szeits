"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const tileSpans = [
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-32">
      <div className="mx-auto mb-16 max-w-7xl px-6 lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
          How We Work
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          A process built for{" "}
          <span className="text-gradient">clarity and speed.</span>
        </h2>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense"
        >
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={cardVariant}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
              }}
              className={`neu-raised spotlight-card flex flex-col justify-between rounded-3xl p-10 ${tileSpans[i]}`}
            >
              <span className="font-display text-6xl font-bold text-gradient">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
