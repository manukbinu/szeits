"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function useScrollRef() {
  const ref = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      ref.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

function Medallion({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/logo.jpeg");

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const target = scrollRef.current * 0.0018;
    mesh.rotation.y += (target - mesh.rotation.y) * Math.min(1, delta * 2);
    mesh.rotation.x = 0.4 + Math.sin(scrollRef.current * 0.0012) * 0.12;
    mesh.position.y = Math.sin(scrollRef.current * 0.0008) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1.8, 1.8, 0.32, 64]} />
      <meshStandardMaterial attach="material-0" color="#1f7ce0" metalness={0.55} roughness={0.4} />
      <meshStandardMaterial attach="material-1" map={texture} metalness={0.1} roughness={0.55} />
      <meshStandardMaterial attach="material-2" map={texture} metalness={0.1} roughness={0.55} />
    </mesh>
  );
}

export default function LogoScrollBackdrop() {
  const scrollRef = useScrollRef();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-[0.35]"
      style={{ zIndex: -1 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <Medallion scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
