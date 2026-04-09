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

const DESKTOP_PX_PER_SEC = 80;
const MOBILE_PX_PER_SEC = 45; // noticeably slower on narrow viewports

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
  const [pxPerSec, setPxPerSec] = useState(DESKTOP_PX_PER_SEC);

  useEffect(() => {
    if (!rowRef.current) return;
    // getBoundingClientRect gives sub-pixel precision; offsetWidth rounds to
    // integers and can differ by up to 1px — enough to cause a visible jump.
    setRowWidth(rowRef.current.getBoundingClientRect().width);
    // md breakpoint matches Tailwind's 768px threshold.
    setPxPerSec(window.innerWidth < 768 ? MOBILE_PX_PER_SEC : DESKTOP_PX_PER_SEC);
  }, [items]);

  const ready = rowWidth !== null;
  const duration = ready ? rowWidth / pxPerSec : 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-surface-container-lowest border-y border-outline-variant/20 py-3",
        className
      )}
    >
      {/*
       * shrink-0 w-max on each row div prevents the flex container from
       * compressing them into the viewport width — without these the two divs
       * overlap because the outer flex tries to fit them into a bounded width.
       *
       * The animation is withheld until rowWidth is measured so that
       * --marquee-translate and animationDuration are never wrong even briefly.
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
        <div ref={rowRef} className="flex items-center gap-12 pr-12 shrink-0 w-max">
          <TickerRow items={items} />
        </div>
        <div className="flex items-center gap-12 pr-12 shrink-0 w-max" aria-hidden>
          <TickerRow items={items} />
        </div>
      </div>
    </div>
  );
}
