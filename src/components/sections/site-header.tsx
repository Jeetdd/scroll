export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* The nav floats over the film, which runs from near-white to a dark
          kadhai. A scrim keeps the links legible across all of it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/40 to-transparent"
      />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-7xl items-center justify-between px-[6vw] py-6 sm:px-8"
      >
        <a className="font-display text-xl tracking-tight text-ink" href="#top">
          National Foods
        </a>
      </nav>
    </header>
  );
}
