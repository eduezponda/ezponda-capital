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

## Body structure (in order)

1. ## The Thesis in One Paragraph

2. ---

3. ## Why [Asset/Theme], Why Now

4. ---

5. ## Why [Company]

6. ---

7. ## Key Risks — each as **Bold label.** followed by prose

8. ---

9. ## Valuation Framework — GFM table bear/base/bull

10. ---

11. ## Monitoring Checklist — items as **Label:** Description

12. ---

13. ## Bottom Line + italic disclaimer

## Valuation table format

| Scenario | Price | EBITDA | Multiple | Implied Value |
|----------|-------|--------|---------|--------------|
| Bear     | ...   | ...    | ...     | ...          |
| Base     | ...   | ...    | ...     | ...          |
| Bull     | ...   | ...    | ...     | ...          |

*Note: Figures are illustrative estimates, not financial projections.*

## Prose conventions

- No em dashes (—). Use commas, colons, or split into two sentences.

- En dashes in numeric ranges are fine: $4.50–$5.50/lb

- Checklist items: **Label:** Description (colon, not dash)

- Final disclaimer in italic: *This thesis reflects the views of Ezponda Capital as of [Month Year]. It is not financial advice. Do your own research.*
