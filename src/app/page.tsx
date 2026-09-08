import { Scene } from "@/components/scroll/scene";
import { About } from "@/components/sections/about";
import { Intro } from "@/components/sections/intro";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Intro />
        <Scene />
        <About />
      </main>
      <SiteFooter />
    </>
  );
}
