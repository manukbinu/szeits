import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import SolarExperience from "@/components/solar/SolarExperience";

export default function Home() {
  return (
    <SolarExperience
      sections={{
        home: <Hero />,
        services: <Services />,
        process: <Process />,
        about: <About />,
        faq: <FAQ />,
        contact: <Contact />,
      }}
    />
  );
}
