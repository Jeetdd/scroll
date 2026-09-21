"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * When anything on this page counts as on screen.
 *
 * `amount: "some"` — one intersecting pixel is enough. The old default asked
 * for half the element's *area*, which had two problems. A tall block only
 * reached 50% once you had scrolled most of the way past it, so its contents
 * sat blank through the entire approach and then animated somewhere behind
 * you — the gap this replaces. Worse, 50% of an element taller or wider than
 * the viewport can be unreachable outright, and an element that never reaches
 * its threshold never animates: it stays at `opacity: 0` permanently. The
 * certificates band hit exactly that and rendered invisible.
 *
 * The inset is bottom-only and in viewport units, so it means the same thing
 * to a 40px eyebrow and an 800px collage: fire when the element's top edge is
 * a tenth of the screen above the bottom. Enough that nothing animates on a
 * one-pixel graze, early enough that it has finished by the time it is
 * properly in front of the reader.
 *
 * Exported because the staggered containers drive Motion directly rather than
 * through `Reveal`, and a second opinion about what "on screen" means is how
 * the two drift apart.
 */
export const IN_VIEW = {
  amount: "some",
  margin: "0px 0px -10% 0px",
  once: true,
} as const;

/**
 * Entrance animation for the unpinned sections. GSAP owns the pinned scene's
 * timeline; everything outside it is Motion's, which keeps the two libraries
 * from competing for the same scroll.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  margin = IN_VIEW.margin,
  amount = IN_VIEW.amount,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** The observer's inset, as `IntersectionObserver` rootMargin. */
  margin?: string;
  amount?: number | "some" | "all";
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
      viewport={{ once: IN_VIEW.once, margin, amount }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
