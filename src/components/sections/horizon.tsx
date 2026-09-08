import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * The one full-bleed section between About and the process steps. Its plate is
 * a flattened export of the comp's mask group — the original is a masked image
 * mirrored against itself with a strip knocked out of the shelf, and rebuilding
 * that stack in CSS would be three layers of guesswork for a result the export
 * already gives exactly.
 */
export function Horizon() {
  return (
    <section
      className="relative isolate min-h-[620px] overflow-hidden bg-char px-6 py-20 sm:px-8 lg:min-h-[681px] lg:py-[120px]"
      id="horizon"
    >
      <Image
        alt=""
        className="-z-20 absolute inset-0 object-cover object-center"
        fill
        sizes="100vw"
        src="/horizon/shelf.png"
      />

      {/* The plate is 1920x681. Cropped to a phone it becomes a narrow slice
          through its own centre, which is exactly where the lamp and the jar
          are — so the copy lands on the brightest part of the picture instead
          of the dark margins it was set against. This puts the dark back under
          the text. At lg the top of the plate is already near-black and the
          scrim would only dull the lamp, so it doesn't run there. */}
      <div
        aria-hidden
        className="-z-10 absolute inset-0 bg-gradient-to-b from-char/90 via-char/75 to-transparent lg:hidden"
      />

      {/* 823 / 557, no gutter — the body column is pulled in from the right
          edge of the grid rather than sitting beside the headline. */}
      <div className="mx-auto grid max-w-[1380px] gap-y-10 lg:grid-cols-[823fr_557fr]">
        <Reveal>
          <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
            The next 50 years
          </p>
          <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-white">
            <span className="lg:block">Today, the Hing is only</span>{" "}
            <span className="lg:block">known as Kitchen Spice.</span>
          </h2>
        </Reveal>

        <Reveal className="lg:mt-[12px]" delay={0.1}>
          <p className="font-editorial text-[15px] capitalize leading-[30px] text-white">
            For five thousand years, traditional texts have documented
            asafoetida&rsquo;s role in digestive health and wellness, the
            ancients called it Devashakha, the branch of the gods. For most of
            modern history, that knowledge stayed anecdotal. Keep scrolling.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
