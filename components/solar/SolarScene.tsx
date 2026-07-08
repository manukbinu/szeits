"use client";

import { Suspense, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import PlanetPanel from "./PlanetPanel";
import FooterExtras from "./FooterExtras";
import { PLANETS, getPanelPosition, type PlanetId } from "./planetData";
import type { PerfTier } from "@/lib/useDeviceCapability";
import type { LanguageContextValue } from "@/lib/i18n/LanguageContext";

// Deterministic PRNG (not Math.random) so the dust field is stable across
// re-renders and doesn't trip render-purity rules.
function mulberry32(seed: number) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Sun({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hitem3d-model.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.4 / radius;
    clone.position.sub(center);
    clone.scale.setScalar(scale);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    return wrapper;
  }, [scene]);

  useFrame((state, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
      <pointLight color="#06b6d4" intensity={3.5} distance={40} decay={1.5} />
    </group>
  );
}
useGLTF.preload("/models/hitem3d-model.glb");

function Nebula() {
  const layers = [
    { radius: 55, color: "#2563eb", opacity: 0.05 },
    { radius: 42, color: "#06b6d4", opacity: 0.045 },
    { radius: 68, color: "#818cf8", opacity: 0.03 },
  ];
  return (
    <>
      {layers.map((l, i) => (
        <mesh key={i}>
          <sphereGeometry args={[l.radius, 24, 24]} />
          <meshBasicMaterial
            color={l.color}
            transparent
            opacity={l.opacity}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function CosmicDust({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(count * 7919 + 3);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 13 * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22d3ee" size={0.05} sizeAttenuation transparent opacity={0.5} />
      </points>
    </group>
  );
}

export default function SolarScene({
  sections,
  flightProgress,
  cameraProgress,
  activeIndex,
  onActiveChange,
  onJump,
  reducedMotion,
  tier,
  language,
}: {
  sections: Record<PlanetId, ReactNode>;
  flightProgress: React.MutableRefObject<number>;
  cameraProgress: React.MutableRefObject<number>;
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onJump: (index: number) => void;
  reducedMotion: boolean;
  tier: PerfTier;
  language: LanguageContextValue;
}) {
  const dustCount = tier === "high" ? 400 : tier === "medium" ? 200 : 100;
  const starCount = tier === "high" ? 6000 : tier === "medium" ? 3000 : 1500;

  // Only calls back up when the nearest planet actually changes, so panel
  // fade/aria-hidden can react via sparse parent state, while the smooth
  // per-frame camera/mesh motion stays entirely in refs via useFrame above.
  // Reduced motion freezes the camera and never advances flightProgress, so
  // active-planet switching there is driven entirely by explicit clicks
  // (see SolarExperience) rather than this auto-detector.
  const lastActiveRef = useRef(activeIndex);
  useFrame(() => {
    if (reducedMotion) return;
    const nearest = Math.round(
      THREE.MathUtils.clamp(cameraProgress.current, 0, PLANETS.length - 1)
    );
    if (nearest !== lastActiveRef.current) {
      lastActiveRef.current = nearest;
      onActiveChange(nearest);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={0.6} color="#2563eb" />

      <Stars radius={80} depth={50} count={starCount} factor={4} saturation={0} fade speed={reducedMotion ? 0 : 0.5} />
      <Nebula />
      <CosmicDust count={dustCount} />

      <Suspense fallback={null}>
        <Sun reducedMotion={reducedMotion} />
      </Suspense>

      {PLANETS.map((planet, i) => (
        <group key={planet.id} position={getPanelPosition(planet)}>
          <PlanetPanel active={activeIndex === i} language={language}>
            {sections[planet.id]}
            {planet.id === "contact" && <FooterExtras onJump={onJump} />}
          </PlanetPanel>
        </group>
      ))}

      <CameraRig
        flightProgress={flightProgress}
        cameraProgress={cameraProgress}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
