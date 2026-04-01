import Link from "next/link";
import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import AuthorCard from "@/components/sections/AuthorCard";
import MethodologySteps from "@/components/sections/MethodologySteps";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import ThesisGallery from "@/features/theses/components/ThesisGallery";
import Container from "@/components/layout/Container";
import { getAllTheses } from "@/lib/api/theses";

export default async function HomePage() {
  const theses = await getAllTheses();
  const featured = theses.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Commodity Investment Research"
        headline="Real Assets."
        headlineAccent="Real Value."
        subtitle="High-conviction investment ideas in gold, copper, and macro cycles — for investors who think in decades, not quarters."
        primaryCta={{ label: "Explore Theses", href: "/theses" }}
        secondaryCta={{ label: "Get Access", href: "/auth/signup" }}
      />

      <MacroTicker />

      {/* Strategic anchors */}
      <section className="py-20 bg-surface-container-lowest">
        <Container>
          <div className="mb-10">
            <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
              Coverage Universe
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Strategic Anchors
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "diamond", label: "Gold", sub: "Monetary metals" },
              { icon: "cable", label: "Copper", sub: "Industrial metals" },
              { icon: "public", label: "Macro Cycles", sub: "Global dynamics" },
              {
                icon: "foundation",
                label: "Real Assets",
                sub: "Tangible value",
              },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="bg-surface-container rounded-lg p-5 md:p-8 border border-outline-variant/10 hover:bg-surface-container-high transition-colors flex flex-col gap-4"
              >
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{
                    fontSize: 24,
                    fontVariationSettings: "'FILL' 0, 'wght' 300",
                  }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <div>
                  <p className="font-bold text-white">{label}</p>
                  <p className="text-[0.75rem] text-outline mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Author */}
      <AuthorCard
        name="Iñigo Ezponda Igea"
        title="Principal, Ezponda Capital"
        bio="Commodity-focused investor with a macro framework built around real yield cycles, monetary policy divergence, and structural demand shifts in industrial metals. Writing for investors who want the signal without the noise."
        credentials={[
          "CFA Candidate",
          "10+ Years Markets",
          "Gold & Copper Focus",
        ]}
      />

      {/* Featured theses */}
      <section className="py-20 bg-surface">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
                Latest Research
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Featured Theses
              </h2>
            </div>
            <Link
              href="/theses"
              className="text-[0.75rem] uppercase tracking-[0.08rem] text-outline hover:text-tertiary transition-colors hidden md:block"
            >
              View all →
            </Link>
          </div>

          <ThesisGallery theses={featured} />
        </Container>
      </section>

      <MethodologySteps />
      <SubscribeCTA />
    </>
  );
}
