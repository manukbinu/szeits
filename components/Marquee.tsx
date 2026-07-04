import { marqueeItems } from "@/lib/constants";

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-6">
      <div className="flex w-max animate-marquee gap-12">
        {[...items, ...items].map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-2xl font-medium text-muted/70"
          >
            {label}
            <span className="text-brand-lime">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
