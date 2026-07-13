"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [70, -70]);

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
    <section id="contact" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <motion.div
        style={{ y: orbY }}
        className="glow-orb pointer-events-none absolute bottom-0 end-1/4 h-72 w-72 rounded-full bg-gold/20"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-10 text-center sm:mb-14 lg:mb-16"
        >
          <p className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:mb-4">
            <ChapterTag number="05" />
            {t.contact.eyebrow}
          </p>
          <StaggerHeading
            before={t.contact.headingBefore}
            highlight={t.contact.headingHighlight}
            className="text-display-md font-bold tracking-tight"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-flow-dense">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="glass flex flex-col justify-center rounded-2xl px-4 py-3 sm:px-6 sm:py-4 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{t.contact.emailLabel}</p>
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
            className="glass flex flex-col justify-center rounded-2xl px-4 py-3 sm:px-6 sm:py-4 lg:col-span-1"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{t.contact.phoneLabel}</p>
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
            className="glass col-span-2 flex flex-col justify-center rounded-2xl px-4 py-3 sm:px-6 sm:py-4 lg:col-span-2"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{t.contact.locationLabel}</p>
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
            className="glass-strong col-span-2 space-y-3 rounded-2xl p-4 sm:space-y-4 sm:p-6 lg:col-span-2 lg:row-span-2"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                className="rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent sm:py-3"
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                className="rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent sm:py-3"
              />
            </div>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t.contact.messagePlaceholder}
              rows={3}
              className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent sm:py-3"
            />
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary shine bg-gradient-accent rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {status === "sending" ? t.contact.sendingButton : t.contact.sendButton}
              </button>
            </Magnetic>
            {status === "success" && (
              <p className="text-sm text-emerald-500">{t.contact.successMessage}</p>
            )}
            {status === "error" && <p className="text-sm text-red-400">{t.contact.errorMessage}</p>}
          </motion.form>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="glass col-span-2 overflow-hidden rounded-2xl p-2 lg:col-span-2"
          >
            <iframe
              src={siteConfig.mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.name} location on Google Maps`}
              className="min-h-[140px] rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
