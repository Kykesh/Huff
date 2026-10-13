# API-credit agents

Runs any Huff seat (`.claude/agents/<seat>.md`) headless on the **Claude Agent SDK**, billed to the Console API key in
`Gojo/trading_personal/.env.local` — Kyle's Max-plan API credits (org "Sr's Individual Org", $200 a month, landing on
the 2nd). The credits cover the Claude API and the Agent SDK, not Claude Code sessions, so this lane uses the SDK and
refuses to start unless the SDK reports `apiKeySource = ANTHROPIC_API_KEY`.

```bash
cd ~/Documents/GitHub/Huff/tools/api-agents && npm ci          # once
node run-seat.mjs run --seat <seat> --brief <file.md> [--cwd <worktree>] [--model fable] [--max-usd 6]
node run-seat.mjs status                                        # this cycle's spend: agents + Gojo's chart reads
```

**When to use it (the switch).** FIRST, always. Kyle, 2026-10-13 00:0x: *"run our api's until we hit the 150$ limit
they are always to be used first."* Every agent seat runs here until the agents' cycle cap is reached; only then (or for
a job this lane cannot run, e.g. a multi-agent workflow) does work move to the subscription (IDE Agent tool). The cycle
restarts on the 2nd. One brief file per seat, so either lane can run it.

**Budget.** `API_AGENTS_MONTHLY_USD` (default = the whole $200 grant, Kyle 10-13 CEO-119: "let the api agents use all the api credits"; was 150 on 10-12), `API_AGENTS_DAILY_USD` (default = the cycle cap — no separate daily brake, Kyle 10-13), `API_AGENTS_RUN_USD` (10), and never into the reserve that keeps Gojo funded to the cycle end: per trading day left, the larger of $4 (the vision cap) and his highest day of the last 10. Gojo's spend is read-only from prod: every surface from `anthropic_usage` once the CEO-114 ledger is promoted, chart reads before that (F-1081). Gojo's own guard stops at $198 of the grant; the agents stop first. Each run gets
`maxBudgetUsd = min(run cap, left today, left this cycle)` and the SDK stops it there. Gojo's own learning reads draw on
the same credits and come first (CEO-114). Ledger: `~/.local/gojo-integrator/api-agents-ledger.jsonl`; transcripts:
`/Volumes/GojoData/gojo/api-agents/runs/`.

**Model and effort.** Default model `claude-opus-5-5` ($4/$20 per MTok); `--model fable` runs Claude Fable 5.1
($10/$50). Effort comes from the seat's charter.

**Safety.** The SDK's `auto` permission mode vets every tool call with a classifier, and a call it cannot clear is
denied (nobody is there to approve it). Tools are limited to the charter's own list. No subagents or workflows.

**Two traps, both measured on 2026-10-12.** The SDK's Claude Code finds Kyle's subscription login in the keychain unless it
gets its own `CLAUDE_CONFIG_DIR`. It also ignores the key when it inherits variables from a parent Claude Code
session, so the runner hands it an allowlisted environment.

Smoke tests on 2026-10-12: a no-tool reply cost $0.11 and a one-command run cost $0.09, both on the API key.
