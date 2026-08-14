"use client";

import { useRef } from "react";
import { motion, useMotionValue } from "motion/react";
import { cn } from "./cn";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export default function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-block", className)}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}
