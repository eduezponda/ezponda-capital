import { getTranslations } from "next-intl/server";
import Container from "@/components/layout/Container";

export async function generateMetadata() {
  const t = await getTranslations("legal");
  return { title: t("title"), description: t("description") };
}

export default async function LegalPage() {
  const t = await getTranslations("legal");

  const sections = [
    { title: t("serviceTitle"), body: t("serviceBody") },
    { title: t("subscriptionTitle"), body: t("subscriptionBody") },
    { title: t("disclaimerTitle"), body: t("disclaimerBody") },
    { title: t("lawTitle"), body: t("lawBody") },
  ];

  return (
    <div className="pt-28 pb-20 bg-surface min-h-screen overflow-x-hidden">
      <Container className="max-w-3xl">
        <div className="mb-12 flex flex-col gap-4">
          <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t("heading")}
          </h1>
          <p className="text-[1.125rem] text-on-surface-variant leading-relaxed max-w-2xl">
            {t("subheading")}
          </p>
          <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
            {t("lastUpdated")}
          </p>
          <div className="h-px bg-outline-variant/30 mt-4" />
        </div>

        <div className="thesis-prose">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
