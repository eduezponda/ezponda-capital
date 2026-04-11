import { getTranslations } from "next-intl/server";
import Container from "@/components/layout/Container";

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface MethodologyStepsProps {
  steps?: Step[];
  eyebrow?: string;
  title?: string;
}

export default async function MethodologySteps({
  steps,
  eyebrow,
  title,
}: MethodologyStepsProps) {
  const t = await getTranslations("methodology");

  const resolvedEyebrow = eyebrow ?? t("eyebrow");
  const resolvedTitle = title ?? t("title");
  const resolvedSteps: Step[] = steps ?? [
    {
      icon: "analytics",
      title: t("step0Title"),
      description: t("step0Desc"),
    },
    {
      icon: "visibility_off",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      icon: "account_balance",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
  ];

  return (
    <section className="py-24 bg-surface">
      <Container>
        <div className="mb-14 max-w-xl">
          <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-3">
            {resolvedEyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {resolvedTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedSteps.map((step, i) => (
            <div key={i} className="flex flex-col gap-5">
              <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{
                    fontSize: 20,
                    fontVariationSettings: "'FILL' 0, 'wght' 300",
                  }}
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
              </div>
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.08rem] text-outline font-medium mb-1">
                  {t("stepPrefix")} {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
