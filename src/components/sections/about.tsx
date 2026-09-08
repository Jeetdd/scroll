import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * Row-major, so the pairing reads across rather than down: scale beside
 * compliance, lineage beside longevity.
 */
const STATS = [
  { label: "Tons per shift. Industrial scale.", value: "5T+" },
  { label: "Global compliance. Zero compromises.", value: "10+" },
  { label: "Generations of focus. Zero distraction.", value: "3rd" },
  { label: "Years. One ingredient.", value: "55+" },
];

/**
 * The two labels are separate layers in the comp, not part of the plate — the
 * photograph underneath has blank glass. Positions are the comp's, expressed
 * against the 675x396 crop so they ride the image at any width. The second one
 * sits on an empty jar and is lightened rather than laid on top, which is what
 * makes it read as an etch in the glass instead of a sticker.
 */
const MARKS = [
  { blend: false, left: "32.15%", top: "48.23%" },
  { blend: true, left: "58.67%", top: "40.66%" },
];

export function About() {
  return (
    <section className="bg-cream px-6 py-20 sm:px-8 lg:py-[120px]" id="about">
      <div className="mx-auto max-w-[1380px]">
        {/* 652 / 53 / 675 out of 1380, straight from the comp. Ratio columns
            rather than percentages so the gutter stays a constant 53px and
            only the two picture columns absorb the difference. */}
        <div className="grid gap-x-[53px] gap-y-16 lg:grid-cols-[652fr_675fr]">
          <div>
            <Reveal>
              <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
                About National Foods
              </p>
              {/* The comp sets these three lines by hand. Inline spans that go
                  block at lg keep those breaks where there's room for them and
                  let the sentence reflow when there isn't. */}
              <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-black">
                <span className="lg:block">The invisible giant of</span>{" "}
                <span className="lg:block">a five-thousand-year-old</span>{" "}
                <span className="lg:block">ingredient.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative mt-[46px] aspect-[652/634] overflow-hidden">
                <Image
                  alt="Cured asafoetida granules on a stoneware plate beside a brass mortar and a bottle of hing oil"
                  className="object-cover object-[center_58%]"
                  fill
                  sizes="(min-width: 1024px) 47vw, 100vw"
                  src="/about/about-hing.png"
                />
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <p className="font-editorial text-[15px] capitalize leading-[30px] text-graphite">
                Raw asafoetida resin travels from the Ferula fields of
                Afghanistan and Iran to our processing complex in Baroda,
                Gujarat, India. Within this single, unbroken supply chain, we
                maintain strict Pharma-Grade Manufacturing Standards, including
                advanced automation, CIP cleaning systems, AI-driven processes
                and laboratory-backed quality control to ensure minimal human
                intervention.
              </p>

              <p className="mt-[40px] font-editorial font-semibold text-[16px] capitalize leading-[30px] text-black">
                What leaves our facility is pure hing engineered to strict
                pharmaceutical standards.
              </p>

              <hr className="mt-[21px] border-black/20" />

              {/* The comp's columns are deliberately uneven — the left labels
                  run longer. That only helps at full width; below lg the two
                  even out so neither label wraps harder than the other. */}
              <dl className="mt-[44px] grid grid-cols-2 gap-x-4 gap-y-[39px] lg:grid-cols-[353fr_322fr] lg:gap-x-0">
                {STATS.map((stat) => (
                  <div key={stat.value}>
                    <dt className="font-editorial font-bold text-[30px] leading-[1.16] text-black">
                      {stat.value}
                    </dt>
                    <dd className="mt-[9px] font-editorial font-medium text-[16px] capitalize leading-[1.16] text-graphite">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative mt-[56px] aspect-[675/396] overflow-hidden">
                <Image
                  alt="Hira Hing granules in a labelled pharmaceutical vial beside a jar of capsules"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 49vw, 100vw"
                  src="/about/about-pharma.png"
                />
                {MARKS.map((mark) => (
                  <div
                    aria-hidden
                    className={`absolute h-[12.37%] w-[9.19%] ${
                      mark.blend ? "mix-blend-plus-lighter" : ""
                    }`}
                    key={mark.left}
                    style={{ left: mark.left, top: mark.top }}
                  >
                    <Image
                      alt=""
                      className="object-contain"
                      fill
                      sizes="62px"
                      src="/about/nf-mark.png"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.28}>
          <p className="mt-6 text-center font-script font-bold text-[clamp(1.75rem,2.08vw,2.5rem)] capitalize leading-[1.25] text-onyx">
            Tomorrow · Pharmacy — concept visualisation, research in progress
          </p>
        </Reveal>
      </div>
    </section>
  );
}
