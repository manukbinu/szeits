"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(-py * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariant}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-white/25"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-green/0 blur-[80px] transition-colors duration-500 group-hover:bg-brand-green/25" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#svcGradient)"
        strokeWidth="1.5"
        className="h-10 w-10"
      >
        <defs>
          <linearGradient id="svcGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-lime)" />
          </linearGradient>
        </defs>
        {icons[service.icon]}
      </svg>
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
          className="grid gap-6 sm:grid-cols-2"
          style={{ perspective: 800 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
