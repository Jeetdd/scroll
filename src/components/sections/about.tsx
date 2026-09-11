"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT } from "@/lib/ease";

const STATS = [
  {
    label: "Tons Per Shift.\nIndustrial Scale.",
    value: "5T+",
    icon: "/about/04_icon_factory.png",
  },
  {
    label: "Global Compliance.\nZero Compromises.",
    value: "10+",
    icon: "/about/05_icon_global.png",
  },
  {
    label: "Generations Of Focus.\nZero Distraction.",
    value: "3rd",
    icon: "/about/06_icon_generations.png",
  },
  {
    label: "Years. One Ingredient.",
    value: "55+",
    icon: "/about/07_icon_heritage.png",
  },
];

const GRID: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

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
        <div className="grid gap-x-[53px] gap-y-16 lg:grid-cols-[652fr_675fr]">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
                  About National Foods
                </p>
                <div className="h-px w-[60px] bg-marigold" />
              </div>
              <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] tracking-[-0.01em] text-black">
                <span className="lg:block">The invisible giant of</span>{" "}
                <span className="lg:block">a five-thousand-year-old</span>{" "}
                <span className="lg:block text-vermilion">ingredient.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative mt-[46px]">
                <div className="absolute -top-10 right-4 z-10 hidden sm:flex size-[140px] items-center justify-center rounded-full border border-black/10 bg-cream/30 backdrop-blur-sm pointer-events-none">
                  <svg
                    role="img"
                    aria-label="Nature's Power Badge"
                    className="absolute inset-0 size-full animate-[spin_20s_linear_infinite]"
                    viewBox="0 0 100 100"
                  >
                    <path
                      id="curve"
                      d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="transparent"
                    />
                    <text
                      className="font-editorial text-[9.5px] font-bold tracking-[0.2em] uppercase mix-blend-multiply"
                      fill="currentColor"
                    >
                      <textPath
                        href="#curve"
                        startOffset="0%"
                        className="text-graphite"
                      >
                        NATURE&apos;S POWER • A HEALTHIER TOMORROW •&nbsp;
                      </textPath>
                    </text>
                  </svg>
                  <Image
                    src="/about/07_icon_heritage.png"
                    alt=""
                    width={28}
                    height={28}
                    className="opacity-80 mix-blend-multiply"
                  />
                </div>

                <div
                  className={`relative aspect-[652/634] overflow-hidden ${LIFT}`}
                >
                  <Image
                    alt="Golden asafoetida granules spilling from a wooden scoop onto a wood surface"
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 47vw, 100vw"
                    src="/about/hing_spoon.png"
                  />
                </div>

                <div className="mt-5">
                  <hr className="mb-3 w-10 border-black/30" />
                  <p className="font-editorial text-[11px] font-bold uppercase tracking-[0.12em] leading-[1.7] text-graphite">
                    Same roots.
                    <br />
                    New possibilities.
                  </p>
                </div>
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

              <p className="mt-6 font-editorial font-semibold text-[18px] capitalize leading-[30px] text-black">
                What leaves our facility is pure hing engineered to strict
                pharmaceutical standards.
              </p>

              <hr className="mt-4 border-black/20" />
            </Reveal>

            <motion.dl
              className="mt-8 grid grid-cols-2 lg:grid-cols-[353fr_322fr]"
              initial="hidden"
              variants={GRID}
              viewport={{ once: true, margin: "-12%" }}
              whileInView="shown"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.value}
                  variants={STAT}
                  className={`flex items-start gap-4 py-4 ${
                    i < 2 ? "border-b border-black/10" : ""
                  } ${i % 2 === 0 ? "pr-4 border-r border-black/10" : "pl-6"}`}
                >
                  <div className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[#fce9e9]">
                    <Image
                      src={stat.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <dt className="font-editorial font-bold text-[30px] leading-[1.3] text-black">
                      {stat.value}
                    </dt>
                    <dd className="mt-[9px] font-editorial font-medium text-[15px] capitalize leading-[1.3] text-graphite whitespace-pre-line">
                      {stat.label}
                    </dd>
                  </div>
                </motion.div>
              ))}
            </motion.dl>

            <Reveal delay={0.2}>
              <div
                className={`relative mt-10 aspect-[675/310] overflow-hidden ${LIFT}`}
              >
                <Image
                  alt="Line workers in hairnets and gloves processing hing granules in National Foods' pharma-grade facility"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 49vw, 100vw"
                  src="/about/factory_new.png"
                />
                <div className="absolute right-0 top-0 bottom-0 w-[120px] bg-white/70 backdrop-blur-md flex flex-col justify-center px-5">
                  <p className="font-editorial text-[10px] font-bold tracking-[0.15em] text-graphite uppercase leading-[1.8]">
                    Purity
                    <br />
                    Processed
                    <br />
                    For a brighter
                    <br />
                    Tomorrow.
                  </p>
                </div>
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
