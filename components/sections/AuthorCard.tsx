import { getTranslations } from "next-intl/server";
import Container from "@/components/layout/Container";

interface AuthorCardProps {
  name: string;
  title: string;
  bio: string;
  image?: string;
  credentials?: string[];
}

export default async function AuthorCard({
  name,
  title,
  bio,
  image,
  credentials = [],
}: AuthorCardProps) {
  const t = await getTranslations("author");

  return (
    <section className="py-20 bg-surface-container-low">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
          {/* Avatar */}
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-24 h-24 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-outline"
                style={{ fontSize: 32, fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                aria-hidden="true"
              >
                person
              </span>
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col gap-3 max-w-2xl">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.2rem] text-tertiary font-medium mb-1">
                {t("role")}
              </p>
              <h3 className="text-2xl font-bold text-white">{name}</h3>
              <p className="text-[0.875rem] text-outline mt-0.5">{title}</p>
            </div>
            <p className="text-[0.9375rem] text-on-surface-variant leading-relaxed">{bio}</p>
            {credentials.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {credentials.map((c) => (
                  <span
                    key={c}
                    className="text-[0.625rem] uppercase tracking-[0.06rem] font-bold px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
