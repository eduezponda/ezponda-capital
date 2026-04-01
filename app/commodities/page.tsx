import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import CommoditySection from "@/features/commodities/components/CommoditySection";
import MacroIndicators from "@/components/sections/MacroIndicators";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import UpgradeCTA from "@/features/subscription/components/UpgradeCTA";
import Container from "@/components/layout/Container";
import { getCommodities } from "@/features/commodities/lib/commodities";
import { getIndicators } from "@/lib/api/indicators";

export default async function CommoditiesPage() {
  const [commodities, indicators] = await Promise.all([
    getCommodities(),
    getIndicators(),
  ]);

  return (
    <>
      <Hero
        eyebrow="Real Assets"
        headline="Real Assets."
        headlineAccent="Real Value."
        subtitle="A structured view of the commodity landscape — gold, copper, and the macro forces driving the next decade of returns."
        primaryCta={{ label: "Get Started", href: "/auth/signup" }}
        secondaryCta={{ label: "View Theses", href: "/theses" }}
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
      />

      {/* Upgrade CTA */}
      <section className="py-20 bg-surface">
        <Container>
          <div className="max-w-lg mx-auto">
            <UpgradeCTA
              headline="Access Full Commodity Analysis"
              body="Go deeper with live price data, historical context, and complete investment theses for gold, copper, and the broader real assets universe."
            />
          </div>
        </Container>
      </section>

      <SubscribeCTA
        eyebrow="Weekly Insights"
        title="Commodity Intelligence, Delivered"
        subtitle="Stay ahead of macro shifts with our weekly commodity brief."
      />
    </>
  );
}
