"use client";

import { useRef } from "react";
import MaskedHeading from "@/components/ui/MaskedHeading";
import {
  FRAME_MASK_FILL,
  FRAME_MASK_FILL_PORTRAIT,
} from "@/lib/frames.generated";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_VH } from "@/lib/scroll-plan";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const HEADING = "World's largest producers of asafoetida.";

const MASKED = {
  align: "center",
  drift: 7,
  duration: 1.3,
  fillScale: 1.3,
  lineHeight: 0.94,
  parallax: 14,
  // The frame the pinned canvas opens on, so the type is cut out of the same
  // picture the veil is about to uncover behind it — but the pre-graded copy,
  // not the raw one. The footage is shot on cream throughout, so ungraded the
  // letters would land barely darker than the page. Grading the file rather
  // than passing `brightness`/`saturation` keeps a filter off this heading,
  // which repaints on every frame of the growth.
  src: FRAME_MASK_FILL,
  // Matched to the sequence loader's own tier query, so the letters are cut
  // out of the same crop the canvas behind the veil is about to show.
  srcNarrow: FRAME_MASK_FILL_PORTRAIT,
  stagger: 0.1,
  tag: "h1",
  text: HEADING,
  tracking: -0.035,
  weight: 900,
} as const;

/**
 * Font size is a fraction of the heading's own width, so a phone needs a much
 * bigger fraction to fill the same proportion of the screen. 0.145 puts the
 * longest word — "asafoetida." — just inside a 390px viewport.
 */
const TEXT_SCALE = { narrow: 0.145, wide: 0.105 };

export function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const narrow = useMediaQuery("(max-width: 640px)");
  const textScale = narrow ? TEXT_SCALE.narrow : TEXT_SCALE.wide;

  useGSAP(
    () => {
      if (reduced) return;
      const root = rootRef.current;
      const heading = headingRef.current;
      const veil = veilRef.current;
      const cue = cueRef.current;
      if (!(root && heading && veil && cue)) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // Ends exactly where the sticky stage unpins, which is also where
          // the scene below is set to start scrubbing.
          end: "bottom bottom",
          // Matches the scene's scrub so the two read as one move.
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(cue, { autoAlpha: 0, duration: 0.05, ease: "none" }, 0)
        // Eased in, not linear: the growth should accelerate into the
        // hand-off rather than crawl to a stop at full size.
        .fromTo(
          heading,
          { scale: 1 },
          { scale: 3.4, ease: "power2.in", duration: 1 },
          0,
        )
        // Lifting the veil is the reveal. There is nothing behind it but the
        // scene's canvas, already pinned and holding frame 0.
        .fromTo(
          veil,
          { autoAlpha: 1 },
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.3 },
          0.4,
        )
        .to(heading, { autoAlpha: 0, ease: "power2.in", duration: 0.24 }, 0.61);
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  // No runway worth scrolling when the growth isn't going to happen, so the
  // reduced-motion telling is just the headline, once, at rest.
  if (reduced) {
    return (
      // `overflow-x-clip`, because the mask's media layer is scaled past its
      // own box by `fillScale` and only the clip-path stops it being painted —
      // the layout overflow is still there, and without a clip somewhere it
      // puts a horizontal scrollbar on the page. Clipping the x axis only
      // leaves the glyphs' vertical overhang alone.
      <section
        className="flex min-h-svh items-center overflow-x-clip px-[6vw] py-32 sm:px-8"
        id="top"
      >
        <div className="mx-auto w-full max-w-6xl">
          <MaskedHeading {...MASKED} reveal="none" textScale={textScale} />
        </div>
      </section>
    );
  }

  return (
    // Above the scene, which is lifted to sit underneath this whole section.
    <section
      className="relative z-10"
      id="top"
      ref={rootRef}
      style={{ height: `${INTRO_VH}vh` }}
    >
      {/* Centred at every size: the canvas behind the veil now fills the
          viewport on portrait too, so there is no band to line the type up
          with. */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cream" ref={veilRef} />

        {/* Deliberately no `will-change: transform` here. The heading is an
            image behind an SVG text clip behind a CSS filter; promoting this
            wrapper makes Chrome rasterise all of that once and then scale the
            texture, which smears one row of the clip mask into a hairline
            across the top of its bounding box. Letting it re-rasterise per
            frame costs a little and looks right. */}
        <div
          className="relative mx-auto w-full max-w-6xl px-[6vw] sm:px-8"
          ref={headingRef}
        >
          <MaskedHeading
            {...MASKED}
            reveal="rise"
            textScale={textScale}
            trigger="view"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          ref={cueRef}
        >
          {/* 0.25em, the same as the beat labels inside the scene. At 0.4em a
              five-letter word stops reading as a word and starts reading as
              five letters, which is the opposite of a legible affordance. */}
          <span
            aria-hidden
            className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-ink-soft/60"
          >
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
