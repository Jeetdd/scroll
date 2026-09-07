import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { FRAME_COUNT, FRAME_TIERS, frameSrc } from "@/lib/frames.generated";

const SPECS = [
  { label: "Net weight", value: "100 g" },
  { label: "Form", value: "Golden Dana" },
  { label: "Type", value: "Compounded asafoetida" },
  { label: "Diet", value: "Vegetarian" },
];

export function ProductDetail() {
  return (
    <section className="bg-canvas px-[6vw] py-32 sm:px-8" id="product">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <Image
            alt="Hira Hing Golden Dana, 100g jar of compounded asafoetida"
            className="w-full rounded-sm"
            height={FRAME_TIERS.desktop.height}
            priority
            src={frameSrc("desktop", FRAME_COUNT - 1)}
            unoptimized
            width={FRAME_TIERS.desktop.width}
          />
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-resin">
            The jar
          </p>
          <h2 className="mt-6 text-balance font-display text-headline leading-[1.05] text-ink">
            Airtight from our floor to your shelf.
          </h2>
          <p className="mt-6 max-w-md text-pretty text-lede leading-relaxed text-ink-soft">
            Hing loses its character to air faster than almost anything else in
            the masala dabba. The jar is built around that one problem.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8">
            {SPECS.map((spec) => (
              <div className="border-ink/10 border-t pt-4" key={spec.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft/70">
                  {spec.label}
                </dt>
                <dd className="mt-2 font-display text-xl text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
