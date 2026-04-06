import type { ThesisMeta } from "@/lib/api/theses";
import ThesisCard from "@/components/sections/ThesisCard";
import { formatDate } from "@/lib/utils";

interface Props { theses: ThesisMeta[] }

export default function ThesisGallery({ theses }: Props) {
  if (theses.length === 0) {
    return (
      <p className="py-20 text-center text-outline text-sm">
        No theses found in this category.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {theses.map((t, i) => (
        <ThesisCard key={t.slug} {...t} date={formatDate(t.date)} featured={i === 0} />
      ))}
    </div>
  );
}
