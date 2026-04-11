"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  function toggle() {
    const next = locale === "en" ? "es" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="text-[0.75rem] uppercase tracking-[0.1rem] font-medium text-outline hover:text-white transition-colors"
      aria-label={locale === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
