"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Magnetic from "@/components/Magnetic";
import StaggerHeading from "@/components/StaggerHeading";
import ChapterTag from "@/components/ChapterTag";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    if (!FORMSPREE_ID) {
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
        `Website inquiry from ${form.name}`
      )}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-4 text-center sm:mb-6 lg:mb-8"
        >
          <p className="mb-2 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
            <ChapterTag number="05" />
            {t.contact.eyebrow}
          </p>
          <StaggerHeading
            before={t.contact.headingBefore}
            highlight={t.contact.headingHighlight}
            className="text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-flow-dense">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip flex flex-col justify-center rounded-2xl px-3 py-2 sm:px-5 sm:py-3 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.emailLabel}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-1 block truncate font-display text-xs font-semibold hover:text-gradient sm:text-sm"
            >
              {siteConfig.email}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip flex flex-col justify-center rounded-2xl px-3 py-2 sm:px-5 sm:py-3 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.phoneLabel}
            </p>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="mt-1 block truncate font-display text-xs font-semibold hover:text-gradient sm:text-sm"
            >
              {siteConfig.phone}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip col-span-2 flex flex-col justify-center rounded-2xl px-3 py-2 sm:px-5 sm:py-3 lg:col-span-2"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.locationLabel}
            </p>
            <a
              href={siteConfig.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate font-display text-xs font-semibold hover:text-gradient sm:text-sm"
            >
              {t.siteConfig.location}
            </a>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="col-span-2 space-y-2 sm:space-y-3 lg:col-span-2 lg:row-span-2"
          >
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                className="neu-pressed rounded-xl px-4 py-2 text-xs outline-none placeholder:text-muted sm:px-5 sm:py-3 sm:text-sm"
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                className="neu-pressed rounded-xl px-4 py-2 text-xs outline-none placeholder:text-muted sm:px-5 sm:py-3 sm:text-sm"
              />
            </div>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t.contact.messagePlaceholder}
              rows={2}
              className="neu-pressed w-full rounded-xl px-4 py-2 text-xs outline-none placeholder:text-muted sm:px-5 sm:py-3 sm:text-sm"
            />
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary shine bg-gradient-brand rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-60 sm:px-6 sm:py-2.5 sm:text-sm"
              >
                {status === "sending" ? t.contact.sendingButton : t.contact.sendButton}
              </button>
            </Magnetic>
            {status === "success" && (
              <p className="text-xs text-brand-green sm:text-sm">{t.contact.successMessage}</p>
            )}
            {status === "error" && (
              <p className="text-xs text-red-400 sm:text-sm">{t.contact.errorMessage}</p>
            )}
          </motion.form>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="neu-raised col-span-2 overflow-hidden rounded-2xl p-2 lg:col-span-2"
          >
            <iframe
              src={siteConfig.mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.name} location on Google Maps`}
              className="min-h-[70px] rounded-xl sm:min-h-[120px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
