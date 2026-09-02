"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function CameraRig({ reduce }: { reduce: boolean }) {
  const target = useRef({ x: 0, y: 0 });
  const camera = useThree((s) => s.camera);
  const hoverFine = useMedia("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!hoverFine) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hoverFine]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (reduce || !hoverFine) {
      camera.position.x = damp(camera.position.x, 0, 3, 1 / 60);
      camera.position.y = damp(camera.position.y, Math.sin(t * 0.2) * 0.1, 3, 1 / 60);
    } else {
      camera.position.x = damp(camera.position.x, target.current.x * 0.5, 3, 1 / 60);
      camera.position.y = damp(camera.position.y, target.current.y * 0.35, 3, 1 / 60);
    }
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FloatingEnergyOrbs() {
  const orb1 = useRef<THREE.Mesh>(null);
  const orb2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (orb1.current) {
      orb1.current.position.y = 1 + Math.sin(t * 0.5) * 0.3;
    }
    if (orb2.current) {
      orb2.current.position.y = -1 + Math.cos(t * 0.4) * 0.4;
    }
  });

  return (
    <>
      <mesh ref={orb1} position={[-4, 1.5, -4]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.07} />
      </mesh>

      <mesh ref={orb2} position={[4.5, -1.5, -4.5]}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.07} />
      </mesh>
    </>
  );
}

export default function LiveScene() {
  const reduce = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[-4, 3, 4]} intensity={1} color="#10b981" />
      <pointLight position={[5, -2, 4]} intensity={1} color="#06b6d4" />
      <pointLight position={[0, 4, -2]} intensity={0.6} color="#a855f7" />

      <CameraRig reduce={reduce} />
      <FloatingEnergyOrbs />

      {/* Cinematic Floating Sparkles Starfield */}
      <Sparkles count={120} scale={[14, 10, 8]} size={2.2} speed={0.4} color="#34d399" opacity={0.6} />
      <Sparkles count={80} scale={[12, 8, 6]} size={1.8} speed={0.3} color="#38bdf8" opacity={0.5} />
    </Canvas>
  );
}
