export type Locale = "en" | "ar";

export type NavLink = { label: string; href: string };
export type Kpi = { label: string; value: string };
export type ServiceItem = { title: string; description: string; icon: string };
export type ProcessStep = { number: string; title: string; description: string };
export type FaqItem = { question: string; answer: string };

export type Dictionary = {
  siteConfig: {
    description: string;
    location: string;
  };
  nav: {
    links: NavLink[];
    cta: string;
    toggleMenu: string;
  };
  hero: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    headingAfter: string;
    ctaPrimary: string;
    ctaSecondary: string;
    kpis: Kpi[];
    scroll: string;
  };
  marquee: {
    items: string[];
  };
  services: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    items: ServiceItem[];
  };
  techMarquee: {
    heading: string;
  };
  process: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    steps: ProcessStep[];
  };
  about: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    headingAfter: string;
    body: string;
    quote: string;
    highlights: Kpi[];
  };
  faq: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    items: FaqItem[];
  };
  contact: {
    eyebrow: string;
    headingBefore: string;
    headingHighlight: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    sendButton: string;
    sendingButton: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    quickLinks: string;
    servicesHeading: string;
    contactHeading: string;
    rightsReserved: string;
  };
  aria: {
    backToTop: string;
    whatsapp: string;
    themeToLight: string;
    themeToDark: string;
    languageToggle: string;
  };
};
