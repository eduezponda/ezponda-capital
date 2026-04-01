"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";

interface SubscribeCTAProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function SubscribeCTA({
  eyebrow = "Stay Informed",
  title = "Access Institutional Insights",
  subtitle = "Join investors who track commodity cycles before the crowd.",
}: SubscribeCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section className="py-24 bg-surface-container-lowest">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-[1rem] text-on-surface-variant leading-relaxed">{subtitle}</p>

          {submitted ? (
            <div className="glass-panel border border-tertiary/20 rounded-lg px-10 py-6 text-center">
              <p className="text-tertiary font-medium">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-surface-container-highest text-on-surface placeholder:text-outline/50 px-6 py-4 rounded-full outline-none border border-transparent focus:ring-1 focus:ring-tertiary transition-all"
              />
              <button
                type="submit"
                className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
