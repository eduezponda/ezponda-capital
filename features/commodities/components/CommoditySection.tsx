import type { Commodity } from "@/features/commodities/lib/commodities";
import { cn } from "@/lib/utils";
import Container from "@/components/layout/Container";

interface CommoditySectionProps {
  commodity: Commodity;
}

export default function CommoditySection({ commodity }: CommoditySectionProps) {
  const imageLeft = commodity.imagePosition === "left";

  return (
    <section className="py-20 border-b border-outline-variant/15">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <div className={cn("relative h-72 md:h-96 rounded-lg overflow-hidden bg-surface-container-low", !imageLeft && "md:order-last")}>
            {commodity.image ? (
              <img
                src={commodity.image}
                alt={commodity.imageAlt}
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-60"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-outline-variant text-[0.6875rem] uppercase tracking-[0.2rem]">
                  {commodity.name} Imagery
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.25rem] text-tertiary font-medium mb-2">
                {commodity.name}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                {commodity.tagline}
              </h2>
            </div>
            <p className="text-[0.9375rem] text-on-surface-variant leading-relaxed">
              {commodity.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {commodity.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-container-low rounded p-4 border border-outline-variant/15"
                >
                  <p className="text-lg font-bold text-tertiary">{stat.value}</p>
                  <p className="text-[0.6875rem] uppercase tracking-[0.04rem] text-outline mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
