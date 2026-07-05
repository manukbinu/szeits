"use client";

import dynamic from "next/dynamic";

const LogoScrollBackdrop = dynamic(
  () => import("@/components/three/LogoScrollBackdrop"),
  { ssr: false }
);

export default function LogoScrollBackdropLoader() {
  return <LogoScrollBackdrop />;
}
