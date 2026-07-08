"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS, getCameraPosition } from "./planetData";

const MAX_PROGRESS = PLANETS.length - 1;

export default function CameraRig({
  flightProgress: flightProgressRef,
  cameraProgress: cameraProgressRef,
  reducedMotion,
}: {
  flightProgress: React.MutableRefObject<number>;
  cameraProgress: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const smoothPos = useRef(new THREE.Vector3(...getCameraPosition(PLANETS[0])));

  useFrame((state, delta) => {
    // flightProgress is driven entirely by gsap tweens in SolarExperience
    // (one whole planet index at a time), not per-frame velocity — so it
    // just needs clamping here, no integration.
    const progress = reducedMotion ? 0 : flightProgressRef.current;
    const clamped = THREE.MathUtils.clamp(progress, 0, MAX_PROGRESS);
    const lo = Math.floor(clamped);
    const hi = Math.min(MAX_PROGRESS, lo + 1);
    const frac = clamped - lo;

    const a = new THREE.Vector3(...getCameraPosition(PLANETS[lo]));
    const b = new THREE.Vector3(...getCameraPosition(PLANETS[hi]));
    const target = a.lerp(b, frac);

    const damp = Math.min(1, delta * (reducedMotion ? 10 : 2.2));
    smoothPos.current.lerp(target, damp);
    // Track "nearest planet" off this same damped progress, not the raw
    // scroll target above, so a panel only becomes active once the camera
    // has actually caught up to it visually. Otherwise fast scroll/fling
    // marks the next panel active while the camera (and thus its on-screen
    // projection) is still mid-flight from the previous one, shoving it off
    // to the side of the viewport instead of centered.
    cameraProgressRef.current = THREE.MathUtils.lerp(cameraProgressRef.current, clamped, damp);

    state.camera.position.copy(smoothPos.current);
    // Always look back at the sun so it stays in frame at every stop.
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
