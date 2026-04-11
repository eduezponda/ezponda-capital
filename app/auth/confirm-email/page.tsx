import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AuthLayout from "@/features/auth/components/AuthLayout";

export async function generateMetadata() {
  const t = await getTranslations("auth.confirmEmail");
  return { title: t("title"), description: t("description") };
}

export default async function ConfirmEmailPage() {
  const t = await getTranslations("auth.confirmEmail");

  return (
    <AuthLayout>
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

        <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
          {t("body")}
        </p>

        <Link
          href="/auth/login"
          className="text-[0.8125rem] text-tertiary hover:underline self-start"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </AuthLayout>
  );
}
