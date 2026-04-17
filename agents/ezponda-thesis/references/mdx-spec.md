# MDX Spec — Ezponda Capital Theses

## Frontmatter template

The very first line of the file must be --- with no blank line before it.

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

## Frontmatter rules

- tier: exactly "free" or "premium" with quotes

- status: "active" for the thesis to appear in the gallery

- coverImage and ogImage: paths from /public, without writing public/

- summary: no em dashes

- slug: lowercase, hyphens only, matches the filename

## Body structure

Theses follow a narrative arc, not a rigid template. Section names should fit
the specific company and thesis. The arc is:

1. Opening — one strong paragraph that states the full investment case. Reader
   should understand the thesis after this paragraph alone.

2. Valuation context — explain why current price/multiples are interesting.
   Show the specific number that makes this cheap. Make the math intuitive.

3. Asset or business deep-dive — go through the key assets, operations, or
   divisions that drive the thesis. Use bold labels for each item.

4. Production or growth profile — quantitative section. Use GFM tables.
   Walk through scenarios year by year if the thesis is production-growth driven.

5. Valuation logic — bear/base/bull table. Explain the multiple or method used.
   Focus on meaning, not spreadsheet mechanics.

6. Hidden kickers — dynamics not visible in headline numbers (EV compression,
   FCF acceleration, optionality). Only include if genuinely present.

7. Key assumptions and risks — what has to go right, what can go wrong.
   Bold label for each risk. Be honest about fragile assumptions.

8. Final view — 2-3 sentences. No hedging. State the investment case plainly.

9. Italic disclaimer — always last.

Section names are flexible. Use what fits the thesis. Examples that work:
  "## The Setup", "## Why Current Multiples Are Misleading", "## The Four-Asset Portfolio",
  "## Valuation Logic", "## EV Compression: The Hidden Kicker", "## Final Investment View"

The FCX thesis uses a more formal structure (exact section names). The Mako thesis
uses a more narrative structure. Both are valid — the arc matters, not the names.

## Valuation table format

| Scenario | [Price metric] | [Earnings metric] | Multiple | Implied Value |
|----------|---------------|-------------------|---------|--------------|
| Bear     | ...           | ...               | ...     | ...          |
| Base     | ...           | ...               | ...     | ...          |
| Bull     | ...           | ...               | ...     | ...          |

*Note: Figures are illustrative estimates, not financial projections.*

## Image placeholders

Use `<ImagePlaceholder label="..." />` directly in the MDX body wherever a chart,
map, or visual would improve the narrative. The component renders a visible dark
panel with a gold border and the label text so placeholder positions are clear
in-browser before real images are produced.

Component location: components/ui/ImagePlaceholder.tsx
Already wired into MDXRemote in app/theses/[slug]/page.tsx — no extra setup needed.

Placement guidelines:
- After the opening paragraph if a cover chart helps frame the thesis
- After each major section that introduces quantitative data
- Before the valuation table if a bridge chart adds clarity
- After the FCF or EV section if a trajectory chart is planned

Label format: short, descriptive, colon for sub-labels ("Production Profile: 2026-2028")
No em dashes in labels.

Replace each placeholder later by swapping `<ImagePlaceholder label="..." />` for
`<img src="..." alt="..." />` or a chart component. No other changes needed.

## Prose conventions

- No em dashes (—). Use commas, colons, parentheses, or split into two sentences.

- En dashes in numeric ranges are fine: $4.50–$5.50/lb

- Bold asset labels: **Asset Name (Location)** not **Asset Name — Location**

- Bold section sub-labels: **Label.** followed by prose on the same line

- Checklist items: **Label:** Description (colon, not dash)

- Production year headers: **2026: Title** (colon, not em dash)

- Final disclaimer in italic:
  *This thesis reflects the views of Ezponda Capital as of [Month Year].
  It is not financial advice. Do your own research.*
