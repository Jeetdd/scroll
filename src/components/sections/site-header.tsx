"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type MouseEvent, useEffect, useState } from "react";
import { EASE_DRAWER } from "@/lib/ease";

/** In page order, so the nav reads as a map of the scroll rather than a menu. */
const LINKS = [
  { href: "#about", label: "About" },
  { href: "#research", label: "Research" },
  { href: "#horizon", label: "Horizon" },
  { href: "#trusted", label: "Clients" },
];

/**
 * The bar's own height once it has compacted, so a link lands its section's
 * eyebrow just clear of the glass instead of behind it. Sections carry 80px of
 * top padding, which absorbs the difference at the sizes where the bar is
 * shorter than this.
 */
const HEADER_OFFSET = 88;

const LINK =
  "font-editorial font-semibold text-[13px] uppercase leading-none tracking-[0.18em] text-ink transition-colors duration-200 ease-out hover:text-vermilion focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion";

const CTA =
  "inline-flex h-[38px] items-center justify-center rounded-full bg-vermilion px-5 font-editorial font-extrabold text-[12px] uppercase leading-none tracking-[0.1em] text-white transition-colors duration-200 ease-out hover:bg-[#c8151b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion";

const BAR =
  "block h-[2px] w-6 rounded-full bg-ink transition duration-300 ease-out";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // The intro is the whole 400vh runway the film is pinned behind, so "the
  // intro has left" is the same moment the scene starts scrubbing — which is
  // also where a cream gradient stops being able to hold the mark legible,
  // because the footage runs down to a near-black kadhai from there.
  useEffect(() => {
    const intro = document.getElementById("top");
    if (!intro) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  // Escape closes the panel, and so does growing past the breakpoint that
  // hides the toggle — otherwise the panel is left open with no way to shut it.
  useEffect(() => {
    if (!open) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onChange);
    };
  }, [open]);

  // The panel hangs off a fixed bar, so anything scrolling behind it slides out
  // from under the links while they're being read.
  useEffect(() => {
    if (!(lenis && open)) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, open]);

  // Lenis owns the scroll position, so a native anchor jump would fight it: the
  // browser hard-jumps and Lenis carries on from where it still thinks it is.
  // Under reduced motion Lenis has been destroyed and the native path is the
  // correct one — and an instant jump is what was asked for anyway.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    setOpen(false);

    const top =
      target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (lenis && !reduced.matches) {
      // Released here rather than left to the lock effect's cleanup. Closing
      // the panel and scrolling are one gesture, and `start()` runs `reset()`,
      // which drops whatever scroll is in flight — so a cleanup firing after
      // this line would cancel the very scroll the link asked for. Starting
      // first makes that cleanup a no-op: Lenis' `start()` returns early when
      // it isn't stopped.
      lenis.start();
      lenis.scrollTo(top);
    } else {
      window.scrollTo({ top, behavior: "auto" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Two materials, cross-faded rather than swapped. Over the intro's cream
          veil a gradient scrim is enough and costs nothing; past it the bar has
          to sit over the film and then over the dark sections, where a cream
          wash just smears. Opacity is what moves because `backdrop-filter`
          doesn't interpolate from `none` — toggling the property itself would
          pop the blur in at full strength while the tint was still fading. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/40 to-transparent transition-opacity duration-500 ease-out ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border-ink/8 border-b bg-cream/72 backdrop-blur-[20px] backdrop-saturate-[180%] transition-opacity duration-500 ease-out ${
          scrolled || open ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-[85vw] items-center justify-between gap-4 px-[1vw] py-3 sm:px-3"
      >
        {/* The light-background cut. `nf-logo.png` is the dark-background
            variant — its wordmark and tagline are near-white, which is
            invisible against the cream the nav sits on — so the neutrals are
            recoloured to ink and the brand red is left alone. Keep the
            original for anything on `bg-ink`, like the footer. */}
        <a className="block shrink-0" href="/">
          <Image
            alt="National Foods — the hing specialist"
            // Height, not a transform: this fires once per visit, and shrinking
            // the mark is meant to take the bar down with it. A scale would
            // leave the same 96px of chrome with a smaller logo floating in it.
            className={`w-auto transition-[height] duration-[350ms] ease-out ${
              scrolled ? "h-12 sm:h-16" : "h-16 sm:h-24"
            }`}
            height={360}
            priority
            src="/nf-logo-ink.png"
            width={324}
          />
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          <ul className="flex items-center gap-9">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className={LINK}
                  href={link.href}
                  onClick={(event) => goTo(event, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* biome-ignore lint/a11y/useValidAnchor: navigation to a section of
              this page, which is exactly what a fragment anchor is for. The
              handler only replaces the jump with Lenis' scroll — middle-click,
              open-in-new-tab and the keyboard all still behave like a link. */}
          <a
            className={CTA}
            href="#contact"
            onClick={(event) => goTo(event, "#contact")}
          >
            Contact
          </a>
        </div>

        <button
          aria-controls="primary-menu"
          aria-expanded={open}
          className="-mr-2 flex size-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {/* 2px bars 5px apart, so 7px of travel puts both outer bars on the
              middle one's centre line and the cross closes on itself. */}
          <span
            aria-hidden
            className={`${BAR} ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span aria-hidden className={`${BAR} ${open ? "opacity-0" : ""}`} />
          <span
            aria-hidden
            className={`${BAR} ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-full border-ink/8 border-b bg-cream/95 backdrop-blur-[20px] backdrop-saturate-[180%] lg:hidden"
            exit={{ opacity: 0, y: -12 }}
            id="primary-menu"
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE_DRAWER }}
          >
            <ul className="flex flex-col gap-1 px-[6vw] py-5 sm:px-8">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    className={`${LINK} block py-3 text-[15px]`}
                    href={link.href}
                    onClick={(event) => goTo(event, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-3">
                {/* biome-ignore lint/a11y/useValidAnchor: as above — a link to
                    a section of this page. */}
                <a
                  className={`${CTA} w-full`}
                  href="#contact"
                  onClick={(event) => goTo(event, "#contact")}
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
