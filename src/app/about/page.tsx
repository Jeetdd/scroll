import type { Metadata } from "next";
import {
  AboutCertificates,
  AboutDirector,
  AboutHero,
  AboutPhilosophy,
  AboutStory,
  AboutUsps,
  AboutVision,
} from "@/components/sections/about-us";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";

export const metadata: Metadata = {
  title: "About — National Foods",
  description:
    "India's first and largest asafoetida processing plant — shaped by three generations of the Joshi family and one uncompromising standard of purity.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutPhilosophy />
        <AboutUsps />
        <AboutVision />
        <AboutDirector />
        <AboutCertificates />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
