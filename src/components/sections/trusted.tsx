import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * The seven customer marks, sized as a share of the disc they sit on so the
 * whole row scales from one `size-*` change. Percentages are the comp's boxes
 * over its 237px circle; each bitmap already matches its box's aspect, so
 * `object-contain` lands them exactly.
 */
const BRANDS = [
  {
    alt: "MTR Foods",
    box: "h-[43.9%] w-[55.96%]",
    src: "/trusted/brand-mtr.png",
  },
  { alt: "ITC", box: "h-[43.94%] w-[38.74%]", src: "/trusted/brand-itc.png" },
  {
    alt: "Eastern Condiments",
    box: "h-[43.87%] w-[50.51%]",
    src: "/trusted/brand-eastern.png",
  },
  {
    alt: "Hamdard",
    box: "h-[43.87%] w-[59.66%]",
    src: "/trusted/brand-hamdard.jpg",
  },
  {
    alt: "Badshah Masala",
    box: "h-[17.82%] w-[59.99%]",
    // The supplied artwork is white-on-transparent — the mark only exists once
    // its red plate is behind it, so this one brand carries a second box.
    plate: "h-[26.72%] w-[68.28%]",
    src: "/trusted/brand-badshah.png",
  },
  {
    alt: "Priya Foods",
    box: "h-[35.01%] w-[68.98%]",
    src: "/trusted/brand-priya.png",
  },
  {
    alt: "VKL Spices",
    box: "h-[23.77%] w-[69.16%]",
    src: "/trusted/brand-vkl.png",
  },
];

/**
 * Four passes of the set. The comp runs the row off both edges of the frame,
 * which only resolves as a loop, and `--animate-brand-marquee` shifts the track
 * by half its own width — so the two halves have to be identical and the seam
 * has to land on the same rung of the zigzag. Fourteen per half does both: an
 * even count, so the alternating lift carries across the join without a
 * stutter. A given mark rides high on one pass and low on the next, which is
 * what the comp's own run of seven already implies.
 */
const TRACK = [0, 1, 2, 3].flatMap((pass) =>
  BRANDS.map((brand) => ({ ...brand, key: `${brand.alt}-${pass}` })),
);

const CENTRED = "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2";

export function Trusted() {
  return (
    <section className="relative isolate bg-cream" id="trusted">
      <div className="mx-auto max-w-[1380px] px-6 pt-[72px] sm:px-8 lg:pt-[111px]">
        {/* 580 / 125 / 675. */}
        <div className="grid gap-x-[125px] gap-y-6 lg:grid-cols-[580fr_675fr]">
          <Reveal>
            <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
              Trusted by India&rsquo;s most respected food brands
            </p>
            {/* Archivo sets a hair wider in the browser than in Figma, so the
                middle line breaks again inside its 580px column. Held to the
                comp's three lines; the few px of overhang land in the 125px
                gutter. */}
            <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-black">
              <span className="lg:block lg:whitespace-nowrap">
                The specialists behind
              </span>{" "}
              <span className="lg:block lg:whitespace-nowrap">
                the Brands you Already
              </span>{" "}
              <span className="lg:block">Trust.</span>
            </h2>
          </Reveal>

          <Reveal className="lg:mt-[48px]" delay={0.08}>
            <p className="font-editorial text-[15px] capitalize leading-[30px] text-graphite">
              When India&rsquo;s most respected food companies need hing, for
              their signature blends, their ready-to-eat lines, their most
              protected recipes, they come to Waghodia. Some relationships span
              decades. All of them began with a single conversation.
            </p>
          </Reveal>
        </div>
      </div>

      {/* The resin plate. It's a photograph vignetted into white, so it's
          multiplied onto the page rather than laid over it — the white drops
          out to cream and only the stem and the droplet survive, with no seam
          where the image stops. From lg it becomes the section's background and
          the copy sits on it, as in the comp. Below that, a 2.34:1 plate
          stretched behind a phone-height column crops to a narrow slice of its
          own centre, which is exactly where the droplet is, so it steps back
          into the flow as a picture in its own right instead of fighting the
          text for the same pixels. */}
      <div className="-z-20 relative mt-12 aspect-[16/10] mix-blend-multiply lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
        {/* `contain` rather than `cover` from lg: the section is taller than
            the plate's 2.34:1, and covering it crops off the pale outer thirds
            — the very part that makes the picture read as a wash rather than a
            photograph dropped on the page. Contained and hung from the top it
            keeps its own proportions, and the band of nothing left underneath
            is invisible, because multiplying transparency changes nothing. */}
        <Image
          alt=""
          className="object-cover object-center lg:object-contain lg:object-top"
          fill
          sizes="100vw"
          src="/trusted/resin-band.jpg"
        />
      </div>

      {/* The row itself is decorative once it repeats four times, so the marks
          are named once, here, and the track is hidden from assistive tech. */}
      <ul className="sr-only">
        {BRANDS.map((brand) => (
          <li key={brand.alt}>{brand.alt}</li>
        ))}
      </ul>

      {/* The vertical padding is headroom for the discs' shadows: the track has
          to clip horizontally to hide the loop, and overflow can't be clipped
          on one axis alone, so without it the shadows would be cut flat. */}
      <div className="mt-12 overflow-hidden py-10 lg:mt-[clamp(140px,17.2vw,330px)]">
        {/* Bare `:hover` rather than the `hover:` variant — that one is gated
            behind `@media (hover: hover)`, and pausing a decorative row costs
            nothing on a device that reports its pointer differently. */}
        <div
          aria-hidden
          className="flex w-max animate-brand-marquee will-change-transform [&:hover]:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {TRACK.map((brand, index) => (
            <div
              className={`relative mr-[59px] size-[168px] shrink-0 rounded-full bg-white shadow-[0_15px_100px_rgba(0,0,0,0.08)] sm:mr-[70px] sm:size-[200px] lg:mr-[83px] lg:size-[237px] ${
                index % 2 === 1
                  ? "-translate-y-[15px] sm:-translate-y-[18px] lg:-translate-y-[21.5px]"
                  : "translate-y-[15px] sm:translate-y-[18px] lg:translate-y-[21.5px]"
              }`}
              key={brand.key}
            >
              {brand.plate ? (
                <span className={`${CENTRED} bg-[#ba341b] ${brand.plate}`} />
              ) : null}
              <div className={`${CENTRED} ${brand.box}`}>
                <Image
                  alt=""
                  className="object-contain"
                  fill
                  sizes="180px"
                  src={brand.src}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
