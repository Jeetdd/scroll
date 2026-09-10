"use client";

import { useEffect, useRef } from "react";
import { Preloader } from "@/components/ui/preloader";
import { BEATS, framePosition } from "@/lib/beats";
import { FRAME_COUNT } from "@/lib/frames.generated";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_TRAVEL_VH, INTRO_VH } from "@/lib/scroll-plan";
import { BeatCopy } from "./beat-copy";
import { useFrameSequence } from "./use-frame-sequence";

const LAST = FRAME_COUNT - 1;
/** Travel the scrub itself gets — roughly 3vh per frame. */
const SCRUB_VH = 600;
/**
 * The section is lifted to sit behind the intro and made long enough to
 * absorb that lift, so the canvas is pinned and holding frame 0 the whole
 * time the intro is dissolving onto it. See lib/scroll-plan.
 */
const SCENE_HEIGHT = `${INTRO_TRAVEL_VH + SCRUB_VH + 100}vh`;
const SCENE_LIFT = `-${INTRO_VH}vh`;

type Painter = { draw: (frame: number) => void; resize: () => void };

export function ScrollScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const painterRef = useRef<Painter | null>(null);
  const { framesRef, ready, progress } = useFrameSequence();

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas || !ready) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let painted: HTMLImageElement | null = null;
      let current = 0;

      /** Nearest decoded frame, so a gap in the loader never blanks the canvas. */
      const resolve = (index: number) => {
        const frames = framesRef.current;
        if (frames[index]) return frames[index];
        for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
          const before = frames[index - offset];
          if (before) return before;
          const after = frames[index + offset];
          if (after) return after;
        }
        return null;
      };

      const draw = (frame: number) => {
        current = Math.min(LAST, Math.max(0, Math.round(frame)));
        const image = resolve(current);
        // Comparing images rather than indices means a stand-in frame is
        // replaced the moment the real one finishes decoding.
        if (!image || image === painted) return;
        painted = image;

        const { width, height } = canvas;

        // drawImage has no object-fit, so cover is done by hand: scale to the
        // larger fit and centre the overflow. The loader hands us a frame
        // already cropped to the viewport's orientation, so what spills past
        // the edges here is margin, not composition.
        const scale = Math.max(
          width / image.naturalWidth,
          height / image.naturalHeight,
        );
        const w = image.naturalWidth * scale;
        const h = image.naturalHeight * scale;

        ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        painted = null; // Resizing clears the bitmap; force the repaint.
        draw(current);
      };

      painterRef.current = { draw, resize };
      resize();

      const state = { frame: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // Pinned from the section's top, but held on frame 0 until the
          // intro overlay above it has finished dissolving. Resolved as a
          // function so a resize re-reads the viewport height.
          start: () =>
            `top+=${(window.innerHeight * INTRO_TRAVEL_VH) / 100} top`,
          end: "bottom bottom",
          // Lenis is already smoothing; stacking much more turns it to mush.
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        state,
        {
          frame: LAST,
          ease: "none",
          snap: { frame: 1 },
          // Duration 1 makes timeline positions equal normalised frame
          // progress, so beat copy can be placed by frame number below.
          duration: 1,
          onUpdate: () => draw(state.frame),
        },
        0,
      );

      for (const beat of BEATS) {
        const target = root.querySelector(`[data-beat="${beat.id}"]`);
        if (!target) continue;

        const start = framePosition(beat.from);
        const end = framePosition(beat.to);
        const fade = Math.min(0.045, (end - start) / 3);

        timeline
          .fromTo(
            target,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: fade, ease: "power2.out" },
            start,
          )
          .to(
            target,
            { autoAlpha: 0, y: -32, duration: fade, ease: "power2.in" },
            end - fade,
          );
      }
    },
    { scope: rootRef, dependencies: [ready] },
  );

  useEffect(() => {
    const onResize = () => painterRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {!ready && <Preloader progress={progress} />}
      <section
        ref={rootRef}
        aria-label="How National foods Hing is made"
        className="relative"
        style={{ height: SCENE_HEIGHT, marginTop: SCENE_LIFT }}
      >
        {/* Cream underneath: the canvas covers it once a frame lands, so this
            only shows in the gap before the first paint. */}
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-cream">
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />
          {BEATS.map((beat) => (
            <BeatCopy key={beat.id} beat={beat} />
          ))}
        </div>
      </section>
    </>
  );
}
