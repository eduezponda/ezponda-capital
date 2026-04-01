"use client";

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
          {/* separator */}
          <div className="w-8 h-px bg-outline-variant" />
        </div>
      ))}
    </>
  );
}

export default function Ticker({ items, className }: TickerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-surface-container-lowest border-y border-outline-variant/20 py-3",
        className
      )}
    >
      <div className="flex animate-marquee gap-12 items-center">
        {/* Duplicated for seamless loop */}
        <TickerRow items={items} />
        <TickerRow items={items} />
      </div>
    </div>
  );
}
