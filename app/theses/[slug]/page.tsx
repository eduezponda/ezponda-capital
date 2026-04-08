import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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
    <div className="pt-28 pb-20 bg-surface min-h-screen overflow-x-hidden">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge category={thesis.category} />
            {thesis.ticker && (
              <span className="text-[0.6875rem] uppercase tracking-[0.08rem] font-bold text-tertiary">
                {thesis.ticker}
              </span>
            )}
            {thesis.exchange && (
              <span className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline">
                {thesis.exchange}
              </span>
            )}
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
          {thesis.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {thesis.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline border border-outline-variant/40 rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="h-px bg-outline-variant/30 mt-4" />
        </div>

        {/* Cover image */}
        {thesis.image && (
          <img
            src={thesis.image}
            alt={thesis.title}
            className="w-full max-w-full rounded-xl mb-10 object-cover"
            style={{ aspectRatio: "1200/630" }}
          />
        )}

        {/* MDX content */}
        {thesis.tier === "premium" ? (
          <PremiumGate
            preview={
              <div className="thesis-prose">
                <MDXRemote
                  source={thesis.source.slice(0, 500)}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
              </div>
            }
          >
            <div className="thesis-prose">
              <MDXRemote source={thesis.source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </PremiumGate>
        ) : (
          <div className="thesis-prose">
            <MDXRemote source={thesis.source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>
        )}
      </Container>
    </div>
  );
}
