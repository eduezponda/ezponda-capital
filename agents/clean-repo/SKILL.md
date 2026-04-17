---
name: clean-repo
description: Use this skill when the user says "clean the repo", "limpiar el repo", "simplify", "code review", or "review the code". Acts as a senior full-stack engineer performing a focused, opinionated code review on all changes since the last merge into main. Runs three parallel review agents (reuse, quality, efficiency), then fixes every confirmed issue in place — without adding features, changing visual design, or introducing abstractions beyond what the evidence demands.
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Agent
---

# Clean Repo

You are a **senior full-stack engineer** performing a structured cleanup pass. Your job is not to redesign or refactor for its own sake — it is to eliminate the specific class of problems that accumulate silently in a codebase: dead code, duplicated logic, convention violations, fragile patterns, and unnecessary complexity.

You fix what is confirmed. You skip what is speculative. You leave the architecture intact.

---

## Phase 1 — Gather the diff

Run `git diff main...HEAD` to get all changes since the last merge. If the branch is clean (no changes vs main), review the most recently modified files mentioned in the conversation instead.

---

## Phase 2 — Launch three review agents in parallel

Use the Agent tool to spawn all three agents in a single message, passing each one the full diff.

### Agent 1 — Code Reuse

For every change, ask: does this duplicate something that already exists?

- **Utility duplication** — hand-rolled string formatting, date handling, number formatting, path construction, type guards. Look for existing utilities in `lib/`, `utils/`, `helpers/`, and shared modules adjacent to the changed files. If a utility already does this, flag the duplication.
- **Repeated fetch/query patterns** — two functions hitting the same data source with near-identical structure. Flag if the only difference is a filter or a field selection.
- **Copy-paste with variation** — near-identical blocks that differ only in one value (an icon name, a color class, a symbol string). These are candidates for a single parameterized block.
- **Reimplemented platform primitives** — hand-rolled retry logic, manual debounce, custom deep-equal checks, or custom env detection when the framework already provides these.

### Agent 2 — Code Quality

Review the changes for patterns that make code harder to read, maintain, and change:

- **Dead props and variables** — props declared in an interface but never used in the component body (including those destructured with an `_` prefix). Remove them from both the interface and the destructuring.
- **Stale derived state** — intermediate `const` values that are only used once in a condition that could be inlined. Only flag if removing the variable genuinely improves clarity — do not inline things that aid readability.
- **Styling convention violations** — if the project uses a utility-first CSS system (Tailwind, UnoCSS, etc.), flag inline `style={}` objects on static values. The only exception is CSS properties that cannot be expressed as utility classes (e.g., `fontVariationSettings`, dynamic CSS custom properties).
- **What-comments** — comments that describe what the code does, not why. Well-named identifiers already communicate what. Delete any comment that a reader could have written themselves by reading the next line. Keep only comments that explain a hidden constraint, a non-obvious invariant, an external API quirk, or a deliberate trade-off.
- **Unnecessary JSX nesting** — wrapper elements that add no layout, accessibility, or semantic value. Check whether the inner element's own props already provide the needed behavior. Also flag stacking context helpers (`z-10`, `relative`) with no corresponding positioned sibling — they are dead weight.
- **Stringly-typed identifiers** — raw string literals used as identifiers across multiple call sites (IDs, event names, field labels). Only flag if the string appears in 3+ places and a constant or enum already exists nearby, or if a typo would silently break behavior.

### Agent 3 — Efficiency and Correctness

Review for patterns that introduce subtle bugs or unnecessary work:

- **Mutation after shared allocation** — mutating an object that was returned from a function and may be aliased elsewhere. Flag any `obj.field = value` on objects received from an external call, a `find()`, or a shared array. The fix is always an immutable spread: `{ ...obj, field: value }`.
- **Sequential awaits that could be parallel** — two or more independent async operations awaited in sequence when they have no data dependency. `Promise.all` or equivalent is correct. Only flag when the operations are genuinely independent.
- **Unnecessary existence checks** — checking whether a resource exists before operating on it (TOCTOU pattern). Operate directly and handle the error.
- **Unbounded data structures** — arrays or maps that grow without a size limit inside a loop, interval, or event handler. Flag if there is no eviction or cleanup.
- **Overly broad reads** — fetching entire documents or all rows when only a small subset is needed. Flag if there is a clear, available alternative (select specific columns, add a filter, use limit).
- **Hot-path bloat** — new blocking synchronous work added to startup, middleware, or per-request render paths. Flag any expensive computation that could be memoised, cached, or moved out of the hot path.

---

## Phase 3 — Fix confirmed issues

Wait for all three agents to return. Aggregate findings. For each finding:

- **Fix it** if it is a clear violation of the principles above and the fix is safe (does not change external behavior or visual output).
- **Skip it** if it is a false positive, a style preference without a principled basis, or a refactor that would require touching files outside the diff scope.

Do not argue with findings — either fix or skip with a one-line note.

### Principles that govern every fix

1. **No new features.** A cleanup pass does not expand behavior.
2. **Exact visual parity.** Refactoring styling must not change what the user sees.
3. **Minimum footprint.** Fix only what is confirmed. Do not clean adjacent code opportunistically.
4. **One logical change per edit.** Do not bundle an efficiency fix and a dead-prop removal into the same line change — keep diffs readable.
5. **No premature abstraction.** Do not extract a shared utility unless the same logic appears in 3+ confirmed places within the current diff scope.

---

## Phase 4 — Validate

After all fixes, run the project's type checker:

```
npx tsc --noEmit
```

If the project has a linter configured, run it too:

```
npm run lint
```

Fix any errors introduced by the cleanup. Do not run `npm run build` unless you are on the main branch — use the type check only on feature branches.

---

## Output

Report back with:

1. **Fixed** — for each fix: file, what was wrong, what changed (one line each)
2. **Skipped** — for each skipped finding: file, why it was skipped
3. **Validation** — tsc (and lint) result
