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
            dir={language.dir}
            data-panel-scroll
            aria-hidden={!active}
            inert={!active ? true : undefined}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0.92,
              y: active ? 0 : 12,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: active ? "auto" : "none" }}
            // overflow-y-auto (not hidden): panel content can be taller than
            // the 94vh cap — a dense grid/list, or just longer Arabic text —
            // and silently clipping it with overflow-hidden was losing real
            // content instead of making it reachable. SolarExperience's
            // wheel/touch handlers let this scroll natively first and only
            // hijack the gesture for layer-to-layer navigation once this
            // panel's own content is scrolled to its start/end.
            className="glass w-[min(96vw,1080px)] max-h-[94vh] overflow-y-auto overscroll-contain rounded-3xl"
          >
            {children}
          </motion.div>
        </MotionConfig>
      </LanguageContext.Provider>
    </Html>
  );
}
