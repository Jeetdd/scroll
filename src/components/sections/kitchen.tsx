import { Reveal } from "@/components/ui/reveal";

const USES = [
  {
    dish: "Dal tadka",
    note: "Into hot ghee with cumin, off the heat for a second so it blooms instead of burns.",
  },
  {
    dish: "Kadhi",
    note: "A pinch at the start of the tempering. It's what makes besan taste like more than besan.",
  },
  {
    dish: "Sambar",
    note: "Added with the mustard seeds. Rounds out the tamarind's edge.",
  },
  {
    dish: "Pickles",
    note: "Stirred into the oil before it goes in the jar. Keeps for the season.",
  },
];

export function Kitchen() {
  return (
    <section className="bg-cream px-[6vw] py-32 sm:px-8" id="kitchen">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-resin">
            In the kitchen
          </p>
          <h2 className="mt-6 max-w-3xl text-balance font-display text-headline leading-[1.05] text-ink">
            A pinch is the entire dose. Anything more is a different dish.
          </h2>
        </Reveal>

        <ul className="mt-20 divide-y divide-ink/10 border-ink/10 border-t border-b">
          {USES.map((use, index) => (
            <li key={use.dish}>
              <Reveal
                className="grid gap-3 py-8 sm:grid-cols-[14rem_1fr] sm:gap-8"
                delay={index * 0.08}
              >
                <h3 className="font-display text-2xl text-ink">{use.dish}</h3>
                <p className="text-pretty leading-relaxed text-ink-soft">
                  {use.note}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
