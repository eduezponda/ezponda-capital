import type { TickerItem } from "@/components/ui/Ticker";

// Stub data — replace with Metals API / TradingEconomics
const STUB: TickerItem[] = [
  { label: "Gold (XAU/USD)", value: "$3,082.40", change: "+1.2%", direction: "up" },
  { label: "Copper (USD/lb)", value: "$4.38",    change: "+0.8%", direction: "up" },
  { label: "Silver (XAG/USD)", value: "$33.15",  change: "-0.3%", direction: "down" },
  { label: "Brent Crude",      value: "$84.60",  change: "+0.5%", direction: "up" },
  { label: "WTI Crude",        value: "$80.22",  change: "+0.4%", direction: "up" },
  { label: "Platinum",         value: "$968.00", change: "-0.6%", direction: "down" },
  { label: "Palladium",        value: "$962.00", change: "+0.2%", direction: "up" },
  { label: "DXY",              value: "103.50",  change: "+0.3%", direction: "up" },
];

export async function getSpotPrices(): Promise<TickerItem[]> {
  // Future: fetch({ next: { revalidate: 300 } })
  return STUB;
}
