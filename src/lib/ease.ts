/**
 * The page's easing curves, for Motion.
 *
 * These are the same control points as the `--ease-*` tokens in globals.css,
 * written a second time because Motion takes a cubic-bezier as four numbers
 * and cannot read a CSS custom property. Changing a curve means changing it in
 * both places — there is no third.
 *
 * Typed as a mutable tuple rather than `as const`: Motion's `ease` field wants
 * `[number, number, number, number]`, which a readonly tuple does not satisfy.
 */

/** The default. Everything that fades, lifts, settles or recolours. */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Surfaces that slide rather than fade — the mobile menu panel. */
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];
