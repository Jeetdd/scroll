"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";

/**
 * Entrance animation for the unpinned sections. GSAP owns the pinned scene's
 * timeline; everything outside it is Motion's, which keeps the two libraries
 * from competing for the same scroll.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  margin = "-12%",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * The observer's inset, as `IntersectionObserver` rootMargin. The default
   * holds an element back until it is properly into the viewport rather than
   * grazing the edge.
   *
   * It has to be relaxable for anything sitting at the very bottom of the
   * page. -12% of a 900px viewport pulls the root's bottom edge up to 792px,
   * and the last element on the document — the footer's copyright bar — tops
   * out at 844px when scrolled as far as the page goes. It can never reach the
   * root, so with the default it would sit at opacity 0 forever.
   */
  margin?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
      viewport={{ once: true, margin }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
