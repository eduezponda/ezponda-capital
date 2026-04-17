import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Retention: 7 days (7 rows/symbol). Cleanup handled by DB trigger.
// Vercel Hobby: 1 invocation/day (daily cron limit on Hobby plan).
const METALS = [
  { symbol: "XAU", name: "Gold",      unit: "oz",   currency: "USD" },
  { symbol: "XAG", name: "Silver",    unit: "oz",   currency: "USD" },
  { symbol: "XPT", name: "Platinum",  unit: "oz",   currency: "USD" },
  { symbol: "XPD", name: "Palladium", unit: "oz",   currency: "USD" },
];

// Troy ounces per pound — used to convert metals.dev copper (USD/toz) to USD/lb
const TOZ_PER_LB = 14.5833;

type PriceRow = {
  symbol: string;
  name: string;
  price: number;
  change_pct: number;
  currency: string;
  unit: string;
};

async function fetchMetalPrice(
  symbol: string,
  name: string,
  unit: string,
  apiKey: string
): Promise<PriceRow | null> {
  try {
    const res = await fetch(`https://www.goldapi.io/api/${symbol}/USD`, {
      headers: { "x-access-token": apiKey },
    });
    if (!res.ok) throw new Error(`GoldAPI responded ${res.status} for ${symbol}`);
    const data = await res.json();
    return {
      symbol,
      name,
      price: data.price,
      change_pct: data.chp,
      currency: data.currency,
      unit,
    };
  } catch (err) {
    console.error(`[refresh] Failed to fetch ${symbol}:`, err);
    return null;
  }
}

async function fetchMetalsDevPrices(apiKey: string): Promise<PriceRow[]> {
  try {
    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`
    );
    if (!res.ok) throw new Error(`metals.dev responded ${res.status}`);
    const data = await res.json();
    const metals = data.metals as Record<string, number>;

    const rows: PriceRow[] = [];

    if (metals.copper != null) {
      rows.push({
        symbol: "XCU",
        name: "Copper",
        price: metals.copper * TOZ_PER_LB,
        change_pct: 0,
        currency: "USD",
        unit: "lb",
      });
    }

    if (metals.btc != null) {
      rows.push({
        symbol: "BTC",
        name: "Bitcoin",
        price: metals.btc,
        change_pct: 0,
        currency: "USD",
        unit: "coin",
      });
    }

    return rows;
  } catch (err) {
    console.error("[refresh] Failed to fetch metals.dev prices:", err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const goldApiKey = process.env.COMMODITY_API_KEY;
    const metalsDevKey = process.env.METALS_DEV_API_KEY;

    if (!goldApiKey) {
      console.error("[refresh] COMMODITY_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }
    if (!metalsDevKey) {
      console.error("[refresh] METALS_DEV_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const supabase = createSupabaseAdminClient();

    const [metalResults, metalsDevRows, lastBtc] = await Promise.all([
      Promise.all(METALS.map(({ symbol, name, unit }) =>
        fetchMetalPrice(symbol, name, unit, goldApiKey)
      )),
      fetchMetalsDevPrices(metalsDevKey),
      supabase
        .from("commodity_prices")
        .select("price")
        .eq("symbol", "BTC")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // metals.dev returns 0 for change_pct — compute it from yesterday's stored price
    const priceRows: PriceRow[] = [
      ...metalResults.filter((r): r is PriceRow => r !== null),
      ...metalsDevRows.map((r) =>
        r.symbol === "BTC" && lastBtc.data
          ? { ...r, change_pct: ((r.price - lastBtc.data.price) / lastBtc.data.price) * 100 }
          : r
      ),
    ];

    if (priceRows.length === 0) {
      return NextResponse.json({ error: "All price fetches failed" }, { status: 500 });
    }

    const fetched_at = new Date().toISOString();
    const rows = priceRows.map((p) => ({ ...p, fetched_at }));

    const { error } = await supabase.from("commodity_prices").insert(rows);
    if (error) throw error;

    return NextResponse.json({ refreshed: rows.length, at: fetched_at });
  } catch (err) {
    console.error("[/api/commodities/refresh]", err);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
