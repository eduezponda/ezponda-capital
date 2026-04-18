import { describe, it, expect } from "vitest";
import { cn, formatPrice, formatPct, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null)).toBe("foo");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500"
    );
  });
});

describe("formatPrice", () => {
  it("formats USD price with two decimal places", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
  });

  it("formats whole number with .00", () => {
    expect(formatPrice(100)).toBe("$100.00");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("formats large number with comma separators", () => {
    expect(formatPrice(2500000)).toBe("$2,500,000.00");
  });

  it("respects custom currency", () => {
    const result = formatPrice(99.9, "EUR");
    expect(result).toContain("99.90");
  });
});

describe("formatPct", () => {
  it("adds + sign for positive values", () => {
    expect(formatPct(1.5)).toBe("+1.50%");
  });

  it("no + sign for negative values", () => {
    expect(formatPct(-0.5)).toBe("-0.50%");
  });

  it("adds + sign for zero", () => {
    expect(formatPct(0)).toBe("+0.00%");
  });

  it("formats to two decimal places", () => {
    expect(formatPct(3.14159)).toBe("+3.14%");
  });

  it("handles large negative", () => {
    expect(formatPct(-100)).toBe("-100.00%");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to long format", () => {
    expect(formatDate("2026-04-18")).toBe("April 18, 2026");
  });

  it("formats another date correctly", () => {
    expect(formatDate("2024-01-15")).toBe("January 15, 2024");
  });

  it("includes year, month name, and day", () => {
    const result = formatDate("2025-12-31");
    expect(result).toContain("2025");
    expect(result).toContain("December");
    expect(result).toContain("31");
  });
});
