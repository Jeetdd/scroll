import { FRAME_COUNT } from "./frames.generated";

const LAST_FRAME = FRAME_COUNT - 1;

export type Beat = {
  id: string;
  ordinal: string;
  label: string;
  title: string;
  body: string;
  /** Where the copy sits over the frame, chosen to avoid the subject. */
  align: "left" | "right";
  /** Inclusive frame range, 0-indexed, that this copy belongs to. */
  from: number;
  to: number;
};

/**
 * The six acts of the film. Frame ranges were read off the sequence itself, so
 * copy is pinned to the footage rather than to hand-tuned scroll offsets.
 */
export const BEATS: Beat[] = [
  {
    id: "origin",
    ordinal: "01",
    label: "Origin",
    title: "It starts in the root.",
    body: "Ferula resin, tapped by hand from the living stem. Nothing is added here. Nothing needs to be.",
    align: "left",
    from: 0,
    to: 44,
  },
  {
    id: "dana",
    ordinal: "02",
    label: "Golden Dana",
    title: "Asafoetida, in its truest form.",
    body: "Cured until it sets into a single amber granule — the grade the rest of the world simply calls hing.",
    align: "right",
    from: 67,
    to: 110,
  },
  {
    id: "bloom",
    ordinal: "03",
    label: "The grind",
    title: "Ground fine. Sealed at peak aroma.",
    body: "Milled and bottled in one pass, so the volatile oils never get the chance to leave.",
    align: "left",
    from: 111,
    to: 142,
  },
  {
    id: "kitchen",
    ordinal: "04",
    label: "The tadka",
    title: "One pinch. Everything changes.",
    body: "The note your dal has been missing.",
    align: "left",
    from: 171,
    to: LAST_FRAME,
  },
];

/** Maps a frame index onto the scene timeline, which runs 0 → 1. */
export function framePosition(frame: number): number {
  return frame / LAST_FRAME;
}
