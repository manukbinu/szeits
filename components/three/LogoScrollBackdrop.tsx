"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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

function usePointerRef() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

function ScannedModel({
  scrollRef,
  pointerRef,
}: {
  scrollRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const autoYRef = useRef(0);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF("/models/hitem3d-model.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.6 / radius;

    clone.position.sub(center);
    clone.scale.setScalar(scale);

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    return wrapper;
  }, [scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    autoYRef.current += delta * 0.15;
    const damp = Math.min(1, delta * 8);
    smoothPointer.current.x += (pointerRef.current.x - smoothPointer.current.x) * damp;
    smoothPointer.current.y += (pointerRef.current.y - smoothPointer.current.y) * damp;

    group.rotation.y = autoYRef.current + smoothPointer.current.x * Math.PI;
    group.rotation.x =
      0.4 + Math.sin(scrollRef.current * 0.0012) * 0.12 + smoothPointer.current.y * 0.45;
    group.position.y = Math.sin(scrollRef.current * 0.0008) * 0.2 - smoothPointer.current.y * 0.35;
    group.position.x = smoothPointer.current.x * 0.6;
  });

  return <primitive ref={groupRef} object={model} />;
}

useGLTF.preload("/models/hitem3d-model.glb");

export default function LogoScrollBackdrop() {
  const scrollRef = useScrollRef();
  const pointerRef = usePointerRef();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-[0.5]"
      style={{ zIndex: -1 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <ScannedModel scrollRef={scrollRef} pointerRef={pointerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
