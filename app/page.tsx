import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { About, Experience, Services, Stack, Work } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
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
