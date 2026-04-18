import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GET } from "@/app/api/commodities/prices/route";

function makeSupabaseMock(result: { data: unknown; error: unknown }) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue(result),
      }),
    }),
  };
}

const sampleRows = [
  {
    id: 1,
    symbol: "XAU",
    name: "Gold",
    price: 2500.0,
    change_pct: 1.2,
    currency: "USD",
    unit: "oz",
    fetched_at: "2026-04-18T10:00:00Z",
  },
  {
    id: 2,
    symbol: "XAU",
    name: "Gold",
    price: 2480.0,
    change_pct: 0.5,
    currency: "USD",
    unit: "oz",
    fetched_at: "2026-04-17T10:00:00Z",
  },
  {
    id: 3,
    symbol: "XCU",
    name: "Copper",
    price: 4.5,
    change_pct: -0.3,
    currency: "USD",
    unit: "lb",
    fetched_at: "2026-04-18T10:00:00Z",
  },
];

describe("GET /api/commodities/prices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with latest prices array", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: sampleRows, error: null }) as never
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("deduplicates — returns only latest row per symbol", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: sampleRows, error: null }) as never
    );
    const res = await GET();
    const json = await res.json();
    const symbols = json.map((r: { symbol: string }) => r.symbol);
    expect(symbols).toHaveLength(2);
    expect(new Set(symbols).size).toBe(2);
  });

  it("returns first row for each symbol (already ordered desc by fetched_at)", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: sampleRows, error: null }) as never
    );
    const res = await GET();
    const json = await res.json();
    const gold = json.find((r: { symbol: string }) => r.symbol === "XAU");
    expect(gold.price).toBe(2500.0);
  });

  it("returns empty array when no data", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: [], error: null }) as never
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it("returns 500 on DB error", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: null, error: new Error("DB error") }) as never
    );
    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to fetch prices");
  });
});
