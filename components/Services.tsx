"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/constants";

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
  service: (typeof services)[number];
  span: string;
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      variants={cardVariant}
      onMouseMove={handleMouseMove}
      className={`neu-card spotlight-card flex flex-col justify-center rounded-3xl p-8 ${span}`}
    >
      <div className="neu-chip flex h-16 w-16 items-center justify-center rounded-2xl">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#svcGradient)"
          strokeWidth="1.5"
          className="h-8 w-8"
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
      <h3 className="mt-6 font-display text-xl font-semibold">{service.title}</h3>
      <p className="mt-3 text-muted">{service.description}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
            What We Do
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Services built to move your{" "}
            <span className="text-gradient">business forward.</span>
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} span={tileSpans[i]} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
