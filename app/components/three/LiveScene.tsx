"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import BillCard3D from "./BillCard3D";

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
      <BillCard3D position={[0, 0.15, 0]} scale={0.9} />
    </Canvas>
  );
}
