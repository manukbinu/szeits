"use client";

import { createContext, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SzeitsLogoIntro = dynamic(() => import("@/components/intro/SzeitsLogoIntro"), {
  ssr: false,
});

// Lets any section (e.g. Hero) or the blur-reveal wrapper (see BlurReveal.tsx)
// know when the intro has actually finished, so reveal animations can start
// then instead of on mount (mount happens while still hidden behind the
// intro overlay, so a mount-triggered animation would already be fully
// settled/invisible by the time the user can actually see it).
const IntroDoneContext = createContext(false);
export function useIntroDone() {
  return useContext(IntroDoneContext);
}

// Plays the SZEITS 3D logo intro once. It never unmounts — once it
// finishes it turns itself into a fixed, transparent background layer
// (see SzeitsLogoIntro's `revealed` state) so the model stays on screen,
// idling behind the page while the site's real content scrolls over it.
//
// Deliberately does NOT wrap `children` in any div here (no blur filter,
// no transform): a CSS `filter` on an ancestor creates a new containing
// block for every position:fixed descendant, which broke Navbar, the
// WhatsApp/BackToTop buttons, and GSAP's pinned sections for as long as
// the intro was playing. The blur-reveal effect instead lives in
// BlurReveal.tsx, applied only around the actual scrollable page content
// — fixed-position chrome stays outside it entirely.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <IntroDoneContext.Provider value={done}>
      <SzeitsLogoIntro onDone={() => setDone(true)} />
      {children}
    </IntroDoneContext.Provider>
  );
}
