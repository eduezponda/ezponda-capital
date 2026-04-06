import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CommodityPrice } from "@/lib/types/database";

export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("commodity_prices")
      .select("*")
      .order("fetched_at", { ascending: false });

    if (error) throw error;

    // Return the latest price per symbol (dedup in JS for portability)
    const seen = new Set<string>();
    const latest: CommodityPrice[] = [];
    for (const row of data ?? []) {
      if (!seen.has(row.symbol)) {
        seen.add(row.symbol);
        latest.push(row as CommodityPrice);
      }
    }

    return NextResponse.json(latest);
  } catch (err) {
    console.error("[/api/commodities/prices]", err);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
