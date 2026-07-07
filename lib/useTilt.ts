"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function useTilt(maxTilt = 8) {
  const reducedMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 300, damping: 30 });
  const springY = useSpring(py, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return {
    style: reducedMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" as const },
    onMouseMove,
    onMouseLeave,
  };
}
