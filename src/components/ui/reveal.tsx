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
 * The margin is bottom-only, in viewport units, and **slightly positive** — it
 * grows the observer's box a twentieth of a screen *below* the fold.
 *
 * Both signs have been wrong here, in opposite directions, and the window
 * between them is narrow:
 *
 *  - `-10%` shrank the box, pulling the root's bottom edge *up*. Nothing fired
 *    until its top had already climbed a tenth of the screen in, so a block
 *    sitting low inside a tall section — the USP grid under its headline, the
 *    card row under its quote — held its full layout height at `opacity: 0`
 *    while visibly on screen. A band of blank page.
 *  - `+20%` overshot the other way. A fifth of a screen of lead is several
 *    seconds at the pace someone actually reads at, so every entrance ran to
 *    completion below the fold and the page arrived pre-settled. No blank
 *    band, but no animation either — the motion was all happening where
 *    nobody was looking.
 *
 * `+5%` is the seam. It is enough that an element is already fading as its
 * first pixels appear, so nothing is ever laid out blank; it is small enough
 * that the travel still plays in front of the reader rather than behind them.
 *
 * Exported because the staggered containers drive Motion directly rather than
 * through `Reveal`, and a second opinion about what "on screen" means is how
 * the two drift apart.
 */
export const IN_VIEW = {
  amount: "some",
  margin: "0px 0px 5% 0px",
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
  //
  // 0.9s and 36px of travel. With only 5% of lead the entrance now plays on
  // screen rather than below it, which is what the duration is for — at 0.6s
  // against a 20% pre-trigger the same move was over before anyone saw it and
  // the page read as though nothing animated at all. Long enough to register
  // as motion, short enough that a reader scrolling at pace isn't waiting on
  // copy to finish arriving.
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      transition={
        reduced
          ? { duration: 0.3, delay, ease: EASE_OUT, y: { duration: 0 } }
          : { duration: 0.9, delay, ease: EASE_OUT }
      }
      viewport={{ once: IN_VIEW.once, margin, amount }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
