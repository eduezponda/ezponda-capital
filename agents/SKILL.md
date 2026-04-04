---
name: ezponda-thesis
description: Use this skill when adding a new investment thesis to Ezponda Capital. Triggers when the user says things like "add a new thesis", "nueva tesis", "add [ticker] thesis", or provides thesis content to publish. Covers the full workflow: creating the MDX file, validating frontmatter, placing images, and committing. Does NOT modify any system files (lib/api/theses.ts, app/theses/page.tsx, app/theses/[slug]/page.tsx) — those are already wired and must not be touched.
allowed-tools: bash, edit, write
---

# Ezponda Capital — Add New Thesis

## What this skill does
Adds a new investment thesis to the platform. The MDX system is already installed and running. This skill only creates new content files.

## Inputs needed before starting
Ask the user for these if not already provided:
- Company name and full thesis title
- Ticker and exchange (e.g. GOLD, NYSE)
- Category: Gold | Copper | Macro | Real Assets
- Tier: "free" or "premium" (default: "free" unless told otherwise)
- Summary: 1–2 sentences, no em dashes
- Tags: 3–6 lowercase strings
- Full thesis body content (sections, risks, valuation table, monitoring checklist)
- Cover image: SVG content pasted inline, OR a visual description to generate one

## Step 1 — Derive the slug

slug = company name lowercased, spaces replaced with hyphens, no special characters
Example: "Barrick Gold" → barrick-gold

## Step 2 — Create the MDX file

Create content/theses/<slug>.mdx

Critical rules:
- The very first line must be --- with no blank line before it
- tier must be exactly "free" or "premium" with quotes
- status must be "active"
- coverImage path: "/images/theses/<slug>_cover_image.svg"
- ogImage path: "/images/theses/<slug>_og_thumbnail.svg"
- No em dashes (—) anywhere in the file. Use commas, colons, or split into two sentences instead
- En dashes in numeric ranges are fine: $4.50–$5.50/lb

Frontmatter template:
---
title: ""
slug: ""
date: "YYYY-MM-DD"
category: ""
ticker: ""
exchange: ""
tier: "free"
status: "active"
summary: ""
coverImage: "/images/theses/<slug>_cover_image.svg"
ogImage: "/images/theses/<slug>_og_thumbnail.svg"
tags: []
---

Body structure (follow this order):
1. ## The Thesis in One Paragraph — executive summary in prose
2. ---
3. ## Why [Asset/Theme], Why Now — demand case and catalysts
4. ---
5. ## Why [Company] — specific asset advantages
6. ---
7. ## Key Risks — each risk in **Bold label.** followed by prose
8. ---
9. ## Valuation Framework — scenario table bear/base/bull in GFM markdown
10. ---
11. ## Monitoring Checklist — items as **Label:** Description (colon, not dash)
12. ---
13. ## Bottom Line — closing paragraph + italic disclaimer

Table format (GFM, renders automatically):
| Scenario | Price | EBITDA | Multiple | Implied Value |
|----------|-------|--------|---------|--------------|
| Bear     | ...   | ...    | ...     | ...          |
| Base     | ...   | ...    | ...     | ...          |
| Bull     | ...   | ...    | ...     | ...          |

*Note: Figures are illustrative estimates, not financial projections.*

Disclaimer (last line, italic):
*This thesis reflects the views of Ezponda Capital as of [Month Year]. It is not financial advice. Do your own research.*

## Step 3 — Create image files

Run: ls public/images/theses/

Both files must exist:
- public/images/theses/<slug>_cover_image.svg
- public/images/theses/<slug>_og_thumbnail.svg

If the user provided SVG content: write it directly to those paths.

If the user provided a visual description: generate an SVG following the FCX light style:
- Background: warm parchment #f5e6c8
- Left accent bar: #b87333 (6px wide)
- Right side: concentric circles in copper tones
- Typography: Georgia serif, dark brown text #1a0e04
- Fields to include: category pill (top), ticker (monospace), title (large), subtitle, divider line, summary line, bottom bar with "INVESTMENT THESIS · [Month Year]" and "EZPONDA CAPITAL"
- Dimensions: viewBox="0 0 1200 630"

If neither is provided: ask the user before proceeding.

## Step 4 — Validate

Run:
npx tsc --noEmit && npm run lint

Fix any errors before committing. Do NOT run npm run build.

## Step 5 — Commit

git add -A
git commit -m "feat: add thesis — [TICKER] [Company Name]"
git push

## What NOT to touch
- lib/api/theses.ts
- app/theses/page.tsx
- app/theses/[slug]/page.tsx
- app/globals.css
- tailwind.config.ts
- Any component under components/
- CLAUDE.md

The gallery and thesis pages pick up new MDX files automatically. No wiring needed.
