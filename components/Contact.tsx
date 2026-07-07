"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Magnetic from "@/components/Magnetic";
import StaggerHeading from "@/components/StaggerHeading";

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
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
            {t.contact.eyebrow}
          </p>
          <StaggerHeading
            before={t.contact.headingBefore}
            highlight={t.contact.headingHighlight}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip flex flex-col justify-center rounded-2xl px-5 py-4 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.emailLabel}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-1 block font-display text-xl font-semibold hover:text-gradient"
            >
              {siteConfig.email}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip flex flex-col justify-center rounded-2xl px-5 py-4 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.phoneLabel}
            </p>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="mt-1 block font-display text-xl font-semibold hover:text-gradient"
            >
              {siteConfig.phone}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="neu-chip flex flex-col justify-center rounded-2xl px-5 py-4 lg:col-span-2"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {t.contact.locationLabel}
            </p>
            <a
              href={siteConfig.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-display text-xl font-semibold hover:text-gradient"
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
            className="space-y-5 lg:col-span-2 lg:row-span-2"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                className="neu-pressed rounded-xl px-5 py-4 text-sm outline-none placeholder:text-muted"
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                className="neu-pressed rounded-xl px-5 py-4 text-sm outline-none placeholder:text-muted"
              />
            </div>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t.contact.messagePlaceholder}
              rows={5}
              className="neu-pressed w-full rounded-xl px-5 py-4 text-sm outline-none placeholder:text-muted"
            />
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary shine bg-gradient-brand rounded-full px-7 py-3.5 text-sm font-semibold disabled:opacity-60"
              >
                {status === "sending" ? t.contact.sendingButton : t.contact.sendButton}
              </button>
            </Magnetic>
            {status === "success" && (
              <p className="text-sm text-brand-green">{t.contact.successMessage}</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">{t.contact.errorMessage}</p>
            )}
          </motion.form>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="neu-raised overflow-hidden rounded-2xl p-2 lg:col-span-2"
          >
            <iframe
              src={siteConfig.mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 260 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.name} location on Google Maps`}
              className="rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
