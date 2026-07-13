"use client";

import { techStack } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TechMarquee() {
  const { t } = useLanguage();
  const items = [...techStack, ...techStack];

  return (
    <section id="technologies" className="relative overflow-hidden border-y border-border py-16 sm:py-20">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-muted">
        {t.techMarquee.heading}
      </p>
      <div className="relative flex w-max animate-marquee gap-4">
        {[...items, ...items].map((tech, i) => (
          <span
            key={i}
            className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-accent" />
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
