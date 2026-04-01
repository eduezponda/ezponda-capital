import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/layout/Container";

interface HeroProps {
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  minHeight?: string;
}

export default function Hero({
  eyebrow,
  headline,
  headlineAccent,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = "",
  className,
  minHeight = "min-h-screen",
}: HeroProps) {
  return (
    <section className={cn("relative flex items-center", minHeight, className)}>
      {/* Background image */}
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </>
      )}

      {/* Content */}
      <Container className={cn("relative z-10 py-28 md:py-40 lg:py-48")}>
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-[0.6875rem] uppercase tracking-[0.3rem] text-tertiary font-medium mb-6">
              {eyebrow}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
            {headline}
            {headlineAccent && (
              <>
                {" "}
                <span className="text-gold">{headlineAccent}</span>
              </>
            )}
          </h1>

          <p className="text-[1.125rem] text-on-surface-variant max-w-xl leading-relaxed mb-10">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="gold-gradient text-black text-[0.75rem] uppercase tracking-[0.08rem] font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_40px_rgba(255,224,132,0.25)] active:scale-95 transition-all duration-200"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="glass-panel border border-outline-variant/30 text-white text-[0.75rem] uppercase tracking-[0.08rem] font-medium px-8 py-4 rounded-xl hover:bg-surface-container-high/60 active:scale-95 transition-all duration-200"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
