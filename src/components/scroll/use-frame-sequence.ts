"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { FRAME_COUNT, type FrameTier, frameSrc } from "@/lib/frames.generated";

/** Frames that must be decoded before the scene is allowed to start. */
const GATE = 24;
/** Images in flight at once. More than this and the gate frames arrive later. */
const CONCURRENCY = 6;

export type FrameSequence = {
  framesRef: RefObject<(HTMLImageElement | null)[]>;
  ready: boolean;
  progress: number;
};

/**
 * Loads the frame sequence for the current breakpoint's tier.
 *
 * Frames are kept as plain `Image` elements rather than `ImageBitmap`s on
 * purpose: bitmaps stay resident, while the browser is free to drop the
 * decoded data behind an `Image` it hasn't painted lately. Across 199 frames
 * that is the difference between a working page and an out-of-memory tab.
 */
export function useFrameSequence(): FrameSequence {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null),
  );
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tier: FrameTier = window.matchMedia("(max-width: 768px)").matches
      ? "mobile"
      : "desktop";

    const frames = framesRef.current;
    let cancelled = false;
    let decoded = 0;
    let cursor = 0;

    const load = async (index: number) => {
      const image = new Image();
      image.decoding = "async";
      image.src = frameSrc(tier, index);

      try {
        // Decoding up front means the scrub never pays for it mid-drag.
        await image.decode();
      } catch {
        return; // A missing frame is survivable; the draw falls back.
      }
      if (cancelled) return;

      frames[index] = image;
      decoded += 1;
      setProgress(decoded / FRAME_COUNT);
      if (decoded >= Math.min(GATE, FRAME_COUNT)) setReady(true);
    };

    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < FRAME_COUNT && !cancelled) {
        await load(cursor++);
      }
    });
    void Promise.all(workers);

    return () => {
      cancelled = true;
    };
  }, []);

  return { framesRef, ready, progress };
}
