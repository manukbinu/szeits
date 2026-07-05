"use client";

import { motion } from "framer-motion";

type Token = { text: string; color?: string };
type Line = Token[];

const codeLines: Line[] = [
  [
    { text: "const ", color: "var(--brand-blue)" },
    { text: "szeits", color: "var(--brand-green)" },
    { text: " = {" },
  ],
  [
    { text: "  builds" },
    { text: ": " },
    { text: '["web", "mobile", "AI", "cloud"]', color: "var(--brand-lime)" },
    { text: "," },
  ],
  [
    { text: "  based" },
    { text: ": " },
    { text: '"Dubai, UAE"', color: "var(--brand-lime)" },
    { text: "," },
  ],
  [
    { text: "  mission" },
    { text: ": " },
    { text: "() => ", color: "var(--brand-blue)" },
    { text: '"ship products that scale"', color: "var(--brand-lime)" },
  ],
  [{ text: "};" }],
  [{ text: "// engineered for what's next", color: "var(--muted)" }],
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
};

const lineVariant = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function TerminalWindow() {
  return (
    <div
      className="w-full min-w-0 max-w-lg rounded-2xl border p-3"
      style={{
        background: "#0d1117",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 20px 40px rgba(15,23,42,.18)",
      }}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#27c93f" }} />
        <span
          className="ml-3 rounded-full px-3 py-1 text-xs"
          style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
        >
          szeits.ts
        </span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="overflow-x-auto rounded-xl p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-sm"
        style={{ background: "#0a0c10" }}
      >
        {codeLines.map((line, i) => (
          <motion.div key={i} variants={lineVariant} className="flex">
            <span className="mr-4 w-4 shrink-0 select-none" style={{ color: "rgba(156,163,175,0.4)" }}>
              {i + 1}
            </span>
            <span className="whitespace-pre">
              {line.map((token, j) => (
                <span key={j} style={{ color: token.color ?? "#e5e7eb" }}>
                  {token.text}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
        <motion.div variants={lineVariant} className="flex">
          <span className="mr-4 w-4 shrink-0 select-none" style={{ color: "rgba(156,163,175,0.4)" }}>
            {codeLines.length + 1}
          </span>
          <span className="inline-block h-4 w-2 animate-blink bg-brand-lime" />
        </motion.div>
      </motion.div>
    </div>
  );
}
