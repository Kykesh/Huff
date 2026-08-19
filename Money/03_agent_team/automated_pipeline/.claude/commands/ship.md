# /ship — The Orchestrator

Run the full feature pipeline for: $ARGUMENTS

## Execution rules

Execute these stages IN ORDER. Do not skip ahead. After each stage, confirm the handoff file exists before starting the next.

If any stage fails or returns an unexpected output, STOP and surface the issue to the human. Do not improvise.

## Stage 1 — Planner

Delegate to the `planner` subagent with the feature request above.

Wait for `.pipeline/spec.md` to exist.

After completion:
- If `.pipeline/spec.md` contains an "OPEN QUESTIONS" section with any questions, STOP. Show the questions to the human. Do NOT proceed.
- Otherwise, continue to Stage 2.

## Stage 2 — Coder

Delegate to the `coder` subagent.

Wait for `.pipeline/changes.md` to exist.

After completion:
- Confirm files were actually modified (run `git status`).
- If `.pipeline/changes.md` mentions any unresolved flags or "Anything I'm flagging back to the human", surface those.
- Continue to Stage 3.

## Stage 3 — Tester

Delegate to the `tester` subagent.

Wait for `.pipeline/test-results.md` to exist.

After completion:
- Read the first line of `.pipeline/test-results.md`.
- If it says "Status: FAIL", STOP. Show the human the failures. Do NOT proceed to review.
- If it says "Status: PASS", continue to Stage 4.

## Stage 4 — Reviewer

Delegate to the `reviewer` subagent.

Wait for `.pipeline/review.md` to exist.

After completion:
- Read the VERDICT line.
- Report the verdict to the human, along with a 1-paragraph summary.

## Final report

Output to the human:

```
PIPELINE COMPLETE
─────────────────
Feature: [from $ARGUMENTS]
Branch:  [current git branch]
Verdict: SHIP / NEEDS WORK / BLOCK

Files changed:
- [list from changes.md]

Tests added: [number]
Tests passing: [number]

Issues to address:
- [from review.md, if any]

Files for your review:
- .pipeline/spec.md          ← what was planned
- .pipeline/changes.md       ← what was built
- .pipeline/test-results.md  ← how it was verified
- .pipeline/review.md        ← what the senior reviewer said

I have NOT merged anything. The branch is ready for your morning review.
```

## Hard rules

1. **NEVER skip a stage.** If Stage 2 didn't create `changes.md`, do NOT start Stage 3 anyway.
2. **NEVER auto-merge.** The pipeline produces a verdict, not a commit. Human approves merges.
3. **NEVER paper over failures.** If the Tester says FAIL, you STOP. You don't "fix it up" between stages.
4. **NEVER guess what an open question means.** If the Planner returned open questions, you STOP and ask the human.

## When to use a different command

- Single-line tweaks → don't use `/ship`. Use a single Claude session.
- Exploratory questions ("how does our auth work?") → don't use `/ship`. Use a Read/Grep session.
- Codebase-wide refactors → consider `/effort ultracode` or "create a workflow" instead (Dynamic Workflows scale to 1,000 agents). `/ship` tops out at 1 feature per run.
