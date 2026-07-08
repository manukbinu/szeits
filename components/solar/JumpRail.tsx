"use client";

import { PLANETS } from "./planetData";

export default function JumpRail({
  activeIndex,
  onJump,
}: {
  activeIndex: number;
  onJump: (index: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed end-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="pointer-events-auto relative flex flex-col items-center px-2">
        <div className="absolute start-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10 rtl:translate-x-1/2" />

        <ul className="relative flex flex-col gap-8">
          {PLANETS.map((planet, i) => {
            const active = activeIndex === i;
            return (
              <li key={planet.id} className="group relative flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-label={planet.label}
                  aria-current={active ? "true" : undefined}
                  className="relative flex h-4 w-4 items-center justify-center"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-gradient-brand transition-all duration-300"
                    style={{
                      transform: active ? "scale(1)" : "scale(0.5)",
                      opacity: active ? 1 : 0.55,
                    }}
                  />
                  {active && (
                    <span className="absolute h-4 w-4 rounded-full border border-brand-blue/50" />
                  )}
                </button>
                <span className="glass pointer-events-none absolute end-full top-1/2 me-3 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {planet.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
