import Image from "next/image";

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
        {/* The light-background cut. `nf-logo.png` is the dark-background
            variant — its wordmark and tagline are near-white, which is
            invisible against the cream the nav sits on — so the neutrals are
            recoloured to ink and the brand red is left alone. Keep the
            original for anything on `bg-ink`, like the footer. */}
        <a className="block" href="#top">
          <Image
            alt="National Foods — the hing specialist"
            className="h-12 w-auto"
            height={260}
            priority
            src="/nf-logo-ink.png"
            width={324}
          />
        </a>
      </nav>
    </header>
  );
}
