"use client";

import { Html } from "@react-three/drei";
import { motion, MotionConfig } from "framer-motion";
import { LanguageContext, type LanguageContextValue } from "@/lib/i18n/LanguageContext";

export default function PlanetPanel({
  active,
  language,
  children,
}: {
  active: boolean;
  language: LanguageContextValue;
  children: React.ReactNode;
}) {
  return (
    <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      {/*
        drei's <Html> mounts its children into a fully independent
        `ReactDOM.createRoot`, not a portal that preserves the outer Fiber
        tree — so context has to be re-established right here, around what's
        actually passed in as children, not further up the scene graph.
      */}
      <LanguageContext.Provider value={language}>
        <MotionConfig reducedMotion="user">
          <motion.div
            aria-hidden={!active}
            inert={!active ? true : undefined}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0.92,
              y: active ? 0 : 12,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: active ? "auto" : "none" }}
            className="glass w-[min(96vw,1080px)] max-h-[94vh] overflow-hidden rounded-3xl"
          >
            {children}
          </motion.div>
        </MotionConfig>
      </LanguageContext.Provider>
    </Html>
  );
}
