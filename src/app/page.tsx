import { Scene } from "@/components/scroll/scene";
import { Intro } from "@/components/sections/intro";
import { Kitchen } from "@/components/sections/kitchen";
import { ProductDetail } from "@/components/sections/product-detail";
import { Provenance } from "@/components/sections/provenance";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Intro />
        <Scene />
        <Provenance />
        <ProductDetail />
        <Kitchen />
      </main>
      <SiteFooter />
    </>
  );
}
