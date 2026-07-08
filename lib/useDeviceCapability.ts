"use client";

import { useEffect, useState } from "react";

export type PerfTier = "high" | "medium" | "low";

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

function computeTier(): PerfTier {
  if (typeof window === "undefined") return "high";

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8;
  const narrow = window.innerWidth < 1024;

  if (cores <= 4 || memory <= 4) return "low";
  if (narrow) return "medium";
  return "high";
}

export function useDeviceCapability(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("high");

  useEffect(() => {
    setTier(computeTier());
    const onResize = () => setTier(computeTier());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return tier;
}
