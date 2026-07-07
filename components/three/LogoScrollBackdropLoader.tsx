"use client";

import dynamic from "next/dynamic";

function BackdropFallback() {
  return (
    <div
      aria-hidden="true"
      className="three-fallback-gradient pointer-events-none fixed inset-0 opacity-[0.15]"
      style={{ zIndex: -1 }}
    />
  );
}

const LogoScrollBackdrop = dynamic(
  () => import("@/components/three/LogoScrollBackdrop"),
  { ssr: false, loading: BackdropFallback }
);

export default function LogoScrollBackdropLoader() {
  return <LogoScrollBackdrop />;
}
