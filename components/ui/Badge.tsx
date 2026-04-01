import { cn } from "@/lib/utils";

type BadgeCategory = "Gold" | "Copper" | "Macro" | "Real Assets" | string;

interface BadgeProps {
  category: BadgeCategory;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Gold:         "bg-[#725c05]/60 text-[#ffe084] border-[#ffe084]/20",
  Copper:       "bg-[#7c3a1e]/60 text-[#f4a460] border-[#f4a460]/20",
  Macro:        "bg-[#1a2a3a]/60 text-[#7eb8d4] border-[#7eb8d4]/20",
  "Real Assets": "bg-[#1a2a1a]/60 text-[#7ec87e] border-[#7ec87e]/20",
};

export default function Badge({ category, className }: BadgeProps) {
  const colors =
    categoryColors[category] ??
    "bg-surface-container/60 text-on-surface-variant border-outline-variant/20";

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[0.625rem] uppercase tracking-[0.08rem] font-bold border",
        colors,
        className
      )}
    >
      {category}
    </span>
  );
}
