import { techStack } from "@/lib/constants";

export default function TechMarquee() {
  const items = [...techStack, ...techStack];

  return (
    <div className="relative overflow-hidden border-y border-border py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-muted">
        Technologies we build with
      </p>
      <div className="relative flex w-max animate-marquee gap-4">
        {[...items, ...items].map((tech, i) => (
          <span
            key={i}
            className="neu-chip flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-brand" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
