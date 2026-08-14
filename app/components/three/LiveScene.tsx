"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import BillCard3D from "./BillCard3D";

const damp = THREE.MathUtils.damp;

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    camera.position.x = damp(camera.position.x, target.current.x * 0.45, 3, 1 / 60);
    camera.position.y = damp(camera.position.y, 0.1 + target.current.y * 0.28, 3, 1 / 60);
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

export default function LiveScene() {
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
      <CameraRig />
      <BillCard3D position={[0, 0.15, 0]} scale={0.9} />
    </Canvas>
  );
}
