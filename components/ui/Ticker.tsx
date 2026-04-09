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

// Consistent scroll speed regardless of viewport or content length.
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
  // Start with a reasonable fallback; corrected after first paint.
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (rowRef.current) {
      // offsetWidth includes the pr-12 padding, so this is exactly the
      // distance translateX(-50%) will travel — giving a consistent px/s rate.
      setDuration(rowRef.current.offsetWidth / PX_PER_SEC);
    }
  }, [items]);

  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-surface-container-lowest border-y border-outline-variant/20 py-3",
        className
      )}
    >
      {/*
       * Each row div uses gap-12 between items AND pr-12 trailing padding.
       * This means the spacing at the loop boundary equals the spacing between
       * any two adjacent items — making the reset of translateX(-50%) invisible.
       * Container width = 2 × rowRef.offsetWidth → -50% = exactly one row width. ✓
       */}
      <div
        className="flex animate-marquee items-center"
        style={{ animationDuration: `${duration}s` }}
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
