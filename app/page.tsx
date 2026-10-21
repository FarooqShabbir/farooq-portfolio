import { Contact } from "@/components/contact";
import { DeployScene } from "@/components/deploy-scene";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { About, Experience, Services, Stack, Work } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Main sits above the sticky footer so the footer is uncovered like a curtain at the end. */}
      <main id="main" className="relative z-10 bg-canvas shadow-[0_40px_80px_-20px_rgb(0_0_0_/_0.9)]">
        <Hero />
        <DeployScene />
        <Work />
        <Experience />
        <Services />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
