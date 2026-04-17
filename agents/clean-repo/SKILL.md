---
name: clean-repo
description: Use this skill when the user says "clean the repo", "limpiar el repo", "simplify", "code review", or "review the code". Runs a three-agent parallel review (reuse, quality, efficiency) on all changes vs main, then fixes every confirmed issue in place. Does NOT add new features or change visual design.
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Agent
---

# Clean Repo — Ezponda Capital

Invoke the built-in simplify skill, which:

1. Gets the full `git diff main...HEAD`
2. Launches three review agents in parallel:
   - **Reuse** — duplicate logic, missing utility usage, copy-paste
   - **Quality** — redundant state, dead props, unnecessary nesting, inline styles, what-comments
   - **Efficiency** — mutation aliasing, missed concurrency, hot-path bloat, N+1 patterns
3. Aggregates findings and fixes every confirmed issue directly

## Project-specific rules to enforce

These patterns are confirmed issues in this codebase — always flag them:

- **Inline `style={}` instead of Tailwind classes** — all styling must use Tailwind or design tokens. Exception: `fontVariationSettings` on Material Symbols icons (unavoidable CSS property).
- **Unused props with `_` prefix** — if a prop is destructured as `_name`, remove it from the interface and destructuring entirely.
- **`z-10` with no absolute sibling** — dead stacking context; remove it.
- **Object mutation after `Promise.all`** — use `.map()` with spread instead of mutating array elements in place.
- **What-comments** — delete comments that restate what the code does. Keep only comments explaining WHY (API quirk, business rule, hidden constraint).
- **`formatPrice()` / `formatPct()`** — these utilities exist in `lib/utils.ts`. Never hand-roll price or percentage formatting inline.
- **Duplicate icon badge spans** — if two spans share the same className structure but differ only in icon name and color, unify them into one conditional block.

## What NOT to do

- Do not redesign or restructure components beyond what the review flags
- Do not add new abstractions or shared utilities unless duplication is confirmed across 3+ call sites
- Do not run `npm run build` — use `npx tsc --noEmit` to validate
- Do not commit — leave that to Eduardo

## Validation

After all fixes, run:

```
npx tsc --noEmit
```

Report: what was fixed (file + issue), what was skipped (false positive or not worth it), and tsc result.
