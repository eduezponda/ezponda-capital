import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TickerItem } from "@/components/ui/Ticker";

const DISPLAY_ORDER = ["XAU", "XCU", "XAG", "BTC", "XPT", "XPD"];

export async function getSpotPrices(): Promise<TickerItem[]> {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("commodity_prices")
      .select("symbol, name, price, change_pct")
      .order("fetched_at", { ascending: false });

    if (error) throw error;
    if (!data?.length) return [];

    const latestBySymbol = new Map<string, (typeof data)[number]>();
    for (const row of data) {
      if (!latestBySymbol.has(row.symbol)) latestBySymbol.set(row.symbol, row);
    }

    const items: TickerItem[] = [];
    for (const symbol of DISPLAY_ORDER) {
      const row = latestBySymbol.get(symbol);
      if (!row) continue;
      const pct = row.change_pct ?? 0;
      items.push({
        label: `${row.name} (${row.symbol}/USD)`,
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
