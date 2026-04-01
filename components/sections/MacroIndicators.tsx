import Card from "@/components/ui/Card";
import Container from "@/components/layout/Container";

export interface Indicator {
  label: string;
  value: string;
  sublabel: string;
  change: string;
  direction: "up" | "down" | "neutral";
  icon: string;
}

interface MacroIndicatorsProps {
  indicators: Indicator[];
  eyebrow?: string;
  title?: string;
}

export default function MacroIndicators({
  indicators,
  eyebrow = "Market Context",
  title = "Macro Indicators",
}: MacroIndicatorsProps) {
  return (
    <section className="py-20 bg-surface-container-lowest">
      <Container>
        <div className="mb-10">
          <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators.map((ind, i) => (
            <Card key={i} variant="data" className="p-8 h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  className="material-symbols-outlined text-outline"
                  style={{ fontSize: 20, fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                  aria-hidden="true"
                >
                  {ind.icon}
                </span>
                <span
                  className={
                    ind.direction === "up"
                      ? "text-[0.625rem] font-medium text-tertiary"
                      : ind.direction === "down"
                      ? "text-[0.625rem] font-medium text-error"
                      : "text-[0.625rem] font-medium text-outline"
                  }
                >
                  {ind.direction === "up" ? "↑" : ind.direction === "down" ? "↓" : "—"}{" "}
                  {ind.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{ind.value}</p>
                <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline mt-1">
                  {ind.label}
                </p>
                <p className="text-[0.75rem] text-on-surface-variant mt-1">{ind.sublabel}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
