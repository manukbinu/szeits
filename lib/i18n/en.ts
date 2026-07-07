import type { Dictionary } from "./types";

export const en: Dictionary = {
  siteConfig: {
    description:
      "SZEITS is a Dubai, UAE based software company building web, mobile, AI and cloud solutions for ambitious businesses across the region.",
    location: "Al Ghurair Centre, Deira, Dubai, United Arab Emirates",
  },
  nav: {
    links: [
      { label: "Home", href: "#home" },
      { label: "Services", href: "#services" },
      { label: "Process", href: "#process" },
      { label: "About", href: "#about" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    cta: "Get in Touch",
    toggleMenu: "Toggle menu",
  },
  hero: {
    eyebrow: "Software Company · Dubai, UAE",
    headingBefore: "Software, ",
    headingHighlight: "engineered",
    headingAfter: " for what's next.",
    ctaPrimary: "Get in Touch",
    ctaSecondary: "Our Services",
    kpis: [
      { label: "What we build", value: "Web · Mobile · AI · Cloud" },
      { label: "Approach", value: "Custom-built, not templated" },
      { label: "Based in", value: "Dubai, UAE" },
    ],
    scroll: "Scroll",
  },
  marquee: {
    items: [
      "Software Development",
      "AI & Automation",
      "Cloud & IT Consulting",
      "Web & App Development",
    ],
  },
  services: {
    eyebrow: "What We Do",
    headingBefore: "Services built to move your ",
    headingHighlight: "business forward.",
    items: [
      {
        title: "Web & App Development",
        description:
          "Custom websites, web applications and mobile apps built for performance, scale, and a seamless user experience.",
        icon: "code",
      },
      {
        title: "Software & SaaS Development",
        description:
          "End-to-end custom software and SaaS products engineered around your workflows, from architecture to launch.",
        icon: "layers",
      },
      {
        title: "AI & Automation",
        description:
          "Practical AI integration and workflow automation that removes manual work and unlocks new efficiency.",
        icon: "sparkles",
      },
      {
        title: "IT Consulting & Cloud",
        description:
          "Cloud infrastructure, DevOps and IT strategy that keeps your systems secure, scalable, and future-ready.",
        icon: "cloud",
      },
    ],
  },
  techMarquee: {
    heading: "Technologies we build with",
  },
  process: {
    eyebrow: "How We Work",
    headingBefore: "A process built for ",
    headingHighlight: "clarity and speed.",
    steps: [
      {
        number: "01",
        title: "Discover",
        description:
          "We dig into your goals, users, and constraints to define what actually needs to be built.",
      },
      {
        number: "02",
        title: "Design",
        description:
          "Architecture and interface design come together into a clear, buildable plan.",
      },
      {
        number: "03",
        title: "Build",
        description:
          "Iterative development with tight feedback loops, shipping working software early and often.",
      },
      {
        number: "04",
        title: "Deploy",
        description:
          "Rigorous testing and a controlled rollout get your product live with confidence.",
      },
      {
        number: "05",
        title: "Support",
        description:
          "Ongoing monitoring, iteration, and support keep your product improving after launch.",
      },
    ],
  },
  about: {
    eyebrow: "About SZEITS",
    headingBefore: "A software company built for the region's ",
    headingHighlight: "next decade.",
    headingAfter: "",
    body: "Based in Dubai, United Arab Emirates, SZEITS partners with ambitious businesses to design, build, and scale digital products — from custom software and mobile apps to AI-driven automation and cloud infrastructure. We combine engineering rigor with a design-first mindset to ship products that hold up under real-world growth.",
    quote:
      "We build the software layer that lets businesses in the UAE move faster than their market.",
    highlights: [
      { label: "Based in", value: "Dubai, UAE" },
      { label: "Focus", value: "Web, AI & Cloud" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    headingBefore: "Questions, ",
    headingHighlight: "answered.",
    items: [
      {
        question: "How long does a typical project take?",
        answer:
          "It depends on scope and complexity. After a discovery call we map out your requirements and give you a clear timeline and milestones before any work begins.",
      },
      {
        question: "Do you work with startups as well as established businesses?",
        answer:
          "Yes. We build for early-stage startups validating an idea as well as established companies scaling existing systems — the approach is tailored to where you are.",
      },
      {
        question: "What technologies do you build with?",
        answer:
          "We work across modern web, mobile, AI and cloud stacks, choosing the right tools for your product rather than forcing a one-size-fits-all approach.",
      },
      {
        question: "Do you offer support after launch?",
        answer:
          "Yes — ongoing monitoring, iteration, and support are part of our process, not an afterthought. We stay involved after your product goes live.",
      },
      {
        question: "How do we get started?",
        answer:
          "Reach out through the contact form or WhatsApp. We'll set up a discovery call to understand your goals and put together a proposal.",
      },
    ],
  },
  contact: {
    eyebrow: "Get in Touch",
    headingBefore: "Let's build ",
    headingHighlight: "something great.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Tell us about your project",
    sendButton: "Send Message",
    sendingButton: "Sending...",
    successMessage: "Thanks! We'll get back to you shortly.",
    errorMessage: "Something went wrong. Please email us directly instead.",
  },
  footer: {
    quickLinks: "Quick Links",
    servicesHeading: "Services",
    contactHeading: "Contact",
    rightsReserved: "All rights reserved.",
  },
  aria: {
    backToTop: "Back to top",
    whatsapp: "Chat with us on WhatsApp",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    languageToggle: "Switch to Arabic",
  },
};
