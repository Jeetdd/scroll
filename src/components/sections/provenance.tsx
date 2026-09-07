import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  {
    title: "Tapped, not extracted",
    body: "The resin is scored from a living ferula root and left to weep on its own schedule. No solvents, no heat, no hurrying it along.",
  },
  {
    title: "Cured, not rushed",
    body: "Weeks of open-air curing set the raw oleo-gum into a single amber granule. That granule is the whole product; everything after is handling.",
  },
  {
    title: "Milled at source",
    body: "Ground and bottled in one pass. The volatile oils that carry the aroma never get an afternoon in the open to escape.",
  },
];

export function Provenance() {
  return (
    <section className="bg-cream px-[6vw] py-32 sm:px-8" id="story">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-resin">
            Provenance
          </p>
          <h2 className="mt-6 max-w-3xl text-balance font-display text-headline leading-[1.05] text-ink">
            Three decisions, and none of them are shortcuts.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {PILLARS.map((pillar, index) => (
            <Reveal delay={index * 0.12} key={pillar.title}>
              <article className="border-ink/10 border-t pt-6">
                <p className="font-mono text-xs tracking-[0.2em] text-resin">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-2xl leading-snug text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-ink-soft">
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
