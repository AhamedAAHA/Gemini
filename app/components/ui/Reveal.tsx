"use client";

import { motion } from "motion/react";
import { cn } from "./cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
};

export default function Reveal({ children, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
