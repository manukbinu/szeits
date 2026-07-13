"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Marquee() {
  const { t } = useLanguage();
  const items = [...t.marquee.items, ...t.marquee.items];

  return (
    <div className="glass relative overflow-hidden py-6">
      <div className="relative flex w-max animate-marquee gap-12">
        {[...items, ...items].map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-2xl font-medium text-muted/70"
          >
            {label}
            <span className="font-mono text-gold">&lt;/&gt;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
