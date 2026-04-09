import { getTranslations } from "next-intl/server";
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
  const [{ category }, t] = await Promise.all([
    searchParams,
    getTranslations("theses"),
  ]);
  const theses = await getAllTheses(category);

  return (
    <>
      <Hero
        eyebrow={t("heroEyebrow")}
        headline={t("heroHeadline")}
        headlineAccent={t("heroAccent")}
        subtitle={t("heroSubtitle")}
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
        eyebrow={t("subscribeEyebrow")}
        title={t("subscribeTitle")}
        subtitle={t("subscribeSubtitle")}
      />
    </>
  );
}
