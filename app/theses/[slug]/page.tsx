import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import PremiumGate from "@/features/subscription/components/PremiumGate";
import { getThesisBySlug, getAllTheses } from "@/lib/api/theses";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const theses = await getAllTheses();
  return theses.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const thesis = await getThesisBySlug(slug);
  return {
    title: thesis ? `${thesis.title} — Ezponda Capital` : "Not Found",
    description: thesis?.excerpt,
  };
}

export default async function ThesisPage({ params }: PageProps) {
  const { slug } = await params;
  const thesis = await getThesisBySlug(slug);

  if (!thesis) notFound();

  return (
    <div className="pt-28 pb-20 bg-surface min-h-screen">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge category={thesis.category} />
            <span className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
              {formatDate(thesis.date)}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {thesis.title}
          </h1>
          <p className="text-[1.125rem] text-on-surface-variant leading-relaxed max-w-2xl">
            {thesis.excerpt}
          </p>
          <div className="h-px bg-outline-variant/30 mt-4" />
        </div>

        {/* Gated content */}
        <PremiumGate>
          <div className="prose prose-invert max-w-none">
            {thesis.content ? (
              <div dangerouslySetInnerHTML={{ __html: thesis.content }} />
            ) : (
              <p className="text-outline italic">Full thesis content coming soon.</p>
            )}
          </div>
        </PremiumGate>
      </Container>
    </div>
  );
}
