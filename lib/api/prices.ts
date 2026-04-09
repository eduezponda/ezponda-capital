import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TickerItem } from "@/components/ui/Ticker";

const LABEL_MAP: Record<string, string> = {
  XAU: "Gold (XAU/USD)",
  XAG: "Silver (XAG/USD)",
  XPT: "Platinum",
  XPD: "Palladium",
};

const STUB: TickerItem[] = [
  { label: "Gold (XAU/USD)",  value: "$3,082.40", change: "+1.2%", direction: "up" },
  { label: "Copper (USD/lb)", value: "$4.38",     change: "+0.8%", direction: "up" },
  { label: "Silver (XAG/USD)",value: "$33.15",    change: "-0.3%", direction: "down" },
  { label: "Brent Crude",     value: "$84.60",    change: "+0.5%", direction: "up" },
  { label: "WTI Crude",       value: "$80.22",    change: "+0.4%", direction: "up" },
  { label: "Platinum",        value: "$968.00",   change: "-0.6%", direction: "down" },
  { label: "Palladium",       value: "$962.00",   change: "+0.2%", direction: "up" },
  { label: "DXY",             value: "103.50",    change: "+0.3%", direction: "up" },
];

export async function getSpotPrices(): Promise<TickerItem[]> {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("commodity_prices")
      .select("symbol, name, price, change_pct")
      .order("fetched_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return STUB;

    const seen = new Set<string>();
    const items: TickerItem[] = [];
    for (const row of data) {
      if (seen.has(row.symbol)) continue;
      seen.add(row.symbol);
      const pct = row.change_pct ?? 0;
      items.push({
        label: LABEL_MAP[row.symbol] ?? `${row.name} (${row.symbol})`,
        value: `$${row.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
        direction: pct > 0 ? "up" : pct < 0 ? "down" : "neutral",
      });
    }

    return items.length > 0 ? items : STUB;
  } catch (err) {
    console.error("[getSpotPrices]", err);
    return STUB;
  }
}
