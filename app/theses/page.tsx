import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import ThesisGallery from "@/features/theses/components/ThesisGallery";
import ThesisFilter from "@/features/theses/components/ThesisFilter";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import Container from "@/components/layout/Container";
import { getAllTheses } from "@/lib/api/theses";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ThesesPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const theses = await getAllTheses(category);

  return (
    <>
      <Hero
        eyebrow="Research Library"
        headline="Investment"
        headlineAccent="Theses"
        subtitle="Structured, high-conviction research on commodity markets. Each thesis represents a multi-year view backed by macro analysis."
        minHeight="min-h-[60vh]"
      />

      <MacroTicker />

      <section className="py-20 bg-surface">
        <Container>
          {/* Filter bar */}
          <div className="mb-10">
            <ThesisFilter active={category ?? "all"} />
          </div>

          {/* Gallery */}
          <ThesisGallery theses={theses} />
        </Container>
      </section>

      <SubscribeCTA
        eyebrow="Premium Access"
        title="Access Institutional Insights"
        subtitle="Subscribe to unlock full thesis content and live macro data."
      />
    </>
  );
}
