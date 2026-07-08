"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ServiceItem } from "@/lib/i18n/types";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";
import { useTilt } from "@/lib/useTilt";

const icons: Record<string, React.ReactNode> = {
  code: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 9l-4 4 4 4M16 9l4 4-4 4M13.5 6l-3 14"
    />
  ),
  layers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5"
    />
  ),
  sparkles: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l1.8 4.9L19 9.5l-5.2 1.6L12 16l-1.8-4.9L5 9.5l5.2-1.6L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"
    />
  ),
  cloud: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1-.5 7.98"
    />
  ),
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const tileSpans = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
];

function ServiceCard({
  service,
  span,
}: {
  service: ServiceItem;
  span: string;
}) {
  const tilt = useTilt(6);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
    tilt.onMouseMove(e);
  };

  return (
    <motion.div variants={cardVariant} style={{ perspective: 800 }} className={span}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        className="neu-card spotlight-card flex h-full flex-col justify-center rounded-2xl p-3 sm:rounded-3xl sm:p-5"
      >
        <div className="neu-chip flex h-9 w-9 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#svcGradient)"
            strokeWidth="1.5"
            className="h-4 w-4 sm:h-6 sm:w-6"
          >
            <defs>
              <linearGradient id="svcGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop offset="100%" stopColor="var(--brand-lime)" />
              </linearGradient>
            </defs>
            {icons[service.icon]}
          </svg>
        </div>
        <h3 className="mt-2 font-display text-xs font-semibold sm:text-base">{service.title}</h3>
        <p className="mt-1 line-clamp-3 text-[11px] text-muted sm:line-clamp-none sm:text-xs">{service.description}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative py-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-4 max-w-2xl sm:mb-6 lg:mb-8">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
            <ChapterTag number="01" />
            {t.services.eyebrow}
          </p>
          <StaggerHeading
            before={t.services.headingBefore}
            highlight={t.services.headingHighlight}
            className="text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-flow-dense"
        >
          {t.services.items.map((service, i) => (
            <ServiceCard key={i} service={service} span={tileSpans[i]} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
