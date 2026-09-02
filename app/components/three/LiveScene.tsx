"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import BillCard3D from "./BillCard3D";

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
      camera.position.y = damp(camera.position.y, 0.1 + Math.sin(t * 0.2) * 0.05, 3, 1 / 60);
    } else {
      camera.position.x = damp(camera.position.x, target.current.x * 0.5, 3, 1 / 60);
      camera.position.y = damp(camera.position.y, 0.1 + target.current.y * 0.3, 3, 1 / 60);
    }
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

function AmbientOrbs() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[-5, 3, -6]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} />
      </mesh>
      <mesh position={[5, -2, -5]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function MainBill({ wide }: { wide: boolean }) {
  return <BillCard3D position={[wide ? 2.4 : 0, 0.1, 0]} scale={wide ? 1.08 : 0.88} />;
}

export default function LiveScene() {
  const wide = useMedia("(min-width: 1024px)");
  const ultrawide = useMedia("(min-width: 1280px)");
  const reduce = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.1, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 7, 5]} intensity={1.4} color="#f8fafc" />
      <pointLight position={[-4, -2, 4]} intensity={0.8} color="#10b981" />
      <pointLight position={[4, 2, 4]} intensity={0.7} color="#38bdf8" />
      <CameraRig reduce={reduce} />
      <AmbientOrbs />
      <MainBill wide={wide} />
      {ultrawide && (
        <>
          <BillCard3D position={[-4.8, -1.7, -3.5]} scale={0.55} particles={false} animated={false} />
          <BillCard3D position={[4.6, 1.9, -4.2]} scale={0.42} particles={false} animated={false} />
        </>
      )}
    </Canvas>
  );
}
