export interface ThesisMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: "Gold" | "Copper" | "Macro" | "Real Assets";
  date: string;
  tier: "free" | "premium";
  image?: string;
  tags: string[];
}

export interface Thesis extends ThesisMeta {
  content: string; // raw MDX/HTML string — future: parse from file
}

// Stub data — future: load from /content/theses/*.mdx via gray-matter / next-mdx-remote
const THESES_DB: Thesis[] = [
  {
    slug: "golden-hegemony",
    title: "Golden Hegemony: Why Gold Wins the Next Decade",
    excerpt:
      "As central banks rebuild reserves and the dollar's reserve status erodes, gold reasserts its role as the ultimate store of value. A structural case for $5,000/oz.",
    category: "Gold",
    date: "2025-03-01",
    tier: "premium",
    image: undefined,
    tags: ["gold", "central banks", "dedollarization", "reserves"],
    content: "",
  },
  {
    slug: "copper-supercycle",
    title: "Copper Supercycle: The Metal Powering the Energy Transition",
    excerpt:
      "Electric vehicles, grid infrastructure, and AI data centers are converging on a single bottleneck: copper. Supply cannot keep up.",
    category: "Copper",
    date: "2025-02-10",
    tier: "premium",
    image: undefined,
    tags: ["copper", "energy transition", "EV", "infrastructure"],
    content: "",
  },
  {
    slug: "de-dollarization",
    title: "De-Dollarization: The Slow Fracture of the Global Reserve System",
    excerpt:
      "BRICS expansion, bilateral trade in local currencies, and gold accumulation by sovereign funds signal a structural shift decades in the making.",
    category: "Macro",
    date: "2025-01-20",
    tier: "premium",
    image: undefined,
    tags: ["macro", "dollar", "BRICS", "monetary system"],
    content: "",
  },
  {
    slug: "infrastructure-2-0",
    title: "Infrastructure 2.0: Real Assets in the Age of Fiscal Expansion",
    excerpt:
      "Government spending on roads, ports, and power grids is the most underappreciated commodity demand driver of this cycle.",
    category: "Real Assets",
    date: "2025-01-05",
    tier: "premium",
    image: undefined,
    tags: ["real assets", "infrastructure", "fiscal", "commodities"],
    content: "",
  },
];

export async function getAllTheses(category?: string): Promise<ThesisMeta[]> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const metas: ThesisMeta[] = THESES_DB.map(({ content: _content, ...meta }) => meta);
  if (!category || category === "all") return metas;
  return metas.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getThesisBySlug(slug: string): Promise<Thesis | null> {
  return THESES_DB.find((t) => t.slug === slug) ?? null;
}

export const CATEGORIES = ["All", "Gold", "Copper", "Macro", "Real Assets"] as const;
export type Category = (typeof CATEGORIES)[number];
