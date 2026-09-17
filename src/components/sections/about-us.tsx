import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

/**
 * The /about route, comped as one 1920×7194 frame in Figma (node `14:2`).
 *
 * Seven sections in one file because they only ever appear together, on one
 * page, and they share the eyebrow/headline lockup below — splitting them
 * would mean seven imports of a helper that exists for this page alone.
 * The last two blocks of that frame are the contact form and the footer,
 * which are already built as `contact.tsx` and `site-footer.tsx`; the route
 * composes those rather than restating them here.
 *
 * GEOMETRY. The comp's content column is 1380 wide inside a 1920 frame, and
 * `max-w-[1380px]` reproduces that 1:1 — so every gap below is the comp's own
 * pixel value, not a guess. Two things make that work:
 *
 *  - `TRIM` puts `text-box: trim-both cap alphabetic` on every text node, the
 *    same setting the comp uses. Without it a Figma y is a cap-top while a CSS
 *    margin starts at the line box, and everything lands a few px low. Firefox
 *    doesn't implement it yet and simply runs a little looser.
 *  - Headlines clamp up to 41px by 1024px wide and then hold, so from `lg` up
 *    the type is the comp's size and the fixed gaps around it stay exact.
 *
 * The comp's section rhythm is a flat 120px between content blocks. Cream and
 * white sections carry `py-[120px]`; the three full-bleed bands (philosophy,
 * vision, certificates) carry their own and come out at the comped band
 * heights of 765, 792 and 543.
 */

/** Figma's `text-box-trim`, so a comp y-gap is a CSS margin with no fudge. */
const TRIM = "[text-box:trim-both_cap_alphabetic]";

const EYEBROW = `${TRIM} font-editorial font-semibold text-[15px] uppercase leading-[28px] tracking-[0.2em] text-marigold`;

/** 41px in the comp; reached at 1024px wide and held from there up. */
const HEADLINE = `${TRIM} font-editorial font-extrabold text-[clamp(1.75rem,4vw,2.5625rem)] uppercase leading-[1.293] text-black`;

const BODY = `${TRIM} font-editorial text-[16px] capitalize leading-[30px] text-slate`;

/** The lockup that opens every section: eyebrow, 25px, headline. */
function SectionHead({
  children,
  eyebrow,
  tone = "dark",
}: {
  children: ReactNode;
  eyebrow: string;
  /** `light` is the one dark-background section, where the headline inverts. */
  tone?: "dark" | "light";
}) {
  return (
    <div>
      <p className={EYEBROW}>{eyebrow}</p>
      <h2
        className={`mt-[25px] ${HEADLINE} ${tone === "light" ? "text-white" : ""}`}
      >
        {children}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------------------------

const HERO_LINES = (
  <>
    <span className="block">Authenticity, ground</span>
    <span className="block">into every pinch.</span>
  </>
);

/**
 * Framing for the photo poured into the headline.
 *
 * The comp lays a 1662×935 still over an 829×131 text box, offset 15px right
 * and 417px up, so the type is filled from the foliage band across the middle
 * of the picture rather than the blown-out sand on its right. Expressed as
 * percentages of the text box, which keeps that framing at every size:
 *   width  1662/829                     = 200.5%
 *   pos-x  15 / (829 − 1662)            = −1.8%
 *   pos-y  −417 / (131 − 935)           = 51.9%
 * `bg-cover` was the bug — it scaled the still to the box and landed the type
 * on the empty right-hand half, which washed the second line out to grey.
 */
const HERO_FILL =
  "bg-[url('/about-us/resin-field.png')] bg-[length:200.5%_auto] bg-[position:-1.8%_51.9%] bg-no-repeat";

export function AboutHero() {
  return (
    // Two backgrounds, not one. The comp's cream band stops at y870 and the
    // spoon carries on for another 195px over white — which is why the section
    // is white and the cream is a block inside it that the still overhangs.
    //
    // `id="top"` is what the header watches to choose between its gradient
    // scrim and its glass bar, and what the footer's mark scrolls back to. On
    // the home page the intro carries it; here the hero is the first screen.
    <section className="relative bg-white" id="top">
      <div className="bg-cream px-6 pt-[140px] pb-16 text-center sm:px-8 lg:pt-[255px] lg:pb-[353px]">
        <Reveal>
          <p className={EYEBROW}>A history of great flavour</p>

          {/* Black type with the still laid over it at 60%, as in the comp.
              Two stacked copies rather than one `bg-clip-text` element: the
              photo layer is decorative, so if it fails to load the headline
              underneath is still solid black rather than invisible.

              The type lives on the span, not the h1, for two reasons. The
              span is `inline-block`, so its box hugs the type and HERO_FILL's
              percentages measure against that rather than the full column.
              And `text-box` trims an element's own line box — an h1 whose
              only child is an inline-block has a one-line box, so trimming
              there collapsed the headline to 51px and pulled everything under
              it 79px up. `leading-[0]` on the h1 makes the wrapper contribute
              nothing and the span measures the comp's two trimmed lines.

              `MaskedHeading` isn't the right tool here: it clips to measured
              glyph boxes and drives a GSAP per-word rise, neither of which
              this static, backed fill wants. */}
          <h1 className="mt-[30px] leading-[0]">
            <span
              className={`${TRIM} relative inline-block align-top font-editorial font-black capitalize text-[clamp(2.25rem,7.3vw,4.6875rem)] leading-[1.0667] text-black`}
            >
              {HERO_LINES}
              {/* Same TRIM as the parent. Without it this copy lays out with
                  an untrimmed line box and sits half a leading lower than the
                  black type it is meant to sit exactly on top of, which reads
                  as a ghosted double-print. */}
              <span
                aria-hidden
                className={`${TRIM} absolute inset-0 ${HERO_FILL} bg-clip-text text-transparent opacity-60`}
              >
                {HERO_LINES}
              </span>
            </span>
          </h1>

          <p className={`${BODY} mx-auto mt-[49px] max-w-[675px]`}>
            India&rsquo;s first and largest processing plant&mdash;shaped by
            three generations of the Joshi family and one uncompromising
            standard of purity.
          </p>
        </Reveal>
      </div>

      {/* The gutter is the outer element and the 898 cap the inner one. The
          other way round, `px-8` came out of the 898 and the still rendered
          834 wide — 43px short of the comp on both axes. */}
      <div className="px-6 sm:px-8">
        {/* 403px up is the comp's overlap: it puts the spoon's top at y467,
            50px above the copy it tucks behind, and drops the cream/white
            seam at 67.5% of the still — exactly where the white fade starts.
            Below `lg` the column is too narrow to overlap anything, so the
            still just follows the copy. */}
        <Reveal
          className="mx-auto w-full max-w-[898px] lg:-mt-[403px]"
          delay={0.1}
          margin="-4%"
        >
          <div className="relative mt-10 aspect-[898/598] lg:mt-0">
            <Image
              alt="Ground asafoetida heaped in a wooden spoon, with resin pearls scattered around it"
              className="object-contain mix-blend-multiply"
              fill
              priority
              sizes="(min-width: 1024px) 898px, 100vw"
              src="/about-us/hero-spoon.png"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[67.5%] from-transparent to-white/60"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const STORY_NOTES = [
  "The original spirit — patient craft, honest ingredients, 10 kg at a time.",
  "A new chapter of scale — modern processing shaped by exacting standards.",
  "3+ tons each day — ingredient integrity carried forward by a third generation.",
];

const MILESTONES = [
  {
    body: "Late Shri Punamlal S Joshi establishes a traditional grinding mill founded on honest flavour and patient craft.",
    title: "A 10 kg beginning",
    year: "1970",
  },
  {
    body: "A second factory opens, followed by the company's first ISO certification - scale guided by discipline.",
    title: "Building the standard",
    year: "2001–02",
  },
  {
    body: "The Joshi family now leads India's first and largest asafoetida processing plant, producing more than three tons daily.",
    title: "Three generations forward",
    year: "Today",
  },
];

export function AboutStory() {
  return (
    // 47px, not 120: the spoon above already overhangs into this section's
    // white, and the comp measures the gap from where the still ends.
    <section className="bg-white px-6 pt-[47px] pb-[120px] sm:px-8">
      <div className="mx-auto max-w-[1380px]">
        {/* 660 + 45 puts the notes' column edge at the comp's x975 and leaves
            it the 675 it needs — at 705 the column came out 630 and every
            note wrapped to two lines. */}
        <div className="grid gap-x-[45px] gap-y-10 lg:grid-cols-[660px_1fr]">
          <Reveal>
            <SectionHead eyebrow="Our Story">
              A small mill.{" "}
              <span className="lg:block text-vermilion">
                A singular ambition.
              </span>
            </SectionHead>
          </Reveal>

          {/* 13px down and a 40px pitch — the notes sit against the headline,
              not on its baseline. */}
          <Reveal delay={0.08}>
            <ul className="flex flex-col gap-[30px] lg:mt-[13px]">
              {STORY_NOTES.map((note) => (
                <li className="flex items-start gap-[10px]" key={note}>
                  <span
                    aria-hidden
                    className="mt-[1px] size-[9px] shrink-0 rounded-full bg-marigold"
                  />
                  <span
                    className={`${TRIM} font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.01em] text-black`}
                  >
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-[60px] grid gap-x-[45px] gap-y-12 lg:mt-[80px] lg:grid-cols-[778px_1fr]">
          <Reveal delay={0.04}>
            <ol>
              {MILESTONES.map((milestone, i) => (
                <li
                  // 120px of trailing space per row, with the rule at its
                  // midpoint — that reproduces the comp's 249px row pitch and
                  // puts the separator 60px clear of the copy either side.
                  // `before` is the rail: it runs from this row's dot to the
                  // next one's, so hiding it on the last row stops the line at
                  // the final dot instead of running past it. `after` is the
                  // rule, inset to the copy column the way the comp draws it.
                  className="relative grid grid-cols-[15px_1fr] items-start gap-x-[30px] pb-[120px] before:absolute before:-bottom-[10px] before:left-[7px] before:top-[10px] before:w-px before:bg-black/15 after:absolute after:right-0 after:bottom-[60px] after:left-[48px] after:h-px after:bg-black/10 last:pb-0 last:before:hidden last:after:hidden sm:grid-cols-[15px_1fr_52px]"
                  key={milestone.year}
                >
                  <span
                    aria-hidden
                    className="mt-[3px] size-[15px] rounded-full bg-marigold"
                  />
                  <div>
                    <p
                      className={`${TRIM} font-editorial font-bold text-[31px] capitalize leading-[1.16] text-vermilion`}
                    >
                      {milestone.year}
                    </p>
                    <h3
                      className={`${TRIM} mt-[30px] font-editorial font-bold text-[20px] capitalize leading-[1.16] text-black`}
                    >
                      {milestone.title}
                    </h3>
                    <p
                      className={`${TRIM} mt-[24px] font-editorial font-medium text-[17px] capitalize leading-[28px] text-slate`}
                    >
                      {milestone.body}
                    </p>
                  </div>
                  {/* Decorative in the comp — it marks the row, it doesn't go
                      anywhere — so it stays an image rather than a button. */}
                  <Image
                    alt=""
                    className="mt-[39px] hidden size-[52px] sm:block"
                    height={52}
                    src={
                      i === 0
                        ? "/about-us/story-arrow-active.svg"
                        : "/about-us/story-arrow.svg"
                    }
                    width={52}
                  />
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative aspect-[570/637] w-full overflow-hidden lg:-mt-[5px]">
              <Image
                alt="Technicians in whites feeding resin into a grinder on the National Foods line"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 570px, 100vw"
                src="/about-us/story-plant.png"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const VALUES = [
  { icon: "/about-us/icon-trust.svg", label: "Trust" },
  { icon: "/about-us/icon-quality.svg", label: "Quality" },
  { icon: "/about-us/icon-reliability.svg", label: "Reliability" },
];

export function AboutPhilosophy() {
  // 120 + 525 of content + 120 = the comp's 765px band.
  return (
    <section className="relative isolate overflow-hidden bg-obsidian px-6 py-20 sm:px-8 lg:py-[120px]">
      <Image
        alt=""
        className="-z-10 object-cover"
        fill
        sizes="100vw"
        src="/about-us/philosophy-bg.png"
      />

      <div className="mx-auto max-w-[1380px]">
        <Reveal>
          <SectionHead eyebrow="Our Philosophy" tone="light">
            <span className="lg:block">Good food begins with what</span>{" "}
            <span className="lg:block">
              you <span className="text-vermilion">refuse to add.</span>
            </span>
          </SectionHead>

          <p className={`${BODY} mt-[80px] text-white`}>
            Raw asafoetida resin travels from the Ferula fields of Afghanistan
            and Iran to our processing complex in Baroda, Gujarat, India. Within
            this single, unbroken supply chain, we maintain strict Pharma-Grade
            Manufacturing Standards, including advanced automation, CIP cleaning
            systems, AI-driven processes and laboratory-backed quality control
            to ensure minimal human intervention.
          </p>
        </Reveal>

        <Reveal
          className="mt-[60px] flex flex-wrap items-center justify-between gap-x-12 gap-y-12 lg:mt-[100px]"
          delay={0.1}
        >
          <ul className="flex flex-wrap gap-x-[80px] gap-y-10 lg:gap-x-[142px]">
            {VALUES.map((value) => (
              <li className="text-center" key={value.label}>
                <Image
                  alt=""
                  className="mx-auto size-[100px]"
                  height={100}
                  src={value.icon}
                  width={100}
                />
                <p
                  className={`${TRIM} mt-[38px] font-quote font-bold text-[26px] capitalize leading-[50px] text-white`}
                >
                  {value.label}
                </p>
              </li>
            ))}
          </ul>

          {/* Outlined rather than filled: at 30% a solid white would read as
              a second paragraph competing with the copy above it, where the
              hairline reads as a watermark. */}
          <p
            className={`${TRIM} font-editorial font-extrabold text-[clamp(2rem,5.86vw,3.75rem)] uppercase leading-[1.233] tracking-[0.085em] text-transparent opacity-30`}
            style={{ WebkitTextStroke: "1px #ffffff" }}
          >
            <span className="block">Nothing hidden.</span>
            <span className="block">Nothing diluted.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const USPS = [
  {
    body: "Ingredients chosen for genuine flavour, uncompromised at every stage.",
    icon: "/about-us/usp-01.svg",
    span: "lg:col-span-3",
    title: "100% authentic",
  },
  {
    body: "Cryogenic grinding helps preserve volatile oils, aroma, and taste.",
    icon: "/about-us/usp-02.svg",
    span: "lg:col-span-3",
    title: "Natural aroma",
  },
  {
    body: "The spice keeps its own honest, natural character.",
    icon: "/about-us/usp-03.svg",
    span: "lg:col-span-2",
    title: "No artificial colour",
  },
  {
    body: "An AGMARK-approved in-house lab measures every critical standard.",
    icon: "/about-us/usp-04.svg",
    span: "lg:col-span-2",
    title: "Laboratory precision",
  },
  {
    body: "A long-standing supplier to respected food brands across India.",
    icon: "/about-us/usp-05.svg",
    span: "lg:col-span-2",
    title: "Trusted at scale",
  },
];

export function AboutUsps() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:py-[120px]">
      <div className="mx-auto max-w-[1380px]">
        <Reveal>
          <SectionHead eyebrow="USPs">
            <span className="lg:block">
              What sets <span className="text-vermilion">National</span>
            </span>{" "}
            <span className="lg:block">
              <span className="text-vermilion">Foods</span> apart
            </span>
          </SectionHead>
        </Reveal>

        {/* Six columns rather than two grids stacked: at 30px gutters a
            six-track row gives exactly the comp's 675/675 and 440/440/440
            rows from one definition. */}
        <Reveal
          className="mt-[60px] grid gap-[30px] sm:grid-cols-2 lg:mt-[80px] lg:grid-cols-6"
          delay={0.08}
        >
          {USPS.map((usp, i) => (
            <article
              className={`rounded-[20px] bg-cream p-8 sm:p-10 ${usp.span}`}
              key={usp.title}
            >
              <div className="flex items-start justify-between gap-6">
                <Image
                  alt=""
                  className="h-[82px] w-auto"
                  height={82}
                  src={usp.icon}
                  width={82}
                />
                <span
                  className={`${TRIM} font-editorial font-bold text-[40px] capitalize leading-[1.16] text-black/20`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                className={`${TRIM} mt-[41px] font-editorial font-bold text-[26px] capitalize leading-[1.16] text-black`}
              >
                {usp.title}
              </h3>
              <p
                className={`${TRIM} mt-[25px] font-editorial font-medium text-[17px] capitalize leading-[28px] text-slate`}
              >
                {usp.body}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

function Pledge({
  body,
  children,
  eyebrow,
}: {
  body: string;
  children: ReactNode;
  eyebrow: string;
}) {
  return (
    <div className="px-6 text-center sm:px-10">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={`mt-[25px] ${HEADLINE}`}>{children}</h2>
      <p className={`${BODY} mx-auto mt-[40px] max-w-[558px]`}>{body}</p>
    </div>
  );
}

export function AboutVision() {
  // 120 + 552 of card + 120 = the comp's 792px band.
  return (
    <section className="relative isolate overflow-hidden bg-cream px-6 py-20 sm:px-8 lg:py-[120px]">
      {/* Two stills bleeding in from the edges, each veiled back to cream
          before it reaches the card. The veil is a gradient rather than a
          crop so the seam lands mid-photo instead of on a hard edge.
          The object-positions are the comp's framing, not the defaults: it
          oversizes each still and slides it past the frame edge, so `left`
          and `right` cropped a few percent off the wrong side and cut the
          scoop out of the right-hand plate. */}
      <div aria-hidden className="-z-10 absolute inset-y-0 left-0 w-1/2">
        <Image
          alt=""
          className="object-[68%_center] object-cover"
          fill
          sizes="50vw"
          src="/about-us/resin-field.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_20%,var(--color-cream)_80%)]" />
      </div>
      <div aria-hidden className="-z-10 absolute inset-y-0 right-0 w-1/2">
        <Image
          alt=""
          className="object-[92%_center] object-cover"
          fill
          sizes="50vw"
          src="/about-us/vm-right.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_left,transparent_15%,var(--color-cream)_85%)]" />
      </div>

      <Reveal className="mx-auto max-w-[793px]">
        {/* 20% white is the comp's value, and it works there because the two
            stills have already faded to cream behind the card. Narrow, the
            card spans the full column and sits over the photos themselves, so
            below `lg` the veil is opaque enough to read against. */}
        <div className="rounded-[20px] bg-white/70 py-[55px] shadow-[0_0_80px_rgba(0,0,0,0.08)] backdrop-blur-[7.5px] lg:bg-white/20">
          <Pledge
            body="A world where good health, better taste and viability belong together."
            eyebrow="Our Vision"
          >
            <span className="block">To see the world unite</span>
            <span className="block">through flavour.</span>
          </Pledge>

          <hr className="my-[55px] border-black/10" />

          <Pledge
            body="To be recognised at the forefront of convenience foods around the world."
            eyebrow="Our Mission"
          >
            <span className="block">To take our presence</span>
            <span className="block">global.</span>
          </Pledge>
        </div>
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function AboutDirector() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1380px] items-center gap-x-[95px] gap-y-12 lg:grid-cols-[675px_1fr]">
        <Reveal>
          <SectionHead eyebrow="Director's Message">
            <span className="lg:block">
              &ldquo;We work together,{" "}
              <span className="text-vermilion">we</span>
            </span>{" "}
            <span className="lg:block">
              <span className="text-vermilion">grow together.</span>&rdquo;
            </span>
          </SectionHead>

          <p className={`${BODY} mt-[60px] max-w-[675px]`}>
            Our workforce is family. Trust, loyalty, and shared responsibility
            have carried National Foods across three generations&mdash;and they
            remain the foundation of everything we make.
          </p>

          <p
            className={`${TRIM} mt-[50px] flex items-center gap-[20px] font-editorial text-[16px] capitalize leading-[28px] text-black`}
          >
            <span aria-hidden className="h-px w-[84px] shrink-0 bg-vermilion" />
            The Joshi Family &middot; National Foods
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative aspect-[611/634] w-full overflow-hidden">
            <Image
              alt="Portrait of the Joshi family director of National Foods"
              className="object-cover object-top"
              fill
              sizes="(min-width: 1024px) 611px, 100vw"
              src="/about-us/director.jpg"
            />
            {/* The dark-background cut of the mark — its wordmark is near
                white, which is what this portrait needs. `nf-logo-ink.png` is
                the one for cream. */}
            <Image
              alt=""
              className="absolute left-5 top-5 h-[90px] w-auto"
              height={90}
              src="/nf-logo.png"
              width={112}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const CERTIFICATES = [
  {
    badge: "/about-us/iso-9001.svg",
    body: "Quality management systems, the global production-excellence standard.",
    name: "ISO 9001",
  },
  {
    badge: "/about-us/iso-14001.svg",
    // Kept to the same length as the ISO 9001 line so both wrap to the two
    // lines the comp draws, and the badge pair stays a matched height.
    body: "Environmental management systems, the global footprint-control standard.",
    name: "ISO 14001",
  },
];

export function AboutCertificates() {
  // 100 + 343 of badges + 100 = the comp's 543px band; the shorter left
  // column centres against it, which is where the comp puts it too.
  return (
    <section className="bg-cream px-6 py-20 sm:px-8 lg:py-[100px]">
      <div className="mx-auto grid max-w-[1240px] items-center gap-x-[110px] gap-y-14 lg:grid-cols-[521px_1fr]">
        <Reveal>
          <SectionHead eyebrow="Certificates">
            <span className="lg:block">Quality,</span>{" "}
            <span className="lg:block text-vermilion">made visible.</span>
          </SectionHead>

          <p className={`${BODY} mt-[60px] max-w-[521px]`}>
            Standards built for trust at home and readiness across global
            markets.
          </p>

          {/* The comp draws this as a flat pill with no destination. The
              dossier is something you have to ask for, and the form is the
              only place on the site that takes a request — so it goes there. */}
          <a
            className="mt-[50px] inline-flex h-[47px] min-w-[324px] items-center justify-center rounded-full bg-vermilion px-8 font-editorial font-bold text-[13px] uppercase leading-none tracking-[0.02em] text-white transition-colors duration-200 ease-out hover:bg-[#c8151b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
            href="#contact"
          >
            Request our certification dossier
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-x-[93px] gap-y-14 sm:grid-cols-2">
            {CERTIFICATES.map((certificate) => (
              <div className="text-center" key={certificate.name}>
                <Image
                  alt=""
                  className="mx-auto size-[157px]"
                  height={157}
                  src={certificate.badge}
                  width={157}
                />
                <h3
                  className={`${TRIM} mt-[31px] font-editorial font-semibold text-[22px] capitalize leading-[1.16] text-black`}
                >
                  {certificate.name}
                </h3>
                <p
                  className={`${TRIM} mx-auto mt-[15px] max-w-[256px] font-editorial text-[14px] capitalize leading-[20px] text-slate`}
                >
                  {certificate.body}
                </p>
                <p
                  className={`${TRIM} mt-[30px] font-editorial text-[13px] uppercase leading-[28px] tracking-[0.16em] text-vermilion`}
                >
                  Scope &middot; Full plant
                </p>
              </div>
            ))}
          </div>

          {/* The comp's pager. It is inert here — there are two certificates
              and no carousel to page through — but it is 16px of the comped
              543px band, so leaving it out left this section short. It is an
              image, not buttons, so nothing invites a click that does
              nothing. Swap it for real controls when a third certificate
              makes a carousel worth building. */}
          <Image
            alt=""
            className="mx-auto mt-[51px] h-4 w-[84px]"
            height={16}
            src="/about-us/cert-dots.svg"
            width={84}
          />
        </Reveal>
      </div>
    </section>
  );
}
