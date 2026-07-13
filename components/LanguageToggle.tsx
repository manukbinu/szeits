"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, toggleLocale, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.aria.languageToggle}
      className={`btn-ghost flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase ${className}`}
    >
      {locale === "en" ? "عربي" : "EN"}
    </button>
  );
}
