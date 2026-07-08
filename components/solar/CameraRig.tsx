"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS, getCameraPosition } from "./planetData";

const MAX_PROGRESS = PLANETS.length - 1;

export default function CameraRig({
  flightProgress: flightProgressRef,
  velocity: velocityRef,
  reducedMotion,
}: {
  flightProgress: React.MutableRefObject<number>;
  velocity: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const smoothPos = useRef(new THREE.Vector3(...getCameraPosition(PLANETS[0])));

  useFrame((state, delta) => {
    if (!reducedMotion) {
      flightProgressRef.current = THREE.MathUtils.clamp(
        flightProgressRef.current + velocityRef.current * delta,
        0,
        MAX_PROGRESS
      );
      // Exponential decay so wheel/touch input coasts to a smooth stop.
      velocityRef.current *= Math.pow(0.0009, delta);
    }

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

    state.camera.position.copy(smoothPos.current);
    // Always look back at the sun so it stays in frame at every stop.
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
