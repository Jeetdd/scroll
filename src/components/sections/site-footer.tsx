export function SiteFooter() {
  return (
    <footer className="bg-ink px-[6vw] py-20 text-cream sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl tracking-tight">Hira Hing</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-cream/50">
            Isme hai kuch khaas
          </p>
        </div>
        <p className="max-w-xs text-pretty text-sm leading-relaxed text-cream/60">
          Compounded asafoetida, 100g. Store in a cool, dry place and keep the
          jar closed.
        </p>
      </div>
    </footer>
  );
}
