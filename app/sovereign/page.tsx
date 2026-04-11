import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import UpgradeCTA from "@/features/subscription/components/UpgradeCTA";
import Container from "@/components/layout/Container";
import { getSession } from "@/features/auth/lib/session";

const THEME_ICONS = ["account_balance", "public", "show_chart", "trending_up"];

export default async function SovereignPage() {
  const [t, session] = await Promise.all([
    getTranslations("sovereign"),
    getSession(),
  ]);
  const isPremium = session?.tier === "premium";

  const themes = THEME_ICONS.map((icon, i) => ({
    icon,
    title: t(`theme${i}Title` as Parameters<typeof t>[0]),
    description: t(`theme${i}Desc` as Parameters<typeof t>[0]),
  }));

  return (
    <>
      <Hero
        eyebrow={t("heroEyebrow")}
        headline={t("heroHeadline")}
        headlineAccent={t("heroAccent")}
        subtitle={t("heroSubtitle")}
        primaryCta={{ label: t("heroPrimary"), href: "/theses" }}
        secondaryCta={!session ? { label: t("heroSecondary"), href: "/auth/signup" } : undefined}
        minHeight="min-h-[70vh]"
      />

      <MacroTicker />

      {/* Themes */}
      <section className="py-24 bg-surface">
        <Container>
          <div className="mb-14 max-w-xl">
            <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-3">
              {t("frameworkEyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {t("frameworkTitle")}
            </h2>
            <p className="text-[0.9375rem] text-on-surface-variant leading-relaxed mt-4">
              {t("frameworkDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {themes.map((theme) => (
              <div
                key={theme.title}
                className="bg-surface-container-low rounded-lg p-8 border border-outline-variant/10 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span
                      className="material-symbols-outlined text-tertiary"
                      style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                      aria-hidden="true"
                    >
                      {theme.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{theme.title}</h3>
                    <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {!isPremium && (
        <section className="py-20 bg-surface-container-lowest">
          <Container>
            <div className="max-w-xl mx-auto">
              <UpgradeCTA
                headline={t("upgradeHeadline")}
                body={t("upgradeBody")}
                ctaHref={session ? undefined : "/auth/signup"}
                mode={session ? "stripe" : "link"}
                priceId={session ? "price_1TJXvzKe83gRrUXhfkaTgFXt" : undefined}
              />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
