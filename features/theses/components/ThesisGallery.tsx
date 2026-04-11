import { getTranslations } from "next-intl/server";
import type { ThesisMeta } from "@/lib/api/theses";
import ThesisCard from "@/components/sections/ThesisCard";
import { formatDate } from "@/lib/utils";

interface Props { theses: ThesisMeta[] }

export default async function ThesisGallery({ theses }: Props) {
  const t = await getTranslations("theses");

  if (theses.length === 0) {
    return (
      <p className="py-20 text-center text-outline text-sm">
        {t("emptyState")}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {theses.map((thesis, i) => (
        <ThesisCard key={thesis.slug} {...thesis} date={formatDate(thesis.date)} featured={i === 0} />
      ))}
    </div>
  );
}
