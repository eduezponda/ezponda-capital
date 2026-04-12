import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import MacroTicker from "@/features/macro/components/MacroTicker";
import AuthorCard from "@/components/sections/AuthorCard";
import MethodologySteps from "@/components/sections/MethodologySteps";
import SubscribeCTA from "@/components/sections/SubscribeCTA";
import ThesisGallery from "@/features/theses/components/ThesisGallery";
import ThesisBanner from "@/features/subscription/components/ThesisBanner";
import Container from "@/components/layout/Container";
import { getAllTheses } from "@/lib/api/theses";
import { getSession } from "@/features/auth/lib/session";

export default async function HomePage() {
  const [theses, t, session] = await Promise.all([
    getAllTheses(),
    getTranslations("home"),
    getSession(),
  ]);
  const tAuthor = await getTranslations("author");
  const tSubscribe = await getTranslations("subscribe");
  const featured = theses.slice(0, 3);
  const isPremium = session?.tier === "premium";

  return (
    <>
      <Hero
        eyebrow={t("heroEyebrow")}
        headline={t("heroHeadline")}
        headlineAccent={t("heroAccent")}
        subtitle={t("heroSubtitle")}
        primaryCta={{ label: t("heroPrimary"), href: "/theses" }}
        secondaryCta={!session ? { label: t("heroSecondary"), href: "/auth/signup" } : undefined}
        minHeight="min-h-[70vh] md:min-h-screen"
      />

      <MacroTicker />

      {/* Strategic anchors */}
      <section className="py-20 bg-surface-container-lowest">
        <Container>
          <div className="mb-10">
            <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
              {t("coverageEyebrow")}
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {t("coverageTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "diamond",    label: t("goldLabel"),       sub: t("goldSub") },
              { icon: "cable",      label: t("copperLabel"),     sub: t("copperSub") },
              { icon: "public",     label: t("macroCyclesLabel"), sub: t("macroCyclesSub") },
              { icon: "foundation", label: t("realAssetsLabel"),  sub: t("realAssetsSub") },
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
        name={tAuthor("name")}
        title={tAuthor("title")}
        bio={tAuthor("bio")}
        credentials={[
          tAuthor("credential0"),
          tAuthor("credential1"),
          tAuthor("credential2"),
        ]}
      />

      {/* Featured theses */}
      <section className="py-20 bg-surface">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
                {t("researchEyebrow")}
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {t("researchTitle")}
              </h2>
            </div>
            <Link
              href="/theses"
              className="text-[0.75rem] uppercase tracking-[0.08rem] text-outline hover:text-tertiary transition-colors hidden md:block"
            >
              {t("viewAll")}
            </Link>
          </div>

          <ThesisBanner />

          <ThesisGallery theses={featured} />
        </Container>
      </section>

      <MethodologySteps />
      {!isPremium && (
        <SubscribeCTA
          eyebrow={tSubscribe("eyebrow")}
          title={tSubscribe("title")}
          subtitle={tSubscribe("subtitle")}
        />
      )}
    </>
  );
}
