"use client";

import { createElement } from "react";
import StaggerText from "@/components/StaggerText";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STAGGER = 0.05;

function charCount(text: string) {
  return text.replace(/\s/g, "").length;
}

export default function StaggerHeading({
  before,
  highlight,
  after = "",
  trigger = "scroll",
  baseDelay = 0,
  as = "h2",
  className = "",
}: {
  before: string;
  highlight: string;
  after?: string;
  trigger?: "mount" | "scroll";
  baseDelay?: number;
  as?: "h1" | "h2";
  className?: string;
}) {
  const { locale } = useLanguage();

  if (locale !== "en") {
    return createElement(as, { className }, [
      before,
      <span key="highlight" className="text-gradient">
        {highlight}
      </span>,
      after,
    ]);
  }

  const highlightDelay = baseDelay + charCount(before) * STAGGER;
  const afterDelay = highlightDelay + charCount(highlight) * STAGGER;

  return createElement(as, { className }, [
    <StaggerText key="before" text={before} trigger={trigger} delay={baseDelay} />,
    <StaggerText
      key="highlight"
      text={highlight}
      trigger={trigger}
      delay={highlightDelay}
      className="text-gradient"
    />,
    after && <StaggerText key="after" text={after} trigger={trigger} delay={afterDelay} />,
  ]);
}
