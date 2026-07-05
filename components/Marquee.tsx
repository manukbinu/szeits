import { marqueeItems } from "@/lib/constants";

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="neu-pressed relative overflow-hidden py-6">
      <div className="relative flex w-max animate-marquee gap-12">
        {[...items, ...items].map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-2xl font-medium text-muted/70"
          >
            {label}
            <span className="font-mono text-brand-lime">&lt;/&gt;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
