"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const t = useTranslations("auth.signup");
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError(t("emailExists"));
      setIsLoading(false);
      return;
    }

    router.push("/auth/confirm-email");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">Ezponda</span>
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">Capital</span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t("heading")}</h1>
        <p className="text-[0.875rem] text-outline mt-1">
          {t("subheading")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="firstName"
            type="text"
            label={t("firstName")}
            placeholder={t("firstNamePlaceholder")}
            className="flex-1"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            id="lastName"
            type="text"
            label={t("lastName")}
            placeholder={t("lastNamePlaceholder")}
            className="flex-1"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Input
          id="email"
          type="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label={t("password")}
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mt-2">
          <label className="text-[0.6875rem] uppercase tracking-[0.05rem] font-medium text-secondary block mb-2">
            {t("focus")}
          </label>
          <select className="w-full bg-surface-container-highest text-on-surface px-6 py-4 rounded outline-none border border-transparent focus:ring-1 focus:ring-tertiary transition-all">
            <option value="">{t("focusPlaceholder")}</option>
            <option value="gold">{t("focusGold")}</option>
            <option value="copper">{t("focusCopper")}</option>
            <option value="macro">{t("focusMacro")}</option>
            <option value="all">{t("focusAll")}</option>
          </select>
        </div>

        {error && (
          <p className="text-[0.8125rem] text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="text-center text-[0.8125rem] text-outline">
        {t("footer")}{" "}
        <Link href="/auth/login" className="text-tertiary hover:underline">
          {t("footerLink")}
        </Link>
      </p>
    </div>
  );
}
