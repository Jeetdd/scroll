import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const EYEBROW =
  "font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold";
// The negative tracking is what the size is for: at the clamp's 2.5rem top end
// an uppercase extrabold line reads loose, and the same -0.01em on all five
// section headings keeps them one voice rather than five near-misses.
const HEADING =
  "mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] tracking-[-0.01em] text-white";
const BODY =
  "mt-6 font-editorial text-[17px] capitalize leading-[30px] text-white";
const CAPTION = `${EYEBROW} mt-4 text-center`;

/**
 * The same lift the About pictures carry, with the shadow inverted. These sit
 * on `char` (#0e0a06) — a black shadow there is invisible, so the depth cue has
 * to be light spilling off the edges rather than dark pooling under them.
 *
 * `scale` rather than `transform`, because Tailwind v4 compiles `scale-*` to
 * the standalone property; and the scale is `motion-safe` while the shadow
 * isn't, so reduced motion keeps the response without the movement.
 */
const LIFT =
  "transition-[scale,box-shadow] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] pointer-fine:hover:shadow-[0_20px_60px_rgba(247,243,238,0.1)] motion-safe:pointer-fine:hover:scale-[1.02]";
const FRAME = `relative aspect-[632/587] overflow-hidden rounded-[10px] ${LIFT}`;

export function Horizon() {
  return (
    <section
      className="relative isolate overflow-hidden bg-char px-6 py-20 sm:px-8 lg:py-[160px]"
      id="horizon"
    >
      <Image
        alt=""
        className="-z-10 absolute inset-0 object-cover object-center"
        fill
        sizes="100vw"
        src="/horizon/bg.png"
      />

      {/* The dark half of the two seams this section sits between: cream above,
          cream below. Same `-z-10` as the plate and after it in source, so they
          land on the picture and stay under the copy. */}
      <div
        aria-hidden
        className="-z-10 pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream/10 to-transparent"
      />
      <div
        aria-hidden
        className="-z-10 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream/10 to-transparent"
      />

      <div className="relative mx-auto max-w-[1380px]">
        {/* Today */}
        <div className="grid items-center gap-y-10 lg:grid-cols-[576fr_632fr] lg:gap-x-[173px]">
          <Reveal>
            <p className={EYEBROW}>The next 50 years</p>
            <h2 className={HEADING}>
              <span className="lg:block">Today, the Hing is only</span>{" "}
              <span className="lg:block">known as Kitchen Spice.</span>
            </h2>
            <p className={BODY}>
              For five thousand years, traditional texts have documented
              asafoetida&rsquo;s role in digestive health and wellness, the
              ancients called it Devashakha, the branch of the gods. For most of
              modern history, that knowledge stayed anecdotal. Keep scrolling.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className={FRAME}>
              <Image
                alt="A home cook inspecting a jar of hing-seasoned pickles amid rows of preserve jars"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                src="/horizon/man-holding-jar.png"
              />
            </div>
            <p className={CAPTION}>Today · Everyone Homes</p>
          </Reveal>
        </div>

        {/* Decorative flourish connecting the two eras — hidden on mobile, where
            the panels stack and a diagonal squiggle across that gap reads as
            noise rather than narrative. */}
        <div
          aria-hidden
          className="pointer-events-none relative mx-auto hidden max-w-[1380px] lg:block"
        >
          <div className="absolute top-[calc(41%-360px)] left-[37%] h-[760px] w-[17%] opacity-70">
            <Image
              alt=""
              className="object-contain"
              fill
              sizes="240px"
              src="/horizon/arrow.svg"
            />
          </div>
        </div>

        {/* Tomorrow */}
        <div className="mt-16 grid items-center gap-y-10 lg:grid-cols-[632fr_631fr] lg:gap-x-[117px]">
          <Reveal>
            <div className={FRAME}>
              <Image
                alt="A branded National Foods jar of hing beside a glass vial of capsules, representing hing's future in pharmaceutical formulation"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                src="/horizon/medicine-jars.png"
              />
            </div>
            <p className={CAPTION}>Tomorrow · Pharmacy</p>
          </Reveal>

          <Reveal delay={0.12}>
            <p className={EYEBROW}>The destination</p>
            <h2 className={HEADING}>
              <span className="lg:block">
                Tomorrow, the world will recognize its
              </span>{" "}
              <span className="lg:block">remarkable Medicinal</span>{" "}
              <span className="lg:block">Potential.</span>
            </h2>
            <p className={BODY}>
              At National Science, our researchers are isolating hing&rsquo;s
              bioactive compounds and studying their applications, with active
              research programs in cancer biology, microbiology and Ayurvedic
              formulation science. Patents filed. Studies underway. The
              destination: hing that moves from the kirana store to the medical
              store, from folk wisdom to formulated, evidence-backed
              applications. For our partners, that means early access to an
              ingredient category that does not exist yet.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
