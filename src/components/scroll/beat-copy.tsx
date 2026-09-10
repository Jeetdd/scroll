import type { Beat } from "@/lib/beats";

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
          className="-inset-x-[20vw] -top-24 -bottom-[16vh] absolute bg-gradient-to-t from-cream from-35% via-cream/80 to-transparent sm:hidden"
        />
        {/* Positioned, so it paints over the scrim above rather than under it —
            an absolute box outranks static siblings whatever the source order. */}
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
