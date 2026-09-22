"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { FRAME_LQIP } from "@/lib/frames.generated";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const WORDS = ["National", "Foods"];

/**
 * The wordmark, pre-split into letters with one running index across both
 * words, so the exit stagger reads left to right across the whole line rather
 * than restarting at "Foods". Built once at module scope — the text is fixed,
 * and re-deriving it per render is work with one possible answer.
 */
const GROUPS = (() => {
  let index = 0;
  return WORDS.map((word) => ({
    word,
    chars: [...word].map((char) => ({ char, index: index++ })),
  }));
})();

/**
 * The ink's own clock.
 *
 * The fill is floored by real progress but paced by this, and it needs to be:
 * the preloader gates on about two dozen frames fetched six at a time, so on a
 * warm cache `progress` reaches 1 in a couple of hundred milliseconds — before
 * `document.fonts.ready` has even let the wordmark mount. Bound straight to
 * progress the clip rendered fully open on its first paint and the sweep was
 * not slow, it had already happened. Pacing it means the ink always writes the
 * word in, and a genuinely slow connection simply holds it wherever it got to.
 */
const INK_DELAY = 200;
const INK_MS = 1200;
/** A beat on the finished wordmark before it is taken away. */
const HOLD_MS = 250;

/**
 * The exit, letter by letter, left to right. 35ms apart — inside Emil's 30–80
 * band, and at thirteen letters that is 420ms of cascade, which is as long as
 * a stagger can run before it stops reading as one word leaving and starts
 * reading as thirteen things leaving separately. The 620ms travel each letter
 * gets is in the className below, next to the curve it uses.
 */
const LETTER_STAGGER = 0.035;
/**
 * When the panel starts after the letters do. Deliberately shorter than the
 * full cascade (420 + 620 = 1040ms): the last letters are still climbing as
 * the curtain takes them, so the two moves overlap into one gesture instead of
 * the panel waiting politely for the type to finish.
 */
const TYPE_OUT_MS = 650;
/** The curtain's travel. Mirrored in the className below. */
const LIFT_MS = 850;

/**
 * Held for as long as the sequence needs to decode enough of itself that the
 * scrub won't stutter — but read as a title card rather than a progress dialog.
 *
 * The order is the whole idea: the name arrives dim, the ink writes it in from
 * the left as the film decodes, and only once it is whole does it leave —
 * upward, a letter at a time, with the panel following it off the top of the
 * screen. Progress is the fill, so there is no rail and no percentage; the one
 * thing on the screen is the name, and watching it finish *is* watching the
 * loader finish.
 */
export function Preloader({
  progress,
  ready,
  inkMs = INK_MS,
  onLift,
}: {
  progress: number;
  ready: boolean;
  /**
   * How long the fill takes at most. The home route waits on a film and can
   * afford the full write; a route change is waiting on nothing and a title
   * card that outstays the page it is covering stops being a flourish.
   */
  inkMs?: number;
  /** Fired as the curtain starts moving. See lib/intro-gate for the one caller. */
  onLift?: () => void;
}) {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  // `in` → `type-out` → `out` → `gone`. The component has to outlive `ready`
  // to play its own exit, so it owns the unmount rather than the caller
  // switching it off.
  const [phase, setPhase] = useState<"in" | "type-out" | "out" | "gone">("in");
  // Kactigona is a swap-display webfont with metrics nothing on the system
  // comes close to, so a fallback would re-lay out every letter box mid-fill.
  // The words are not mounted until the real face is there, which is also when
  // the clock below starts.
  const [typeReady, setTypeReady] = useState(false);
  const [inkFull, setInkFull] = useState(false);
  const startedAt = useRef(0);
  const inkRef = useRef<HTMLDivElement>(null);
  // Read by the frame loop, which must not re-subscribe on every progress tick.
  const progressRef = useRef(0);
  progressRef.current = progress;

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      startedAt.current = performance.now();
      setTypeReady(true);
    };
    // A font that never resolves must not hold the page hostage.
    const timer = setTimeout(go, 1200);
    document.fonts?.ready.then(go).catch(go);
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, []);

  // Written straight to the node rather than through state: this runs every
  // frame, and re-rendering the tree 60 times a second to move one clip edge
  // is work with nothing to show for it.
  useEffect(() => {
    if (!typeReady || phase !== "in") return;
    let raf = 0;
    const tick = () => {
      const ramp = (performance.now() - startedAt.current - INK_DELAY) / inkMs;
      // The floor is what keeps this honest — the ink can be paced, but it
      // cannot claim more of the film has arrived than actually has.
      const value = Math.max(0, Math.min(progressRef.current, ramp));
      if (inkRef.current) {
        inkRef.current.style.clipPath = `inset(0 ${(1 - value) * 100}% 0 0)`;
      }
      if (value >= 1) {
        setInkFull(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [typeReady, phase, inkMs]);

  // Nothing leaves until the name is written and the film is decoded.
  useEffect(() => {
    if (phase !== "in" || !(ready && inkFull)) return;
    const timer = setTimeout(() => setPhase("type-out"), HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase, ready, inkFull]);

  useEffect(() => {
    if (phase !== "type-out") return;
    const timer = setTimeout(() => {
      // Fired as the lift begins, not after it: whatever is behind the curtain
      // should start moving while it is still on its way up, so the two read
      // as one gesture rather than a handover.
      onLift?.();
      setPhase("out");
    }, TYPE_OUT_MS);
    return () => clearTimeout(timer);
  }, [phase, onLift]);

  useEffect(() => {
    if (phase !== "out") return;
    const timer = setTimeout(() => setPhase("gone"), LIFT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "gone") return;
    lenis?.stop();
    // Belt and braces: Lenis is gone entirely under reduced motion.
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis, phase]);

  if (phase === "gone") return null;

  // The letters go on "type-out" and stay gone through "out" — releasing them
  // when the panel starts moving would drop them back into frame.
  const typeLeaving = phase === "type-out" || phase === "out";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-char transition-[translate,opacity] duration-[850ms] ease-drawer"
      // A full-viewport surface travelling a full viewport is the single most
      // vestibular move on the site, and it is now on every entrance to every
      // page rather than once on the home route. Asked for less motion it
      // cross-fades off instead. The fill stays either way: it is a horizontal
      // wipe across a line of type, not a surface sweeping the visual field,
      // and it is the only thing on the panel reporting progress.
      style={
        phase === "out"
          ? reduced
            ? { opacity: 0 }
            : { translate: "0 -100%" }
          : undefined
      }
    >
      <div
        aria-hidden
        // 0.18, and the frames are warm — any higher and the ground stops
        // being black. The wordmark is the only thing on this panel carrying
        // information; a mottled backdrop costs the fill contrast to decorate
        // the space around it.
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-18 blur-2xl"
        style={{ backgroundImage: `url(${FRAME_LQIP})` }}
      />
      {/* <output> carries an implicit role="status". */}
      <output
        aria-live="polite"
        className="relative flex items-center px-[6vw]"
      >
        {typeReady && (
          // `hero-fill` is `from { opacity: 0 }` and nothing else, so it is
          // just a fade — borrowed here at a different duration and no delay
          // rather than adding a second keyframe that says the same thing.
          <div
            className="relative animate-[hero-fill_450ms_var(--ease-out)_both] transition-opacity duration-[420ms] ease-out"
            // Reduced motion loses the per-letter travel, so the whole wordmark
            // fades as one. Without this the letters would simply still be
            // there when the panel cross-faded out from under them.
            style={reduced && typeLeaving ? { opacity: 0 } : undefined}
          >
            {/* Unloaded is the mark's own red banked down against the black,
                not a grey — so the fill reads as the same ink coming up to
                strength rather than one colour replacing another. */}
            <Wordmark
              className="text-vermilion-dim"
              leaving={typeLeaving && !reduced}
            />
            {/* The ink. Same markup, same stagger, mounted on the same frame —
                which is what keeps the two copies travelling as one without a
                second timer to drift against. `clipPath` is written by the
                frame loop above; the inline value is only where it starts. */}
            <div
              aria-hidden
              className="absolute inset-0 text-vermilion"
              ref={inkRef}
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              <Wordmark leaving={typeLeaving && !reduced} />
            </div>
          </div>
        )}
        {/* The fill is the progress bar now. This is the same reading for
            anyone who can't see it — a live region with nothing in it announces
            nothing, and the wordmark itself is `aria-hidden` on the copy that
            moves. */}
        <span className="sr-only">Loading {Math.round(progress * 100)}%</span>
      </output>
    </div>
  );
}

/**
 * One span per letter, each with its own delay, so the line empties left to
 * right instead of lifting as a slab.
 *
 * Deliberately **not** one clip box per letter, which is how the rest of the
 * site does a roll. Kactigona is a connected brush script: its letters join,
 * and its swashes run well outside their own advance widths — the `N` reaches
 * back over most of the word. Box each glyph and clip to it and every join is
 * cut and every tail shaved, at rest, before anything animates. So the letters
 * travel and fade in the open instead, which needs no mask to hide behind.
 *
 * Splitting at all is only safe because of what the file does not contain: no
 * `GPOS` and no `kern`, so per-letter boxes preserve the exact advances that
 * unsplit text would have had, and the one `GSUB` feature on by default is
 * `liga`, which has no pair to form in these two words.
 *
 * The vertical padding is the ink's, not the type's. The fill copy is clipped
 * with `inset(0 …)` against this element's box, so the box has to be tall
 * enough to contain the swashes — without it the ink stops at the line box and
 * every ascender stays dim while the rest of the letter lights up.
 */
function Wordmark({
  className = "",
  leaving,
}: {
  className?: string;
  leaving: boolean;
}) {
  return (
    <p
      className={`flex items-baseline gap-[0.26em] px-[0.12em] py-[0.55em] font-title text-[clamp(2.25rem,9.5vw,7.5rem)] leading-[1.1] ${className}`}
    >
      {GROUPS.map(({ word, chars }) => (
        <span className="flex items-baseline" key={word}>
          {chars.map(({ char, index }) => (
            <span
              className="block transition-[translate,opacity] duration-[620ms,420ms] ease-in"
              key={`${word}-${index}`}
              style={{
                opacity: leaving ? 0 : undefined,
                transitionDelay: `${index * LETTER_STAGGER}s`,
                // Half a line, not a full one: with nothing to disappear behind
                // the fade is what ends the move, and a letter still travelling
                // once it is invisible is just latency before the curtain.
                translate: leaving ? "0 -50%" : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
