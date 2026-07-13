"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SzeitsLogoIntro = dynamic(() => import("@/components/intro/SzeitsLogoIntro"), {
  ssr: false,
});

// Plays the SZEITS 3D logo intro once. Unlike the old Preloader, the intro
// never unmounts — once it finishes it turns itself into a fixed,
// transparent background layer (see SzeitsLogoIntro's `revealed` state) so
// the model stays on screen, idling behind the page while the site's real
// content scrolls over it. Body scroll is only locked while it's still
// playing as a blocking overlay.
export default function IntroGate() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return <SzeitsLogoIntro onDone={() => setDone(true)} />;
}
