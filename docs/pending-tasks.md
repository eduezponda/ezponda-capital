## Mutation Testing

**What it is:** A technique to evaluate test suite quality. Instead of asking "do the tests pass?", mutation testing asks "would the tests catch a bug if there was one?".

**How it works:**
- A tool automatically introduces small code changes called *mutants* (e.g. `>` → `>=`, `+` → `-`, `return x` → `return None`)
- The test suite is run against each mutant
- If tests fail → mutant is killed ✅ (tests are effective)
- If tests pass → mutant survives ❌ (there is a coverage gap)
- Goal: maximize the **mutation score** = `killed / total`

**Why it matters for AI-generated tests:** When tests are written after the code already exists (which is what Claude Code does by default), they tend to validate current behavior rather than verify correctness. Mutation testing provides an objective feedback loop to detect those gaps.

**Correct workflow:**
1. Write or generate the code
2. Generate an initial test suite
3. Collect surviving mutants using specific tool for language (for example mumut in python)
4. For each surviving mutant, prompt Claude Code: *"This mutant survived: `>` was changed to `>=` on line X. Write a test that kills it."*
5. Re-run `mutmut` → check new mutation score
6. Repeat until score is above 80–90%
