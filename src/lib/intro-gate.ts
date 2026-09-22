/**
 * A pulse, fired the moment the preloader's curtain starts lifting.
 *
 * The intro headline rises on an IntersectionObserver, and it is at the top of
 * the document — so it is already intersecting while the preloader is still
 * covering it. Left alone it plays its whole rise behind the curtain and the
 * reader arrives to a headline that has already landed. Handing
 * `whenIntroOpen()` to `MaskedHeading` as its `hold` arms the observer only
 * once the curtain is on its way up, so the letters climb out from behind the
 * rising edge.
 *
 * A pulse rather than a resolved promise, because the home route can now be
 * arrived at more than once. A single promise stays resolved for the life of
 * the document, so the second visit would find the gate already open and start
 * the rise behind the curtain again — the exact bug this exists to prevent.
 * Clearing the list before calling it means each visit's Intro waits for its
 * own visit's preloader, and nothing has to be reset between them.
 *
 * Module scope rather than context: there is one preloader and one intro on
 * the one page that has either, and a provider threaded through the whole tree
 * to carry a single signal is scaffolding for a second case that does not
 * exist. Routes without an intro simply never call `whenIntroOpen`.
 */
let waiters: (() => void)[] = [];

/** Resolves on the next lift. Call once per Intro mount, not per render. */
export function whenIntroOpen(): Promise<void> {
  return new Promise((resolve) => {
    waiters.push(resolve);
  });
}

export function openIntroGate() {
  const pending = waiters;
  waiters = [];
  for (const resolve of pending) resolve();
}
