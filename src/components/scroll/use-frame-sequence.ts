"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { BEATS } from "@/lib/beats";
import { FRAME_COUNT, type FrameTier, frameSrc } from "@/lib/frames.generated";

/** Images in flight at once. More than this and the gate frames arrive later. */
const CONCURRENCY = 6;
/**
 * Stride of the first pass over the sequence. Twelve frames is around 30vh of
 * scroll, which is coarse enough to be quick and close enough that the scene's
 * nearest-frame fallback still tracks the scrub.
 */
const COARSE = 12;

/**
 * Frames worth having before any others: the one the intro dissolves onto, the
 * one the film rests on at the end, and the frame each act's copy fades in
 * over. Anything added here jumps the queue.
 */
const ANCHORS = [0, FRAME_COUNT - 1, ...BEATS.map((beat) => beat.from)];

export type FrameSequence = {
  framesRef: RefObject<(HTMLImageElement | null)[]>;
  ready: boolean;
  progress: number;
};

/**
 * The order frames are requested in, and how many of them the preloader holds
 * the page for.
 *
 * Anchors first, then the whole film at a coarse stride, then passes that
 * halve the stride until every frame is queued. Fetching 0→240 in order would
 * mean the gate opens on a contiguous prefix and nothing else — scroll faster
 * than the download and the picture stops dead, because the nearest decoded
 * frame stays the last one of that prefix. A coarse pass covers the whole
 * timeline instead: the scrub is jerky until the later passes fill it in, but
 * it never stops moving.
 */
function plan(): { order: number[]; gate: number } {
  const order: number[] = [];
  const queued = new Set<number>();

  const push = (index: number) => {
    if (index < FRAME_COUNT && !queued.has(index)) {
      queued.add(index);
      order.push(index);
    }
  };

  for (const anchor of ANCHORS) push(anchor);
  for (let index = 0; index < FRAME_COUNT; index += COARSE) push(index);

  // Everything queued so far is what the preloader waits on.
  const gate = order.length;

  for (let stride = COARSE >> 1; stride >= 1; stride >>= 1) {
    for (let index = 0; index < FRAME_COUNT; index += stride) push(index);
  }

  return { order, gate };
}

/**
 * Loads the frame sequence for the current viewport's tier, in priority order.
 *
 * Frames are kept as plain `Image` elements rather than `ImageBitmap`s on
 * purpose: bitmaps stay resident, while the browser is free to drop the
 * decoded data behind an `Image` it hasn't painted lately. Across 241 frames
 * that is the difference between a working page and an out-of-memory tab.
 */
export function useFrameSequence(): FrameSequence {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null),
  );
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phones get a tier cropped to their own orientation — the sequence is
    // drawn full-bleed, so a landscape frame on an upright phone would be
    // mostly cropped away. A small screen held sideways still wants the
    // landscape crop, and anything larger has the pixels for the desktop tier.
    // Only this tier is ever requested; the others are never referenced.
    const small = window.matchMedia("(max-width: 768px)").matches;
    const upright = window.matchMedia("(orientation: portrait)").matches;
    let tier: FrameTier = "desktop";
    if (small) tier = upright ? "portrait" : "mobile";

    const { order, gate } = plan();
    const frames = framesRef.current;
    let cancelled = false;
    let settled = 0;
    let cursor = 0;

    const load = async (position: number) => {
      const index = order[position];
      const image = new Image();
      image.decoding = "async";
      // The gate is what the reader is actually waiting on. The rest can queue
      // behind the fonts and the intro's still.
      image.fetchPriority = position < gate ? "high" : "low";
      image.src = frameSrc(tier, index);

      try {
        // Decoding up front means the scrub never pays for it mid-drag.
        await image.decode();
        if (!cancelled) frames[index] = image;
      } catch {
        // A missing frame is survivable; the draw falls back to a neighbour.
      }

      // Counted even when the decode failed: gating on successes alone would
      // let one 404 hold the preloader open for good.
      if (cancelled || position >= gate) return;
      settled += 1;
      setProgress(settled / gate);
      if (settled >= gate) setReady(true);
    };

    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < order.length && !cancelled) {
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
