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
        {/* edge glow */}
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[2.64, 3.44]} />
          <meshBasicMaterial color="#0f766e" transparent opacity={0.35} />
        </mesh>

        {/* provider header strip */}
        <mesh position={[0, 1.5, 0.02]}>
          <planeGeometry args={[2.2, 0.34]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.85} />
        </mesh>
        {/* header "text" hint */}
        <mesh position={[-0.7, 1.5, 0.03]}>
          <planeGeometry args={[0.9, 0.09]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
        <mesh position={[0.62, 1.5, 0.03]}>
          <planeGeometry args={[0.5, 0.09]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
      </group>
    </Float>
  );
}
