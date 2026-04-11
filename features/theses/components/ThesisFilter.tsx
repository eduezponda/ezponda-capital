"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/lib/api/categories";
import { cn } from "@/lib/utils";

interface Props {
  active?: string;
}

export default function ThesisFilter({ active = "all" }: Props) {
  const t = useTranslations("theses");
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleClick(href: string) {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {CATEGORIES.map((cat) => {
        const slug = cat.toLowerCase().replace(" ", "-");
        const isActive = cat === "All" ? active === "all" : active === slug;
        const href = cat === "All" ? "/theses" : `/theses?category=${slug}`;
        const label = cat === "All" ? t("filterAll") : cat;
        return (
          <button
            key={cat}
            onClick={() => handleClick(href)}
            className={cn(
              "rounded-full px-6 py-2.5 text-[0.75rem] uppercase tracking-[0.05rem] font-medium border transition-all duration-150",
              isActive
                ? "gold-gradient text-black border-transparent"
                : "bg-surface-container-low text-on-surface border-white/5 hover:bg-surface-container-high"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
