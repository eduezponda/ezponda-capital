import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSpotPrices } from "@/lib/api/prices";

function makeSupabaseMock(result: { data: unknown; error: unknown }) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue(result),
      }),
    }),
  };
}

describe("getSpotPrices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array on DB error", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: null, error: new Error("DB error") }) as never
    );
    const result = await getSpotPrices();
    expect(result).toEqual([]);
  });

  it("returns empty array when data is empty", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({ data: [], error: null }) as never
    );
    const result = await getSpotPrices();
    expect(result).toEqual([]);
  });

  it("maps XAU to correct label and direction=up for positive change_pct", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [{ symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 1.5 }],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Gold (XAU/USD)");
    expect(result[0].direction).toBe("up");
    expect(result[0].change).toBe("+1.50%");
  });

  it("maps XCU to correct label and direction=down for negative change_pct", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [{ symbol: "XCU", name: "Copper", price: 4.5, change_pct: -0.3 }],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Copper (XCU/USD)");
    expect(result[0].direction).toBe("down");
    expect(result[0].change).toBe("-0.30%");
  });

  it("direction is neutral when change_pct is zero", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [{ symbol: "XAG", name: "Silver", price: 30.0, change_pct: 0 }],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result[0].direction).toBe("neutral");
  });

  it("respects DISPLAY_ORDER — XAU before XCU", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [
          { symbol: "XCU", name: "Copper", price: 4.5, change_pct: 0 },
          { symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 0 },
        ],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Gold (XAU/USD)");
    expect(result[1].label).toBe("Copper (XCU/USD)");
  });

  it("deduplicates repeated symbol entries (keeps first seen)", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [
          { symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 1.0 },
          { symbol: "XAU", name: "Gold", price: 2400.0, change_pct: 0.5 },
        ],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result).toHaveLength(1);
    expect(result[0].value).toContain("2,500.00");
  });

  it("formats price value with dollar sign and 2 decimals", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [{ symbol: "BTC", name: "Bitcoin", price: 67000.0, change_pct: 2.0 }],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result[0].value).toBe("$67,000.00");
  });

  it("uses symbol name fallback for unknown symbols", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock({
        data: [{ symbol: "XAU", name: "Gold", price: 1.0, change_pct: 0 }],
        error: null,
      }) as never
    );
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Gold (XAU/USD)");
  });
});
