"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;
const overshoot = [0.34, 1.56, 0.64, 1] as const;

// Five distinct entrance styles cycled deterministically per character —
// deterministic (not random) so server/client render match and there's no
// hydration mismatch.
const letterVariants: Variants[] = [
  { hidden: { opacity: 0, y: -32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } },
  { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } },
  { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.65, ease } } },
  {
    hidden: { opacity: 0, rotate: -22, y: 10 },
    show: { opacity: 1, rotate: 0, y: 0, transition: { duration: 0.75, ease: overshoot } },
  },
  {
    hidden: { opacity: 0, scale: 0.35 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: overshoot } },
  },
];

export default function StaggerText({
  text,
  className = "",
  stagger = 0.05,
  delay = 0,
  trigger = "mount",
  viewportAmount = 0.4,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  /** "mount" plays once on render (e.g. hero load-in); "scroll" plays once when scrolled into view. */
  trigger?: "mount" | "scroll";
  viewportAmount?: number;
}) {
  const words = text.split(" ");
  let charIndex = 0;

  const orchestration = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const scrollProps =
    trigger === "scroll"
      ? { whileInView: "show", viewport: { once: true, amount: viewportAmount } }
      : { animate: "show" };

  return (
    <motion.span
      role="text"
      aria-label={text}
      initial="hidden"
      {...scrollProps}
      variants={orchestration}
      className={`inline ${className}`}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-flex whitespace-nowrap">
            {Array.from(word).map((char, ci) => {
              const variant = letterVariants[charIndex % letterVariants.length];
              charIndex += 1;
              return (
                <motion.span
                  key={ci}
                  aria-hidden="true"
                  variants={variant}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}
