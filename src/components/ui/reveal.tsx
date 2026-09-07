"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Entrance animation for the unpinned sections. GSAP owns the pinned scene's
 * timeline; everything outside it is Motion's, which keeps the two libraries
 * from competing for the same scroll.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-12%" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
