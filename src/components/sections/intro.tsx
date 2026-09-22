"use client";

import { useRef, useState } from "react";
import MaskedHeading from "@/components/ui/MaskedHeading";
import {
  FRAME_MASK_FILL,
  FRAME_MASK_FILL_PORTRAIT,
} from "@/lib/frames.generated";
import { gsap, useGSAP } from "@/lib/gsap";
import { whenIntroOpen } from "@/lib/intro-gate";
import { INTRO_VH } from "@/lib/scroll-plan";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const HEADING = "WORLD'S LARGEST PRODUCERS OF ASAFOETIDA.";

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
  // Subscribed once per mount, not per render: as `MaskedHeading`'s `hold` it
  // is an effect dependency, and a fresh promise every render would re-arm the
  // observer and reset the glyphs on every pass.
  const [introHold] = useState(whenIntroOpen);
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

      // Every position below is a fraction of the runway, so halving INTRO_VH
      // halves the scroll each move costs without changing how they overlap.
      // The move ends at 1, not 0.85: a tail of runway with nothing left to
      // animate is scroll the reader pays for and gets nothing back from, and
      // it reads as the headline refusing to leave.
      timeline
        .to(cue, { autoAlpha: 0, duration: 0.06, ease: "none" }, 0)
        // `power1.in`, not `power2.in`. Both accelerate into the hand-off, but
        // a quadratic ease-in is nearly flat for its first third — over a long
        // runway that's a slow build, over this one it's a first flick of the
        // wheel that appears to do nothing, which is the complaint. The gentler
        // curve moves on the first pixel and still gathers pace.
        .fromTo(
          heading,
          { scale: 1 },
          { scale: 2.6, ease: "power1.in", duration: 1 },
          0,
        )
        // Lifting the veil is the reveal. There is nothing behind it but the
        // scene's canvas, already pinned and holding frame 0. It gets a larger
        // share of a shorter runway than it had of the long one — a dissolve is
        // the one move here that cheapens if it's hurried, and stretching it
        // means the film is already showing through while the type is still
        // growing, so the hand-off overlaps instead of stepping.
        .fromTo(
          veil,
          { autoAlpha: 1 },
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.46 },
          0.3,
        )
        // Out on `power2.in` — slow to let go, then gone. An exit that leaves
        // at a constant rate reads as a dropped layer rather than a departure.
        .to(heading, { autoAlpha: 0, ease: "power2.in", duration: 0.38 }, 0.62);
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
          {/* Held until the preloader's curtain starts lifting, so the words
              rise out from behind its edge instead of finishing underneath it. */}
          <MaskedHeading
            {...MASKED}
            hold={introHold}
            reveal="rise"
            textScale={textScale}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          ref={cueRef}
        >
          {/* 0.25em, the same as the beat labels inside the scene. At 0.4em a
              five-letter word stops reading as a word and starts reading as
              five letters, which is the opposite of a legible affordance.

              The drift lives on this span rather than the wrapper GSAP owns —
              the timeline writes `autoAlpha` on the parent, so the two never
              touch the same property. `motion-safe` is the reduced-motion gate;
              it also covers the frame before the hook below has resolved,
              where the cue is briefly rendered either way. */}
          <span
            aria-hidden
            className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-ink-soft/60 motion-safe:animate-scroll-hint"
          >
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
