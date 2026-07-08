"use client";

import { siteConfig } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FooterExtras({ onJump }: { onJump: (index: number) => void }) {
  const { t } = useLanguage();

  return (
    <div className="mt-4 border-t border-white/10 px-6 pb-4 pt-4 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {t.nav.links.map((link, i) => (
            <button
              key={link.href}
              type="button"
              onClick={() => onJump(i)}
              className="hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted/70">
          &copy; {new Date().getFullYear()} {siteConfig.name}. {t.footer.rightsReserved}
        </p>
      </div>
    </div>
  );
}
