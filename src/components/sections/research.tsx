"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import {
  CapacityPanel,
  CustomizationPanel,
} from "@/components/sections/research-panels";
import { Reveal } from "@/components/ui/reveal";

/**
 * `heading` is an array because each tab's line breaks are set, not wrapped —
 * the column is 675px and a 30px uppercase line holds about 36 characters, so
 * left to itself the type breaks in the wrong places.
 */
const TABS = [
  {
    body: "Laboratory-backed quality control is not a final checkpoint, it is embedded in the line. Humidity, drying temperature, mixing time and machine operations are continuously monitored under AGMARK-approved laboratory protocols. AI-driven process control flags deviation before it becomes variation. The result: hing so consistent that a pinch in Mumbai and a pinch in Munich behave identically.",
    heading: ["Every batch. Every", "parameter. Every time."],
    id: "quality",
    label: "01 / Quality",
    points: [
      "Batch-level traceability, end to end",
      "AGMARK-approved in-house laboratory",
      "10+ international certifications",
    ],
  },
  {
    body: "India's first and largest hing processing plant produces over five tonnes per shift, with the automation to scale without the quality drift that plagues this industry. Whether you need a container or a supply contract, capacity is never your constraint. It's ours to manage, and we've been managing it for over five decades.",
    heading: ["Pilot run or national rollout.", "Same line. Same standard."],
    id: "capacity",
    label: "02 / Capacity",
    points: [
      "5T+ per shift, India's largest dedicated facility",
      "Serving India's biggest brands simultaneously",
      "No conflict. No shortage. No drift.",
    ],
  },
  {
    body: "Our research team works backwards from your market gap: target cuisine, target potency, target format, target price point. We prototype, you validate, we scale. Compounded blends, pure grades, encapsulation-ready powders, white-label consumer formats, with formulation IP handled cleanly and your confidentiality protected.",
    heading: ["Tell us the product you wish", "existed."],
    id: "customization",
    label: "03 / Customization",
    points: [
      "Custom formulation laboratory",
      "White-label & private-label programs",
      "Patents filed on proprietary processes",
    ],
  },
];

/** The comp's cell widths. Kept as numbers so the pointer can be derived. */
const TAB_WIDTHS = [205, 201, 215];
const BAR_WIDTH = TAB_WIDTHS.reduce((total, width) => total + width, 0);

function pointerLeft(index: number) {
  const before = TAB_WIDTHS.slice(0, index).reduce(
    (total, width) => total + width,
    0,
  );
  return `${((before + TAB_WIDTHS[index] / 2) / BAR_WIDTH) * 100}%`;
}

export function Research() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;

    event.preventDefault();
    const next = (active + delta + TABS.length) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      className="bg-cream px-6 py-20 sm:px-8 lg:py-[120px]"
      id="research"
    >
      <div className="mx-auto max-w-[1380px]">
        {/* 550 / 155 / 675. The gutter is wider than the About row's because
            the headline column is narrower here, not because the grid moved. */}
        <div className="grid gap-x-[155px] gap-y-12 lg:grid-cols-[550fr_675fr]">
          <Reveal>
            <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
              The National Science Research Centre
            </p>
            <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-black">
              <span className="lg:block">The only hing company</span>{" "}
              <span className="lg:block">with its own Research</span>{" "}
              <span className="lg:block">Centre.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="font-editorial text-[17px] capitalize leading-[30px] text-graphite">
              Established in 2016, National Science is the world&rsquo;s first
              dedicated asafoetida research facility, isolating compounds,
              filing patents, running studies across microbiology, extraction
              methodology and agricultural science.
            </p>

            {/* 205 / 201 / 215 — the cells are uneven in the comp so each label
                sits on its own centre without the bar growing. */}
            <div className="relative mt-[40px] max-w-[621px]">
              <div
                aria-label="Research centre capabilities"
                className="grid grid-cols-[205fr_201fr_215fr] overflow-hidden rounded-full border border-black/20"
                onKeyDown={onKeyDown}
                role="tablist"
              >
                {TABS.map((entry, index) => {
                  const selected = index === active;
                  // The comp drops the rule next to the filled cell — its own
                  // edge already does that job.
                  const ruled = index > 0 && !selected && index - 1 !== active;

                  return (
                    <button
                      aria-controls={`research-panel-${entry.id}`}
                      aria-selected={selected}
                      className={`flex min-h-[47px] items-center justify-center px-2 py-2 text-center font-editorial font-extrabold text-[11px] capitalize transition-colors sm:text-[14px] ${
                        selected
                          ? "bg-vermilion text-white"
                          : "text-black hover:bg-black/5"
                      } ${ruled ? "border-black/20 border-l" : ""}`}
                      id={`research-tab-${entry.id}`}
                      key={entry.id}
                      onClick={() => setActive(index)}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      role="tab"
                      tabIndex={selected ? 0 : -1}
                      type="button"
                    >
                      {entry.label}
                    </button>
                  );
                })}
              </div>
              <motion.div
                animate={{ left: pointerLeft(active) }}
                aria-hidden
                className="-translate-x-1/2 absolute top-full h-0 w-0 border-t-[12px] border-t-vermilion border-x-[9.5px] border-x-transparent"
                initial={false}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </Reveal>
        </div>

        <hr className="mt-[46px] border-black/20" />

        {/* 675 / 56 / 649. Keyed on the tab so the swap animates in; the
            surrounding Reveal keeps owning the scroll entrance. */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby={`research-tab-${tab.id}`}
          className="mt-[60px] grid gap-x-[56px] gap-y-12 lg:grid-cols-[675fr_649fr]"
          id={`research-panel-${tab.id}`}
          initial={{ opacity: 0, y: 14 }}
          key={tab.id}
          role="tabpanel"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:mt-[9px]">
            <h3 className="font-editorial font-semibold text-[clamp(1.5rem,1.56vw,1.875rem)] uppercase leading-[1.333] text-black">
              {tab.heading.map((line) => (
                <span className="lg:block" key={line}>
                  {line}{" "}
                </span>
              ))}
            </h3>

            <p className="mt-[20px] font-editorial text-[17px] capitalize leading-[30px] text-graphite">
              {tab.body}
            </p>

            <ul className="mt-[31px] grid gap-y-3">
              {tab.points.map((point) => (
                <li
                  className="flex items-start gap-[10px] leading-[28px]"
                  key={point}
                >
                  {/* These sit on one line in the comp and wrap on a phone, so
                      the dot is pinned to the first line's centre instead of
                      floating to the middle of a two-line block. */}
                  <span
                    aria-hidden
                    className="mt-[9px] size-[9px] shrink-0 rounded-full bg-marigold"
                  />
                  <span className="font-editorial font-semibold text-[18px] uppercase tracking-[0.1em] text-black">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {tab.id === "quality" ? (
            // The plate is 742x496 and the comp shows a 649x408 window onto it
            // at natural size, so the crop is a percentage of the frame rather
            // than an object-position — same trim at every width.
            <div className="relative aspect-[649/408] overflow-hidden rounded-[7px]">
              <Image
                alt="In-line QC readout for batch NF-26-0713: humidity 5.9%, drying temp 42°C, mix uniformity 99.4%, particle deviation 0.66µ — all parameters within spec"
                className="absolute top-[-12.01%] left-[-7.4%] h-[121.57%] w-[114.33%] max-w-none"
                height={496}
                src="/research/qc-panel.png"
                width={742}
              />
            </div>
          ) : null}
          {tab.id === "capacity" ? <CapacityPanel /> : null}
          {tab.id === "customization" ? <CustomizationPanel /> : null}
        </motion.div>
      </div>
    </section>
  );
}
