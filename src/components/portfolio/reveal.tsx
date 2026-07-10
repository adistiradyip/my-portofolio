"use client";

import { motion, useReducedMotion } from "motion/react";

export type RevealDirection = "up" | "down" | "left" | "right" | "scale";

const directionOffset: Record<RevealDirection, { x: number; y: number; scale: number }> = {
  up: { x: 0, y: 36, scale: 1 },
  down: { x: 0, y: -28, scale: 1 },
  left: { x: -44, y: 0, scale: 1 },
  right: { x: 44, y: 0, scale: 1 },
  scale: { x: 0, y: 28, scale: 0.94 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
}) {
  const reduceMotion = useReducedMotion();
  const offset = directionOffset[direction];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: offset.scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: "-48px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
