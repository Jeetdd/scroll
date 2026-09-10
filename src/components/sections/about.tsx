"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT } from "@/lib/ease";

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
 * The four stats enter one at a time rather than as a block, so the eye is
 * given the reading order the grid is built around.
 *
 * Staggered from the container rather than by per-item delays: one observer
 * for the set means the cascade always runs in row-major order. Four separate
 * `whileInView` items would each start on their own row crossing the margin,
 * and on a phone — where the grid is two columns tall — the delays would stack
 * on top of that and the last pair would arrive long after it was on screen.
 */
const GRID: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

/**
 * The two pictures lift under a real pointer. Not a link affordance — there is
 * nothing to click — but a material signal that the surface is live.
 *
 * `scale`, not `transform`: Tailwind v4 compiles `scale-*` to the standalone
 * `scale` property, so a `transition-[transform,box-shadow]` would leave the
 * lift jumping between its two ends untransitioned.
 *
 * The scale is `motion-safe` and the shadow isn't, so under reduced motion the
 * frame still answers — it just deepens instead of moving.
 */
const LIFT =
  "transition-[scale,box-shadow] duration-[400ms] ease-out pointer-fine:hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] motion-safe:pointer-fine:hover:scale-[1.02]";

const STAT: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

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
              <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] tracking-[-0.01em] text-black">
                <span className="lg:block">The invisible giant of</span>{" "}
                <span className="lg:block">a five-thousand-year-old</span>{" "}
                <span className="lg:block">ingredient.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                className={`relative mt-[46px] aspect-[652/634] overflow-hidden ${LIFT}`}
              >
                <Image
                  alt="Golden asafoetida granules spilling from a wooden scoop onto a wood surface"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 47vw, 100vw"
                  src="/about/about-hing-masked.png"
                />
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <p className="font-editorial text-[17px] capitalize leading-[30px] text-graphite">
                Raw asafoetida resin travels from the Ferula fields of
                Afghanistan and Iran to our processing complex in Baroda,
                Gujarat, India. Within this single, unbroken supply chain, we
                maintain strict Pharma-Grade Manufacturing Standards, including
                advanced automation, CIP cleaning systems, AI-driven processes
                and laboratory-backed quality control to ensure minimal human
                intervention.
              </p>

              <p className="mt-[40px] font-editorial font-semibold text-[18px] capitalize leading-[30px] text-black">
                What leaves our facility is pure hing engineered to strict
                pharmaceutical standards.
              </p>

              <hr className="mt-[21px] border-black/20" />
            </Reveal>

            {/* Outside the Reveal above, not inside it: nesting the stagger in
                a block that is itself fading in would fade each stat twice, and
                the cascade would be lost inside the parent's own 850ms.

                The comp's columns are deliberately uneven — the left labels run
                longer. That only helps at full width; below lg the two even out
                so neither label wraps harder than the other. */}
            <motion.dl
              className="mt-[44px] grid grid-cols-2 gap-x-4 gap-y-[39px] lg:grid-cols-[353fr_322fr] lg:gap-x-0"
              initial="hidden"
              variants={GRID}
              viewport={{ once: true, margin: "-12%" }}
              whileInView="shown"
            >
              {/* 1.3 rather than the 1.16 both of these carried. The value
                  never wraps at any width, so it only gains a little air; the
                  label does — "Global compliance. Zero compromises." is two
                  lines from 1440 down — and at 1.16 those two lines set 18px
                  type on a 20.9px slug, which is tighter than anything else on
                  the page. They keep one number because they read as one
                  block. */}
              {STATS.map((stat) => (
                <motion.div key={stat.value} variants={STAT}>
                  <dt className="font-editorial font-bold text-[30px] leading-[1.3] text-black">
                    {stat.value}
                  </dt>
                  <dd className="mt-[9px] font-editorial font-medium text-[18px] capitalize leading-[1.3] text-graphite">
                    {stat.label}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <Reveal delay={0.2}>
              <div
                className={`relative mt-[56px] aspect-[675/396] overflow-hidden ${LIFT}`}
              >
                <Image
                  alt="Line workers in hairnets and gloves processing hing granules in National Foods' pharma-grade facility"
                  className="object-cover rounded-b-lg"
                  fill
                  sizes="(min-width: 1024px) 49vw, 100vw"
                  src="/about/about-pharma-new.png"
                />
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.28}>
          <p className="mt-8 text-center font-quote font-bold text-[25px] capitalize leading-[50px] text-onyx lg:mx-auto lg:max-w-4xl">
            The future is not a distant destination. It is a sequence of
            choices, made decade by decade.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
