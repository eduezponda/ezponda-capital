import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "fs";
import { getAllTheses, getThesisBySlug } from "@/lib/api/theses";

function makeMdx(extra = ""): string {
  return [
    "---",
    "title: Test Thesis",
    "category: Gold",
    'date: "2024-01-01"',
    "summary: A test summary",
    "status: active",
    "coverImage: /test.jpg",
    extra,
    "---",
    "# Content",
  ].join("\n");
}

describe("getAllTheses (real filesystem)", () => {
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

describe("getAllTheses (mocked filesystem)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when content directory does not exist", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(await getAllTheses()).toEqual([]);
  });

  it("ignores files without .mdx extension", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(
      ["thesis.mdx", "readme.txt", "notes.md"] as never
    );
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      makeMdx("slug: test\ntier: free\ntags:\n  - gold\nticker: GLD\nexchange: NYSE")
    );
    expect(await getAllTheses()).toHaveLength(1);
  });

  it("reads files with utf-8 encoding", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx"] as never);
    const readSpy = vi
      .spyOn(fs, "readFileSync")
      .mockReturnValue(
        makeMdx("slug: test\ntier: free\ntags:\n  - gold\nticker: GLD\nexchange: NYSE")
      );
    await getAllTheses();
    expect(readSpy).toHaveBeenCalledWith(expect.any(String), "utf-8");
  });

  it("falls back to filename-derived slug when frontmatter slug is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["my-thesis.mdx"] as never);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx());
    const result = await getAllTheses();
    expect(result[0].slug).toBe("my-thesis");
  });

  it("defaults tier to free when frontmatter tier is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx"] as never);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("slug: test"));
    const result = await getAllTheses();
    expect(result[0].tier).toBe("free");
  });

  it("defaults tags to empty array when frontmatter tags are missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx"] as never);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("slug: test\ntier: free"));
    const result = await getAllTheses();
    expect(result[0].tags).toEqual([]);
  });

  it("defaults ticker to empty string when frontmatter ticker is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx"] as never);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      makeMdx("slug: test\ntier: free\ntags:\n  - gold")
    );
    const result = await getAllTheses();
    expect(result[0].ticker).toBe("");
  });

  it("defaults exchange to empty string when frontmatter exchange is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx"] as never);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      makeMdx("slug: test\ntier: free\ntags:\n  - gold\nticker: GLD")
    );
    const result = await getAllTheses();
    expect(result[0].exchange).toBe("");
  });
});

describe("getThesisBySlug (real filesystem)", () => {
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

describe("getThesisBySlug (mocked filesystem)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when content directory does not exist even if file path resolves", async () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => String(p).endsWith(".mdx"));
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("slug: test\ntier: free"));
    expect(await getThesisBySlug("test")).toBeNull();
  });

  it("reads slug file with utf-8 encoding", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    const readSpy = vi
      .spyOn(fs, "readFileSync")
      .mockReturnValue(
        makeMdx("slug: test\ntier: free\ntags:\n  - gold\nticker: GLD\nexchange: NYSE")
      );
    await getThesisBySlug("test");
    expect(readSpy).toHaveBeenCalledWith(expect.any(String), "utf-8");
  });

  it("falls back to slug parameter when frontmatter slug is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx());
    const result = await getThesisBySlug("my-slug");
    expect(result!.slug).toBe("my-slug");
  });

  it("defaults tier to free when frontmatter tier is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("slug: test"));
    const result = await getThesisBySlug("test");
    expect(result!.tier).toBe("free");
  });

  it("defaults tags to empty array when frontmatter tags are missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("slug: test\ntier: free"));
    const result = await getThesisBySlug("test");
    expect(result!.tags).toEqual([]);
  });

  it("defaults ticker to empty string when frontmatter ticker is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      makeMdx("slug: test\ntier: free\ntags:\n  - gold")
    );
    const result = await getThesisBySlug("test");
    expect(result!.ticker).toBe("");
  });

  it("defaults exchange to empty string when frontmatter exchange is missing", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      makeMdx("slug: test\ntier: free\ntags:\n  - gold\nticker: GLD")
    );
    const result = await getThesisBySlug("test");
    expect(result!.exchange).toBe("");
  });
});
