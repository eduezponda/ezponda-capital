import Link from "next/link";
import { CATEGORIES } from "@/lib/api/theses";
import { cn } from "@/lib/utils";

interface Props {
  active?: string;
}

export default function ThesisFilter({ active = "all" }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {CATEGORIES.map((cat) => {
        const slug = cat.toLowerCase().replace(" ", "-");
        const isActive = cat === "All" ? active === "all" : active === slug;
        const href = cat === "All" ? "/theses" : `/theses?category=${slug}`;
        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "rounded-full px-6 py-2.5 text-[0.75rem] uppercase tracking-[0.05rem] font-medium border transition-all duration-150",
              isActive
                ? "gold-gradient text-black border-transparent"
                : "bg-surface-container-low text-on-surface border-white/5 hover:bg-surface-container-high"
            )}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
