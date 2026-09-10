"use client";

import type { CSSProperties, ElementType } from "react";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { gsap } from "@/lib/gsap";

const clamp = (v: number, a: number, b: number): number =>
  v < a ? a : v > b ? b : v;

type Reveal = "rise" | "wipe" | "fade" | "none";
type Trigger = "view" | "mount" | "hover";

export interface MaskedHeadingProps {
  text?: string;
  tag?: ElementType;
  mediaType?: "image" | "video";
  src?: string;
  /** Alternate still for `srcNarrowMedia`. Only one of the two is fetched. */
  srcNarrow?: string;
  srcNarrowMedia?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: Reveal;
  duration?: number;
  stagger?: number;
  trigger?: Trigger;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text = "Designed in the details",
  tag = "h2",
  mediaType = "image",
  src = "",
  srcNarrow = "",
  srcNarrowMedia = "(max-width: 768px) and (orientation: portrait)",
  poster = "",
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = "rise",
  duration = 1.1,
  stagger = 0.09,
  trigger = "view",
  align = "center",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = "",
  style,
  ...rest
}: MaskedHeadingProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsetRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  // Keys are built here rather than in the map callback so repeated words
  // ("of", "the") stay distinct without keying off the array index in JSX.
  const words = useMemo(
    () =>
      String(text)
        .split(/\s+/)
        .filter(Boolean)
        .map((word, index) => ({ word, key: `${index}-${word}` })),
    [text],
  );

  const settingsRef = useRef<{
    fillScale: number;
    parallax: number;
    drift: number;
    brightness: number;
    saturation: number;
    grayscale: boolean;
    textScale: number;
  }>({
    fillScale: 1,
    parallax: 0,
    drift: 0,
    brightness: 1,
    saturation: 1,
    grayscale: false,
    textScale: 0.115,
  });

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;

    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);

    // 2D `translate`, not `translate3d`. The 3D form promotes this element to
    // its own composited layer, and when a clip-path is applied to a composited
    // layer Chrome leaks a one-pixel row of the mask along the top of the clip's
    // box — visible as a hairline across the heading while an ancestor scales
    // it. Nothing is lost by staying on the main thread: the offsets below are
    // rewritten from rAF every frame anyway, so there is no compositor-driven
    // animation to hand off. See also: no `will-change` on the element.
    media.style.transform = `translate(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px) scale(${s.fillScale})`;

    // `none` rather than `brightness(1) saturate(1)`, so a caller that grades
    // its source image doesn't pay for a no-op filter on every frame.
    const graded = s.brightness !== 1 || s.saturation !== 1 || s.grayscale;
    media.style.filter = graded
      ? `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? " grayscale(1)" : ""}`
      : "none";
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;

    const cs = window.getComputedStyle(measure);
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute("x", `${box.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;
    }
    place();
  }, [place]);

  // Settings land in a ref so the rAF below can read the latest values without
  // re-subscribing every render. Declared first so the mount effect that reads
  // them already sees the real props rather than the placeholder defaults.
  useEffect(() => {
    settingsRef.current = {
      fillScale,
      parallax,
      drift,
      brightness,
      saturation,
      grayscale,
      textScale,
    };
    sync();
  }, [
    fillScale,
    parallax,
    drift,
    brightness,
    saturation,
    grayscale,
    textScale,
    sync,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const s = settingsRef.current;
      const off = offsetRef.current;

      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;

      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;

      place();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      if (s.parallax <= 0) return;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [place, sync]);

  // Each of these changes the text's own metrics without changing the size of
  // the container, so the ResizeObserver above never fires for them and only a
  // re-run re-measures the glyph boxes. A `tag` change is left out: React
  // remounts on an element-type change, which re-runs everything anyway.
  // biome-ignore lint/correctness/useExhaustiveDependencies: metric re-measure
  useEffect(() => {
    sync();
  }, [sync, words, align, weight, tracking, lineHeight]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return;
    // Sliced, not just filtered: the ref array is never truncated, so shorter
    // text would otherwise keep animating the leftovers of a longer run.
    const glyphs = glyphRefs.current.slice(0, words.length).filter(Boolean);
    if (!glyphs.length) return;

    const riseDistance = () =>
      (Number.parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

    const settle = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    };

    const rest = () => {
      if (reveal === "rise") {
        gsap.set(glyphs, { y: riseDistance() });
      } else if (reveal === "wipe") {
        gsap.set(layer, { clipPath: "inset(0% 100% 0% 0%)" });
      } else if (reveal === "fade") {
        gsap.set(layer, { opacity: 0, scale: 1.08 });
      }
    };

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reveal === "none" || reduce) {
      settle();
      return;
    }

    const play = () => {
      tweenRef.current?.kill();
      if (reveal === "rise") {
        gsap.set(layer, {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: "power4.out", overwrite: "auto" },
        );
      } else if (reveal === "wipe") {
        gsap.set(glyphs, { y: 0 });
        const state = { p: 100 };
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
          },
        });
      } else {
        gsap.set(glyphs, { y: 0 });
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1,
            scale: 1,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
      }
    };

    if (trigger === "hover") {
      settle();
      root.addEventListener("pointerenter", play);
      return () => {
        root.removeEventListener("pointerenter", play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === "view") {
      settle();
      rest();
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(root);
      return () => {
        io.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [reveal, trigger, duration, stagger, words]);

  // A polymorphic `tag` can't be typed narrowly enough to take a ref plus
  // arbitrary passthrough props, which is exactly what this component is for.
  // biome-ignore lint/suspicious/noExplicitAny: polymorphic element type
  const Tag = tag as any;

  return (
    <Tag
      className={`relative m-0 w-full p-0 antialiased [text-wrap:balance] ${className}`.trim()}
      ref={rootRef}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style,
      }}
      {...rest}
    >
      <span className="text-transparent" ref={measureRef}>
        {words.map(({ word, key }, i) => (
          // A real space between the boxes, not a generated one: it has to be
          // a break opportunity as well as a gap, or a headline wider than its
          // container has nowhere to wrap.
          <Fragment key={key}>
            {i > 0 ? " " : null}
            <span
              className="inline-block whitespace-pre"
              ref={(el: HTMLSpanElement | null) => {
                wordRefs.current[i] = el;
              }}
            >
              {word}
              <i
                className="inline-block h-0 w-0"
                ref={(el: HTMLElement | null) => {
                  baseRefs.current[i] = el;
                }}
              />
            </span>
          </Fragment>
        ))}
      </span>

      <svg
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden"
        focusable="false"
      >
        <defs>
          <clipPath clipPathUnits="userSpaceOnUse" id={clipId}>
            {words.map(({ word, key }, i) => (
              <text
                key={key}
                ref={(el: SVGTextElement | null) => {
                  glyphRefs.current[i] = el;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span
        className="pointer-events-none absolute inset-0 block"
        ref={revealRef}
      >
        <span
          className="absolute inset-0 block"
          style={{ clipPath: `url(#${clipId})` }}
        >
          {/* No `will-change` here on purpose: like the 3D transform it would
              promote this to a composited layer, and a clip-path over a
              composited layer leaks a row of the mask. See place(). */}
          <span className="absolute inset-0 block" ref={mediaRef}>
            {mediaType === "video" ? (
              <video
                autoPlay
                className="block size-full select-none object-cover"
                loop
                muted
                playsInline
                poster={poster}
                src={src}
              />
            ) : (
              src && (
                // A plain <picture>, not next/image: the stills are already
                // sized and compressed by scripts/process-frames.mjs, so the
                // optimiser would only cost a round trip — and `media` here is
                // what keeps a phone from downloading the landscape cut as
                // well as its own. The preload scanner still starts the fetch
                // before the parser reaches this node.
                <picture>
                  {srcNarrow && (
                    <source media={srcNarrowMedia} srcSet={srcNarrow} />
                  )}
                  <img
                    alt=""
                    className="absolute inset-0 block size-full select-none object-cover"
                    draggable={false}
                    fetchPriority="high"
                    src={src}
                  />
                </picture>
              )
            )}
          </span>
        </span>
      </span>
    </Tag>
  );
};

export default MaskedHeading;
