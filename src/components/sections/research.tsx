import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * Only Quality is specified in the comp — the panel below is its content, and
 * there is no copy yet for the other two. They render in their unselected
 * state, which is exactly what the design shows; wiring the bar up is a matter
 * of giving each entry a panel, not of rebuilding it.
 */
const TABS = [
  { active: true, label: "01 / Quality" },
  { active: false, label: "02 / Capacity" },
  { active: false, label: "03 / Customization" },
];

const CREDENTIALS = [
  "Batch-level traceability, end to end",
  "AGMARK-approved in-house laboratory",
  "10+ international certifications",
];

export function Research() {
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
            <p className="font-editorial text-[15px] capitalize leading-[30px] text-graphite">
              Established in 2016, National Science is the world&rsquo;s first
              dedicated asafoetida research facility, isolating compounds,
              filing patents, running studies across microbiology, extraction
              methodology and agricultural science.
            </p>

            {/* 205 / 201 / 215 — the cells are uneven in the comp so each label
                sits on its own centre without the bar growing. */}
            <div className="relative mt-[40px] max-w-[621px]">
              <div className="grid grid-cols-[205fr_201fr_215fr] overflow-hidden rounded-full border border-black/20">
                {TABS.map((tab, index) => (
                  <div
                    // "03 / Customization" is the widest label and won't hold a
                    // line at 14px once the bar is phone-width, so the type
                    // steps down and the cell is allowed to grow rather than
                    // clipping its own text against a fixed height.
                    className={`flex min-h-[47px] items-center justify-center px-2 py-2 text-center font-editorial font-extrabold text-[11px] capitalize sm:text-[14px] ${
                      tab.active ? "bg-vermilion text-white" : "text-black"
                    } ${
                      // Only the third cell gets a rule. The pill's own edge
                      // already separates the first two, which is why the comp
                      // hides that divider.
                      index === 2 ? "border-black/20 border-l" : ""
                    }`}
                    key={tab.label}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              {/* Centred on the active cell: half of 205 across a 621 bar. */}
              <div
                aria-hidden
                className="-translate-x-1/2 absolute top-full left-[16.51%] h-0 w-0 border-t-[12px] border-t-vermilion border-x-[9.5px] border-x-transparent"
              />
            </div>
          </Reveal>
        </div>

        <hr className="mt-[46px] border-black/20" />

        {/* 675 / 56 / 649. */}
        <div className="mt-[60px] grid gap-x-[56px] gap-y-12 lg:grid-cols-[675fr_649fr]">
          <Reveal className="lg:mt-[9px]">
            <h3 className="font-editorial font-semibold text-[clamp(1.5rem,1.56vw,1.875rem)] uppercase leading-[1.333] text-black">
              <span className="lg:block">Every batch. Every</span>{" "}
              <span className="lg:block">parameter. Every time.</span>
            </h3>

            <p className="mt-[20px] font-editorial text-[15px] capitalize leading-[30px] text-graphite">
              Laboratory-backed quality control is not a final checkpoint, it is
              embedded in the line. Humidity, drying temperature, mixing time
              and machine operations are continuously monitored under
              AGMARK-approved laboratory protocols. AI-driven process control
              flags deviation before it becomes variation. The result: hing so
              consistent that a pinch in Mumbai and a pinch in Munich behave
              identically.
            </p>

            <ul className="mt-[31px] grid gap-y-3">
              {CREDENTIALS.map((credential) => (
                <li
                  className="flex items-start gap-[10px] leading-[28px]"
                  key={credential}
                >
                  {/* These sit on one line in the comp and wrap on a phone, so
                      the dot is pinned to the first line's centre instead of
                      floating to the middle of a two-line block. */}
                  <span
                    aria-hidden
                    className="mt-[9px] size-[9px] shrink-0 rounded-full bg-marigold"
                  />
                  <span className="font-editorial font-semibold text-[16px] uppercase tracking-[0.1em] text-black">
                    {credential}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            {/* The plate is 742x496 and the comp shows a 649x408 window onto
                it at natural size, so the crop is expressed as a percentage of
                the frame rather than an object-position — that keeps the same
                trim at every width instead of re-fitting the image. */}
            <div className="relative aspect-[649/408] overflow-hidden rounded-[7px]">
              <Image
                alt="In-line QC readout for batch NF-26-0713: humidity 5.9%, drying temp 42°C, mix uniformity 99.4%, particle deviation 0.66µ — all parameters within spec"
                className="absolute top-[-12.01%] left-[-7.4%] h-[121.57%] w-[114.33%] max-w-none"
                height={496}
                src="/research/qc-panel.png"
                width={742}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
