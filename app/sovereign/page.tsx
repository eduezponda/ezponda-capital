import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import UpgradeCTA from "@/features/subscription/components/UpgradeCTA";
import Container from "@/components/layout/Container";

const SOVEREIGN_THEMES = [
  {
    icon: "account_balance",
    title: "Central Bank Reserves",
    description:
      "Sovereign wealth funds and central banks are quietly accumulating gold and real assets at record pace, diversifying away from dollar-denominated instruments.",
  },
  {
    icon: "public",
    title: "De-Dollarization",
    description:
      "Bilateral trade settlements in local currencies, BRICS expansion, and the weaponization of the dollar are accelerating a structural monetary shift.",
  },
  {
    icon: "show_chart",
    title: "Fiscal Dominance",
    description:
      "Government debt levels globally have reached a point where central banks cannot raise rates without causing fiscal crises — a structural tailwind for hard assets.",
  },
  {
    icon: "trending_up",
    title: "Real Yield Regime",
    description:
      "The era of deeply negative real yields supercharged gold. As real rates normalize, the commodity thesis evolves — but does not disappear.",
  },
];

export default function SovereignPage() {
  return (
    <>
      <Hero
        eyebrow="Macro & Sovereign"
        headline="Sovereign Forces."
        headlineAccent="Real Consequences."
        subtitle="The macro undercurrents shaping commodity demand for the next decade — central banks, monetary systems, and fiscal reality."
        primaryCta={{ label: "View Theses", href: "/theses" }}
        secondaryCta={{ label: "Get Access", href: "/auth/signup" }}
        minHeight="min-h-[70vh]"
      />

      <MacroTicker />

      {/* Themes */}
      <section className="py-24 bg-surface">
        <Container>
          <div className="mb-14 max-w-xl">
            <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-3">
              Structural Forces
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Macro Framework
            </h2>
            <p className="text-[0.9375rem] text-on-surface-variant leading-relaxed mt-4">
              Every commodity thesis at Ezponda Capital is anchored in a sovereign macro view. These are the structural forces we track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOVEREIGN_THEMES.map((theme) => (
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

      {/* Upgrade CTA */}
      <section className="py-20 bg-surface-container-lowest">
        <Container>
          <div className="max-w-xl mx-auto">
            <UpgradeCTA
              headline="Unlock the Full Sovereign View"
              body="Access deep-dive sovereign macro reports, updated monthly — covering central bank flows, reserve composition shifts, and real yield dynamics."
            />
          </div>
        </Container>
      </section>
    </>
  );
}
