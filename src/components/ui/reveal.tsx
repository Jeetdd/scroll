"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

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
  // The switch lives in `transition`, not in `initial`: `initial` is read once
  // at mount, and the hook starts `false` and corrects itself after — so a
  // conditional there would never reach anything below the fold. `transition`
  // is re-read when the animation starts, which is when the element scrolls in.
  //
  // `y: { duration: 0 }` rather than dropping the offset: the element snaps to
  // its final position at t=0, still at opacity 0, and cross-fades from there.
  // Reduced motion means gentler, not absent — the fade still says "this is new".
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      transition={
        reduced
          ? { duration: 0.3, delay, ease: EASE_OUT, y: { duration: 0 } }
          : { duration: 0.85, delay, ease: EASE_OUT }
      }
      viewport={{ once: true, margin }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
