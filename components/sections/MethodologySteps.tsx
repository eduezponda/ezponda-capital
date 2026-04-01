import Container from "@/components/layout/Container";

interface Step {
  icon: string;
  title: string;
  description: string;
}

const DEFAULT_STEPS: Step[] = [
  {
    icon: "analytics",
    title: "Macro Framework",
    description:
      "We start with top-down macro analysis: monetary cycles, real yields, dollar dynamics, and structural demand shifts.",
  },
  {
    icon: "visibility_off",
    title: "Conviction Filtering",
    description:
      "Only asymmetric opportunities make the cut. High potential return relative to clearly defined risk.",
  },
  {
    icon: "account_balance",
    title: "Institutional Lens",
    description:
      "Research is framed for serious investors — not financial media. No noise, no narratives. Just structured conviction.",
  },
];

interface MethodologyStepsProps {
  steps?: Step[];
  eyebrow?: string;
  title?: string;
}

export default function MethodologySteps({
  steps = DEFAULT_STEPS,
  eyebrow = "How We Think",
  title = "Investment Methodology",
}: MethodologyStepsProps) {
  return (
    <section className="py-24 bg-surface">
      <Container>
        <div className="mb-14 max-w-xl">
          <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-3">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
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
                  Step {String(i + 1).padStart(2, "0")}
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
