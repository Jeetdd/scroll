"use client";

import { createContext, type ReactNode, useContext } from "react";
import { Preloader } from "@/components/ui/preloader";
import { openIntroGate } from "@/lib/intro-gate";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { type FrameSequence, useFrameSequence } from "./use-frame-sequence";

const FrameContext = createContext<FrameSequence | null>(null);

/**
 * The frame sequence, as loaded by the curtain that is waiting on it.
 *
 * `ScrollScene` used to own the hook and render its own preloader, which was
 * fine while the home route was the only one with a curtain. It is not any
 * more: the curtain marks every navigation now, and a second one on `/` would
 * mean two panels at `z-50` both animating, the faster one revealing the
 * slower. So the loader moved up to the route boundary and the sequence had to
 * come with it — the loader is gated on `ready`, and `ready` is what the
 * loading produces.
 */
export function useFrames(): FrameSequence {
  const value = useContext(FrameContext);
  if (!value) {
    throw new Error("useFrames must be used inside <HomeCurtain>");
  }
  return value;
}

/**
 * The home route's curtain. Unlike every other route's, this one is waiting on
 * something real — the pinned scene cannot start scrubbing through frames that
 * have not decoded — so it holds until the sequence reports in rather than
 * running on the timer alone.
 *
 * Mounted from `app/template.tsx` and only for `/`, which is also what keeps
 * the other two routes from fetching a film they never show.
 */
export function HomeCurtain({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const sequence = useFrameSequence(!reduced);

  return (
    <FrameContext.Provider value={sequence}>
      <Preloader
        onLift={openIntroGate}
        progress={sequence.progress}
        ready={sequence.ready}
      />
      {children}
    </FrameContext.Provider>
  );
}
