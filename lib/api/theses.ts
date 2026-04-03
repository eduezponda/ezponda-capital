import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ThesisFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: "Gold" | "Copper" | "Macro" | "Real Assets";
  ticker: string;
  exchange: string;
  tier: "free" | "premium";
  status: string;
  summary: string;
  coverImage: string;
  ogImage?: string;
  tags: string[];
}

export interface ThesisMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: "Gold" | "Copper" | "Macro" | "Real Assets";
  date: string;
  tier: "free" | "premium";
  image?: string;
  tags: string[];
  ticker: string;
  exchange: string;
}

export interface ThesisWithContent extends ThesisMeta {
  source: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "theses");

function readAllFrontmatters(): ThesisMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      const fm = data as ThesisFrontmatter;
      return {
        slug: fm.slug ?? file.replace(/\.mdx$/, ""),
        title: fm.title,
        excerpt: fm.summary,
        category: fm.category,
        date: fm.date,
        tier: fm.tier ?? "free",
        image: fm.coverImage,
        tags: fm.tags ?? [],
        ticker: fm.ticker ?? "",
        exchange: fm.exchange ?? "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllTheses(category?: string): Promise<ThesisMeta[]> {
  const metas = readAllFrontmatters();
  if (!category || category === "all") return metas;
  return metas.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getThesisBySlug(
  slug: string
): Promise<ThesisWithContent | null> {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as ThesisFrontmatter;

  return {
    slug: fm.slug ?? slug,
    title: fm.title,
    excerpt: fm.summary,
    category: fm.category,
    date: fm.date,
    tier: fm.tier ?? "free",
    image: fm.coverImage,
    tags: fm.tags ?? [],
    ticker: fm.ticker ?? "",
    exchange: fm.exchange ?? "",
    source: content,
  };
}

export const CATEGORIES = ["All", "Gold", "Copper", "Macro", "Real Assets"] as const;
export type Category = (typeof CATEGORIES)[number];
