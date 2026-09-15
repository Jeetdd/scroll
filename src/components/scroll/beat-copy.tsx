import { BEATS, type Beat } from "@/lib/beats";

/**
 * One act's copy, overlaid on the pinned canvas.
 *
 * Positioning lives on the outer element and stays transform-free: GSAP owns
 * the inner element's transform, and a Tailwind `translate` utility on the
 * same node would be clobbered on the first tween.
 */
export function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-end px-[6vw] pb-[14vh] sm:items-center sm:pb-0 ${
        beat.align === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <div className="relative max-w-lg opacity-0" data-beat={beat.id}>
        {/* Phones draw the film full-bleed, so the copy now sits on footage
            rather than on the page. Scrim it back to something ink can be read
            against — inside the fading element, so it comes and goes with the
            copy instead of permanently dulling the frame. */}
        <div
          aria-hidden
          className="-inset-x-[20vw] -top-24 -bottom-[16vh] absolute bg-gradient-to-t from-cream from-43% via-cream/80 to-transparent sm:hidden"
        />
        {/* Only the opening beat. It is the one that lands on the pale, busy
            root footage, where ink on cream-on-cream has nothing to separate it;
            the later beats play over darker, calmer frames that the type already
            reads against, and a bloom there would be a wash over footage that
            didn't need one.

            The same idea as the phone scrim above, turned into a bloom rather
            than a band. An ellipse has no edges to catch — it reads as light
            falling on the frame where the copy sits, not as a panel laid over
            it, which is what any straight-edged wash or glyph outline gives
            away. Never fully opaque at the centre either: at 88% the footage
            still ghosts through the brightest part, so the copy stays on the
            image instead of in a card floating above it.

            Kept just past the text box rather than out at the viewport's scale,
            so the falloff still ends in the frame's own colour instead of
            drawing a lit region you can find the shape of. */}
        {beat.id === BEATS[0].id && (
          <div
            aria-hidden
            className="-inset-x-[9vw] -inset-y-[8vh] absolute hidden sm:block"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-cream) 88%, transparent) 0%, color-mix(in srgb, var(--color-cream) 66%, transparent) 42%, transparent 72%)",
            }}
          />
        )}
        {/* Positioned, so it paints over the scrims above rather than under
            them — an absolute box outranks static siblings whatever the source
            order. */}
        <div className="relative">
          {/* <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-resin">
            <span>{beat.ordinal}</span>
            <span className="h-px w-8 bg-resin/40" />
            <span>{beat.label}</span>
          </p> */}
          <h2 className="mt-5 text-balance font-display text-headline leading-[1.05] text-ink">
            {beat.title}
          </h2>
          <p className="mt-4 max-w-md text-pretty text-lede leading-relaxed text-ink-soft">
            {beat.body}
          </p>
        </div>
      </div>
    </div>
  );
}
