import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const BRANDS = [
  {
    alt: "MTR Foods",
    box: "h-[43.9%] w-[55.96%]",
    src: "/trusted/brand-mtr.png",
    x: "8.58%",
    y: "63.96%",
  },
  {
    alt: "Priya Foods",
    box: "h-[35.01%] w-[68.98%]",
    src: "/trusted/brand-priya.png",
    x: "29.29%",
    y: "22.66%",
  },
  {
    alt: "ITC",
    box: "h-[43.94%] w-[38.74%]",
    src: "/trusted/brand-itc.png",
    x: "29.29%",
    y: "77.34%",
  },
  {
    alt: "Eastern Condiments",
    box: "h-[43.87%] w-[50.51%]",
    src: "/trusted/brand-eastern.png",
    x: "50%",
    y: "63.96%",
  },
  {
    alt: "VKL Spices",
    box: "h-[23.77%] w-[69.16%]",
    src: "/trusted/brand-vkl.png",
    x: "70.71%",
    y: "22.66%",
  },
  {
    alt: "Hamdard",
    box: "h-[43.87%] w-[59.66%]",
    src: "/trusted/brand-hamdard.jpg",
    x: "70.71%",
    y: "77.34%",
  },
  {
    alt: "Badshah Masala",
    box: "h-[17.82%] w-[59.99%]",
    plate: "h-[26.72%] w-[68.28%]",
    src: "/trusted/brand-badshah.png",
    x: "91.42%",
    y: "63.96%",
  },
];

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

      {/* The resin plate. Updated layout has hero-resin-new.jpg over the whole backdrop. */}
      <div className="-z-20 absolute inset-0 hidden lg:block mix-blend-multiply opacity-0 lg:opacity-100">
        <Image
          alt=""
          className="object-cover object-top"
          fill
          sizes="100vw"
          src="/trusted/hero-resin-new.jpg"
          priority
        />
      </div>

      {/* Mobile background block */}
      <div className="-z-20 relative mt-12 aspect-[16/10] mix-blend-multiply lg:hidden">
        <Image
          alt=""
          className="object-cover object-top"
          fill
          sizes="100vw"
          src="/trusted/hero-resin-new.jpg"
        />
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <div className="overflow-x-auto snap-x hide-scrollbar">
          <div className="relative mx-auto mt-16 mb-24 aspect-[1381/523] min-w-[900px] w-full max-w-[1381px] px-8 sm:min-w-[1000px] lg:mt-24 lg:mb-32 lg:min-w-0 lg:px-0">
            {/* Soft glowing blobs backdrop across the circles */}
            <div className="-z-10 absolute inset-[-15%] pointer-events-none mix-blend-screen opacity-90 hidden lg:block">
              <Image
                src="/trusted/blobs.svg"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {BRANDS.map((brand) => (
              <div
                key={brand.alt}
                className="absolute shrink-0 rounded-full bg-white shadow-[0_15px_100px_rgba(0,0,0,0.08)] transform -translate-x-1/2 -translate-y-1/2 w-[17.16%] aspect-square hover:scale-105 transition-transform duration-300"
                style={{ left: brand.x, top: brand.y }}
              >
                {brand.plate ? (
                  <span className={`${CENTRED} bg-[#ba341b] ${brand.plate}`} />
                ) : null}
                <div className={`${CENTRED} ${brand.box}`}>
                  <Image
                    alt={brand.alt}
                    className="object-contain"
                    fill
                    sizes="(max-width: 1381px) 17vw, 237px"
                    src={brand.src}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
