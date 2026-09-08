import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-cream">
      <div className="mx-auto flex max-w-[1920px] flex-col px-[6vw] 2xl:px-[60px]">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between py-20 gap-12">
          {/* Logos and Intro */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-[130px] max-w-4xl">
            <a
              href="#top"
              className="shrink-0 flex items-center justify-center"
            >
              <Image
                src="/nf-logo-ink.png"
                alt="National Foods Logo"
                width={191}
                height={153}
                className="h-[120px] w-auto mix-blend-multiply"
              />
            </a>
            <p className="font-editorial text-base text-ink max-w-[593px] leading-[34px] mix-blend-multiply">
              National Foods — the hing specialist. Crafting Hira Hing
              Compounded Asafoetida with the same care, every single batch.
            </p>
          </div>

          {/* Addresses and Contact */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-[90px] pt-4">
            <div>
              <h3 className="font-editorial font-semibold text-marigold uppercase tracking-[0.2em] mb-4 2xl:mb-8 text-sm">
                Contact
              </h3>
              <ul className="font-editorial flex flex-col justify-center text-sm font-medium text-ink space-y-2 lg:space-y-4">
                <li>1800 120 1588</li>
                <li>info@nationalfoods.co.in</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial font-semibold text-marigold uppercase tracking-[0.2em] mb-4 2xl:mb-8 text-sm">
                Visit
              </h3>
              <address className="not-italic font-editorial flex flex-col justify-center text-sm font-medium text-ink max-w-[198px] leading-[25px]">
                127, Road-N, GIDC Waghodia,
                <br />
                Dist. Vadodara, Gujarat 391760
              </address>
            </div>
          </div>
        </div>

        <hr className="border-t border-ink/40 2xl:border-ink/20" />

        <div className="flex flex-col sm:flex-row justify-between items-center py-6 text-[13px] font-editorial font-medium text-ink gap-4">
          <p>
            © 2026{" "}
            <span className="font-bold text-vermilion">National Foods.</span>{" "}
            All rights reserved. India's Hing Specialists since 1970.
          </p>

          <a
            href="https://dreamsdesign.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-opacity hover:opacity-80 group"
          >
            <span className="mt-[2px]">
              Creativity Meets Excellence by{" "}
              <span className="font-bold text-[#783186]">Dreamsdesign</span>
            </span>
            <div
              className="w-[20px] h-[32px] bg-[#783186] mask-image-no-repeat mask-size-contain"
              style={{
                maskImage: "url(/dd_logo.png)",
                WebkitMaskImage: "url(/dd_logo.png)",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
              }}
              aria-label="Dreamsdesign Logo"
              role="img"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
