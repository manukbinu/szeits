import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import TechMarquee from "@/components/TechMarquee";
import Process from "@/components/Process";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Services />
      <TechMarquee />
      <Process />
      <About />
      <FAQ />
      <Contact />
    </main>
  );
}
