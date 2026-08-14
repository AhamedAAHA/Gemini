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
      camera.position.y = damp(camera.position.y, 0.1 + Math.sin(t * 0.2) * 0.04, 3, 1 / 60);
    } else {
      camera.position.x = damp(camera.position.x, target.current.x * 0.45, 3, 1 / 60);
      camera.position.y = damp(camera.position.y, 0.1 + target.current.y * 0.28, 3, 1 / 60);
    }
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

function MainBill({ wide }: { wide: boolean }) {
  return <BillCard3D position={[wide ? 2.3 : 0, 0.15, 0]} scale={wide ? 1.05 : 0.9} />;
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
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <pointLight position={[-4, -2, 3]} intensity={0.7} color="#2dd4bf" />
      <pointLight position={[3, 1, 4]} intensity={0.5} color="#22d3ee" />
      <CameraRig reduce={reduce} />
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
