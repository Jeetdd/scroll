"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Shared shell so the three panels read as one instrument at any width. */
const PANEL =
  "flex flex-col justify-between rounded-[7px] border border-cream/10 bg-char p-6 sm:p-8 lg:aspect-[649/408]";
const META = "font-editorial text-[11px] uppercase tracking-[0.2em] sm:text-xs";

/** The shift target the readout is measured against. */
const TARGET_KG = 5000;
/**
 * Where the ramp lands. The screencast's counter just climbs — the number
 * itself isn't data, only the units and the target are — so it settles
 * mid-shift and then keeps ticking rather than crawling to 5,000 for 40s.
 */
const SETTLED_KG = 3180;
const RAMP_MS = 2200;
/** Kilos per second once the ramp is done, so the panel still reads as live. */
const DRIFT_RATE = 6;
const BAR_SEGMENTS = 46;
/** Fixed identities — the ticks are a static ruler, they never reorder. */
const BAR_KEYS = Array.from(
  { length: BAR_SEGMENTS },
  (_, index) => `tick-${index}`,
);

function CapacityBar({ fraction }: { fraction: number }) {
  const lit = Math.round(BAR_SEGMENTS * fraction);

  return (
    <div aria-hidden className="flex gap-[3px]">
      {BAR_KEYS.map((key, index) => (
        <span
          className={`h-6 flex-1 rounded-[1px] ${
            index < lit ? "bg-saffron" : "bg-cream/12"
          }`}
          key={key}
        />
      ))}
    </div>
  );
}

export function CapacityPanel() {
  const reduced = usePrefersReducedMotion();
  const [kg, setKg] = useState(0);

  useEffect(() => {
    if (reduced) {
      setKg(SETTLED_KG);
      return;
    }

    let frame = 0;
    let origin: number | null = null;

    const tick = (now: number) => {
      origin ??= now;
      const elapsed = now - origin;

      if (elapsed < RAMP_MS) {
        // Ease-out so it decelerates into the settled figure instead of
        // stopping dead.
        const progress = 1 - (1 - elapsed / RAMP_MS) ** 3;
        setKg(Math.round(SETTLED_KG * progress));
      } else {
        const drifted = SETTLED_KG + ((elapsed - RAMP_MS) / 1000) * DRIFT_RATE;
        setKg(Math.min(TARGET_KG, Math.round(drifted)));
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <div className={PANEL}>
      <div className="flex items-start justify-between gap-4">
        <p className={`${META} text-cream/55`}>Shift output · Line A+B</p>
        <p className={`${META} flex items-center gap-2 text-saffron`}>
          <span
            aria-hidden
            className="size-[7px] shrink-0 rounded-full bg-marigold motion-safe:animate-pulse"
          />
          Running
        </p>
      </div>

      <div className="mt-6">
        <p className="font-editorial font-bold text-[clamp(2.5rem,3.6vw,3.5rem)] leading-none text-saffron tabular-nums">
          {kg.toLocaleString("en-IN")} kg
        </p>
        <p className={`${META} mt-3 text-cream/55`}>
          Processed this shift · Target 5,000+ kg
        </p>
      </div>

      <div className="mt-6">
        <CapacityBar fraction={kg / TARGET_KG} />
      </div>

      <p className={`${META} mt-6 text-cream/55`}>
        Uptime 99.2% · Automation active
      </p>
    </div>
  );
}

/**
 * Three independent switches. The screencast flips them on a loop to show the
 * line reconfiguring; here they're real buttons as well, and the loop stops the
 * moment someone takes over so it never fights the person using it.
 */
const AXES = [
  { key: "potency", label: "Potency", options: ["Standard", "High"] },
  { key: "particle", label: "Particle", options: ["Fine", "Granule"] },
  { key: "format", label: "Format", options: ["Compounded", "Pure"] },
];

const CYCLE_MS = 1900;

/**
 * Particle size, drawn rather than described. Both counts are set to overfill
 * the jar at their own pitch — the grid is centred and clipped, so the jar
 * always reads as full and the only thing that changes is how coarse the
 * contents are. Undercount and you get a band of dots floating in empty glass.
 */
const GRAIN: Record<string, { count: number; dot: string }> = {
  Fine: { count: 150, dot: "size-[3px]" },
  Granule: { count: 80, dot: "size-[6px]" },
};
const GRAIN_KEYS = Array.from({ length: 150 }, (_, index) => `grain-${index}`);

/** Potency as concentration — the deeper resin is the stronger dose. */
const POTENCY: Record<string, { body: string; grain: string }> = {
  Standard: { body: "bg-saffron", grain: "bg-ink/30" },
  High: { body: "bg-resin", grain: "bg-char/45" },
};

function SpecJar({
  format,
  particle,
  potency,
}: {
  format: string;
  particle: string;
  potency: string;
}) {
  const grain = GRAIN[particle] ?? GRAIN.Fine;
  const fill = POTENCY[potency] ?? POTENCY.Standard;

  return (
    <div className="mx-auto w-[124px] shrink-0 sm:mx-0">
      <div className="mx-auto h-[15px] w-[56%] rounded-t-[5px] bg-ink" />
      <div
        className={`relative h-[168px] overflow-hidden rounded-[12px] transition-colors duration-500 ease-out ${fill.body}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-[7px] p-3"
        >
          {GRAIN_KEYS.slice(0, grain.count).map((key) => (
            <span
              className={`rounded-full transition-colors duration-500 ease-out ${grain.dot} ${fill.grain}`}
              key={key}
            />
          ))}
        </div>

        {/* The label stays readable over either fill, so it sits on its own
            plate rather than borrowing the jar's contrast. */}
        <div className="-translate-y-1/2 absolute inset-x-[8px] top-1/2 rounded-[3px] bg-char/85 px-2 py-[8px] text-center">
          <span className="block font-editorial font-semibold text-[9px] uppercase tracking-[0.16em] text-cream">
            {format}
          </span>
          {/* Held on one line: "Granule · Standard" is the longest pairing and
              wrapping it would make the label taller in that state only, so the
              plate would jump height as the switches change. */}
          <span className="mt-[3px] block whitespace-nowrap font-editorial text-[7px] uppercase tracking-[0.1em] text-cream/65">
            {particle} · {potency}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CustomizationPanel() {
  const reduced = usePrefersReducedMotion();
  const [picks, setPicks] = useState([0, 0, 0]);
  const [manual, setManual] = useState(false);
  const step = useRef(0);

  useEffect(() => {
    if (reduced || manual) return;

    const timer = setInterval(() => {
      const axis = step.current % AXES.length;
      step.current += 1;
      setPicks((current) =>
        current.map((pick, index) => (index === axis ? 1 - pick : pick)),
      );
    }, CYCLE_MS);

    return () => clearInterval(timer);
  }, [manual, reduced]);

  const choose = (axisIndex: number, optionIndex: number) => {
    setManual(true);
    setPicks((current) =>
      current.map((pick, index) => (index === axisIndex ? optionIndex : pick)),
    );
  };

  // Format / particle · potency — the order the spec is quoted in.
  const format = AXES[2].options[picks[2]];
  const particle = AXES[1].options[picks[1]];
  const potency = AXES[0].options[picks[0]];

  return (
    <div className={PANEL}>
      <div className="flex items-start justify-between gap-4">
        <p className={`${META} text-cream/55`}>Formulation model · Rev 04</p>
        <p className={`${META} flex items-center gap-2 text-saffron`}>
          <span
            aria-hidden
            className="rotate-45 border border-saffron size-2"
          />
          Active
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <SpecJar format={format} particle={particle} potency={potency} />

        <div className="flex flex-1 flex-col gap-4">
          {AXES.map((axis, axisIndex) => (
            <div key={axis.key}>
              <p className={`${META} text-cream/40`}>{axis.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {axis.options.map((option, optionIndex) => {
                  const selected = picks[axisIndex] === optionIndex;

                  return (
                    <button
                      aria-pressed={selected}
                      className={`rounded-full px-4 py-2 font-editorial font-semibold text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ease-out sm:text-xs ${
                        selected
                          ? "bg-saffron text-char"
                          : "border border-cream/25 text-cream/70 hover:border-cream/50 hover:text-cream"
                      }`}
                      key={option}
                      onClick={() => choose(axisIndex, optionIndex)}
                      type="button"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className={`${META} mt-6 text-cream/55`}>
        {manual ? "Locked to client spec" : "Reconfiguring to client spec"}
      </p>
    </div>
  );
}
