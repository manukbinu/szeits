"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/useReducedMotion";

const NODE_COLORS = ["#1f7ce0", "#24c29a", "#8fb832"];
const NODE_COUNT = 7;

type Orbit = {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  color: string;
  size: number;
};

function makeOrbits(count: number): Orbit[] {
  return Array.from({ length: count }, (_, i) => ({
    radius: 0.9 + (i % 3) * 0.28,
    speed: 0.15 + (i % 4) * 0.08,
    phase: (i / count) * Math.PI * 2,
    tilt: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.15),
    color: NODE_COLORS[i % NODE_COLORS.length],
    size: 0.05 + (i % 3) * 0.015,
  }));
}

function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <ringGeometry args={[radius - 0.004, radius + 0.004, 64]} />
      <meshBasicMaterial color="#8fb832" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Node({ orbit, reducedMotion }: { orbit: Orbit; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const angle = orbit.phase + t * orbit.speed;
    mesh.position.set(
      Math.cos(angle) * orbit.radius,
      Math.sin(angle) * orbit.radius * Math.sin(orbit.tilt),
      Math.sin(angle) * orbit.radius * Math.cos(orbit.tilt)
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[orbit.size, 16, 16]} />
      <meshStandardMaterial
        color={orbit.color}
        emissive={orbit.color}
        emissiveIntensity={1.1}
        roughness={0.35}
        metalness={0.1}
      />
    </mesh>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const orbits = useMemo(() => makeOrbits(NODE_COUNT), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1} />
      <group ref={groupRef}>
        {orbits.map((orbit, i) => (
          <group key={i}>
            <OrbitRing radius={orbit.radius} tilt={orbit.tilt} />
            <Node orbit={orbit} reducedMotion={reducedMotion} />
          </group>
        ))}
      </group>
    </>
  );
}

export default function OrbitNodes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden sm:block"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={inView && tabVisible ? "always" : "never"}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
