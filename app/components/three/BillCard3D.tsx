"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
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
  const scan = useRef<THREE.Mesh>(null);
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.16;
      group.current.rotation.x = Math.sin(t * 0.22) * 0.06;
    }
    if (scan.current) {
      scan.current.position.y = Math.sin(t * 1.2) * 1.55;
      (scan.current.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(t * 1.2) * 0.25;
    }
    dots.current.forEach((dot, i) => {
      if (dot) {
        const pulse = 0.4 + Math.abs(Math.sin(t * 2 + i * 1.5)) * 0.6;
        (dot.material as THREE.MeshBasicMaterial).opacity = pulse;
      }
    });
  });

  return (
    <Float
      speed={animated ? 1.6 : 0}
      rotationIntensity={animated ? 0.25 : 0}
      floatIntensity={animated ? 0.7 : 0}
    >
      <group ref={group} position={position} scale={scale}>
        {/* Holographic Paper Base */}
        <mesh>
          <planeGeometry args={[2.6, 3.4]} />
          <meshStandardMaterial
            color="#0b1329"
            roughness={0.25}
            metalness={0.2}
            emissive="#020d1a"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Outer Emerald Neon Edge Glow */}
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[2.66, 3.46]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
        </mesh>

        {/* Provider Header Banner */}
        <mesh position={[0, 1.48, 0.02]}>
          <planeGeometry args={[2.24, 0.36]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
        </mesh>
        <mesh position={[-0.7, 1.48, 0.03]}>
          <planeGeometry args={[0.9, 0.09]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
        <mesh position={[0.62, 1.48, 0.03]}>
          <planeGeometry args={[0.5, 0.09]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>

        {/* Line Items & Error Flags */}
        {ROWS.map((r, i) => (
          <group key={i} position={[0, r.y, 0.02]}>
            <mesh position={[r.x + r.w / 2, 0, 0]}>
              <planeGeometry args={[r.w, 0.075]} />
              <meshBasicMaterial color={r.error ? "#991b1b" : "#1e293b"} />
            </mesh>
            <mesh position={[r.w / 2 + 0.09 + r.amountW / 2, 0, 0.004]}>
              <planeGeometry args={[r.amountW, 0.075]} />
              <meshBasicMaterial color={r.error ? "#fca5a5" : "#475569"} />
            </mesh>
            {r.error && (
              <mesh
                ref={(el) => {
                  dots.current[i] = el;
                }}
                position={[r.w / 2 + 0.09 + r.amountW + 0.09, 0, 0.008]}
              >
                <planeGeometry args={[0.09, 0.09]} />
                <meshBasicMaterial color="#fb7185" transparent />
              </mesh>
            )}
            {r.error && (
              <mesh position={[0, 0, -0.015]}>
                <planeGeometry args={[r.w + r.amountW + 0.24, 0.12]} />
                <meshBasicMaterial color="#fb7185" transparent opacity={0.16} />
              </mesh>
            )}
          </group>
        ))}

        {/* Holographic Disputed Stamp */}
        <group position={[0.72, -0.35, 0.03]} rotation={[-0.1, 0, -0.25]}>
          <mesh>
            <planeGeometry args={[1.1, 0.48]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.2} />
          </mesh>
          <mesh position={[-0.26, 0.07, 0.01]}>
            <planeGeometry args={[0.65, 0.1]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
          </mesh>
          <mesh position={[-0.26, -0.07, 0.01]}>
            <planeGeometry args={[0.45, 0.1]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
          </mesh>
        </group>

        {/* Laser Scanning Beam */}
        <mesh ref={scan} position={[0, 0, 0.35]}>
          <planeGeometry args={[2.75, 0.07]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.75} />
        </mesh>

        {/* Floating Cyber Ambient Particles */}
        {particles && (
          <Sparkles count={80} scale={[10, 7, 5]} size={2.5} speed={0.4} color="#34d399" opacity={0.65} />
        )}
      </group>
    </Float>
  );
}
