"use client";

import type { FormEvent, ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

const INBOX = "info@nationalfoods.co.in";
const PHONE = "1800 120 1588";

// --- Icons ---
const SproutIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);
const BeakerIcon = (props: any) => (
  // Using an Erlenmeyer flask shape
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 3v8l-7 10a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3l-7-10V3" />
    <path d="M7 3h10" />
    <path d="M6 14h12" />
  </svg>
);
const HandshakeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3-6.5 6.5" />
    <path d="M3 21l6.5-6.5" />
    <path d="M14.5 13.5 9 19" />
  </svg>
);
const EnvelopeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const PhoneIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MapPinIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const UserIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const BuildingIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);
const GlobeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);
const ChevronDownIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const LightbulbIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);
const ShieldCheckIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 4.7 1 6.5 2A1 1 0 0 1 20 6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const LockIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ArrowRightIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

// --- Shared styles ---
const FIELD_WRAPPER =
  "group relative flex w-full items-start gap-4 rounded-[12px] border border-[#5d5d5d] bg-transparent p-[16px] transition-[border-color,box-shadow] duration-200 ease-out focus-within:border-white focus-within:ring-[3px] focus-within:ring-saffron/15";

function Field({
  autoComplete,
  label,
  name,
  placeholder,
  required,
  type = "text",
  icon: Icon,
}: {
  autoComplete: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  icon?: React.ElementType;
}) {
  return (
    <label className={FIELD_WRAPPER} htmlFor={`contact-${name}`}>
      {Icon && <Icon className="mt-0.5 size-5 shrink-0 text-white" />}
      <div className="flex w-full flex-col">
        <span className="mb-1 font-editorial font-medium text-[14px] text-white">{label}</span>
        <input
          autoComplete={autoComplete}
          className="w-full bg-transparent p-0 font-editorial text-[14px] text-white outline-none placeholder:text-[#a9a9a9]"
          id={`contact-${name}`}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </div>
    </label>
  );
}

function SelectField({
  autoComplete,
  label,
  name,
  placeholder,
  required,
  icon: Icon,
}: {
  autoComplete: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  icon?: React.ElementType;
}) {
  return (
    <label className={FIELD_WRAPPER} htmlFor={`contact-${name}`}>
      {Icon && <Icon className="mt-0.5 size-5 shrink-0 text-white" />}
      <div className="flex w-full flex-col">
        <span className="mb-1 font-editorial font-medium text-[14px] text-white">{label}</span>
        <div className="relative w-full">
          <select
            autoComplete={autoComplete}
            className="w-full appearance-none bg-transparent p-0 font-editorial text-[14px] text-white outline-none placeholder:text-[#a9a9a9]"
            id={`contact-${name}`}
            name={name}
            required={required}
            defaultValue=""
          >
            <option value="" disabled className="bg-obsidian text-[#a9a9a9]">
              {placeholder}
            </option>
            <option value="India" className="bg-obsidian">
              India
            </option>
            <option value="USA" className="bg-obsidian">
              USA
            </option>
            <option value="UK" className="bg-obsidian">
              UK
            </option>
            <option value="UAE" className="bg-obsidian">
              UAE
            </option>
            <option value="Other" className="bg-obsidian">
              Other
            </option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 mt-[-10px] size-[18px] text-[#a9a9a9]" />
        </div>
      </div>
    </label>
  );
}

function Detail({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="underline decoration-black/25 underline-offset-4 transition-colors duration-200 ease-out hover:decoration-black"
      href={href}
    >
      {children}
    </a>
  );
}

export function Contact() {
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
    <section className="bg-white px-6 py-16 sm:px-8 lg:pt-[80px] lg:pb-[120px]" id="contact">
      {/* Container slightly wider if needed, grid handles two columns */}
      <div className="mx-auto grid max-w-[1380px] gap-x-[43px] gap-y-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Left Column */}
        <Reveal className="lg:pt-[40px]">
          <div className="flex items-center gap-4 mb-4">
            <p className="font-editorial font-semibold text-[13px] uppercase leading-[28px] tracking-[0.2em] text-marigold">
              Start the conversation
            </p>
            <div className="h-px w-10 bg-marigold hidden sm:block"></div>
          </div>

          <h2 className="mt-2 font-editorial font-extrabold text-[clamp(2.5rem,3.2vw,3.5rem)] uppercase leading-[1.1] tracking-[-0.01em] text-black">
            <span className="block">Tell us the product</span>{" "}
            <span className="block">
              you wish <span className="text-vermilion">EXISTED.</span>
            </span>
          </h2>

          <p className="mt-6 font-editorial text-[17px] leading-[1.6] text-graphite/80 max-w-[480px]">
            Whether you need the world&rsquo;s finest raw hing at scale, a white-label partner who
            thinks like an owner, or a research collaborator on the future of this ingredient, this
            is where it begins.
          </p>

          {/* Three Feature Points */}
          <div className="mt-12 mb-10 flex flex-col gap-6 sm:flex-row sm:gap-x-12 lg:gap-x-10">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-vermilion/10 text-vermilion">
                <SproutIcon className="size-[22px]" />
              </div>
              <div className="mt-0.5">
                <div className="font-editorial text-[12px] font-extrabold uppercase leading-[1.3] text-black">
                  <span className="block">NEW</span>
                  <span className="block">PRODUCT IDEAS</span>
                </div>
                <div className="mt-1.5 font-editorial text-[12px] leading-none text-graphite/60">
                  Let&rsquo;s build together
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-vermilion/10 text-vermilion">
                <BeakerIcon className="size-[22px]" />
              </div>
              <div className="mt-0.5">
                <div className="font-editorial text-[12px] font-extrabold uppercase leading-[1.3] text-black">
                  <span className="block">RESEARCH</span>
                  <span className="block">COLLABORATION</span>
                </div>
                <div className="mt-1.5 font-editorial text-[12px] leading-none text-graphite/60">
                  Science for tomorrow
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-vermilion/10 text-vermilion">
                <HandshakeIcon className="size-[22px]" />
              </div>
              <div className="mt-0.5">
                <div className="font-editorial text-[12px] font-extrabold uppercase leading-[1.3] text-black">
                  <span className="block">WHITE-LABEL</span>
                  <span className="block">PARTNERSHIPS</span>
                </div>
                <div className="mt-1.5 font-editorial text-[12px] leading-none text-graphite/60">
                  Your vision, our expertise
                </div>
              </div>
            </div>
          </div>

          <hr className="border-black/5 mb-8" />

          {/* Contact Details */}
          <address className="flex flex-col gap-y-4 font-editorial text-[15px] not-italic text-black">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="size-5 text-vermilion" />
                <Detail href={`mailto:${INBOX}`}>{INBOX}</Detail>
              </div>
              <div className="hidden h-5 w-px bg-black/15 sm:block" />
              <div className="flex items-center gap-3">
                <PhoneIcon className="size-5 text-vermilion" />
                <Detail href={`tel:+91${PHONE.replace(/\s/g, "")}`}>{PHONE}</Detail>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1 text-black/80">
              <MapPinIcon className="size-5 shrink-0 text-vermilion" />
              <span>127 Road N, GIDC Waghodia, Vadodara, Gujarat 391760, India</span>
            </div>
          </address>
        </Reveal>

        {/* Right Column: Dark Form Card */}
        <Reveal delay={0.08}>
          <form
            className="rounded-[24px] bg-obsidian p-6 shadow-[0_15px_80px_rgba(0,0,0,0.15)] sm:p-[40px] lg:p-[48px]"
            onSubmit={onSubmit}
          >
            {/* Card Header */}
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <h3 className="font-editorial text-center font-medium text-lg sm:text-[40px] leading-[1.1] text-white">
                Partner with a Tradition of Trust
              </h3>
            </div>

            {/* Form Fields Grid */}
            <div className="grid gap-x-[16px] gap-y-[16px] sm:grid-cols-2">
              <Field
                autoComplete="name"
                icon={UserIcon}
                label="Name"
                name="name"
                placeholder="Your full name"
                required
              />
              <Field
                autoComplete="organization"
                icon={BuildingIcon}
                label="Company"
                name="company"
                placeholder="Company / institution"
              />
              <Field
                autoComplete="email"
                icon={EnvelopeIcon}
                label="Email"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
              />
              <SelectField
                autoComplete="country-name"
                icon={GlobeIcon}
                label="Country"
                name="country"
                placeholder="Country of operation"
              />

              <label
                className={`${FIELD_WRAPPER} sm:col-span-2 !items-start`}
                htmlFor="contact-brief"
              >
                <LightbulbIcon className="mt-0.5 size-5 shrink-0 text-white" />
                <div className="flex w-full flex-col">
                  <span className="mb-2 font-editorial font-medium text-[14px] text-white">
                    What Are You Looking To Build?
                  </span>
                  <textarea
                    className="h-[80px] w-full resize-none bg-transparent p-0 font-editorial text-[14px] leading-[1.6] text-white outline-none placeholder:text-[#a9a9a9]"
                    id="contact-brief"
                    name="brief"
                    placeholder="e.g. We need 2T/month of high-potency compounded hing for our masala line, BRCGS-compliant, delivered to Chennai..."
                    required
                  />
                  <div className="mt-2 text-right font-editorial text-[12px] text-[#5d5d5d]">
                    0/500
                  </div>
                </div>
              </label>
            </div>

            {/* Badges / Guarantees */}
            <div className="mb-8  pt-3.5 flex flex-col items-start gap-y-6 sm:flex-row sm:items-center sm:justify-center sm:gap-x-12 sm:divide-x sm:divide-[#333]">
              <div className="flex items-center gap-4 sm:pr-8">
                <ShieldCheckIcon className="size-[26px] shrink-0 text-white" />
                <div className="font-editorial text-[13px] leading-[1.4] text-white">
                  Replies Within
                  <span className="block text-white/50">2 Business Days</span>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:pl-8">
                <LockIcon className="size-[26px] shrink-0 text-white" />
                <div className="font-editorial text-[13px] leading-[1.4] text-white">
                  NDAs Welcome
                  <span className="block text-white/50">
                    Confidentiality Is Standard Practice Here
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="mx-auto flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-vermilion px-8 font-editorial font-semibold text-[15px] text-white transition-[background-color,transform] duration-[160ms,100ms] ease-out hover:bg-[#c8151b] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 active:scale-[0.98] sm:max-w-[320px]"
              type="submit"
            >
              Begin The Partnership <ArrowRightIcon className="mt-0.5 size-5" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
