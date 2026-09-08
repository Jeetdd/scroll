import { Reveal } from "@/components/ui/reveal";

/** Plant to pack, in four moves. */
const STEPS = [
  {
    caption: "Ferula tapped in its fourth year",
    step: "Step 1",
    title: "Root",
  },
  {
    caption: "Cured in open air for weeks",
    step: "Step 2",
    title: "Resin",
  },
  {
    caption: "Sorted by purity and volatile oil",
    step: "Step 3",
    title: "Grade",
  },
  {
    caption: "Food line or pharma line",
    step: "Step 4",
    title: "Use",
  },
];

/**
 * Every step sits 89px right of the rule that precedes it; the first has no
 * rule, so it runs flush with the container. Written as a share of each cell
 * rather than a fixed 89px so the strip scales with the grid instead of the
 * type drifting off the rules — the cells are uneven (314/384/407/275 in the
 * comp), which is why the three percentages differ.
 */
const INSETS = ["", "xl:pl-[23.18%]", "xl:pl-[21.87%]", "xl:pl-[32.36%]"];

export function Process() {
  return (
    <section
      className="border-black/20 border-b bg-cream px-6 py-16 sm:px-8 xl:py-0"
      id="process"
    >
      {/* The rules are the 1px grid gaps showing through, so they redraw
          themselves as the column count changes — vertical at xl, horizontal
          once the steps stack — instead of needing a border rule per
          breakpoint. */}
      <ol className="mx-auto grid max-w-[1380px] gap-px bg-black/20 xl:grid-cols-[314fr_384fr_407fr_275fr]">
        {STEPS.map((entry, index) => (
          <li
            className={`bg-cream py-8 xl:py-[111px] ${INSETS[index]}`}
            key={entry.title}
          >
            <Reveal delay={index * 0.08}>
              <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
                {entry.step}
              </p>
              <h3 className="mt-1 font-editorial font-bold text-[30px] uppercase leading-[1.16] text-black">
                {entry.title}
              </h3>
              {/* The last cell is 275px wide against a 187px caption and an
                  89px inset, so left to wrap it breaks one step onto two lines
                  and the row loses its baseline. It's held on one line instead
                  and allowed to run a few px into the page gutter, which is
                  32px wider than the worst overhang. */}
              <p className="mt-[9px] font-editorial font-medium text-[16px] capitalize leading-[1.16] text-graphite xl:whitespace-nowrap">
                {entry.caption}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
