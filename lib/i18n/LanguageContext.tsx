"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dictionary, Locale } from "./types";
import { en } from "./en";
import { ar } from "./ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export type LanguageContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  toggleLocale: () => void;
};

// Exported (not just the hook) so it can be re-provided across React Three
// Fiber's <Canvas> boundary, which runs a separate reconciler that doesn't
// automatically inherit context from the outer DOM tree — see SolarScene.tsx.
export const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored === "en" || stored === "ar") {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const toggleLocale = () => {
    const next: Locale = locale === "en" ? "ar" : "en";
    setLocale(next);
    try {
      localStorage.setItem("locale", next);
    } catch {}
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: dictionaries[locale],
      toggleLocale,
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
