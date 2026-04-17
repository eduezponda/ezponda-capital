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
  tier?: "free" | "premium";
  userTier?: Tier | null;
  className?: string;
  ticker?: string;
  exchange?: string;
}

export default async function ThesisCard({
  slug,
  title,
  excerpt,
  category,
  date,
  tier = "premium",
  userTier = null,
  className,
  ticker,
  exchange,
}: ThesisCardProps) {
  const t = await getTranslations("theses");

  const isGuest = userTier === null;
  const isFree = userTier === "free";
  const shouldBlur = isGuest || (isFree && tier === "premium");

  const cardClasses = cn(
    "relative overflow-hidden rounded-xl flex flex-col justify-end",
    "bg-surface-container border border-outline-variant/40",
    "transition-all duration-300 min-h-[360px]",
    className
  );

  const content = (
    <div className="p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Badge category={category} />
        {tier === "premium" && shouldBlur && (
          <span className={cn(
            "text-[0.625rem] uppercase tracking-[0.08rem] font-bold flex items-center gap-1",
            isFree ? "text-tertiary" : "text-outline"
          )}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
              {isFree ? "lock" : "visibility_off"}
            </span>
            {t("premiumLabel")}
          </span>
        )}
      </div>

      <h3 className={cn(
        "text-2xl font-bold text-white tracking-tight leading-tight",
        shouldBlur && "blur-sm select-none pointer-events-none"
      )}>
        {title}
      </h3>

      <p className={cn(
        "text-[0.8125rem] text-on-surface-variant leading-relaxed line-clamp-2",
        shouldBlur && "blur-sm select-none pointer-events-none"
      )}>
        {excerpt}
      </p>

      {!shouldBlur && (ticker || exchange) && (
        <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline mt-1">
          {ticker}{ticker && exchange ? " · " : ""}{exchange}
        </p>
      )}

      <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
        {date}
      </p>
    </div>
  );

  if (shouldBlur) {
    return (
      <div className={cn(cardClasses, "cursor-default")}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/theses/${slug}`}
      className={cn(cardClasses, "hover:border-outline-variant hover:bg-surface-container-high")}
    >
      {content}
    </Link>
  );
}
