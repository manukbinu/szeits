import Logo from "@/components/Logo";
import { navLinks, siteConfig } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 sm:flex-row sm:items-start sm:justify-between lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-sm text-muted">
          <a href={`mailto:${siteConfig.email}`} className="block hover:text-foreground">
            {siteConfig.email}
          </a>
          <a href={`tel:${siteConfig.phoneHref}`} className="mt-1 block hover:text-foreground">
            {siteConfig.phone}
          </a>
          <p className="mt-1">{siteConfig.location}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-6 text-xs text-muted/70 lg:px-10">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
