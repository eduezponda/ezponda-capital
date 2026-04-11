import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TickerItem } from "@/components/ui/Ticker";

const LABEL_MAP: Record<string, string> = {
  XAU: "Gold (XAU/USD)",
  XAG: "Silver (XAG/USD)",
  XPT: "Platinum",
  XPD: "Palladium",
  BTC: "Bitcoin (BTC/USD)",
};

export async function getSpotPrices(): Promise<TickerItem[]> {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("commodity_prices")
      .select("symbol, name, price, change_pct")
      .order("fetched_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

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

    return items;
  } catch (err) {
    console.error("[getSpotPrices]", err);
    return [];
  }
}
