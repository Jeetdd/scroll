import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const EYEBROW =
  "font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold";
const HEADING =
  "mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-white";
const BODY =
  "mt-6 font-editorial text-[17px] capitalize leading-[30px] text-white";
const CAPTION = `${EYEBROW} mt-4 text-center`;

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
            <div className="relative aspect-[632/587] overflow-hidden rounded-[10px]">
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
            <div className="relative aspect-[632/587] overflow-hidden rounded-[10px]">
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
