import { Scene } from "@/components/scroll/scene";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Horizon } from "@/components/sections/horizon";
import { Intro } from "@/components/sections/intro";
// import { Process } from "@/components/sections/process";
import { Research } from "@/components/sections/research";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { Trusted } from "@/components/sections/trusted";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Intro />
        <Scene />
        <About />
        <Research />
        <Horizon />
        {/* <Process /> */}
        <Trusted />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
