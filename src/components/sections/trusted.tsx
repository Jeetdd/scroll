import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const BRANDS = [
  // Top Row (5)
  {
    alt: "MTR Foods",
    box: "h-[43.9%] w-[55.96%]",
    src: "/trusted/brand-mtr.png",
    x: "8.58%",
    y: "24.53%",
  },
  {
    alt: "Priya Foods",
    box: "h-[35.01%] w-[68.98%]",
    src: "/trusted/brand-priya.png",
    x: "29.31%",
    y: "24.53%",
  },
  {
    alt: "Eastern Condiments",
    box: "h-[43.87%] w-[50.51%]",
    src: "/trusted/brand-eastern.png",
    x: "50%",
    y: "24.53%",
  },
  {
    alt: "VKL Spices",
    box: "h-[23.77%] w-[69.16%]",
    src: "/trusted/brand-vkl.png",
    x: "70.69%",
    y: "24.53%",
  },
  {
    alt: "Badshah Masala",
    box: "h-[17.82%] w-[59.99%]",
    plate: "h-[26.72%] w-[68.28%]",
    src: "/trusted/brand-badshah.png",
    x: "91.42%",
    y: "24.53%",
  },
  // Bottom Row (4)
  {
    alt: "ITC",
    box: "h-[43.94%] w-[38.74%]",
    src: "/trusted/brand-itc.png",
    x: "18.95%",
    y: "75.47%",
  },
  {
    alt: "Hamdard",
    box: "h-[43.87%] w-[59.66%]",
    src: "/trusted/brand-hamdard.jpg",
    x: "39.67%",
    y: "75.47%",
  },
  {
    alt: "Wonder Masala",
    box: "h-[34.6%] w-[75.5%]",
    src: "/trusted/brand-wonder-masala.png",
    x: "60.39%",
    y: "75.47%",
  },
  {
    alt: "Swastiks",
    box: "h-[25.7%] w-[77.2%]",
    src: "/trusted/brand-swastiks.svg",
    x: "81.12%",
    y: "75.47%",
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
            <p className="font-editorial text-[17px] capitalize leading-[30px] text-graphite">
              When India&rsquo;s most respected food companies need hing, for
              their signature blends, their ready-to-eat lines, their most
              protected recipes, they come to Waghodia. Some relationships span
              decades. All of them began with a single conversation.
            </p>
          </Reveal>
        </div>
      </div>

      {/* The plate background with masked gradient/blobs out of Figma */}
      <div className="-z-20 absolute inset-0 hidden lg:block opacity-0 lg:opacity-100">
        <Image
          alt=""
          className="object-cover object-top"
          fill
          sizes="100vw"
          src="/trusted/hero-resin-new.png"
          priority
        />
      </div>

      {/* Mobile background block */}
      <div className="-z-20 relative mt-12 aspect-[16/10] lg:hidden">
        <Image
          alt=""
          className="object-cover object-top"
          fill
          sizes="100vw"
          src="/trusted/hero-resin-new.png"
        />
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <div className="overflow-x-auto snap-x hide-scrollbar">
          <div className="relative mx-auto mt-16 mb-24 aspect-[1381/483] min-w-[900px] w-full max-w-[1381px] px-8 sm:min-w-[1000px] lg:mt-24 lg:mb-32 lg:min-w-0 lg:px-0">
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
