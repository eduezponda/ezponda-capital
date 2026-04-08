import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const METALS = [
  { symbol: "XAU", name: "Gold",      unit: "oz" },
  { symbol: "XAG", name: "Silver",    unit: "oz" },
  { symbol: "XPT", name: "Platinum",  unit: "oz" },
  { symbol: "XPD", name: "Palladium", unit: "oz" },
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
      METALS.map(({ symbol, name, unit }) => fetchMetalPrice(symbol, name, unit, apiKey))
    );

    const priceRows = results.filter((r): r is PriceRow => r !== null);

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
