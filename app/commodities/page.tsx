import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import CommoditySection from "@/features/commodities/components/CommoditySection";
import MacroIndicators from "@/components/sections/MacroIndicators";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import UpgradeCTA from "@/features/subscription/components/UpgradeCTA";
import Container from "@/components/layout/Container";
import { getCommodities } from "@/features/commodities/lib/commodities";
import { getIndicators } from "@/lib/api/indicators";
import { getSession } from "@/features/auth/lib/session";

export default async function CommoditiesPage() {
  const [commodities, indicators, t, session] = await Promise.all([
    getCommodities(),
    getIndicators(),
    getTranslations("commodities"),
    getSession(),
  ]);
  const tMacro = await getTranslations("macro");
  const isPremium = session?.tier === "premium";

  return (
    <>
      <Hero
        eyebrow={t("heroEyebrow")}
        headline={t("heroHeadline")}
        headlineAccent={t("heroAccent")}
        subtitle={t("heroSubtitle")}
        primaryCta={!session ? { label: t("heroPrimary"), href: "/auth/signup" } : { label: t("heroPrimary"), href: "/theses" }}
        secondaryCta={{ label: t("heroSecondary"), href: "/theses" }}
        minHeight="min-h-[70vh]"
      />

      <MacroTicker />

      {commodities.map((commodity) => (
        <CommoditySection key={commodity.id} commodity={commodity} />
      ))}

      <MacroIndicators
        indicators={indicators.map((ind) => ({
          label: ind.label,
          value: ind.value,
          sublabel: ind.sublabel,
          change: ind.change,
          direction: ind.direction,
          icon: ind.icon,
        }))}
        eyebrow={tMacro("eyebrow")}
        title={tMacro("title")}
      />

      {!isPremium && (
        <section className="py-20 bg-surface">
          <Container>
            <div className="max-w-lg mx-auto">
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

      {!isPremium && (
        <SubscribeCTA
          eyebrow={t("subscribeEyebrow")}
          title={t("subscribeTitle")}
          subtitle={t("subscribeSubtitle")}
        />
      )}
    </>
  );
}
