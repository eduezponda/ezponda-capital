"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SubscribeButtonProps {
  priceId: string;
  label?: string;
  className?: string;
}

export default function SubscribeButton({
  priceId,
  label,
  className,
}: SubscribeButtonProps) {
  const t = useTranslations("subscription");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedLabel = label ?? t("ctaLabel");

  async function handleClick() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        setError(t("checkoutError"));
        setIsLoading(false);
      }
    } catch {
      setError(t("checkoutError"));
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={
          className ??
          "gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        {isLoading ? t("processing") : resolvedLabel}
        {!isLoading && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            aria-hidden="true"
          >
            arrow_forward
          </span>
        )}
      </button>
      {error && (
        <p className="text-[0.8125rem] text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
