import Logo from "@/components/Logo";
import { navLinks, siteConfig, services } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Quick Links
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Services
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {services.map((service) => (
              <li key={service.title}>
                <a href="#services" className="hover:text-foreground">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Contact
          </p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <a href={`mailto:${siteConfig.email}`} className="block hover:text-foreground">
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phoneHref}`} className="block hover:text-foreground">
              {siteConfig.phone}
            </a>
            <p>{siteConfig.location}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border px-6 pt-6 text-xs text-muted/70 lg:px-10">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
