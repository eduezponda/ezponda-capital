---
name: ezponda-thesis
description: Use this skill when adding a new investment thesis to Ezponda Capital. Triggers on: "add a new thesis", "nueva tesis", "add [ticker] thesis", "publish thesis for [company]". Covers the full workflow: MDX file creation, image placement, validation, and git commit. Does NOT modify system files (lib/, app/theses/, components/, globals.css, tailwind.config.ts, CLAUDE.md).
allowed-tools: Bash, Edit, Write, Read
---

# Add New Investment Thesis

## Inputs needed

If not provided, ask for:

- Company name, ticker, exchange, category (Gold | Copper | Macro | Real Assets)

- Tier: "free" or "premium" — default "free"

- Summary (1–2 sentences, no em dashes)

- Tags (3–6 lowercase strings)

- Full thesis body

- Cover image: SVG inline OR visual description

## Steps

### 1 — Derive slug

Lowercase company name, spaces to hyphens, no special characters.

Example: "Barrick Gold" → barrick-gold

### 2 — Create MDX file

Read references/mdx-spec.md for frontmatter rules, body structure, and prose conventions.

Create content/theses/<slug>.mdx following that spec exactly.

### 3 — Create image files

Read references/image-templates.md for SVG templates.

Write both files to public/images/theses/:

- <slug>_cover_image.svg

- <slug>_og_thumbnail.svg

### 4 — Validate

npx tsc --noEmit && npm run lint

Fix errors. Do NOT run npm run build.

### 5 — Commit

git add -A

git commit -m "feat: add thesis — [TICKER] [Company Name]"

git push
