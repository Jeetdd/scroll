import Image from "next/image";
import { BEATS } from "@/lib/beats";
import { FRAME_TIERS, frameSrc } from "@/lib/frames.generated";

const { width, height } = FRAME_TIERS.desktop;

/**
 * The reduced-motion telling of the same story: no pin, no scrub, one still
 * per act laid out in normal document flow.
 */
export function StaticScene() {
  return (
    <section
      aria-label="How Hira Hing is made"
      className="mx-auto max-w-5xl space-y-24 px-6 py-24"
    >
      {BEATS.map((beat) => (
        <article
          key={beat.id}
          className="grid items-center gap-8 sm:grid-cols-2 sm:gap-12"
        >
          <Image
            alt=""
            className="w-full rounded-sm bg-canvas"
            height={height}
            src={frameSrc("desktop", Math.round((beat.from + beat.to) / 2))}
            unoptimized
            width={width}
          />
          <div>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-resin">
              <span>{beat.ordinal}</span>
              <span className="h-px w-8 bg-resin/40" />
              <span>{beat.label}</span>
            </p>
            <h2 className="mt-5 text-balance font-display text-headline leading-[1.05] text-ink">
              {beat.title}
            </h2>
            <p className="mt-4 text-pretty text-lede leading-relaxed text-ink-soft">
              {beat.body}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
