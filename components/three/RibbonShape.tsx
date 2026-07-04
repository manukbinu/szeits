"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Ribbon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.22;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      pointer.x * 0.3,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pointer.y * 0.3,
      0.05
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 220, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#24c29a"
          distort={0.28}
          speed={1.8}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

export default function RibbonShape() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#1f7ce0" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#b7db3b" />
      <pointLight position={[0, 4, -3]} intensity={20} color="#24c29a" />
      <Ribbon />
    </Canvas>
  );
}
