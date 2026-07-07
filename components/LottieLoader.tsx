"use client";

import Lottie from "lottie-react";
import loaderAnimation from "@/lib/lottie/loader.json";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Placeholder animation — swap `lib/lottie/loader.json` for any Lottie JSON
// export (e.g. from LottieFiles or After Effects/Bodymovin) to replace it.
export default function LottieLoader({ className = "h-12 w-12" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <Lottie
      animationData={loaderAnimation}
      loop={!reducedMotion}
      autoplay={!reducedMotion}
      className={className}
    />
  );
}
