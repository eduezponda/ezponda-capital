"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  email: string;
  next: string;
}

export default function VerifyEmailForm({ email, next }: Props) {
  const t = useTranslations("auth.verifyEmail");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleVerify(codeToVerify: string) {
    if (codeToVerify.length !== 8 || isVerifying) return;
    setError(null);
    setIsVerifying(true);

    const supabase = createSupabaseBrowserClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: codeToVerify,
      type: "signup",
    });

    if (verifyError) {
      setError(
        verifyError.message.toLowerCase().includes("expired")
          ? t("errorExpired")
          : t("errorInvalid")
      );
      setIsVerifying(false);
      return;
    }

    if (next === "premium") {
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId: "price_1TJXvzKe83gRrUXhfkaTgFXt" }),
        });
        if (res.ok) {
          const data = await res.json();
          window.location.href = data.url;
          return;
        }
      } catch {
        // fallthrough to /theses
      }
    }

    router.push("/theses");
    router.refresh();
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
    if (val.length === 8) handleVerify(val);
  }

  async function handleResend() {
    setError(null);
    setResendSuccess(false);
    setIsResending(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.resend({ type: "signup", email });

    setIsResending(false);
    setResendCooldown(60);
    setResendSuccess(true);
    setCode("");
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
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          label={t("codeLabel")}
          placeholder={t("codePlaceholder")}
          value={code}
          onChange={handleCodeChange}
          disabled={isVerifying}
          autoComplete="one-time-code"
        />

        {error && <p className="text-[0.8125rem] text-red-400">{error}</p>}
        {resendSuccess && <p className="text-[0.8125rem] text-green-400">{t("resendSuccess")}</p>}

        <button
          type="button"
          onClick={() => handleVerify(code)}
          disabled={isVerifying || code.length !== 8}
          className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isVerifying ? t("submitting") : t("submit")}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="text-[0.8125rem] text-outline hover:text-tertiary transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-center"
        >
          {isResending
            ? t("resending")
            : resendCooldown > 0
            ? t("resendCooldown", { seconds: resendCooldown })
            : t("resend")}
        </button>
      </div>

      <Link
        href="/auth/signup"
        className="text-[0.8125rem] text-outline hover:text-tertiary transition-colors self-start"
      >
        {t("backToSignup")}
      </Link>
    </div>
  );
}
