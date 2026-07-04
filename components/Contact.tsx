"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import Magnetic from "@/components/Magnetic";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Contact() {
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
            Get in Touch
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Let&apos;s build{" "}
            <span className="text-gradient">something great.</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="lg:col-span-2"
          >
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  Email
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-1 block font-display text-xl font-semibold hover:text-gradient"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  Phone
                </p>
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="mt-1 block font-display text-xl font-semibold hover:text-gradient"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  Location
                </p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {siteConfig.location}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="space-y-5 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-4 text-sm outline-none transition-colors focus:border-brand-green"
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-4 text-sm outline-none transition-colors focus:border-brand-green"
              />
            </div>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your project"
              rows={5}
              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-5 py-4 text-sm outline-none transition-colors focus:border-brand-green"
            />
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </Magnetic>
            {status === "success" && (
              <p className="text-sm text-brand-green">
                Thanks! We&apos;ll get back to you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                Something went wrong. Please email us directly instead.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
