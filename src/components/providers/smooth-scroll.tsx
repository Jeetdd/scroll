"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Wires Lenis to GSAP from inside the provider.
 *
 * This deliberately does not use ReactLenis' imperative ref: that component
 * builds its instance in an effect and keeps it in state, so the ref is still
 * empty on the first commit and a `[]`-dependency effect reads nothing. With
 * `autoRaf` off that failure is silent and total — Lenis goes on swallowing
 * wheel events with nothing driving `raf()`, and the page stops scrolling.
 * `useLenis` re-renders once the instance exists, so the wiring always lands.
 */
function ScrollBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Smoothing is the whole point of Lenis, so there is nothing worth keeping
    // when the visitor has asked for less motion — hand scrolling back to the
    // browser. ScrollTrigger falls back to its own native listeners.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.destroy();
      return;
    }

    // One clock for both libraries: GSAP's ticker advances Lenis, Lenis
    // publishes the new position, and ScrollTrigger reads it in the same frame.
    // Letting each run its own rAF leaves the canvas scrub a frame behind.
    const advance = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(advance);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(advance);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    // `reducedMotion="user"` lets Motion drop transforms and opacity fades on
    // its own, so the reveals don't need a CSS override to go quiet.
    <MotionConfig reducedMotion="user">
      <ReactLenis
        options={{
          autoRaf: false,
          lerp: 0.1,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        }}
        root
      >
        <ScrollBridge />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
