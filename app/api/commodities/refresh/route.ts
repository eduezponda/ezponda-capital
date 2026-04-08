import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MOCK_PRICES = [
  { symbol: "XAU", name: "Gold",         price: 3082.40, change_pct:  1.2, currency: "USD", unit: "oz"    },
  { symbol: "HG",  name: "Copper",       price:    4.38, change_pct:  0.8, currency: "USD", unit: "lb"    },
  { symbol: "XAG", name: "Silver",       price:   33.15, change_pct: -0.3, currency: "USD", unit: "oz"    },
  { symbol: "BZ",  name: "Brent",        price:   84.60, change_pct:  0.5, currency: "USD", unit: "bbl"   },
  { symbol: "WTI", name: "WTI Crude",    price:   80.22, change_pct:  0.4, currency: "USD", unit: "bbl"   },
  { symbol: "PL",  name: "Platinum",     price:  968.00, change_pct: -0.6, currency: "USD", unit: "oz"    },
  { symbol: "PA",  name: "Palladium",    price:  962.00, change_pct:  0.2, currency: "USD", unit: "oz"    },
  { symbol: "DXY", name: "Dollar Index", price:  103.50, change_pct:  0.3, currency: "USD", unit: "index" },
];

type PriceRow = {
  symbol: string;
  name: string;
  price: number;
  change_pct: number;
  currency: string;
  unit: string;
};

type CommodityConfig = {
  symbol: string;
  name: string;
  currency: string;
  unit: string;
  priceTicker: string;
  prevTicker: string;
  isForex: boolean;
};

const COMMODITY_CONFIG: CommodityConfig[] = [
  { symbol: "XAU", name: "Gold",         currency: "USD", unit: "oz",    priceTicker: "XAU/USD", prevTicker: "C:XAUUSD", isForex: true  },
  { symbol: "XAG", name: "Silver",       currency: "USD", unit: "oz",    priceTicker: "XAG/USD", prevTicker: "C:XAGUSD", isForex: true  },
  { symbol: "HG",  name: "Copper",       currency: "USD", unit: "lb",    priceTicker: "HG",      prevTicker: "HG",       isForex: false },
  { symbol: "BZ",  name: "Brent",        currency: "USD", unit: "bbl",   priceTicker: "BZ",      prevTicker: "BZ",       isForex: false },
  { symbol: "WTI", name: "WTI Crude",    currency: "USD", unit: "bbl",   priceTicker: "CL",      prevTicker: "CL",       isForex: false },
  { symbol: "PL",  name: "Platinum",     currency: "USD", unit: "oz",    priceTicker: "PL",      prevTicker: "PL",       isForex: false },
  { symbol: "PA",  name: "Palladium",    currency: "USD", unit: "oz",    priceTicker: "PA",      prevTicker: "PA",       isForex: false },
  { symbol: "DXY", name: "Dollar Index", currency: "USD", unit: "index", priceTicker: "DXY",     prevTicker: "DXY",      isForex: false },
];

async function fetchPolygonPrice(cfg: CommodityConfig, apiKey: string): Promise<PriceRow | null> {
  try {
    const base = "https://api.polygon.io";

    const priceUrl = cfg.isForex
      ? `${base}/v1/last_quote/currencies/${cfg.priceTicker}?apiKey=${apiKey}`
      : `${base}/v2/last/trade/${cfg.priceTicker}?apiKey=${apiKey}`;

    const priceRes = await fetch(priceUrl);
    if (!priceRes.ok) throw new Error(`Price fetch failed: ${priceRes.status}`);
    const priceData = await priceRes.json();
    const price: number = cfg.isForex ? priceData.last.ask : priceData.results.p;

    const prevRes = await fetch(`${base}/v2/aggs/ticker/${cfg.prevTicker}/prev?apiKey=${apiKey}`);
    if (!prevRes.ok) throw new Error(`Prev aggs fetch failed: ${prevRes.status}`);
    const prevData = await prevRes.json();
    const prev = prevData.results?.[0];
    const change_pct = prev ? ((prev.c - prev.o) / prev.o) * 100 : 0;

    return { symbol: cfg.symbol, name: cfg.name, price, change_pct, currency: cfg.currency, unit: cfg.unit };
  } catch (err) {
    console.error(`[refresh] Failed to fetch ${cfg.symbol}:`, err);
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
    const supabase = createSupabaseAdminClient();
    const fetched_at = new Date().toISOString();

    const apiKey = process.env.COMMODITY_API_KEY;

    let priceRows: PriceRow[];

    if (!apiKey) {
      console.warn("[refresh] COMMODITY_API_KEY not set — using mock prices");
      priceRows = MOCK_PRICES;
    } else {
      const results = await Promise.all(
        COMMODITY_CONFIG.map((cfg) => fetchPolygonPrice(cfg, apiKey))
      );
      priceRows = results.filter((r): r is PriceRow => r !== null);

      if (priceRows.length === 0) {
        return NextResponse.json({ error: "All price fetches failed" }, { status: 500 });
      }
    }

    const rows = priceRows.map((p) => ({ ...p, fetched_at }));

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
