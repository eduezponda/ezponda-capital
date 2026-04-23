import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSpotPrices } from "@/lib/api/prices";

function makeSupabaseMock(result: { data: unknown; error: unknown }) {
  const orderMock = vi.fn().mockResolvedValue(result);
  const selectMock = vi.fn().mockReturnValue({ order: orderMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });
  return { client: { from: fromMock }, fromMock, selectMock, orderMock };
}

describe("getSpotPrices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries commodity_prices with correct fields and descending order", async () => {
    const { client, fromMock, selectMock, orderMock } = makeSupabaseMock({
      data: [],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    await getSpotPrices();
    expect(fromMock).toHaveBeenCalledWith("commodity_prices");
    expect(selectMock).toHaveBeenCalledWith("symbol, name, price, change_pct");
    expect(orderMock).toHaveBeenCalledWith("fetched_at", { ascending: false });
  });

  it("returns empty array on DB error when data is also present", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 1.0 }],
      error: new Error("DB error"),
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    expect(await getSpotPrices()).toEqual([]);
  });

  it("returns empty array on DB error", async () => {
    const { client } = makeSupabaseMock({ data: null, error: new Error("DB error") });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    expect(await getSpotPrices()).toEqual([]);
  });

  it("returns empty array when data is empty", async () => {
    const { client } = makeSupabaseMock({ data: [], error: null });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    expect(await getSpotPrices()).toEqual([]);
  });

  it("returns empty array when data is null without error and does not log", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { client } = makeSupabaseMock({ data: null, error: null });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    expect(await getSpotPrices()).toEqual([]);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("logs error with [getSpotPrices] prefix when Supabase throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("fail");
    const { client } = makeSupabaseMock({ data: null, error: err });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    await getSpotPrices();
    expect(consoleSpy).toHaveBeenCalledWith("[getSpotPrices]", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("maps XAU to correct label and direction=up for positive change_pct", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 1.5 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Gold (XAU/USD)");
    expect(result[0].direction).toBe("up");
    expect(result[0].change).toBe("+1.50%");
  });

  it("maps XCU to correct label and direction=down for negative change_pct", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XCU", name: "Copper", price: 4.5, change_pct: -0.3 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Copper (XCU/USD)");
    expect(result[0].direction).toBe("down");
    expect(result[0].change).toBe("-0.30%");
  });

  it("maps XAG to Silver label, direction=neutral and change=+0.00% for zero change_pct", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XAG", name: "Silver", price: 30.0, change_pct: 0 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Silver (XAG/USD)");
    expect(result[0].direction).toBe("neutral");
    expect(result[0].change).toBe("+0.00%");
  });

  it("maps BTC to Bitcoin label and formats price with dollar sign", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "BTC", name: "Bitcoin", price: 67000.0, change_pct: 2.0 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Bitcoin (BTC/USD)");
    expect(result[0].value).toBe("$67,000.00");
  });

  it("maps XPT to Platinum label", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XPT", name: "Platinum", price: 1000.0, change_pct: 0.5 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Platinum");
  });

  it("maps XPD to Palladium label", async () => {
    const { client } = makeSupabaseMock({
      data: [{ symbol: "XPD", name: "Palladium", price: 2000.0, change_pct: -1.0 }],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Palladium");
  });

  it("respects DISPLAY_ORDER — XAU before XCU", async () => {
    const { client } = makeSupabaseMock({
      data: [
        { symbol: "XCU", name: "Copper", price: 4.5, change_pct: 0 },
        { symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 0 },
      ],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Gold (XAU/USD)");
    expect(result[1].label).toBe("Copper (XCU/USD)");
  });

  it("respects DISPLAY_ORDER — XPT before XPD", async () => {
    const { client } = makeSupabaseMock({
      data: [
        { symbol: "XPD", name: "Palladium", price: 2000.0, change_pct: 0 },
        { symbol: "XPT", name: "Platinum", price: 1000.0, change_pct: 0 },
      ],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result[0].label).toBe("Platinum");
    expect(result[1].label).toBe("Palladium");
  });

  it("deduplicates repeated symbol entries (keeps first seen)", async () => {
    const { client } = makeSupabaseMock({
      data: [
        { symbol: "XAU", name: "Gold", price: 2500.0, change_pct: 1.0 },
        { symbol: "XAU", name: "Gold", price: 2400.0, change_pct: 0.5 },
      ],
      error: null,
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    const result = await getSpotPrices();
    expect(result).toHaveLength(1);
    expect(result[0].value).toContain("2,500.00");
  });
});
