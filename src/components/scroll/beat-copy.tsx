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
        {/* Sits inside the fading element so the scrim comes and goes with the
            copy instead of permanently dulling the film behind it. */}
        <div
          aria-hidden
          className="-inset-x-[18vw] -inset-y-24 -z-10 absolute bg-[radial-gradient(closest-side,rgba(239,234,225,0.94),rgba(239,234,225,0))]"
        />
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-resin">
          <span>{beat.ordinal}</span>
          <span className="h-px w-8 bg-resin/40" />
          <span>{beat.label}</span>
        </p>
        <h2 className="mt-5 text-balance font-display text-headline leading-[1.05] text-ink">
          {beat.title}
        </h2>
        <p className="mt-4 max-w-md text-pretty text-lede leading-relaxed text-ink-soft">
          {beat.body}
        </p>
      </div>
    </div>
  );
}
