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
  const [featured, ...rest] = theses;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ThesisCard {...featured} date={formatDate(featured.date)} featured />
      </div>
      {rest.map((t) => (
        <ThesisCard key={t.slug} {...t} date={formatDate(t.date)} />
      ))}
    </div>
  );
}
