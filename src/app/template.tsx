"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useCallback, useState } from "react";
import { HomeCurtain } from "@/components/scroll/home-curtain";
import { Preloader } from "@/components/ui/preloader";

/**
 * Every route but `/` is prerendered static and waiting on nothing, so the
 * fill there is pure pacing. Roughly half the home route's write: a title card
 * covering a page that has already rendered should get out of the way faster
 * than one covering a film that genuinely has not arrived.
 */
const ROUTE_INK_MS = 600;

/**
 * The curtain, on every entrance to every page.
 *
 * `template.tsx` rather than `layout.tsx` — a layout persists across
 * navigations and would never remount, which is precisely the event the
 * curtain exists to mark. A template is rebuilt each time, so mounting the
 * loader here is the whole mechanism: it plays because it is new.
 *
 * `/` gets a different curtain, not a second one. The home route is the only
 * page waiting on something real, so its loader holds for the frame sequence
 * instead of a timer — and since that sequence is what the loader gates on,
 * the loading moved up here with it rather than staying down in `ScrollScene`.
 * See `HomeCurtain`.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  // Stable identity: `Preloader` keeps `onLift` in an effect's dependencies,
  // and a fresh closure each render would restart the timer that calls it.
  const lift = useCallback(() => setLifted(true), []);

  if (pathname === "/") return <HomeCurtain>{children}</HomeCurtain>;

  return (
    <>
      <Preloader inkMs={ROUTE_INK_MS} onLift={lift} progress={1} ready />
      {/*
        The page is held out of the render tree until the curtain moves, which
        is the whole fix for entrances playing behind it. Every entrance on
        these two routes starts on mount — the hero roll and its photo fill are
        CSS animations with fixed delays, the section reveals are
        IntersectionObservers, and the About headline has an observer of its
        own. All of them were firing while the panel covered the page, so a
        reader arrived to a page that had already finished arriving.

        `display: none` is what makes this one line rather than a gate threaded
        through every animated component: an element that is not rendered runs
        no animations and intersects nothing, and both start from the beginning
        when it comes back. Held out of *rendering*, not out of the tree — the
        markup still ships in the prerendered HTML, and both heroes mark their
        image `priority`, so its preload is issued from the document head and
        does not wait on this.

        `contents` rather than `block` once lifted: `<body>` is a flex column
        whose items are the header, main and footer, and a wrapper with a box
        of its own would collapse all three into a single flex item.
      */}
      <div className={lifted ? "contents" : "hidden"}>{children}</div>
    </>
  );
}
