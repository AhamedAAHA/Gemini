"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type Row = { y: number; w: number; amountW: number; x: number; error?: boolean };

const ROWS: Row[] = [
  { y: 1.14, w: 1.15, amountW: 0.55, x: -0.42 },
  { y: 0.94, w: 1.5, amountW: 0.55, x: -0.32 },
  { y: 0.72, w: 0.85, amountW: 0.55, x: -0.5 },
  { y: 0.48, w: 1.3, amountW: 0.55, x: -0.38, error: true },
  { y: 0.26, w: 1.05, amountW: 0.55, x: -0.44 },
  { y: 0.02, w: 1.4, amountW: 0.55, x: -0.32, error: true },
  { y: -0.22, w: 0.8, amountW: 0.55, x: -0.5 },
  { y: -0.46, w: 1.25, amountW: 0.55, x: -0.36 },
  { y: -0.68, w: 1.05, amountW: 0.55, x: -0.44, error: true },
  { y: -0.9, w: 0.9, amountW: 0.55, x: -0.48 },
  { y: -1.12, w: 1.35, amountW: 0.55, x: -0.34 },
  { y: -1.32, w: 1.0, amountW: 0.55, x: -0.45 },
];

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
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.26) * 0.14;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.04;
    }
    dots.current.forEach((dot, i) => {
      if (dot) {
        const pulse = 0.5 + Math.abs(Math.sin(t * 1.8 + i * 1.7)) * 0.5;
        (dot.material as THREE.MeshBasicMaterial).opacity = pulse;
      }
    });
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

        {/* line items: description bar + right-aligned amount block */}
        {ROWS.map((r, i) => (
          <group key={i} position={[0, r.y, 0.02]}>
            <mesh position={[r.x + r.w / 2, 0, 0]}>
              <planeGeometry args={[r.w, 0.075]} />
              <meshBasicMaterial color={r.error ? "#7f1d1d" : "#33415c"} />
            </mesh>
            <mesh position={[r.w / 2 + 0.09 + r.amountW / 2, 0, 0.004]}>
              <planeGeometry args={[r.amountW, 0.075]} />
              <meshBasicMaterial color={r.error ? "#fda4af" : "#64748b"} />
            </mesh>
            {r.error && (
              <mesh
                ref={(el) => {
                  dots.current[i] = el;
                }}
                position={[r.w / 2 + 0.09 + r.amountW + 0.09, 0, 0.008]}
              >
                <planeGeometry args={[0.085, 0.085]} />
                <meshBasicMaterial color="#fb7185" transparent />
              </mesh>
            )}
            {r.error && (
              <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[r.w + r.amountW + 0.22, 0.11]} />
                <meshBasicMaterial color="#fb7185" transparent opacity={0.14} />
              </mesh>
            )}
          </group>
        ))}

        {/* PAST DUE stamp */}
        <group position={[0.75, -0.32, 0.03]} rotation={[-0.12, 0, -0.28]}>
          <mesh>
            <planeGeometry args={[1.05, 0.46]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.18} />
          </mesh>
          <mesh position={[-0.28, 0.06, 0.01]}>
            <planeGeometry args={[0.62, 0.1]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.55} />
          </mesh>
          <mesh position={[-0.28, -0.06, 0.01]}>
            <planeGeometry args={[0.42, 0.1]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.55} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
