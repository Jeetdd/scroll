"use client";

import type { FormEvent, ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

const INBOX = "info@nationalfoods.co.in";
const PHONE = "1800 120 1588";

/**
 * Everything the input and the textarea share. Height and radius are set on
 * each of them instead of overridden here — two utilities for one property
 * resolve by source order in the sheet, not by their order in the attribute.
 * The two greys are the comp's, used once each and only on this card.
 */
const FIELD =
  "w-full border border-[#5d5d5d] bg-transparent px-[22.6px] font-editorial text-[14px] text-white transition-colors placeholder:text-[#a9a9a9] focus:border-white focus:outline-none";
const LABEL =
  "mb-[9px] block font-editorial font-medium text-[14px] capitalize text-white";

function Field({
  autoComplete,
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  autoComplete: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className={LABEL} htmlFor={`contact-${name}`}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className={`${FIELD} h-[42.6px] rounded-full`}
        id={`contact-${name}`}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  );
}

function Detail({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black"
      href={href}
    >
      {children}
    </a>
  );
}

export function Contact() {
  /**
   * There is no endpoint behind this yet, so rather than a button that appears
   * to work and silently drops the enquiry, the form hands the filled-in
   * details to the visitor's mail client addressed to the inbox already
   * printed beside it. Swapping in a real POST means replacing this body.
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const read = (field: string) => String(data.get(field) ?? "").trim();
    const from = read("company") || read("name");
    const body = [
      `Name: ${read("name")}`,
      `Company: ${read("company") || "—"}`,
      `Email: ${read("email")}`,
      `Country: ${read("country") || "—"}`,
      "",
      read("brief"),
    ].join("\n");

    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(
      `Partnership enquiry — ${from}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      className="bg-cream px-6 py-16 sm:px-8 lg:pt-[80px] lg:pb-[120px]"
      id="contact"
    >
      {/* 662 / 43 / 675 — the card is pinned to the right of the container and
          the copy column keeps its own measure rather than filling the gap. */}
      <div className="mx-auto grid max-w-[1380px] gap-x-[43px] gap-y-12 lg:grid-cols-[662fr_675fr]">
        <Reveal className="lg:pt-[96px]">
          <p className="font-editorial font-semibold text-[14px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
            Start the conversation
          </p>
          <h2 className="mt-1 font-editorial font-extrabold text-[clamp(2rem,2.08vw,2.5rem)] uppercase leading-[1.325] text-black">
            <span className="lg:block">Tell us the product you</span>{" "}
            <span className="lg:block">Wish Existed.</span>
          </h2>

          <p className="mt-4 font-editorial text-[15px] capitalize leading-[30px] text-graphite">
            Whether you need the world&rsquo;s finest raw hing at scale, a
            white-label partner who thinks like an owner, or a research
            collaborator on the future of this ingredient, this is where it
            begins.
          </p>

          {/* The comp title-cases this block along with the rest of the page.
              Left alone that turns the address into Info@Nationalfoods.Co.In,
              so `capitalize` is the one thing not carried over here. */}
          <address className="mt-[60px] font-editorial font-semibold text-[16px] not-italic leading-[30px] text-black">
            <span className="block">
              <Detail href={`mailto:${INBOX}`}>{INBOX}</Detail>
              <span className="ml-3">
                ({" "}
                <Detail href={`tel:+91${PHONE.replace(/\s/g, "")}`}>
                  {PHONE}
                </Detail>{" "}
                )
              </span>
            </span>
            <span className="block">
              127 Road N, GIDC Waghodia, Vadodara, Gujarat 391760, India
            </span>
          </address>
        </Reveal>

        <Reveal delay={0.08}>
          {/* The white rule is invisible against the comp's white page and
              deliberate against ours — it reads as a mount around the card. */}
          <form
            className="rounded-[20px] border-2 border-white bg-obsidian p-6 shadow-[0_15px_80px_rgba(0,0,0,0.05)] backdrop-blur-[5px] sm:px-[27px] sm:pt-[33px] sm:pb-[36px]"
            onSubmit={onSubmit}
          >
            <div className="grid gap-x-[18px] gap-y-[27px] sm:grid-cols-2">
              <Field
                autoComplete="name"
                label="Name"
                name="name"
                placeholder="Your full name"
                required
              />
              <Field
                autoComplete="organization"
                label="Company"
                name="company"
                placeholder="Company / institution"
              />
              <Field
                autoComplete="email"
                label="Email"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
              />
              <Field
                autoComplete="country-name"
                label="Country"
                name="country"
                placeholder="Country of operation"
              />
            </div>

            <div className="mt-[27px]">
              <label className={LABEL} htmlFor="contact-brief">
                What are you looking to build?
              </label>
              <textarea
                className={`${FIELD} h-[122px] resize-none rounded-[20px] py-[12px] leading-[20px]`}
                id="contact-brief"
                name="brief"
                placeholder="e.g. We need 2T/month of high-potency compounded hing for our masala line, BRCGS-compliant, delivered to Chennai..."
                required
              />
            </div>

            <p className="mx-auto mt-[22px] max-w-[420px] text-center font-editorial text-[14px] capitalize leading-[20px] text-white">
              Replies within 2 business days
              <span className="block">
                NDAs welcome, confidentiality is standard practice here
              </span>
            </p>

            {/* Fluid below sm rather than the comp's fixed 248px: a fixed width
                sets the card's min-content, which on a 320px screen pushes the
                whole column past the viewport. */}
            <button
              className="mx-auto mt-5 block h-[42.6px] w-full rounded-full bg-vermilion font-editorial font-extrabold text-[14px] capitalize text-white transition-colors hover:bg-[#c8151b] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 sm:w-[248px]"
              type="submit"
            >
              Begin the Partnership
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
