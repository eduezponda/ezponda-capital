export interface Indicator {
  label: string;
  value: string;
  sublabel: string;
  change: string;
  direction: "up" | "down" | "neutral";
  icon: string;
}

// Stub data — replace with real API call (TradingEconomics, FRED, etc.)
const STUB: Indicator[] = [
  {
    label: "Inflation (CPI YoY)",
    value: "3.4%",
    sublabel: "US CPI, Feb 2025",
    change: "+0.1pp",
    direction: "up",
    icon: "trending_up",
  },
  {
    label: "Real 10Y Yield",
    value: "2.08%",
    sublabel: "TIPS-implied",
    change: "-0.05pp",
    direction: "down",
    icon: "show_chart",
  },
  {
    label: "Dollar Index (DXY)",
    value: "103.5",
    sublabel: "USD vs basket",
    change: "+0.3%",
    direction: "up",
    icon: "currency_exchange",
  },
  {
    label: "Sentiment Score",
    value: "62 / 100",
    sublabel: "Institutional bullish",
    change: "Neutral",
    direction: "neutral",
    icon: "psychology",
  },
];

export async function getIndicators(): Promise<Indicator[]> {
  // Future: fetch from /api/indicators with revalidate: 900
  return STUB;
}
