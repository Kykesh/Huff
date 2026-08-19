# /scout — Niche & Reference-Channel Evaluator

Evaluate for a future faceless channel: $ARGUMENTS

Input is ONE of: a niche idea (e.g., "geography map rankings"), a YouTube channel URL, or the word `inbox` (process every note in `Channel Lab/inbox/`, one evaluation each, delete processed notes).

This is a single-agent research task — no subagents. It produces a verdict file, never a launch.

## Required reading first
1. `Channel Lab/scoring_rubric.md` — the framework and the required output format
2. `Channel Lab/niche_money_table.md` — RPM baselines (update its numbers if research contradicts them, with source + date)
3. `Channel Lab/README.md` — Status block (is the portfolio guardrail ACTIVE?)
4. `Money/04_youtube_starter_kit/05_policy_compliance.md` — the hard gates' source of truth
5. `Faceless/README.md` + `Faceless/.claude/agents/` (skim) — what "our existing stack" means for automation-fit scoring

## Process

1. **Frame the candidate.** Niche, likely formats, who watches and why. If input is a URL: identify the channel's actual niche first — you're evaluating the niche, the channel is evidence.
2. **Research with the web (every number sourced + dated):**
   - RPM range for the niche (cross-check ≥ 2 sources; convert CPM→RPM honestly: RPM ≈ 45–55% of quoted CPM)
   - Top 3–5 channels: subs, cadence, average video length, recent view performance — and specifically what they do LAZILY (the competition gap is where they're beatable, not where they're big)
   - Demand signals: search-style titles that recur across channels, evergreen vs trend decay
   - Policy exposure: does the niche depend on scraped clips, real-person likenesses, YMYL advice, kids content?
3. **Score all 6 rubric dimensions** with evidence. No evidence = no score.
4. **Run the hard gates.** Any trip caps the verdict per the rubric.
5. **Compute the weighted score, apply the verdict bands.** Guardrail ACTIVE + GO → record **GO (parked)**.
6. **If input was a URL: write the teardown section** — cadence, length, estimated views/mo → revenue estimate via the money table, what they do well, what our stack does better, originality/policy read.
7. **Write the evaluation** to `Channel Lab/evaluations/YYYY-MM-DD-<slug>.md` in the rubric's exact format, including "What would change it" and a re-check date.
8. **Update `Channel Lab/README.md`** Status block (evaluations count).

## Report back (chat)

```
SCOUT COMPLETE — [candidate]
Verdict: GO (parked) / WATCH / NO-GO — [N.N]/10
Reason: [one line]
Would flip it: [one line]
Money math: [RPM × views = $range/mo at month ~6]
Pipeline reuse: [N%] — [one line on what's new]
Full evaluation: Channel Lab/evaluations/<file>
```

## Hard rules
1. NEVER create a channel folder, copy templates, or start Recipe A — scouting and launching are separate decisions, and launching is Kyle's.
2. NEVER score without sourced evidence; if research is thin, say WATCH with "insufficient data," not a guess.
3. NEVER bypass the portfolio guardrail because a niche looks exciting. Park it.
4. Evaluations are drafts for Kyle — no auto-actions follow from a verdict.
