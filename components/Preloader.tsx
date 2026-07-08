"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";

const LottieLoader = dynamic(() => import("@/components/LottieLoader"), {
  ssr: false,
  loading: () => <div className="h-12 w-12 animate-pulse rounded-full border-2 border-dashed border-brand-blue/40" />,
});

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
    }, 1300);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(14px)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-background"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.35), rgba(6,182,212,0.12) 55%, transparent 75%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-4"
          >
            <Logo className="text-2xl" />
            <LottieLoader />
            <motion.div className="h-px w-40 overflow-hidden bg-foreground/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full bg-gradient-brand"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
