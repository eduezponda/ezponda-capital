"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TickerItem {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "neutral";
}

interface TickerProps {
  items: TickerItem[];
  className?: string;
}

const PX_PER_SEC = 100;

function TickerRow({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 shrink-0">
          <span className="text-[0.6875rem] uppercase tracking-[0.25rem] text-outline">
            {item.label}
          </span>
          <span
            className={cn(
              "font-mono text-[0.75rem] font-bold",
              item.direction === "up"
                ? "text-tertiary"
                : item.direction === "down"
                ? "text-error"
                : "text-on-surface"
            )}
          >
            {item.value}
          </span>
          <span
            className={cn(
              "text-[0.625rem] font-medium",
              item.direction === "up"
                ? "text-tertiary"
                : item.direction === "down"
                ? "text-error"
                : "text-outline"
            )}
          >
            {item.direction === "up" ? "↑" : item.direction === "down" ? "↓" : "—"}{" "}
            {item.change}
          </span>
          <div className="w-8 h-px bg-outline-variant" />
        </div>
      ))}
    </>
  );
}

export default function Ticker({ items, className }: TickerProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    // getBoundingClientRect gives sub-pixel precision; offsetWidth rounds to
    // integers and can differ from the browser's actual layout value by up to
    // 1px per row — enough to cause a visible jump at the loop reset point.
    setRowWidth(rowRef.current.getBoundingClientRect().width);
  }, [items]);

  const ready = rowWidth !== null;
  const duration = ready ? rowWidth / PX_PER_SEC : 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-surface-container-lowest border-y border-outline-variant/20 py-3",
        className
      )}
    >
      {/*
       * The animation is withheld until rowWidth is measured so that
       * animationDuration and --marquee-translate are never wrong even briefly.
       * translateX travels exactly -rowWidth px, landing at the pixel-perfect
       * start of the second copy regardless of container width or rounding.
       */}
      <div
        className={cn("flex items-center", ready && "animate-marquee")}
        style={
          ready
            ? ({
                "--marquee-translate": `-${rowWidth}px`,
                animationDuration: `${duration}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div ref={rowRef} className="flex items-center gap-12 pr-12">
          <TickerRow items={items} />
        </div>
        <div className="flex items-center gap-12 pr-12" aria-hidden>
          <TickerRow items={items} />
        </div>
      </div>
    </div>
  );
}
