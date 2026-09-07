"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";
import { FRAME_LQIP } from "@/lib/frames.generated";

/**
 * Holds the page still until enough of the sequence has decoded that scrubbing
 * won't stutter. Backed by a blurred frame 1 so there is something to look at.
 */
export function Preloader({ progress }: { progress: number }) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    // Belt and braces: Lenis is gone entirely under reduced motion.
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis]);

  const percent = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
        style={{ backgroundImage: `url(${FRAME_LQIP})` }}
      />
      {/* <output> carries an implicit role="status". */}
      <output
        aria-live="polite"
        className="relative flex flex-col items-center gap-6"
      >
        <p className="font-display text-3xl tracking-tight text-ink">
          National Foods
        </p>
        <div className="h-px w-52 overflow-hidden bg-ink/15">
          <div
            className="h-full bg-resin transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="font-mono text-xs tracking-[0.3em] text-ink-soft">
          {percent}%
        </p>
      </output>
    </div>
  );
}
