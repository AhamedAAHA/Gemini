"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function BillCard3D({
  position = [0, 0, 0],
  scale = 1,
  particles = true,
  animated = true,
}: {
  position?: [number, number, number];
  scale?: number;
  particles?: boolean;
  animated?: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.26) * 0.14;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.04;
    }
  });

  return (
    <Float
      speed={animated ? 1.4 : 0}
      rotationIntensity={animated ? 0.22 : 0}
      floatIntensity={animated ? 0.6 : 0}
    >
      <group ref={group} position={position} scale={scale}>
        {/* paper */}
        <mesh>
          <planeGeometry args={[2.6, 3.4]} />
          <meshStandardMaterial
            color="#0e1a2e"
            roughness={0.35}
            metalness={0.08}
            emissive="#04121f"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
    </Float>
  );
}
