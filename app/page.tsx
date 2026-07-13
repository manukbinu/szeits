import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechMarquee from "@/components/TechMarquee";
import Process from "@/components/Process";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <TechMarquee />
        <Process />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </SmoothScroll>
  );
}
