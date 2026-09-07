/**
 * Shared geometry for the two sections that overlap at the top of the page.
 *
 * The intro doesn't cut to the scene, it dissolves onto it: its cream veil
 * fades out and the pinned canvas is simply what was already behind it. That
 * only works if the canvas is pinned and holding frame 0 for the whole time
 * the intro is on screen — so the scene is lifted by exactly the intro's
 * height and told not to start scrubbing until the intro is done. The numbers
 * live here because getting them out of step is silent: you'd get a torn
 * hand-off or a scene that has already scrubbed past its opening frame.
 */

/** Runway the intro overlay gets, in viewport-heights. */
export const INTRO_VH = 400;

/**
 * Of that runway, how much is actual travel. A sticky child unpins once the
 * section's bottom reaches it, which costs the last viewport-height.
 */
export const INTRO_TRAVEL_VH = INTRO_VH - 100;
