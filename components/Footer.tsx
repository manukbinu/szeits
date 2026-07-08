"use client";

import Logo from "@/components/Logo";
import { siteConfig } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {t.siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            {t.footer.quickLinks}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {t.nav.links.map((link) => (
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
            {t.footer.servicesHeading}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {t.services.items.map((service, i) => (
              <li key={i}>
                <a href="#services" className="hover:text-foreground">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            {t.footer.contactHeading}
          </p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <a href={`mailto:${siteConfig.email}`} className="block hover:text-foreground">
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phoneHref}`} className="block hover:text-foreground">
              {siteConfig.phone}
            </a>
            <p>{t.siteConfig.location}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border px-6 pt-6 text-xs text-muted/70 lg:px-10">
        &copy; {new Date().getFullYear()} {siteConfig.name}. {t.footer.rightsReserved}
      </div>
    </footer>
  );
}
