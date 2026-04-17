---
name: ezponda-thesis
description: Use this skill when adding a new investment thesis to Ezponda Capital. Triggers on: "add a new thesis", "nueva tesis", "add [ticker] thesis", "publish thesis for [company]". Covers the full workflow: MDX file creation, image placeholder placement, image creation, validation, and git commit. Does NOT modify system files (lib/, app/theses/, components/, globals.css, tailwind.config.ts, CLAUDE.md).
allowed-tools: Bash, Edit, Write, Read
---

# Add New Investment Thesis

## Inputs needed

If not provided, ask for:

- Company name, ticker, exchange, category (Gold | Copper | Macro | Real Assets)

- Tier: "free" or "premium" — default "free"

- Summary (1–2 sentences, no em dashes)

- Tags (3–6 lowercase strings)

- Full thesis body (raw notes, structured draft, or complete write-up)

- Cover image: SVG inline OR visual description (if none, use the parchment template)

## Pending tasks

- **Thesis card logos:** Cards currently show no image. Eduardo will provide a logo per thesis in
  the future. When received, add `logo` field to ThesisFrontmatter and ThesisMeta in lib/api/theses.ts,
  render it in ThesisCard (small, top area of card, not as background). Do NOT use coverImage as a
  card background — it is for the thesis detail header only.

## Steps

### 1 — Derive slug

Lowercase company name, spaces to hyphens, no special characters.

Example: "Barrick Gold" → barrick-gold

### 2 — Create MDX file

Read references/mdx-spec.md for frontmatter rules, body structure, prose conventions,
and ImagePlaceholder usage.

Create content/theses/<slug>.mdx following that spec.

Key reminders:
- No em dashes anywhere in the file (prose, labels, ImagePlaceholder labels, headings)
- Asset labels: **Name (Location)** not **Name — Location**
- Year headers: **2026: Title** not **2026 — Title**
- Place <ImagePlaceholder label="..." /> wherever a chart will eventually go

### 3 — Create image files

Read references/image-templates.md for the parchment SVG template.

Write both files to public/images/theses/ using the slug as the prefix:

- <slug>_cover_image.svg
- <slug>_og_thumbnail.svg

Substitute into the template: [CATEGORY], [EXCHANGE], [TICKER], [TITLE],
[SUBTITLE], [SUMMARY LINE], [MONTH YEAR].

### 4 — Validate

npx tsc --noEmit && npm run lint

Fix errors. Do NOT run npm run build.

### 5 — Commit

git add content/theses/<slug>.mdx public/images/theses/<slug>_cover_image.svg public/images/theses/<slug>_og_thumbnail.svg

git commit -m "feat: add thesis — [TICKER] [Company Name]"

git push
