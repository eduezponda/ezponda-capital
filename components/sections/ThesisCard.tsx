import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Badge from "@/components/ui/Badge";
import type { Tier } from "@/features/auth/lib/session";
import { cn } from "@/lib/utils";

interface ThesisCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
  tier?: "free" | "premium";
  userTier?: Tier | null;
  className?: string;
  featured?: boolean;
  ticker?: string;
  exchange?: string;
}

export default async function ThesisCard({
  slug,
  title,
  excerpt,
  category,
  date,
  image,
  tier = "premium",
  userTier = null,
  className,
  featured = false,
  ticker,
  exchange,
}: ThesisCardProps) {
  const t = await getTranslations("theses");

  const isGuest = userTier === null;
  const isFree = userTier === "free";
  const shouldBlur = isGuest || (isFree && tier === "premium");
  const showLock = tier === "premium" && isFree;

  return (
    <Link
      href={`/theses/${slug}`}
      className={cn(
        "group relative overflow-hidden rounded-lg flex flex-col justify-end",
        "bg-surface-container-low hover:bg-surface-container-high transition-all duration-300",
        "min-h-[320px]",
        className
      )}
    >
      {/* Background image */}
      {image && !shouldBlur && (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center grayscale brightness-[0.18] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        </>
      )}

      {/* Content overlay */}
      <div className="relative z-10 p-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge category={category} />
          {showLock && (
            <span className="text-[0.625rem] uppercase tracking-[0.08rem] font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                lock
              </span>
              {t("premiumLabel")}
            </span>
          )}
          {isGuest && tier === "premium" && (
            <span className="text-[0.625rem] uppercase tracking-[0.08rem] font-bold text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                visibility_off
              </span>
              {t("premiumLabel")}
            </span>
          )}
        </div>
        {shouldBlur ? (
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight blur-sm select-none pointer-events-none">
            {title}
          </h3>
        ) : (
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h3>
        )}
        {(ticker || exchange) && (
          <p className={cn(
            "text-[0.6875rem] uppercase tracking-[0.05rem] text-outline",
            isGuest && "blur-sm select-none pointer-events-none"
          )}>
            {ticker}{ticker && exchange ? " · " : ""}{exchange}
          </p>
        )}
        <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
          {date}
        </p>
      </div>
    </Link>
  );
}
