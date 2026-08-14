"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
    />
  );
}
