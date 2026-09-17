"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import Image from "next/image";
import {
  BODY,
  EYEBROW,
  SectionHead,
  TRIM,
} from "@/components/sections/about-us";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT } from "@/lib/ease";

/**
 * The /team route, comped as one 1920×5481 frame in Figma (node `17:359`).
 *
 * Three sections here; the frame's last three blocks are the certificates
 * band, the contact form and the footer, which are pixel-identical to the
 * ones already built for `/about` and `/` — so the route composes
 * `AboutCertificates`, `Contact` and `SiteFooter` instead of restating them.
 *
 * Same 1380 content column and the same type scale as `about-us.tsx`, which
 * is why the lockup and the four type constants are imported from there
 * rather than copied. Every gap below is the comp's own pixel value; see the
 * geometry note at the top of `about-us.tsx` for why that works literally.
 */

// ---------------------------------------------------------------------------

const HERO_LINES = (
  <>
    <span className="block">The People Behind</span>
    <span className="block">the Purity.</span>
  </>
);

/**
 * Framing for the photo poured into the headline, by the same arithmetic as
 * the About hero: the comp lays a 1662×935 still over the 786×131 text box,
 * offset 6px left and 417px up.
 *   width  1662/786          = 211.5%
 *   pos-x  −6 / (786 − 1662) = 0.7%
 *   pos-y  −417 / (131 − 935) = 51.9%
 */
const HERO_FILL =
  "bg-[url('/team/headline-fill.png')] bg-[length:211.5%_auto] bg-[position:0.7%_51.9%] bg-no-repeat";

export function TeamHero() {
  return (
    // The comp's cream band stops at y870 and the collage carries on for
    // another 213px over white, so the section is white and the cream is a
    // block inside it that the still overhangs.
    //
    // `id="top"` is what the header watches to choose between its gradient
    // scrim and its glass bar — every page needs one, and here it's the hero.
    <section className="relative bg-white" id="top">
      <div className="bg-cream px-6 pt-[140px] pb-16 text-center sm:px-8 lg:pt-[255px] lg:pb-[353px]">
        <Reveal>
          <p className={EYEBROW}>Team National</p>

          {/* Two stacked copies rather than one `bg-clip-text` element: the
              photo layer is decorative, so if it fails to load the headline
              underneath is still solid black rather than invisible. The type
              lives on the span because `text-box` trims an element's own line
              box — see the same construction in `AboutHero`. */}
          <h1 className="mt-[30px] leading-[0]">
            <span
              className={`${TRIM} relative inline-block align-top font-editorial font-black capitalize text-[clamp(2.25rem,7.3vw,4.6875rem)] leading-[1.0667] text-black`}
            >
              {HERO_LINES}
              {/* The photograph floods into the letterforms a beat after the
                  black type has landed, rather than arriving already poured
                  in. It's the one piece of motion here that explains the
                  page — the picture filling the words is the headline's whole
                  idea, and a static fill hides that it's a photograph at all.
                  Opacity only, so it's a single compositor property and it
                  survives reduced motion untouched: a fill appearing is
                  comprehension, not vestibular movement. */}
              <motion.span
                aria-hidden
                className={`${TRIM} absolute inset-0 ${HERO_FILL} bg-clip-text text-transparent`}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
                viewport={{ once: true }}
                whileInView={{ opacity: 0.6 }}
              >
                {HERO_LINES}
              </motion.span>
            </span>
          </h1>

          <p className={`${BODY} mx-auto mt-[50px] max-w-[675px]`}>
            National Foods is carried by artisans, specialists, and stewards
            whose dedication turns hard-won knowledge into consistent
            purity&nbsp;&mdash; every day, across every generation.
          </p>
        </Reveal>
      </div>

      <div className="px-6 sm:px-8">
        {/* 337px up is the comp's overlap: it puts the collage's top at y533,
            16px below the copy, and drops the cream/white seam at 61% of the
            still. `mix-blend-multiply` is what makes that seam invisible —
            the export is opaque white behind the silhouettes, and multiply
            drops white to whatever is underneath, cream above the seam and
            white below it. Below `lg` the column is too narrow to overlap
            anything, so the still just follows the copy.

            The blend has to sit on `Reveal`'s own element, not on the image
            inside it. Motion leaves a transform on that element, which makes
            it a stacking context — and a blend mode on a *descendant* of one
            only ever sees that context's own backdrop, which is empty. So the
            still rendered on an opaque white plate over the cream. On the
            element itself the blend is against the page behind it, which is
            what it needs to see.

            It settles out of a 4% oversize rather than sliding up like the
            rest of the page. 28px of travel is invisible on a 955px-wide
            still, so the standard `Reveal` rise was costing a frame budget
            for nothing; a scale settle reads as the image coming to rest at
            its depth, which is the same language the philosophy band on
            /about uses. `transform` as a full string, not Motion's `scale`
            shorthand — the shorthand isn't hardware-accelerated. */}
        <MotionConfig reducedMotion="user">
          <motion.div
            className="mx-auto w-full max-w-[955px] mix-blend-multiply lg:-mt-[337px]"
            initial={{ opacity: 0, transform: "scale(1.04)" }}
            transition={{ delay: 0.1, duration: 0.9, ease: EASE_OUT }}
            viewport={{ margin: "-4%", once: true }}
            whileInView={{ opacity: 1, transform: "scale(1)" }}
          >
            <div className="relative mt-10 aspect-[955/550] lg:mt-0">
              <Image
                alt="Double exposure of a team walking together, the city skyline and Ferula flower heads printed through their silhouettes"
                className="object-contain"
                fill
                priority
                sizes="(min-width: 1024px) 955px, 100vw"
                src="/team/hero-collage.png"
              />
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const ROLES = [
  {
    alt: "A master blender sifting ground asafoetida into a steel bowl beside jars of raw resin",
    body: "Seasoned hands balance aroma, strength, and character with the intuition that only years of practice can build.",
    photo: "/team/role-blenders.png",
    title: "Master Blenders",
  },
  {
    alt: "An analyst at a microscope testing a sample in the in-house laboratory",
    body: "Every critical standard is measured with care, protecting purity from raw ingredient to finished product.",
    photo: "/team/role-analysts.png",
    title: "Quality & Safety Analysts",
  },
  {
    alt: "Technicians in whites and gloves feeding resin into the processing line",
    body: "Precision and practical knowledge keep a modern plant moving while preserving the ingredient's natural integrity.",
    photo: "/team/role-craftsmen.png",
    title: "Processing Craftsmen",
  },
  {
    alt: "Buyers shaking hands with farmers at a collection point, raw resin in the foreground",
    body: "Trusted relationships carry quality across farmers, partners, production teams, and respected food brands.",
    photo: "/team/role-stewards.png",
    title: "Supply Stewards",
  },
];

const CARDS: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

const CARD: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/**
 * The badge lands after its own card, not with it — that beat is what turns
 * four photographs into a numbered sequence instead of a row of stills.
 *
 * 0.6, not 0: a marker that grows out of nothing reads as an effect, the same
 * reasoning as the timeline dots on /about. No overshoot either — nothing the
 * reader did carried momentum into this, so a bounce would be decoration
 * pretending to be physics.
 *
 * `transform` rather than Motion's `scale`, and it composes with the badge's
 * Tailwind `-translate-x-1/2`: v4 writes that to the standalone `translate`
 * property, so the two never fight over one declaration.
 */
const BADGE: Variants = {
  hidden: { opacity: 0, transform: "scale(0.6)" },
  shown: {
    opacity: 1,
    transform: "scale(1)",
    transition: { delay: 0.18, duration: 0.4, ease: EASE_OUT },
  },
};

export function TeamRoles() {
  // 30px, not 120: the collage above already overhangs into this section's
  // white, and the comp measures the gap from where the still ends.
  return (
    <section className="bg-white px-6 pt-[30px] pb-20 sm:px-8 lg:pb-[120px]">
      <div className="mx-auto max-w-[1380px]">
        {/* 660 + 45 puts the quote's column edge at the comp's x975 and leaves
            it the 675 it needs — the same split as the story block on /about. */}
        <div className="grid gap-x-[45px] gap-y-8 lg:grid-cols-[660px_1fr]">
          <Reveal>
            <SectionHead eyebrow="About Team">
              Not employees.{" "}
              <span className="lg:block text-vermilion">Family.</span>
            </SectionHead>
          </Reveal>

          {/* 23px down — the quote sits against the eyebrow, not on it. */}
          <Reveal delay={0.08}>
            <p className={`${BODY} max-w-[675px] lg:mt-[23px]`}>
              &ldquo;We believe that our workforce is a family rather than
              employees. There is a lot of trust and belief in the product that
              we produce, which helps us deliver optimal output even during hard
              times.&rdquo;
            </p>
          </Reveal>
        </div>

        {/* 106px, not the comp's 80: the badge overhangs the photo by 26px, so
            the grid's own top edge is the photo's and the badge lives above
            it. `gap-y` is generous for the same reason — when the row wraps,
            a badge has to clear the copy of the card above it. */}
        <MotionConfig reducedMotion="user">
          <motion.ul
            className="mt-[80px] grid gap-x-[30px] gap-y-[60px] sm:grid-cols-2 lg:mt-[106px] lg:grid-cols-4"
            initial="hidden"
            variants={CARDS}
            viewport={{ once: true, margin: "-10%" }}
            whileInView="shown"
          >
            {ROLES.map((role, i) => (
              <motion.li className="relative" key={role.title} variants={CARD}>
                <div className="relative aspect-[323/309] w-full overflow-hidden rounded-[20px] bg-black/5">
                  <Image
                    alt={role.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 323px, (min-width: 640px) 45vw, 90vw"
                    src={role.photo}
                  />
                </div>

                {/* Decorative: it numbers the card, it doesn't label it, and
                    the heading below already names the role. */}
                <motion.span
                  aria-hidden
                  className={`-top-[26px] -translate-x-1/2 absolute left-1/2 flex size-[51px] items-center justify-center rounded-full bg-marigold font-editorial font-bold text-[20px] text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] ${TRIM}`}
                  variants={BADGE}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>

                <h3
                  className={`${TRIM} mt-[30px] font-editorial font-bold text-[20px] capitalize leading-[1.16] text-black`}
                >
                  {role.title}
                </h3>
                <p
                  className={`${TRIM} mt-[24px] font-editorial font-medium text-[17px] capitalize leading-[28px] text-slate`}
                >
                  {role.body}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </MotionConfig>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

const PLEDGES = [
  {
    body: "Only 100% authentic, carefully selected ingredients enter our process.",
    icon: "/team/value-01.svg",
    title: "Authentic & safe",
  },
  {
    body: "Zero artificial colouring or additives—purity remains visible and verifiable.",
    icon: "/team/value-02.svg",
    title: "Nothing artificial",
  },
  {
    body: "Natural, genuine, potent flavour and the ingredient's medicinal character are protected.",
    icon: "/team/value-03.svg",
    title: "Integrity preserved",
  },
  {
    body: "Progress must sustain the farmers, partners, craftspeople, and team members who make it possible.",
    icon: "/team/value-04.svg",
    title: "Growth shared",
  },
];

/**
 * `translate`, not `transform`. Tailwind v4 writes lifts to the standalone
 * property, which leaves Motion's entrance transform on the same element alone
 * instead of the two fighting over one declaration.
 */
const LIFT =
  "transition-[translate,box-shadow] duration-[250ms] ease-out pointer-fine:hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] motion-safe:pointer-fine:hover:-translate-y-1";

export function TeamValues() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:py-[120px]">
      <div className="mx-auto max-w-[1380px]">
        <Reveal>
          <SectionHead eyebrow="Grow Together">
            We work together; <span className="text-vermilion">we</span>{" "}
            <span className="lg:block text-vermilion">grow together.</span>
          </SectionHead>
        </Reveal>

        <MotionConfig reducedMotion="user">
          <motion.div
            className="mt-[60px] grid gap-[30px] lg:mt-[80px] lg:grid-cols-2"
            initial="hidden"
            variants={CARDS}
            viewport={{ once: true, margin: "-10%" }}
            whileInView="shown"
          >
            {PLEDGES.map((pledge, i) => (
              <motion.article
                className={`rounded-[20px] bg-cream p-8 sm:p-10 ${LIFT}`}
                key={pledge.title}
                variants={CARD}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Height is what's fixed — the four glyphs are all 82 tall
                      in the comp and between 68 and 94 wide. */}
                  <Image
                    alt=""
                    className="h-[82px] w-auto"
                    height={82}
                    src={pledge.icon}
                    width={94}
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
                  {pledge.title}
                </h3>
                <p
                  className={`${TRIM} mt-[25px] font-editorial font-medium text-[17px] capitalize leading-[28px] text-slate`}
                >
                  {pledge.body}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </MotionConfig>
      </div>
    </section>
  );
}
