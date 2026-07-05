"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div variants={fadeUp} className="glass glass-hover overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="neu-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#faqGradient)" strokeWidth="1.5" className="h-4 w-4">
            <defs>
              <linearGradient id="faqGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop offset="100%" stopColor="var(--brand-lime)" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.66.26-1.4.8-1.4 1.67v.5M12 17h.01" />
          </svg>
        </span>
        <span className="flex-1 font-display text-lg font-semibold">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-light text-muted"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 pl-[4.75rem] text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
            FAQ
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Questions, <span className="text-gradient">answered.</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-4"
        >
          {faqItems.map((item, i) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
