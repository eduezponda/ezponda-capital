import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Stub prices — replace with real commodity API call once COMMODITY_API_KEY is configured
const MOCK_PRICES = [
  { symbol: "XAU", name: "Gold",     price: 3082.40, change_pct: 1.2,  currency: "USD", unit: "oz" },
  { symbol: "HG",  name: "Copper",   price: 4.38,    change_pct: 0.8,  currency: "USD", unit: "lb" },
  { symbol: "XAG", name: "Silver",   price: 33.15,   change_pct: -0.3, currency: "USD", unit: "oz" },
  { symbol: "BZ",  name: "Brent",    price: 84.60,   change_pct: 0.5,  currency: "USD", unit: "bbl" },
  { symbol: "WTI", name: "WTI Crude",price: 80.22,   change_pct: 0.4,  currency: "USD", unit: "bbl" },
  { symbol: "PL",  name: "Platinum", price: 968.00,  change_pct: -0.6, currency: "USD", unit: "oz" },
  { symbol: "PA",  name: "Palladium",price: 962.00,  change_pct: 0.2,  currency: "USD", unit: "oz" },
  { symbol: "DXY", name: "Dollar Index", price: 103.50, change_pct: 0.3, currency: "USD", unit: "index" },
];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const fetched_at = new Date().toISOString();

    const rows = MOCK_PRICES.map((p) => ({ ...p, fetched_at }));

    const { error } = await supabase
      .from("commodity_prices")
      .insert(rows);

    if (error) throw error;

    return NextResponse.json({ refreshed: rows.length, at: fetched_at });
  } catch (err) {
    console.error("[/api/commodities/refresh]", err);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
