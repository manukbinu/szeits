"use client";

import { motion } from "framer-motion";
import { useIntroDone } from "@/components/SiteChrome";

// Wraps the scrollable page content only (never fixed-position chrome like
// Navbar/WhatsAppButton/BackToTop — see SiteChrome.tsx for why) so it
// blurs in the moment the intro finishes instead of just popping into view.
export default function BlurReveal({ children }: { children: React.ReactNode }) {
  const done = useIntroDone();

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(18px)" }}
      animate={done ? { opacity: 1, filter: "none" } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
