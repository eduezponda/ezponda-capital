import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import ThesisGallery from "@/features/theses/components/ThesisGallery";
import ThesisFilter from "@/features/theses/components/ThesisFilter";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import Container from "@/components/layout/Container";
import { getAllTheses } from "@/lib/api/theses";
import { getSession } from "@/features/auth/lib/session";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ThesesPage({ searchParams }: PageProps) {
  const [{ category }, t, session] = await Promise.all([
    searchParams,
    getTranslations("theses"),
    getSession(),
  ]);
  const theses = await getAllTheses(category);
  const isPremium = session?.tier === "premium";

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
          <div className="mb-10">
            <ThesisFilter active={category ?? "all"} />
          </div>

          <ThesisGallery theses={theses} />
        </Container>
      </section>

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
