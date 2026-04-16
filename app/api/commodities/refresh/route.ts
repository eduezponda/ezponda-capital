import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Retention: 7 days (7 rows/symbol). Cleanup handled by DB trigger.
// GoldAPI.io has no rate limits on real-time prices — safe to call daily.
// Vercel Hobby: 1 invocation/day (daily cron limit on Hobby plan).
const METALS = [
  { symbol: "XAU", name: "Gold",      unit: "oz",   currency: "USD" },
  { symbol: "XAG", name: "Silver",    unit: "oz",   currency: "USD" },
  { symbol: "XPT", name: "Platinum",  unit: "oz",   currency: "USD" },
  { symbol: "XPD", name: "Palladium", unit: "oz",   currency: "USD" },
];

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

async function fetchBitcoinPrice(apiKey: string): Promise<PriceRow | null> {
  try {
    const res = await fetch("https://api.api-ninjas.com/v1/bitcoin", {
      headers: { "X-Api-Key": apiKey },
    });
    if (!res.ok) throw new Error(`api-ninjas responded ${res.status} for BTC`);
    const data = await res.json();
    return {
      symbol: "BTC",
      name: "Bitcoin",
      price: data.price,
      change_pct: data["24h_price_change_percent"],
      currency: "USD",
      unit: "coin",
    };
  } catch (err) {
    console.error("[refresh] Failed to fetch BTC:", err);
    return null;
  }
}

async function fetchCopperPrice(apiKey: string): Promise<PriceRow | null> {
  try {
    const res = await fetch(
      "https://api.api-ninjas.com/v1/commodityprice?name=copper",
      { headers: { "X-Api-Key": apiKey } }
    );
    if (!res.ok)
      throw new Error(`api-ninjas responded ${res.status} for copper`);
    const data = await res.json();
    return {
      symbol: "HG",
      name: "Copper",
      price: data.price,
      change_pct: data.change_percent,
      currency: "USD",
      unit: "lb",
    };
  } catch (err) {
    console.error("[refresh] Failed to fetch copper:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = process.env.COMMODITY_API_KEY;
    if (!apiKey) {
      console.error("[refresh] COMMODITY_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const results = await Promise.all(
      METALS.map(({ symbol, name, unit }) =>
        fetchMetalPrice(symbol, name, unit, apiKey)
      )
    );

    const priceRows = results.filter((r): r is PriceRow => r !== null);

    // Fetch api-ninjas commodities (Bitcoin + Copper)
    const ninjasKey = process.env.BTC_COPPER_API_KEY;
    if (ninjasKey) {
      const [btcRow, copperRow] = await Promise.all([
        fetchBitcoinPrice(ninjasKey),
        fetchCopperPrice(ninjasKey),
      ]);
      if (btcRow) priceRows.push(btcRow);
      if (copperRow) priceRows.push(copperRow);
    } else {
      console.error("[refresh] BTC_COPPER_API_KEY is not set — skipping BTC & copper");
    }

    if (priceRows.length === 0) {
      return NextResponse.json({ error: "All price fetches failed" }, { status: 500 });
    }

    const supabase = createSupabaseAdminClient();
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
