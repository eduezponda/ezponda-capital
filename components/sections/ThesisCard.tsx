import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ThesisCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
  tier?: "free" | "premium";
  className?: string;
  featured?: boolean;
}

export default async function ThesisCard({
  slug,
  title,
  excerpt,
  category,
  date,
  image,
  tier = "premium",
  className,
  featured = false,
}: ThesisCardProps) {
  const t = await getTranslations("theses");

  return (
    <Link
      href={`/theses/${slug}`}
      className={cn(
        "group relative overflow-hidden rounded-lg flex flex-col justify-end",
        "bg-surface-container-low hover:bg-surface-container-high transition-all duration-300",
        featured ? "min-h-[440px]" : "min-h-[280px]",
        className
      )}
    >
      {/* Background image */}
      {image && (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </>
      )}

      {/* Content overlay */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge category={category} />
          {tier === "premium" && (
            <span className="text-[0.625rem] uppercase tracking-[0.08rem] font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                lock
              </span>
              {t("premiumLabel")}
            </span>
          )}
        </div>
        {tier === "premium" ? (
          <div className="relative">
            <h3 className={cn("font-bold text-white tracking-tight leading-tight blur-sm select-none pointer-events-none", featured ? "text-2xl md:text-3xl" : "text-xl")}>
              {title}
            </h3>
          </div>
        ) : (
          <h3 className={cn("font-bold text-white tracking-tight leading-tight", featured ? "text-2xl md:text-3xl" : "text-xl")}>
            {title}
          </h3>
        )}
        {featured && (
          <p className="text-[0.875rem] text-on-surface-variant leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
        <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
          {date}
        </p>
      </div>
    </Link>
  );
}
