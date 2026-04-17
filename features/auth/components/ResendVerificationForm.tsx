"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  email: string;
}

export default function ResendVerificationForm({ email }: Props) {
  const t = useTranslations("auth.resendVerification");
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleSend() {
    setError(null);
    setIsSending(true);

    const supabase = createSupabaseBrowserClient();
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email });

    if (resendError) {
      setError(t("errorGeneric"));
      setIsSending(false);
      return;
    }

    setIsSending(false);
    router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}&next=free`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">Ezponda</span>
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">Capital</span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t("heading")}</h1>
        <p className="text-[0.875rem] text-outline mt-1">{t("subheading", { email })}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && <p className="text-[0.8125rem] text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || resendCooldown > 0}
          className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSending
            ? t("submitting")
            : resendCooldown > 0
            ? t("resendCooldown", { seconds: resendCooldown })
            : t("submit")}
        </button>
      </div>

      <Link
        href="/auth/login"
        className="text-[0.8125rem] text-outline hover:text-tertiary transition-colors self-start"
      >
        {t("backToLogin")}
      </Link>
    </div>
  );
}
