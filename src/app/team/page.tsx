import type { Metadata } from "next";
import { AboutCertificates } from "@/components/sections/about-us";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { TeamHero, TeamRoles, TeamValues } from "@/components/sections/team";

export const metadata: Metadata = {
  title: "Team — National Foods",
  description:
    "The artisans, analysts, craftsmen and stewards behind India's first and largest asafoetida processing plant.",
};

export default function TeamPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <TeamHero />
        <TeamRoles />
        <TeamValues />
        <AboutCertificates />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
