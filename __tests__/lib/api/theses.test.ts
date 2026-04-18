import { describe, it, expect } from "vitest";
import { getAllTheses, getThesisBySlug } from "@/lib/api/theses";

describe("getAllTheses", () => {
  it("returns theses when no category filter", async () => {
    const theses = await getAllTheses();
    expect(theses.length).toBeGreaterThan(0);
  });

  it("each thesis has required fields", async () => {
    const theses = await getAllTheses();
    for (const t of theses) {
      expect(t).toHaveProperty("slug");
      expect(t).toHaveProperty("title");
      expect(t).toHaveProperty("tier");
      expect(t).toHaveProperty("category");
      expect(t).toHaveProperty("date");
      expect(t).toHaveProperty("excerpt");
      expect(t).toHaveProperty("tags");
      expect(["free", "premium"]).toContain(t.tier);
    }
  });

  it("sorts by date descending (newest first)", async () => {
    const theses = await getAllTheses();
    if (theses.length >= 2) {
      const dates = theses.map((t) => new Date(t.date).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    }
  });

  it("filters by category (case-insensitive)", async () => {
    const copper = await getAllTheses("Copper");
    expect(copper.length).toBeGreaterThan(0);
    copper.forEach((t) => expect(t.category).toBe("Copper"));
  });

  it("returns all theses for 'all' filter", async () => {
    const all = await getAllTheses("all");
    const unfiltered = await getAllTheses();
    expect(all.length).toBe(unfiltered.length);
  });

  it("returns empty array for non-existent category", async () => {
    const result = await getAllTheses("NonExistent");
    expect(result).toEqual([]);
  });
});

describe("getThesisBySlug", () => {
  it("returns thesis for a valid slug", async () => {
    const thesis = await getThesisBySlug("freeport-mcmoran-copper");
    expect(thesis).not.toBeNull();
    expect(thesis!.slug).toBe("freeport-mcmoran-copper");
    expect(thesis!.title).toBeTruthy();
    expect(thesis!.source).toBeTruthy();
  });

  it("returned thesis has all required fields", async () => {
    const thesis = await getThesisBySlug("freeport-mcmoran-copper");
    expect(thesis).not.toBeNull();
    expect(thesis!.category).toMatch(/Gold|Copper|Macro|Real Assets/);
    expect(thesis!.ticker).toBeTruthy();
    expect(thesis!.exchange).toBeTruthy();
    expect(thesis!.tags).toBeInstanceOf(Array);
  });

  it("returns null for non-existent slug", async () => {
    const thesis = await getThesisBySlug("this-slug-does-not-exist");
    expect(thesis).toBeNull();
  });
});
